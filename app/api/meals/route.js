// /app/api/meals/route.js
import cloudinary from 'lib/cloudinary';  // استيراد Cloudinary
import { v2 as cloudinaryV2 } from 'cloudinary';  // التأكد من استخدام Cloudinary API
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // تحقق أن المحتوى هو form-data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'نوع المحتوى غير مدعوم' }, { status: 400 });
    }

    // قراءة البيانات المرسلة من النموذج
    const formData = await req.formData();

    const name = formData.get('name');
    const price = parseInt(formData.get('price'));
    const restaurantId = formData.get('restaurantId');
    const file = formData.get('image');

    // تحقق من الحقول المطلوبة
    if (!name || !price || !restaurantId || !file) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }
    console.log('file:', file);
console.log('file stream:', file.stream());
    // رفع الصورة إلى Cloudinary
    const result = await cloudinaryV2.uploader.upload(file.stream(), {
      folder: 'meals_images', // تحديد المجلد في Cloudinary
      public_id: `meal_${Date.now()}`, // تحديد ID فريد
    });

    const imageUrl = result.secure_url;  // الحصول على رابط الصورة الآمن من Cloudinary

    // حفظ البيانات في قاعدة البيانات باستخدام Prisma
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
