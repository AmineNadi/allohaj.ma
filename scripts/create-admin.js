const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // استخدام bcryptjs بدلًا من bcrypt

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10); // نفس الدالة متوفرة في bcryptjs

  await prisma.user.create({
    data: {
      name: 'user',
      email: 'user@example.com',
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
