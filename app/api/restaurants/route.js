// /app/api/restaurants/route.js
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        meals: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json({ restaurants });
  } catch (error) {
    console.error('خطأ في جلب المطاعم:', error);
    return new Response(JSON.stringify({ error: 'فشل في جلب المطاعم' }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const file = formData.get('image');

    if (!name || name.trim() === '') {
      return new Response(JSON.stringify({ error: 'اسم المطعم مطلوب' }), {
        status: 400,
      });
    }

    let imageUrl = null;
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }

    const existing = await prisma.restaurant.findFirst({ where: { name } });
    if (existing) {
      return new Response(JSON.stringify({ error: 'المطعم موجود مسبقاً' }), {
        status: 409,
      });
    }

    const newRestaurant = await prisma.restaurant.create({
      data: { name, imageUrl },
    });

    return Response.json({ message: 'تمت إضافة المطعم بنجاح', restaurant: newRestaurant });
  } catch (error) {
    console.error('خطأ في إضافة المطعم:', error);
    return new Response(JSON.stringify({ error: 'فشل في إضافة المطعم' }), {
      status: 500,
    });
  }
}
