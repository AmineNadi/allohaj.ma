'use client';
import { useEffect, useState } from 'react';
import { IoShareOutline } from "react-icons/io5";


export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobileSize, setIsMobileSize] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if screen is small (mobile)
    const checkMobileSize = () => {
      setIsMobileSize(window.innerWidth <= 768);
    };

    checkMobileSize();
    window.addEventListener('resize', checkMobileSize);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(userAgent);
    const isInStandaloneMode = 'standalone' in window.navigator && window.navigator.standalone;

    if (isiOS && !isInStandaloneMode) {
      setIsIOS(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('resize', checkMobileSize);
      window.removeEventListener('beforeinstallprompt', handler);
    };
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

  const handleIOSClick = () => {
    setShowInstructions(true);
  };

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  if (!isMobileSize) return null; // 📱 Only show on mobile

  return (
    <>
      {canInstall && (
        <button
          onClick={handleInstall}
          className="flex justify-center self-center transition duration-300 ease mx-auto mb-4 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 rounded-lg w-[200px] text-base font-semibold"
        >
          📲 تثبيت التطبيق
        </button>
      )}

      {isIOS && (
        <>
          <button
            onClick={handleIOSClick}
            className="flex justify-center self-center transition duration-300 ease mx-auto mb-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg w-[200px] text-base font-semibold"
          >
            📲 تثبيت التطبيق
          </button>

          {showInstructions && (
            <div className="fixed inset-0 bg-[#000000b5] flex items-center justify-center z-50">
              <div className="bg-white py-6 px-4 rounded-xl max-w-[90%] shadow-xl">
                <h2 className="text-lg font-bold mb-2 text-center">كيفية تنزيل التطبيق</h2>
                <div className="text-sm mb-4 " dir='rtl'>
                    <span className='flex items-center gap-1.5 flex-wrap'> 1. إضغط على زر المشاركة <IoShareOutline size={14} className='text-blue-800' />  في نافذة المتصفح .<br /></span>
                    <span >2. اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</span>
                  
                </div>
                <h2 className="text-lg font-bold mb-2 text-center">Comment télécharger l'application</h2>
                <div className="text-sm mb-4">
                <span className='flex items-center gap-1.5 flex-wrap'>1. Cliquez sur le bouton de partage <IoShareOutline size={14} className='text-blue-800' /> dans la fenêtre du navigateur. </span>
                  <span>3. Sélectionnez <strong>« Sur l'ecran d'accueil »</strong>.</span>
                  
                </div>
                <button
                  onClick={closeInstructions}
                  className="mt-2 flex justify-self-center text-center bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  فهمت ✅
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
