import Skeleton from '@/components/Skeleton';

type Props = { lines?: number };

export default function PartialSkeleton({ lines = 3 }: Props) {
  return (
    <div role="status" aria-label="polite" className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-full" />
      ))}
    </div>
  );
}
