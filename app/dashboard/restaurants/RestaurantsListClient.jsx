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
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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
        <ul className="space-y-8 ">
          {restaurants.map((r) => (
            <li key={r.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  {r.imageUrl && <img src={r.imageUrl} className="w-10 h-10 rounded-full border" />}
                  <h3 className="font-bold uppercase">{r.name}</h3>
                </div>
                <button
                    onClick={() => {
                    setSelectedRestaurant(r); 
                    setOpenEditDialog(true); 
                    }}
                    className="text-blue-600 text-xs sm:text-sm"
                >
                    تعديل  ✏️
                </button>
                <button
                  className="text-red-600 text-xs sm:text-sm"
                  onClick={() => {
                    setItemToDelete({ type: 'restaurant', id: r.id });
                    setOpenDialog(true);
                  }}
                >
                  حذف المطعم 🚮
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
                        <span className='text-sm sm:text-[16px]'>{m.name} - {m.price} DH</span>
                      </div>
                      <button
                        onClick={() => {
                          setItemToDelete({ type: 'meal', id: m.id });
                          setOpenDialog(true);
                        }}
                        className="text-red-600 text-xs sm:text-sm"
                      >
                       حذف الوجبة 🚮
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
            <button onClick={() => setOpenDialog(false)} className="border px-4 py-2 rounded">إلغاء</button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog  open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <AlertDialogContent className='h-max max-h-[95vh] overflow-y-auto'>
            <AlertDialogHeader>
            <AlertDialogTitle className='mb-6 text-center'>تعديل المطعم والوجبات</AlertDialogTitle>
            </AlertDialogHeader>

            {selectedRestaurant && (
            <form
            onSubmit={async (e) => {
                e.preventDefault();
            
                // 1️⃣ رفع صورة المطعم إذا تم تغييرها
                let uploadedRestaurantImageUrl = selectedRestaurant.imageUrl;
                if (selectedRestaurant.newImage) {
                const restaurantImageFormData = new FormData();
                restaurantImageFormData.append('file', selectedRestaurant.newImage);
            
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: restaurantImageFormData,
                });
            
                const data = await res.json();
                uploadedRestaurantImageUrl = data.url;
                }
            
                // 2️⃣ تحديث بيانات المطعم
                await fetch(`/api/restaurants/${selectedRestaurant.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: selectedRestaurant.name,
                    imageUrl: uploadedRestaurantImageUrl,
                }),
                });
            
                // 3️⃣ تحديث كل وجبة على حدة مع رفع صورة جديدة (إن وُجدت)
                for (const meal of selectedRestaurant.meals) {
                let uploadedMealImageUrl = meal.imageUrl;
            
                if (meal.newImage) {
                    const mealImageFormData = new FormData();
                    mealImageFormData.append('file', meal.newImage);
            
                    const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: mealImageFormData,
                    });
            
                    const uploadData = await uploadRes.json();
                    uploadedMealImageUrl = uploadData.url;
                }
            
                // تحديث بيانات الوجبة
                await fetch(`/api/meals/${meal.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    name: meal.name,
                    price: parseFloat(meal.price),
                    imageUrl: uploadedMealImageUrl,
                    }),
                });
                }
            
                toast.success('تم التعديل بنجاح');
                fetchRestaurants();
                setOpenEditDialog(false);
            }}
            className="space-y-6"
            >
            
                {/* --- تعديل المطعم --- */}
                <div className="space-y-4 text-sm">
                <h3 className="text-base font-semibold text-blue-600">تعديل المطعم</h3>
                <div className="space-y-2 flex flex-col md:flex-row gap-3 items-center">
                <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={selectedRestaurant.name}
                    onChange={(e) =>
                    setSelectedRestaurant({
                        ...selectedRestaurant,
                        name: e.target.value,
                    })
                    }
                />
                <input
                className='hidden'
                id='imgRest'
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        setSelectedRestaurant({
                        ...selectedRestaurant,
                        newImage: file,
                        imagePreview: URL.createObjectURL(file),
                        });
                    }
                    }}
                />
                <label htmlFor="imgRest" className='w-full border p-2 rounded cursor-pointer'> تحميل صورة المطعم ⬇️</label>
                {(selectedRestaurant.imagePreview || selectedRestaurant.imageUrl) && (
                    <img
                    src={selectedRestaurant.imagePreview || selectedRestaurant.imageUrl}
                    className="w-20 h-20 object-cover rounded"
                    alt="معاينة صورة المطعم"
                    />
                )}
                </div>
                
                
                </div>

                {/* --- تعديل الوجبات --- */}
                <div className="space-y-4 text-sm">
                <h3 className="text-base font-semibold text-blue-600">الوجبات</h3>
                {selectedRestaurant.meals.map((meal, idx) => (
                    <div key={meal.id} className="border p-3 rounded space-y-2">
                        <div className='flex gap-2'>
                        <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={meal.name}
                        onChange={(e) => {
                        const newMeals = [...selectedRestaurant.meals];
                        newMeals[idx].name = e.target.value;
                        setSelectedRestaurant({ ...selectedRestaurant, meals: newMeals });
                        }}
                    />
                    <input
                        
                        type="number"
                        className="w-full border p-2 rounded "
                        value={meal.price}
                        onChange={(e) => {
                        const newMeals = [...selectedRestaurant.meals];
                        newMeals[idx].price = e.target.value;
                        setSelectedRestaurant({ ...selectedRestaurant, meals: newMeals });
                        }}
                    />
                    
                        </div>
                    <div className=' flex gap-3 items-center'>
                    <input
                        id='imgMeals'
                        className='hidden'
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const newMeals = [...selectedRestaurant.meals];
                            newMeals[idx].newImage = file;
                            newMeals[idx].imagePreview = URL.createObjectURL(file);
                            setSelectedRestaurant({ ...selectedRestaurant, meals: newMeals });
                        }
                        }}
                    />
                    <label htmlFor="imgMeals" className='inline-block border p-2 rounded cursor-pointer'> تحميل صورة الوجبة ⬇️</label>
                    {(meal.imagePreview || meal.imageUrl) && (
                        <img
                        src={meal.imagePreview || meal.imageUrl}
                        className="w-20 h-20 object-cover rounded"
                        alt="معاينة صورة الوجبة"
                        />
                    )}
                    </div>
                    
                    </div>
                ))}
                </div>

                <AlertDialogFooter className=" gap-2">
                
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    حفظ التعديلات
                </button>
                <button
                    type="button"
                    onClick={() => setOpenEditDialog(false)}
                    className="border px-4 py-2 rounded"
                >
                    إلغاء
                </button>
                </AlertDialogFooter>
            </form>
            )}
        </AlertDialogContent>
        </AlertDialog>


      <Toaster position="bottom-left" richColors/>
    </div>
  )
}
