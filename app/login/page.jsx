'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')  // تغيير من username إلى email
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      email,  // التأكد من إرسال البريد الإلكتروني
      password,
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      alert('خطأ في تسجيل الدخول')
    }
  }

  return (
    <div className="p-10 max-w-sm mx-auto text-center">
      <h1 className="text-xl mb-4 font-bold">تسجيل الدخول</h1>
      <input
        type="email"  // تأكد من أن النوع هو email
        placeholder="البريد الإلكتروني"
        value={email}  // استخدام البريد الإلكتروني هنا
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
  )
}
