import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 });
  }

  const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
    access: 'public', // يجعل الصورة عامة للوصول
  });

  return NextResponse.json({ url: blob.url });
}
