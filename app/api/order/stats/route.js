// app/api/order/stats/route.js
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      newOrdersCount,
      confirmedCount,
      pendingConfirmCount,
    ] = await Promise.all([
      prisma.order.count({ where: { status: 'new' } }),
      prisma.order.count({ where: { confirmed: true } }),
      prisma.order.count({ where: { confirmed: false } }),
    ])

    const recentOrders = await prisma.order.findMany({
      where: { status: { in: ['new', 'processing'] } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return NextResponse.json({
      counts: {
        newOrders: newOrdersCount,
        confirmed: confirmedCount,
        pendingConfirm: pendingConfirmCount,
      },
      recentOrders,
    })
  } catch (error) {
    console.error('خطأ في إحضار إحصائيات الطلبات:', error)
    return NextResponse.json({ error: 'فشل في جلب الإحصائيات' }, { status: 500 })
  }
}
