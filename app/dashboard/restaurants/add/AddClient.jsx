// app/restaurants/add/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner"
import AddBox from '@/components/AddBox';

export default function AddRestaurantPage({session}) {

  const [restaurants, setRestaurants] = useState([])
  const [newRestaurantName, setNewRestaurantName] = useState('')
  const [newRestaurantImage, setNewRestaurantImage] = useState(null)
  const [restaurantPreview, setRestaurantPreview] = useState(null)
  const [selectedImageName, setSelectedImageName] = useState("")
  const [selectedImageMealName, setSelectedImageMealName] = useState("")
  const [newMeal, setNewMeal] = useState({ name: '', price: '', image: '', restaurantId: '' })
  const [previewImage, setPreviewImage] = useState(null)

  const fetchRestaurants = async () => {
    const res = await fetch('/api/restaurants')
    const data = await res.json()
    setRestaurants(data.restaurants)
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const handleRestaurantImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewRestaurantImage(file)
      setRestaurantPreview(URL.createObjectURL(file))
    }
  }

  const addRestaurant = async () => {
    if (!newRestaurantName || !newRestaurantImage) {
      return toast.error('يرجى إدخال اسم وصورة للمطعم');
    }

    const formData = new FormData()
    formData.append('name', newRestaurantName)
    formData.append('image', newRestaurantImage)

    const res = await fetch('/api/restaurants', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      toast.success('تمت إضافة المطعم')
      setNewRestaurantName('')
      setNewRestaurantImage(null)
      setRestaurantPreview(null)
      setSelectedImageName('')
      fetchRestaurants()
    }
  }

  const handleMealImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewMeal({ ...newMeal, image: file })
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const addMeal = async () => {
    const { name, price, image, restaurantId } = newMeal
    if (!name || !price || !image || !restaurantId) return toast.error('المرجو ملأ حقول الوجبة')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('restaurantId', restaurantId)
    formData.append('image', image)

    const res = await fetch('/api/meals', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      toast.success('تمت إضافة الوجبة')
      setNewMeal({ name: '', price: '', image: '', restaurantId: '' })
      setPreviewImage(null)
      setSelectedImageMealName('')
      fetchRestaurants()
    }
  }

  return (
    <div className="py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">إضافة مطعم أو وجبة</h1>

      <AddBox title="إضافة مطعم" imagePreview={restaurantPreview} buttonLabel="إضافة مطعم" onSubmit={addRestaurant}
        fields={
          <>
            <input
              type="text"
              placeholder="اسم المطعم"
              value={newRestaurantName}
              onChange={(e) => setNewRestaurantName(e.target.value)}
              className="border p-2 rounded"
            />
            <label className="cursor-pointer border p-2 rounded text-gray-600">
              {selectedImageName || "📷 اختر صورة"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleRestaurantImageChange}
              />
            </label>
          </>
        }
      />

      <AddBox title="إضافة وجبة" imagePreview={previewImage} buttonLabel="إضافة وجبة" onSubmit={addMeal}
        fields={
          <>
            <input
              type="text"
              placeholder="اسم الوجبة"
              value={newMeal.name}
              onChange={(e) =>
                setNewMeal({ ...newMeal, name: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="السعر"
              value={newMeal.price}
              onChange={(e) =>
                setNewMeal({ ...newMeal, price: e.target.value })
              }
              className="border p-2 rounded"
            />
            <label className="cursor-pointer border p-2 rounded text-gray-600">
              {selectedImageMealName || "🍴 اختر صورة"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMealImageChange}
              />
            </label>
            <select
              value={newMeal.restaurantId}
              onChange={(e) =>
                setNewMeal({ ...newMeal, restaurantId: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">اختر مطعماً</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </>
        }
      />

      <Toaster position="bottom-left" richColors />
    </div>
  )
}
