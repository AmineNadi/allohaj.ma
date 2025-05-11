'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div>
      <h1>حدث خطأ أثناء تسجيل الدخول</h1>
      <p>{error || 'لم يتم تحديد الخطأ'}</p>
    </div>
  );
}
