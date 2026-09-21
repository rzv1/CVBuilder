import { TRPCError } from '@trpc/server';
import { prisma } from '../config/db.js';

/**
 * Resolves a valid user ID. If not provided, defaults to usr_alex_popescu or the first available user.
 */
async function resolveUserId(userId) {
  if (userId) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (existing) return existing.id;
  } else {
    throw new TRPCError('No default user found');
  }
}

/**
 * Retrieves all target jobs for a specific user.
 */
export async function getTargetJobs(userId) {
  try {
    const targetUserId = await resolveUserId(userId);
    const jobs = await prisma.targetJob.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: 'desc' },
    });
    return jobs;
  } catch (err) {
    throw new TRPCError('Error fetching target jobs: ' + err.message);
  }
}

/**
 * Creates a new target job for a user (used by web extension or manual creation).
 */
export async function createTargetJob(data = {}) {
  try {
    const targetUserId = await resolveUserId(data.userId);

    const title = (data.title || 'Untitled Position').trim();
    const company = (data.company || 'Unknown Company').trim();
    const location = data.location ? data.location.trim() : 'Remote / Nedefinit';
    const url = data.url || null;
    const description = (data.description || '').trim();
    const iconSeed = data.iconSeed || company.replace(/[^a-zA-Z0-9]/g, '') || 'Job';
    const importedAt = data.importedAt || 'Extensie Web • Recent';

    // Match scores: default to 0 for unanalyzed state upon import
    const currentScore = typeof data.currentScore === 'number' ? data.currentScore : 0;
    const potentialScore = typeof data.potentialScore === 'number' ? data.potentialScore : 0;
    const maxScoreAchieved = typeof data.maxScoreAchieved === 'number' ? data.maxScoreAchieved : 0;
    const isOptimized = Boolean(data.isOptimized);

    const newJob = await prisma.targetJob.create({
      data: {
        userId: targetUserId,
        title,
        company,
        location,
        url,
        importedAt,
        iconSeed,
        description,
        currentScore,
        potentialScore,
        maxScoreAchieved,
        coverLetter: data.coverLetter || null,
        isOptimized,
      },
    });

    return newJob;
  } catch (err) {
    throw new TRPCError('Error creating target job: ' + err.message);
  }
}

/**
 * Updates an existing target job (e.g. description edit, cover letter, ATS scores, isOptimized).
 */
export async function updateTargetJob(id, data = {}) {
  try {
    const updated = await prisma.targetJob.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.company && { company: data.company }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.currentScore !== undefined && { currentScore: data.currentScore }),
        ...(data.potentialScore !== undefined && { potentialScore: data.potentialScore }),
        ...(data.maxScoreAchieved !== undefined && { maxScoreAchieved: data.maxScoreAchieved }),
        ...(data.coverLetter !== undefined && { coverLetter: data.coverLetter }),
        ...(data.isOptimized !== undefined && { isOptimized: data.isOptimized }),
      },
    });

    return updated;
  } catch (err) {
    throw new TRPCError(`Error updating job ${id}: ` + err.message);
  }
}

/**
 * Deletes a target job by ID.
 */
export async function deleteTargetJob(id) {
  try {
    await prisma.targetJob.delete({
      where: { id },
    });
    return { success: true };
  } catch (err) {
    throw new TRPCError(`Error deleting job ${id}: ` + err.message);
  }
}
