'use client';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function RestaurantCard({
  restaurant,
  isExpanded,
  onToggle,
  selectedMeals,
  toggleMeal,
}) {
  return (
    <div
      key={restaurant.id}
      className="bg-white flex flex-col overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition"
    >
      <div
        className="flex gap-4 cursor-pointer h-full"
        onClick={() => onToggle(restaurant.id)}
      >
        <div className="relative overflow-hidden w-[30%]">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover absolute top-1/2 left-1/2 -translate-1/2"
          />
        </div>

        <div className="p-5 w-full flex items-center justify-between">
          <h2 className="text-xl font-bold mb-1 text-gray-800">
            {restaurant.name}
          </h2>
          <p className="text-gray-500 text-sm mb-0" dir="rtl">
            {restaurant.meals.length > 1 ? 'وجبات متوفرة' : 'وجبة متوفرة'}
          </p>
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
            {restaurant.meals.map((meal, index) => {
              const isSelected = selectedMeals.some(
                (m) => m.restaurantId === restaurant.id && m.mealName === meal.name
              );

              return (
                <motion.div
                  key={index}
                  layout
                  variants={mealVariants}
                  className={`flex items-center justify-between rounded-xl border p-3 transition cursor-pointer ${
                    isSelected
                      ? 'bg-green-50 border-green-500'
                      : 'bg-gray-50 hover:border-green-400'
                  }`}
                  onClick={() => toggleMeal(restaurant.id, restaurant.name, meal.name, meal.price)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{meal.name}</p>
                      <p className="text-sm text-gray-500">{meal.price} DH</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                    {isSelected && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
