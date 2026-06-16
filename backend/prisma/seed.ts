import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      {
        name: 'ADMIN',
        description: 'System Administrator',
      },
      {
        name: 'DOCTOR',
        description: 'Hospital Doctor',
      },
      {
        name: 'PATIENT',
        description: 'Mobile Application User',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Role seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
