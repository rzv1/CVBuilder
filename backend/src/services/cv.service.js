import fs from 'fs';
import { CONTENT_DATA_PATH, STYLE_DATA_PATH } from '../config/paths.js';
import { prisma } from '../config/db.js';
import { applySmartPatches } from '../../../frontend/src/utils/jsonPatch.js';
import { projectMasterToVariant, mergeVariantToMaster } from '../../../frontend/src/utils/variantProjection.js';

export async function getCvData() {
  try {
    if (prisma) {
      try {
        const dbCv = await prisma.cvData.findFirst({ where: { id: 'default' } });
        if (dbCv) {
          return {
            content: JSON.parse(dbCv.content),
            style: JSON.parse(dbCv.style)
          };
        }
      } catch (dbErr) {
        console.warn('Prisma getCvData error, fallback to disk:', dbErr.message);
      }
    }

    const contentStr = fs.readFileSync(CONTENT_DATA_PATH, 'utf-8');
    const styleStr = fs.readFileSync(STYLE_DATA_PATH, 'utf-8');
    return {
      content: JSON.parse(contentStr),
      style: JSON.parse(styleStr)
    };
  } catch (err) {
    throw new Error('Eroare la citirea fișierelor pe disc: ' + err.message);
  }
}

export async function saveCvData(body) {
  try {
    let patched = false;
    let patchCount = 0;

    if (Array.isArray(body.patches) && body.patches.length > 0 && body.variantId) {
      const contentStr = fs.readFileSync(CONTENT_DATA_PATH, 'utf-8');
      const diskMaster = JSON.parse(contentStr);
      const currentVariantRAM = projectMasterToVariant(diskMaster, body.variantId);
      const { newContent } = applySmartPatches(currentVariantRAM, {}, body.patches);
      const mergedMaster = mergeVariantToMaster(diskMaster, newContent, body.variantId);
      fs.writeFileSync(CONTENT_DATA_PATH, JSON.stringify(mergedMaster, null, 2), 'utf-8');
      patched = true;
      patchCount = body.patches.length;
    } else if (body.variantContent && body.variantId) {
      const contentStr = fs.readFileSync(CONTENT_DATA_PATH, 'utf-8');
      const diskMaster = JSON.parse(contentStr);
      const mergedMaster = mergeVariantToMaster(diskMaster, body.variantContent, body.variantId);
      fs.writeFileSync(CONTENT_DATA_PATH, JSON.stringify(mergedMaster, null, 2), 'utf-8');
    } else if (body.content) {
      fs.writeFileSync(CONTENT_DATA_PATH, JSON.stringify(body.content, null, 2), 'utf-8');
    }

    if (body.style) {
      fs.writeFileSync(STYLE_DATA_PATH, JSON.stringify(body.style, null, 2), 'utf-8');
    }

    // Sync to Prisma DB if connected
    if (prisma) {
      try {
        const finalContent = fs.readFileSync(CONTENT_DATA_PATH, 'utf-8');
        const finalStyle = fs.readFileSync(STYLE_DATA_PATH, 'utf-8');
        await prisma.cvData.upsert({
          where: { id: 'default' },
          update: { content: finalContent, style: finalStyle, variantId: body.variantId || 'master' },
          create: { id: 'default', content: finalContent, style: finalStyle, variantId: body.variantId || 'master' }
        });
      } catch (dbErr) {
        console.warn('Prisma saveCvData sync error:', dbErr.message);
      }
    }

    return {
      message: patched ? `Aplicat ${patchCount} patch-uri JSON cu succes!` : 'CV salvat cu succes pe disc!'
    };
  } catch (err) {
    throw new Error('Eroare la salvarea pe disc: ' + err.message);
  }
}
