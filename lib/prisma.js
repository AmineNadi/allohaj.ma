import { PrismaClient } from '@prisma/client'

// استخدام متغير `globalForPrisma` لتخزين Prisma Client عبر التحديثات في بيئة التطوير.
const globalForPrisma = global

// إذا كان يوجد مثيل PrismaClient بالفعل في `global`, يتم استخدامه، وإلا يتم إنشاء مثيل جديد.
const prisma = globalForPrisma.prisma || new PrismaClient()

// إذا كانت البيئة ليست بيئة الإنتاج (أي بيئة تطوير)، يتم تخزين مثيل Prisma في `global` لإعادة استخدامه.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// تصدير المثيل لاستخدامه في أماكن أخرى
export default prisma
