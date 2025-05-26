'use client';
import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
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

  const handleIOSClick = () => {
    setShowInstructions(true);
  };

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <>
      {/* Android Button */}
      {canInstall && (
        <button
          onClick={handleInstall}
          className="flex justify-center self-center transition duration-300 ease mx-auto mb-4 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 rounded-lg w-[200px] text-base font-semibold"
        >
          📲 تثبيت التطبيق
        </button>
      )}

      {/* iOS Button */}
      {isIOS && (
        <>
          <button
            onClick={handleIOSClick}
            className="flex justify-center self-center transition duration-300 ease mx-auto mb-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg w-[200px] text-base font-semibold"
          >
            📲 تثبيت التطبيق
          </button>

          {showInstructions && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl max-w-sm text-center shadow-xl">
                <h2 className="text-lg font-bold mb-2">تثبيت التطبيق على iPhone</h2>
                <p className="text-sm mb-4">
                  1. افتح الموقع في <strong>Safari</strong>.<br />
                  2. اضغط على زر <strong>المشاركة</strong> (🔗 أو 🧭).<br />
                  3. اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                </p>
                <button
                  onClick={closeInstructions}
                  className="mt-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
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
