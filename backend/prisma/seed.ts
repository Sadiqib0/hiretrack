import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo user
  const hashedPassword = await bcrypt.hash('Demo123!', 10);

console.log('Attempting to create/update demo user...');

const user = await prisma.user.upsert({
  where: { email: 'demo@hiretrack.com' },
  update: {
    password: hashedPassword,
    firstName: 'Demo',
    lastName: 'User',
    emailVerified: true,
  },
  create: {
    email: 'demo@hiretrack.com',
    password: hashedPassword,
    firstName: 'Demo',
    lastName: 'User',
    emailVerified: true,
  },
});

console.log('✅ Demo user is ready:', user.email);

  console.log('✅ Created demo user:', user.email);

  // Create sample applications
  const applications = await Promise.all([
    prisma.application.create({
      data: {
        userId: user.id,
        jobTitle: 'Senior Frontend Developer',
        company: 'Google',
        location: 'Mountain View, CA',
        salary: '$150k - $200k',
        status: 'INTERVIEW',
        jobUrl: 'https://careers.google.com/jobs',
        notes: 'Had initial phone screen, waiting for technical interview.',
        appliedAt: new Date('2024-01-15'),
      },
    }),
    prisma.application.create({
      data: {
        userId: user.id,
        jobTitle: 'Full Stack Engineer',
        company: 'Meta',
        location: 'Menlo Park, CA',
        salary: '$140k - $180k',
        status: 'APPLIED',
        jobUrl: 'https://www.metacareers.com/jobs',
        appliedAt: new Date('2024-01-20'),
      },
    }),
    prisma.application.create({
      data: {
        userId: user.id,
        jobTitle: 'Backend Engineer',
        company: 'Amazon',
        location: 'Seattle, WA',
        salary: '$130k - $170k',
        status: 'REJECTED',
        notes: 'Did not pass initial screening.',
        appliedAt: new Date('2024-01-10'),
        rejectedAt: new Date('2024-01-18'),
      },
    }),
    prisma.application.create({
      data: {
        userId: user.id,
        jobTitle: 'Software Engineer',
        company: 'Netflix',
        location: 'Los Gatos, CA',
        salary: '$160k - $210k',
        status: 'OFFER',
        notes: 'Received offer! Need to respond by end of week.',
        appliedAt: new Date('2024-01-05'),
        offerReceivedAt: new Date('2024-01-25'),
      },
    }),
    prisma.application.create({
      data: {
        userId: user.id,
        jobTitle: 'Senior Software Engineer',
        company: 'Apple',
        location: 'Cupertino, CA',
        salary: '$170k - $220k',
        status: 'APPLIED',
        jobUrl: 'https://jobs.apple.com',
        appliedAt: new Date('2024-01-22'),
      },
    }),
  ]);

  console.log(`✅ Created ${applications.length} sample applications`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📧 Demo account credentials:');
  console.log('   Email: demo@hiretrack.com');
  console.log('   Password: Demo123!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });