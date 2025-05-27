'use client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminInstallButton from '@/components/AdminInstallButton';

// Ensure the page is fully dynamic (client-side rendered)
export const dynamic = 'force-dynamic';

// Component to handle searchParams with Suspense
function LoginContent() {
  const { data: session, status } = typeof window !== 'undefined' ? useSession() : { data: null, status: 'loading' };
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isGoogleOneTapInitialized = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
      return;
    }

    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError('❌ فشل تسجيل الدخول. حاول مرة أخرى.');
      setIsLoading(false);
    }

    if (!isGoogleOneTapInitialized.current && clientId && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleOneTapResponse,
            auto_select: true,
          });

          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log(
                'One Tap prompt was not displayed or was skipped:',
                notification.getNotDisplayedReason()
              );
            }
          });

          isGoogleOneTapInitialized.current = true;
        }
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [status, searchParams, router, clientId]);

  const handleOneTapResponse = async (response) => {
    setIsLoading(true);
    try {
      await signIn('google', {
        credential: response.credential,
        callbackUrl: '/dashboard',
        redirect: false,
      });
    } catch (err) {
      setError('❌ حدث خطأ أثناء تسجيل الدخول بـ Google One Tap.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('❌ حدث خطأ أثناء تسجيل الدخول بـ Google.');
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setMessage('');
    setError('');
    const res = await signIn('email', {
      email,
      redirect: false,
      callbackUrl: '/dashboard',
    });

    if (res?.ok) {
      setMessage('✅ تم إرسال رابط تسجيل الدخول إلى بريدك الإلكتروني');
    } else {
      setMessage('❌ حدث خطأ أثناء إرسال الرابط. تأكد من صحة البريد.');
    }
  };

  return (
    <div className="p-10 max-w-sm mx-auto text-center">
      <h1 className="text-xl mb-6 font-bold">تسجيل الدخول</h1>

      {status === 'loading' && <div>جارٍ التحميل...</div>}

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
          fill="currentColor"
        >
          <path d="M488 261.8C488 403.3 391.1 512 248 512 110.8 512 0 401.2 0 264S110.8 16 248 16c66.7 0 122.5 24.1 165.6 63.6l-67.1 64.6C316.2 103.4 284 88 248 88c-87.1 0-157.5 71.6-157.5 176S160.9 440 248 440c90.6 0 124.6-64.9 130-98H248v-80h240C487.4 275.2 488 268.6 488 261.8z" />
        </svg>
        {isLoading ? 'جارٍ فتح نافذة تسجيل الدخول...' : 'تسجيل الدخول بواسطة Google'}
      </button>

      <div className="my-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative bg-white px-3 text-gray-500 text-sm">أو</div>
      </div>

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-3"
      />

      <button
        onClick={handleEmailLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        أرسل رابط تسجيل الدخول
      </button>

      {message && <p className="mt-4 text-sm text-green-700">{message}</p>}

      <AdminInstallButton />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>جارٍ تحميل صفحة تسجيل الدخول...</div>}>
      <LoginContent />
    </Suspense>
  );
}