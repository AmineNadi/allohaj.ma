//app/api/meals/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'

export async function DELETE(request, { params }) {
    const { id } = await params // ✅ استخدام await لاستخراج id

  try {
    const deleted = await prisma.meal.delete({
      where: { id },
    });

    return Response.json({ success: true, deleted });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete meal' }), {
      status: 500,
    });
  }
}
export async function PUT(request, { params }) {
    const { id } = await params;
  
    try {
      const { name, price, imageUrl } = await request.json();
  
      console.log('🧪 Incoming data:', { name, price, imageUrl });
  
      if (!name?.trim() || !price || !imageUrl?.trim()) {
        return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
      }
  
      const updatedMeal = await prisma.meal.update({
        where: { id },
        data: {
          name: name.trim(),
          price: parseFloat(price),
          imageUrl: imageUrl.trim(),
        },
      });
  
      return NextResponse.json({ success: true, meal: updatedMeal });
    } catch (error) {
      console.error('❌ Error updating meal:', error);
      return NextResponse.json({ error: 'فشل تحديث الوجبة' }, { status: 500 });
    }
  }