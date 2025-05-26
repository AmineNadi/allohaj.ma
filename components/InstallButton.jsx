'use client';
import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // التحقق مما إذا كان الجهاز iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // التحقق من دعم Service Worker و PushManager
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('🌐 Service Worker and PushManager supported');
      const handler = (e) => {
        console.log('📦 beforeinstallprompt event fired');
        e.preventDefault();
        setDeferredPrompt(e);
        setCanInstall(true);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => window.removeEventListener('beforeinstallprompt', handler);
    } else {
      console.log('⚠️ Service Worker or PushManager not supported');
    }
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      console.log('📥 Prompting install...');
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ App installed');
        } else {
          console.log('❌ App installation declined');
        }
        setDeferredPrompt(null);
        setCanInstall(false);
      });
    }
  };

  // عرض تعليمات لمستخدمي iOS
  if (isIOS) {
    return (
      <div className="flex justify-center self-center mb-[32px]">
        <p className="text-base font-semibold text-center">
          📲 لتثبيت التطبيق، اضغط على زر المشاركة في Safari ثم اختر "إضافة إلى الشاشة الرئيسية"
        </p>
      </div>
    );
  }

  // إذا لم يكن التثبيت متاحًا، لا تعرض شيئًا
  if (!canInstall) return null;

  // زر التثبيت للمتصفحات المدعومة
  return (
    <button
      onClick={handleInstall}
      className="flex justify-center self-center transition duration-300 ease mb-[32px] bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 rounded-lg w-[200px] text-base font-semibold fixed top-2.5 left-1/2 transform -translate-x-1/2 z-[9999] border-none cursor-pointer"
    >
      📲 تثبيت التطبيق
    </button>
  );
}