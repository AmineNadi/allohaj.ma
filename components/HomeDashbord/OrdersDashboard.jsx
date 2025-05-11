'use client'

import { useEffect, useState } from 'react'
import OrdersPieChart from '@/components/HomeDashbord/OrdersPieChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function OrdersDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/order/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setError('فشل في جلب الإحصائيات'))
  }, [])

  if (error) return <p className="text-red-600">{error}</p>
  if (!stats) return <p>جاري التحميل...</p>

  
  const cards = [
    { title: 'طلبيات جديدة', value: stats.counts.newOrders - stats.counts.confirmed, color: 'bg-yellow-100' },
    { title: 'طلبيات مؤكدة', value: stats.counts.confirmed, color: 'bg-teal-100' },
    { title: 'طلبيات في الإنتظار', value: stats.counts.pendingConfirm, color: 'bg-gray-100' },
  ]

  return (
    <div className='grid gap-10'>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <Card key={idx} className={`${card.color} text-center`}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
        
        </div>
        <OrdersPieChart stats={stats} />
    </div>
      
  )
}
