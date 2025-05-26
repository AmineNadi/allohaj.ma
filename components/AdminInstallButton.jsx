'use client';
import { useEffect, useState } from 'react';

export default function AdminInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const isSmallScreen = window.innerWidth < 768;
    const isLogin = window.location.pathname === '/login';

    const handler = (e) => {
      if (!isSmallScreen || !isLogin) return;
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setCanInstall(false);
      });
    }
  };

  const showIOSInstructions = () => {
    alert(
      'لتثبيت التطبيق:\nاضغط على زر المشاركة في Safari ثم اختر "إضافة إلى الشاشة الرئيسية".'
    );
  };

  if (!canInstall && !isIOS) return null;

  return (
    <button
      onClick={isIOS ? showIOSInstructions : handleInstall}
      className="mt-6 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm"
    >
      📲 تثبيت التطبيق الإداري
    </button>
  );
}
