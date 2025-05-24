'use client';
import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      console.log('📦 beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      console.log('📥 Prompting install...');
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log('✅ User choice:', choiceResult);
        setDeferredPrompt(null);
        setCanInstall(false);
      });
    }
  };

  if (!canInstall) return null;

  return (
    <button onClick={handleInstall} className="flex justify-center self-center transition duration-300 ease mb-[32px] bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 rounded-lg w-[200px] text-base font-semibold">
      📲 تثبيت التطبيق
    </button>
  );
}
