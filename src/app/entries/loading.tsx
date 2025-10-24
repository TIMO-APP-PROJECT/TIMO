import Skeleton from '@/components/Skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div className="p-6 space-y-4" role="status" aria-live="polite">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-32 w-full" />
      loading,,,
    </div>
  );
}
