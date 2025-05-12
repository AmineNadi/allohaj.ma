import { upload } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'نوع المحتوى غير مدعوم' }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get('name');
    const price = parseInt(formData.get('price'));
    const restaurantId = formData.get('restaurantId');
    const file = formData.get('image');

    if (!name || !price || !restaurantId || !file) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await upload(`meals_images/${Date.now()}_${file.name}`, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const imageUrl = uploaded.url;

    const meal = await prisma.meal.create({
      data: {
        name,
        price,
        restaurantId,
        imageUrl,
      },
    });

    return NextResponse.json({ meal }, { status: 201 });
  } catch (error) {
    console.error('Error adding meal:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة الوجبة' }, { status: 500 });
  }
}
