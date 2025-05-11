// /app/api/upload/route.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file'); // يجب أن يكون اسم الـ input هو 'file'

  if (!file) {
    return NextResponse.json({ error: 'لا يوجد ملف مرفوع' }, { status: 400 });
  }

  const filename = `${Date.now()}-${file.name}`;

  try {
    const blob = await put(filename, file.stream(), {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('خطأ أثناء رفع الملف إلى Vercel Blob:', error);
    return NextResponse.json({ error: 'فشل في رفع الملف' }, { status: 500 });
  }
}
