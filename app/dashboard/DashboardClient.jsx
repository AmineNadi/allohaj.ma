'use client'

import OrdersDashboard from '@/components/HomeDashbord/OrdersDashboard'


export default function DashboardClient({ orders: initialOrders }) {


  return (
    <div className="flex py-5">
      <main className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">الطلبيات</h1>

        <OrdersDashboard />
      </main>
    </div>
  )
}
