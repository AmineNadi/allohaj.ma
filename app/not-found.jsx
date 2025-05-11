import Image from "next/image";
import Link from "next/link";
import foundImage from '../public/404.svg'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50" dir="rtl">
      <Image
        src={foundImage}
        alt="صفحة غير موجودة"
        width={300}
        height={300}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold text-red-600 mb-4">الصفحة غير موجودة</h1>
      <p className="text-lg text-gray-700 mb-6">
        عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها.
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}
