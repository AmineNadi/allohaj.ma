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