// /app/api/restaurants/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
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
      const city = formData.get('city');
      const address = formData.get('address');
      const phone = formData.get('phone');
      const imageFile = formData.get('image');
  
      let imageUrl = null;
  
      if (imageFile && typeof imageFile.arrayBuffer === 'function') {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
  
        const blob = await put(`restaurants/${Date.now()}-${imageFile.name}`, buffer, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
  
        imageUrl = blob.url;
      }
  
      const restaurant = await prisma.restaurant.create({
        data: {
          name,
          city,
          address,
          phone,
          image: imageUrl,
        },
      });
  
      return NextResponse.json(restaurant);
    } catch (error) {
      console.error('خطأ في إضافة المطعم:', error);
      return NextResponse.json({ error: 'فشل في إضافة المطعم' }, { status: 500 });
    }
  }
