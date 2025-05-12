'use client';
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession(); // التحقق من حالة الجلسة

  // إعادة توجيه المستخدم إلى /dashboard إذا كان مسجلاً دخوله
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // عرض شاشة تحميل أثناء التحقق من الجلسة
  if (status === 'loading') {
    return <div>جارٍ التحميل...</div>

  // إذا كان المستخدم مسجلاً دخوله، لا تعرض النموذج
  if (session) {
    return null; // أو يمكن عرض رسالة مثل "تم تسجيل الدخول، يتم إعادة التوجيه..."
  }}

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/dashboard',
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('خطأ في تسجيل الدخول');
    }
  };

  return (
    <div className="p-10 max-w-sm mx-auto text-center">
      <h1 className="text-xl mb-4 font-bold">تسجيل الدخول</h1>
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-3"
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        دخول
      </button>
    </div>
  );
}