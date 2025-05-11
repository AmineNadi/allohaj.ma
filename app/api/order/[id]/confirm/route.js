import prisma from '@/lib/prisma'

export async function PUT(_, { params }) {
  const { id } = await params

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { confirmed: true },
    })

    return Response.json({ message: 'تم التأكيد', order: updated })
  } catch (error) {
    console.error('خطأ في تأكيد الطلب:', error)
    return new Response('خطأ في السيرفر', { status: 500 })
  }
}

