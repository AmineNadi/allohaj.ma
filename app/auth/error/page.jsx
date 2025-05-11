import { Suspense } from 'react';
import ErrorPageContent from './ErrorPageContent';

export default function ErrorPage() {
  return (
    <Suspense fallback={<p>جاري التحميل...</p>}>
      <ErrorPageContent />
    </Suspense>
  );
}
