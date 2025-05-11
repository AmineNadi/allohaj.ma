import cloudinary from 'lib/cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';
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

    // ❌ خطأ هنا: استخدام file.stream() في بيئة Vercel يسبب مشاكل

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      const upload = cloudinaryV2.uploader.upload_stream({
        folder: 'meals_images',
        public_id: `meal_${Date.now()}`
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });

      upload.end(buffer);
    });

    const imageUrl = result.secure_url;

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
