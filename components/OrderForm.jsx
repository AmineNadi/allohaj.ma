'use client';

import { useForm } from 'react-hook-form';

export default function OrderForm({ onValid }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      dir="rtl"
      onSubmit={handleSubmit(onValid)}
      className="bg-white rounded-2xl shadow-xl p-8 mx-auto mt-10"
    >
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        معلوماتك الشخصية
      </h3>
      <div className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="اسمك"
            {...register('name', { required: 'الاسم مطلوب' })}
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.name && (
            <p className="text-red-500 mt-2 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="رقم الهاتف"
            {...register('phone', {
              required: 'رقم الهاتف مطلوب',
              pattern: {
                value: /^\d{10,}$/,
                message: 'رقم هاتف غير صالح (10 أرقام على الأقل)',
              },
            })}
            className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.phone && (
            <p className="text-red-500 mt-2 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg w-full text-lg font-semibold"
        >
          إرسال الطلب
        </button>
      </div>
    </form>
  );
}
