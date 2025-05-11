import prisma from '@/lib/prisma'

export async function DELETE(_, { params }) {
  const { id } = await params
  try {
    await prisma.order.delete({
      where: { id },
    })

    return Response.json({ message: 'تم حذف المطعم' })
  } catch (error) {
    return Response.json({ error: 'فشل الحذف' }, { status: 500 })
  }
  
}


