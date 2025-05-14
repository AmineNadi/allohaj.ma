const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('lhaj@ma.allo', 10);

  await prisma.user.create({
    data: {
      name: 'admin',
      email: 'lhajma@allo.ma',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin user created successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });