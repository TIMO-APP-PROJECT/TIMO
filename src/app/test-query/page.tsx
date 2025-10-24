'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchSlow() {
  const res = await fetch('/api/debug/slow', { cache: 'no-store' });
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
}

export default function TestQueryPage() {
  const { data, isLoading, isFetching, status, error } = useQuery({
    queryKey: ['debug-slow'], // 캐시키 고정
    queryFn: fetchSlow,
    staleTime: 0, // 항상 stale → 로딩 보여주기 쉬움
    gcTime: 0, // 캐시 즉시 회수(테스트용)
    refetchOnMount: 'always', // 마운트될 때마다 refetch
    retry: 0, // 에러 시 즉시 표시
  });

  // 🔎 로딩이 보이는지 명확히: 조건을 단순화
  if (isLoading) return <div style={{ padding: 12 }}>로딩 중… (최초)</div>;
  if (error) return <div>에러: {(error as Error).message}</div>;

  return (
    <div style={{ padding: 12 }}>
      <h1>React Query 로딩 테스트</h1>
      <pre>
        {JSON.stringify({ data, isLoading, isFetching, status }, null, 2)}
      </pre>
      {isFetching && <div style={{ opacity: 0.6 }}>백그라운드 갱신 중…</div>}
    </div>
  );
}
