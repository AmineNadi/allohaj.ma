// app/restaurants/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription
} from '@/components/ui/alert-dialog'

export default function RestaurantsListPage({ session }) {
const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([])
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: null });

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/restaurants');
      const data = await res.json();
      setRestaurants(data.restaurants);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب المطاعم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const deleteRestaurant = async (id) => {
    const res = await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchRestaurants();
      toast.success('تم حذف المطعم بنجاح');
    } else {
      toast.error('فشل في حذف المطعم');
    }
  }

  const deleteMeal = async (id) => {
    const res = await fetch(`/api/meals/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchRestaurants();
      toast.success('تم حذف الوجبة بنجاح');
    } else {
      toast.error('فشل في حذف الوجبة');
    }
  }

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold text-center mb-6">قائمة المطاعم</h1>

      {loading ? (
        <p className="text-center text-gray-500">جاري التحميل...</p>
        ) : restaurants.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد مطاعم.</p>
        ) : (
        <ul className="space-y-4">
          {restaurants.map((r) => (
            <li key={r.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  {r.imageUrl && <img src={r.imageUrl} className="w-10 h-10 rounded-full border" />}
                  <h3 className="font-bold uppercase">{r.name}</h3>
                </div>
                <button
                  className="text-red-600"
                  onClick={() => {
                    setItemToDelete({ type: 'restaurant', id: r.id });
                    setOpenDialog(true);
                  }}
                >
                  حذف
                </button>
              </div>

              {r.meals.length === 0 ? (
                <p className="text-sm text-gray-500">لا توجد وجبات.</p>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-2 mt-2">
                  {r.meals.map((m) => (
                    <li key={m.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <img src={m.imageUrl} className="w-12 h-12 object-cover rounded" />
                        <span>{m.name} - {m.price} DH</span>
                      </div>
                      <button
                        onClick={() => {
                          setItemToDelete({ type: 'meal', id: m.id });
                          setOpenDialog(true);
                        }}
                        className="text-red-600 text-sm"
                      >
                        حذف
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل تريد حذف {itemToDelete.type === 'restaurant' ? 'المطعم' : 'الوجبة'}؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button onClick={() => setOpenDialog(false)} className="border px-4 py-2 rounded">إلغاء</button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={async () => {
                setOpenDialog(false)
                itemToDelete.type === 'restaurant'
                  ? await deleteRestaurant(itemToDelete.id)
                  : await deleteMeal(itemToDelete.id)
              }}
            >
              حذف
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position="bottom-left" richColors/>
    </div>
  )
}
