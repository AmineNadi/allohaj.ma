'use client'

import { useState } from 'react'
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter,  AlertDialogTitle, AlertDialogDescription} from '@/components/ui/alert-dialog'

export default function OrdersClient({ orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [showDialog, setShowDialog] = useState(false)

  const confirmOrder = async (id) => {
    const res = await fetch(`/api/order/${id}/confirm`, { method: 'PUT' })
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, confirmed: true } : o))
      )
    }
  }

  const deleteOrder = async (id) => {
    const res = await fetch(`/api/order/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id))
    }
  }

  return (
    <div className="flex py-10">
      <main className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">الطلبيات</h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد طلبات حالياً.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 order-last">
            {orders.slice().reverse().map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm flex flex-col gap-1 md:flex-row">
                    <span>{order.name}</span>{' '}
                    <span className="hidden md:block">-</span>{' '}
                    <span>{order.phone}</span>
                  </CardTitle>
                  <Badge variant={order.confirmed ? 'success' : 'warning'}>
                    {order.confirmed ? 'مؤكد ✅' : 'قيد الانتظار'}
                  </Badge>
                </CardHeader>

                <Separator />

                <CardContent className="text-sm space-y-1 mt-4">
                  <p>
                    <strong>الطلب:</strong>
                  </p>
                  <ul className="space-y-2">
                    {order.meals ? (
                      (() => {
                        try {
                          const meals = JSON.parse(order.meals)
                          return Array.isArray(meals) && meals.length > 0 ? (
                            meals.map((item, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                                  {item.meal} ({item.restaurant})
                                </span>
                              </li>
                            ))
                          ) : (
                            <li>لا توجد وجبات</li>
                          )
                        } catch {
                          return <li>خطأ في عرض الوجبات</li>
                        }
                      })()
                    ) : (
                      <li>لا توجد وجبات</li>
                    )}
                  </ul>

                  <div className="flex gap-2 mt-4">
                    {!order.confirmed && (
                      <Button
                        variant="default"
                        onClick={() => confirmOrder(order.id)}
                      >
                        تأكيد
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedOrderId(order.id)
                        setShowDialog(true)
                      }}
                    >
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* AlertDialog for delete confirmation */}
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من حذف الطلب؟</AlertDialogTitle>
              <AlertDialogDescription>
                لا يمكنك التراجع بعد حذف هذا الطلب.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                إلغاء
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!selectedOrderId) return
                  await deleteOrder(selectedOrderId)
                  setShowDialog(false)
                }}
              >
                تأكيد الحذف
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
