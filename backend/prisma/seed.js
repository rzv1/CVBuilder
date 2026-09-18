import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Prisma Database Seed process...');

  const rootDataDir = path.resolve(__dirname, '../../frontend/src/data');
  const contentPath = path.join(rootDataDir, 'content.json');
  const stylePath = path.join(rootDataDir, 'style.json');

  // 1. Seed Main User
  const mainUser = await prisma.user.upsert({
    where: { id: 'usr_alex_popescu' },
    update: {
      name: 'Alexandru Popescu',
      credits: 100,
      status: 'active'
    },
    create: {
      id: 'usr_alex_popescu',
      name: 'Alexandru Popescu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      credits: 100,
      status: 'active'
    }
  });

  console.log(`Seeded Main User: ${mainUser.name} (${mainUser.id})`);

  const DEFAULT_STYLE_STR = JSON.stringify({
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
  }, null, 2);

  // 2. Seed Master CvData linked to Main User
  if (fs.existsSync(contentPath)) {
    const contentStr = fs.readFileSync(contentPath, 'utf-8');
    const styleStr = fs.existsSync(stylePath) ? fs.readFileSync(stylePath, 'utf-8') : DEFAULT_STYLE_STR;

    const masterCv = await prisma.cvData.upsert({
      where: { slug: 'alex-popescu' },
      update: {
        title: 'Master CV',
        content: contentStr,
        style: styleStr,
        activeVariant: 'all',
        userId: mainUser.id
      },
      create: {
        id: 'cv_default_master',
        userId: mainUser.id,
        slug: 'alex-popescu',
        title: 'Master CV',
        content: contentStr,
        style: styleStr,
        activeVariant: 'all'
      }
    });

    console.log(`Seeded Master CvData: ${masterCv.title} (slug: ${masterCv.slug})`);

    // 3. Seed CvVariants
    const defaultVariants = [
      { variantKey: 'all', label: 'Full Stack Developer (Default)' },
      { variantKey: 'frontend', label: 'Frontend Specialist' },
      { variantKey: 'backend', label: 'Backend Architect' }
    ];

    for (const v of defaultVariants) {
      await prisma.cvVariant.upsert({
        where: {
          variantKey_cvDataId: {
            variantKey: v.variantKey,
            cvDataId: masterCv.id
          }
        },
        update: { label: v.label },
        create: {
          variantKey: v.variantKey,
          cvDataId: masterCv.id,
          label: v.label
        }
      });
    }
    console.log('Seeded CvVariants successfully.');

    // 4. Seed GitCommits
    const mockCommits = [
      { hash: 'a7f3b91', message: 'Updated lead experience bullets with Google XYZ metric formula', tag: 'v1.4', added: 3, deleted: 1 },
      { hash: 'd4e21a8', message: 'Added Open Source & Conference Talks modular sections', tag: 'v1.3', added: 8, deleted: 0 },
      { hash: '8c91b22', message: 'Suggested refining Senior Frontend role summary for ATS optimization', tag: 'v1.2', added: 2, deleted: 2 },
      { hash: '1a00f45', message: 'Initial JSON Resume import & baseline setup', tag: 'v1.0', added: 24, deleted: 0 }
    ];

    for (const c of mockCommits) {
      await prisma.gitCommit.create({
        data: {
          hash: c.hash,
          cvDataId: masterCv.id,
          userId: mainUser.id,
          message: c.message,
          tag: c.tag,
          changesAdded: c.added,
          changesDeleted: c.deleted
        }
      });
    }
    console.log('Seeded GitCommits successfully.');

    // 5. Seed GroupMembers & Comments
    const reviewerUser = await prisma.user.upsert({
      where: { id: 'usr_elena_ionescu' },
      update: {},
      create: {
        id: 'usr_elena_ionescu',
        name: 'Elena Ionescu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
        credits: 100
      }
    });

    await prisma.groupMember.upsert({
      where: {
        cvDataId_userId: {
          cvDataId: masterCv.id,
          userId: mainUser.id
        }
      },
      update: { role: 'Owner' },
      create: {
        cvDataId: masterCv.id,
        userId: mainUser.id,
        role: 'Owner',
        color: '#3b82f6'
      }
    });

    await prisma.groupMember.upsert({
      where: {
        cvDataId_userId: {
          cvDataId: masterCv.id,
          userId: reviewerUser.id
        }
      },
      update: { role: 'Reviewer' },
      create: {
        cvDataId: masterCv.id,
        userId: reviewerUser.id,
        role: 'Reviewer',
        color: '#10b981'
      }
    });

    await prisma.groupComment.create({
      data: {
        cvDataId: masterCv.id,
        userId: reviewerUser.id,
        section: 'Work Experience - TechScale Solutions',
        text: 'Great metric in bullet #1! Consider adding Kubernetes to your cloud skills tags as well.',
        resolved: false
      }
    });
    console.log('Seeded GroupMembers & Comments successfully.');

    // 6. Seed AnalyticsEvents
    const events = [
      { eventType: 'view', referrer: 'linkedin', durationSeconds: 140 },
      { eventType: 'view', referrer: 'github', durationSeconds: 95 },
      { eventType: 'download', referrer: 'direct', durationSeconds: 0 },
      { eventType: 'qr_scan', referrer: 'qr_code', durationSeconds: 60 }
    ];

    for (const ev of events) {
      await prisma.analyticsEvent.create({
        data: {
          cvDataId: masterCv.id,
          eventType: ev.eventType,
          referrer: ev.referrer,
          durationSeconds: ev.durationSeconds
        }
      });
    }
    console.log('Seeded AnalyticsEvents successfully.');
  }

  console.log('Database Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Prisma Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
