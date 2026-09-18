import { prisma } from '../config/db.js';
import { applySmartPatches } from '../../../frontend/src/utils/jsonPatch.js';
import { projectMasterToVariant, mergeVariantToMaster } from '../../../frontend/src/utils/variantProjection.js';
import { validateCvPayload } from '../utils/cvValidator.js';

export const DEFAULT_STYLE = {
  theme: {
    mode: "light",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    secondaryAccent: "#4b543e",
    neutralColor: "#1e293b",
    mutedColor: "#64748b",
    backgroundColor: "#ffffff",
    cardBackgroundColor: "#2b3446",
    contactBarBg: "#1a202c",
    fontFamily: "Helvetica"
  },
  layout: {
    template: "classic",
    pageSize: "A4",
    margins: { top: 24, right: 28, bottom: 36, left: 28 },
    columns: 1,
    sidebarWidth: "39%"
  },
  typography: {
    headerSize: 20,
    titleSize: 11,
    sectionTitleSize: 13,
    itemTitleSize: 10,
    itemSubSize: 9.5,
    bodySize: 9.5,
    smallSize: 8.5,
    microSize: 7.5,
    lineHeight: 1.3
  },
  features: {
    showQrCode: true,
    compactMode: false,
    enableAtsScoring: true
  }
};

/**
 * Retrieves Master CV content, style, variants, gitCommits, collaborators & analytics directly from Prisma DB.
 */
export async function getCvData() {
  try {
    const dbCv = await prisma.cvData.findFirst({
      include: {
        user: true,
        variants: true,
        gitCommits: { orderBy: { createdAt: 'desc' } },
        groupMembers: true,
        comments: { orderBy: { createdAt: 'desc' } },
        analyticsEvents: true
      }
    });

    if (dbCv) {
      return {
        id: dbCv.id,
        slug: dbCv.slug,
        title: dbCv.title,
        activeVariant: dbCv.activeVariant,
        content: JSON.parse(dbCv.content),
        style: dbCv.style ? JSON.parse(dbCv.style) : DEFAULT_STYLE,
        user: dbCv.user,
        variants: dbCv.variants,
        gitCommits: dbCv.gitCommits,
        groupMembers: dbCv.groupMembers,
        comments: dbCv.comments,
        analyticsEvents: dbCv.analyticsEvents
      };
    }

    return {
      id: null,
      slug: '',
      title: 'Master CV',
      activeVariant: 'all',
      content: null,
      style: DEFAULT_STYLE,
      user: null,
      variants: [],
      gitCommits: [],
      groupMembers: [],
      comments: [],
      analyticsEvents: []
    };
  } catch (err) {
    throw new Error('Eroare la citirea CV-ului din baza de date Prisma: ' + err.message);
  }
}

/**
 * Saves CV content and style changes directly to Prisma DB using JSON Patches or full updates.
 * Includes backend integrity validation.
 */
export async function saveCvData(body) {
  // 1. Validate payload integrity
  const validation = validateCvPayload(body);
  if (!validation.isValid) {
    const err = new Error(`Date corupte sau nevalide: ${validation.error}`);
    err.statusCode = 400;
    throw err;
  }

  try {
    let patched = false;
    let patchCount = 0;

    const dbCv = await prisma.cvData.findFirst();
    const cvId = dbCv ? dbCv.id : 'cv_default_master';
    let currentMaster = dbCv ? JSON.parse(dbCv.content) : {};
    let currentStyle = (dbCv && dbCv.style) ? JSON.parse(dbCv.style) : DEFAULT_STYLE;

    if (Array.isArray(body.patches) && body.patches.length > 0 && body.variantId) {
      const currentVariantRAM = projectMasterToVariant(currentMaster, body.variantId);
      const { newContent } = applySmartPatches(currentVariantRAM, {}, body.patches);
      currentMaster = mergeVariantToMaster(currentMaster, newContent, body.variantId);
      patched = true;
      patchCount = body.patches.length;
    } else if (body.variantContent && body.variantId) {
      currentMaster = mergeVariantToMaster(currentMaster, body.variantContent, body.variantId);
    } else if (body.content) {
      currentMaster = body.content;
    }

    if (body.style) {
      currentStyle = body.style;
    }

    await prisma.cvData.upsert({
      where: { id: cvId },
      update: {
        content: JSON.stringify(currentMaster),
        style: JSON.stringify(currentStyle),
        activeVariant: body.variantId || dbCv?.activeVariant || 'all'
      },
      create: {
        id: cvId,
        userId: dbCv?.userId || 'usr_alex_popescu',
        slug: 'alex-popescu',
        title: 'Master CV',
        content: JSON.stringify(currentMaster),
        style: JSON.stringify(currentStyle),
        activeVariant: body.variantId || 'all'
      }
    });

    return {
      message: patched ? `Aplicat ${patchCount} patch-uri JSON în baza de date cu succes!` : 'CV salvat în baza de date Prisma cu succes!'
    };
  } catch (err) {
    throw new Error('Eroare la salvarea CV-ului în baza de date Prisma: ' + err.message);
  }
}

/**
 * Adds a new GitCommit snapshot in Prisma DB
 */
export async function addGitCommit(body) {
  const dbCv = await prisma.cvData.findFirst();
  if (!dbCv) throw new Error('CV data not found');

  const hash = Math.random().toString(16).substring(2, 9);
  const commit = await prisma.gitCommit.create({
    data: {
      hash,
      cvDataId: dbCv.id,
      userId: body.userId || dbCv.userId,
      message: body.message || 'Snapshot update',
      tag: body.tag || `v1.${Date.now().toString().slice(-2)}`,
      changesAdded: body.changesAdded ?? 2,
      changesDeleted: body.changesDeleted ?? 0
    }
  });

  return commit;
}

/**
 * Adds a new GroupComment in Prisma DB
 */
export async function addGroupComment(body) {
  const dbCv = await prisma.cvData.findFirst();
  if (!dbCv) throw new Error('CV data not found');

  const comment = await prisma.groupComment.create({
    data: {
      cvDataId: dbCv.id,
      userId: body.userId || dbCv.userId,
      section: body.section || 'General',
      text: body.text || '',
      resolved: false
    }
  });

  return comment;
}

/**
 * Toggles resolved status of a GroupComment in Prisma DB
 */
export async function toggleGroupComment(commentId) {
  const existing = await prisma.groupComment.findUnique({ where: { id: commentId } });
  if (!existing) throw new Error('Comentariul nu a fost găsit');

  const updated = await prisma.groupComment.update({
    where: { id: commentId },
    data: { resolved: !existing.resolved }
  });

  return updated;
}

/**
 * Records an AnalyticsEvent in Prisma DB
 */
export async function recordAnalyticsEvent(body) {
  const dbCv = await prisma.cvData.findFirst();
  if (!dbCv) throw new Error('CV data not found');

  const event = await prisma.analyticsEvent.create({
    data: {
      cvDataId: dbCv.id,
      eventType: body.eventType || 'view',
      referrer: body.referrer || 'direct',
      durationSeconds: body.durationSeconds || 0
    }
  });

  return event;
}
