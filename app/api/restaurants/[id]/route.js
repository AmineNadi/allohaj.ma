//app/api/restaurants/[id]/route.js
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma'

export async function DELETE(_, { params }) {
  const { id } = await params

  try {
    await prisma.restaurant.delete({
      where: { id },
    })

    return Response.json({ message: 'تم حذف المطعم' })
  } catch (error) {
    return Response.json({ error: 'فشل الحذف' }, { status: 500 })
  }
}
export async function PUT(request, { params }) {
    const { id } = await params;
  
    try {
      const { name, imageUrl } = await request.json();
  
      const updatedRestaurant = await prisma.restaurant.update({
        where: { id },
        data: {
          name,
          imageUrl, // تأكد من أن imageUrl هو رابط لصورة على Vercel Blob
        },
      });
  
      return NextResponse.json({ success: true, restaurant: updatedRestaurant });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      return NextResponse.json({ error: 'فشل تحديث المطعم' }, { status: 500 });
    }
  }
