'use client';

import { Suspense } from 'react';
import { Loading } from '@/components/feedback';
import ResetPassword from '@/components/forms/ResetPassword';

export default function Page() {
  return (
    <Suspense fallback={<Loading message="Loading..." />}>
      <ResetPassword />
    </Suspense>
  );
}
