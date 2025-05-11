'use client';

export default function OrderForm({ userData, setUserData, handleSubmit }) {
  return (
    <form
      dir="rtl"
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 mx-auto mt-10"
    >
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        معلوماتك الشخصية
      </h3>
      <div className="space-y-5">
        <input
          type="text"
          placeholder="اسمك"
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <input
          type="tel"
          placeholder="رقم الهاتف"
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
        />
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
