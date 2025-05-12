import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const restaurantId = formData.get('restaurantId');
    const imageFile = formData.get('image');

    let imageUrl = null;

    if (imageFile && typeof imageFile.arrayBuffer === 'function') {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const blob = await put(`meals/${Date.now()}-${imageFile.name}`, buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      imageUrl = blob.url;
    }

    const meal = await prisma.meal.create({
      data: {
        name,
        description,
        price,
        image: imageUrl,
        restaurantId,
      },
    });

    return NextResponse.json(meal);
  } catch (error) {
    console.error('خطأ في إضافة الوجبة:', error);
    return NextResponse.json({ error: 'فشل في إضافة الوجبة' }, { status: 500 });
  }
}
