'use client'
import { Inter } from "next/font/google";
import Image from "next/image";
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import OrderForm from '@/components/OrderForm';
import Hero from "@/components/Hero";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ChevronDown } from "lucide-react";


const interSans = Inter({
  subsets: ["latin"],
  weight: ["400","500","800"],
});
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

const mealVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]); // [{ restaurantId, restaurantName, mealName, price }, ...]
  const [userData, setUserData] = useState({ name: '', phone: '' });
  const [expandedRestaurantId, setExpandedRestaurantId] = useState(null);
  const [loadingRestaurantId, setLoadingRestaurantId] = useState(null);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true); 
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('/api/restaurants');
        const data = await res.json();
        setRestaurants(data.restaurants);
      } catch (err) {
        console.error('فشل تحميل المطاعم', err);
        toast.error('حدث خطأ أثناء تحميل قائمة المطاعم');
      } finally {
        setIsLoadingRestaurants(false); // إنهاء التحميل عند وصول البيانات
      }
    };
    fetchRestaurants();
  }, []);

  const toggleMeal = (restaurantId, restaurantName, mealName, price) => {
    const mealData = { restaurantId, restaurantName, mealName, price };
    setSelectedMeals((prev) => {
      const mealExists = prev.find(
        (m) => m.restaurantId === restaurantId && m.mealName === mealName
      );
      if (mealExists) {
        return prev.filter((m) => !(m.restaurantId === restaurantId && m.mealName === mealName));
      }
      return [...prev, mealData];
    });
  };

  const validateForm = () => {
    const phoneRegex = /^\d{10,}$/;
    if (
      selectedMeals.length === 0 ||
      !userData.name ||
      !userData.phone ||
      !phoneRegex.test(userData.phone)
    ) {
      toast.error("الرجاء اختيار وجبة واحدة على الأقل وملء جميع المعلومات بشكل صحيح (رقم هاتف مكون من 10 أرقام على الأقل)");
      return false;
    }
    return true;
  };
  
  // عرض الـ Dialog بعد التحقق
  const confirmAndSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowDialog(true);
    }
  };
  
  // إرسال الطلب بعد الموافقة
  const submitOrder = async () => {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        phone: userData.phone,
        meals: selectedMeals.map((m) => ({
          restaurant: m.restaurantName,
          meal: `${m.mealName} - ${m.price} DH`,
        })),
      }),
    });
  
    if (res.ok) {
      toast.success("تم إرسال الطلب بنجاح");
      setUserData({ name: '', phone: '' });
      setSelectedMeals([]);
      setShowDialog(false);
    } else {
      toast.error("حدث خطأ في إرسال الطلب");
    }
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-10">
        <div className="mx-auto px-4 md:px-9 lg:px-20">
          <Hero />
          <div className="grid grid-cols-1 gap-8 mb-12">
            {isLoadingRestaurants ? (
              // Skeleton loading أثناء تحميل المطاعم
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-5 animate-pulse space-y-4"
                >
                  <div className="h-40 bg-gray-300 rounded-xl" />
                  <div className="h-4 bg-gray-300 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : (
              restaurants.map((restaurant) => {
                const isExpanded = expandedRestaurantId === restaurant.id;

                return (
                  <div
                    key={restaurant.id}
                    className="bg-white flex flex-col overflow-hidden rounded-2xl lg:min-h-[90px] 2xl:min-h-[160px] shadow-lg hover:shadow-xl transition"
                  >
                    <div
                      className="flex gap-4 cursor-pointer h-full"
                      onClick={async () => {
                        if (isExpanded) {
                          setExpandedRestaurantId(null);
                        } else {
                          setLoadingRestaurantId(restaurant.id);
                          await new Promise((resolve) => setTimeout(resolve, 200)); // simulate loading
                          setExpandedRestaurantId(restaurant.id);
                          setLoadingRestaurantId(null);
                        }
                      }}
                    >
                      <div className="relative overflow-hidden w-[30%] h-full">
                        
                        <Image
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          layout="fill"         
                          objectFit="cover"    
                          className="absolute top-0 left-0"
                        />
                      </div>

                      <div className="p-5 w-full flex items-center justify-between">
                        <h2 className={`${interSans.className} text-xl font-bold mb-1 text-gray-800 uppercase`}>
                          {restaurant.name}
                        </h2>
                        <ChevronDown
                          className={`transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="meals"
                          className="p-5 space-y-3 border-t"
                          layout
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {loadingRestaurantId === restaurant.id ? (
                            // Skeleton loading للوجبات
                            Array.from({ length: 3 }).map((_, i) => (
                              <div
                                key={i}
                                className="animate-pulse flex items-center gap-3 p-3 border rounded-xl bg-gray-100"
                              >
                                <div className="w-12 h-12 bg-gray-300 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                  <div className="h-3 bg-gray-300 rounded w-3/4" />
                                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                                </div>
                              </div>
                            ))
                          ) : (
                            restaurant.meals.map((meal, index) => {
                              const isSelected = selectedMeals.some(
                                (m) =>
                                  m.restaurantId === restaurant.id &&
                                  m.mealName === meal.name
                              );

                              return (
                                <motion.div
                                  key={index}
                                  layout
                                  variants={mealVariants}
                                  className={`flex items-center justify-between rounded-xl border p-3 transition cursor-pointer ${
                                    isSelected
                                      ? "bg-green-50 border-green-500"
                                      : "bg-gray-50 hover:border-green-400"
                                  }`}
                                  onClick={() =>
                                    toggleMeal(
                                      restaurant.id,
                                      restaurant.name,
                                      meal.name,
                                      meal.price
                                    )
                                  }
                                >
                                  <div className="flex items-center gap-3">
                                    
                                    <Image
                                      loading="lazy"
                                      src={meal.imageUrl}
                                      alt={meal.name}
                                      width={48} 
                                      height={48} 
                                      className="rounded-lg object-cover"
                                    />
                                    <div>
                                      <p className="font-semibold text-gray-800">
                                        {meal.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {meal.price} DH
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                                    {isSelected && (
                                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          <OrderForm
            userData={userData}
            setUserData={setUserData}
            handleSubmit={confirmAndSubmit}
          />


        </div>
      </main>
      <Footer />
      <Toaster position="bottom-left" richColors />
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد إرسال الطلب</AlertDialogTitle>
            <AlertDialogDescription>
              {`${userData.name} هل أنت متأكد أنك تريد إرسال الطلب التالي :  `}
            </AlertDialogDescription>

            {/* قائمة الوجبات */}
            <ul className="mt-2 list-disc list-inside pl-5 text-sm text-muted-foreground">
              {selectedMeals.map((meal, idx) => (
                <li key={idx}>
                  {meal.restaurantName}: {meal.mealName} - {meal.price} DH
                </li>
              ))}
            </ul>

          </AlertDialogHeader>

          <AlertDialogFooter>
            
            <AlertDialogAction className="bg-green-600 hover:bg-green-700 text-white" onClick={submitOrder}>تأكيد الطلب</AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}