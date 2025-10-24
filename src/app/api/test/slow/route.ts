import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // 캐시 금지 (App Router)
export const revalidate = 0;

export async function GET() {
  // 1.5초 인위 지연
  await new Promise((r) => setTimeout(r, 1500));

  const res = NextResponse.json({ ok: true, ts: Date.now() });
  // 브라우저/CDN 캐시도 확실히 끔
  res.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, max-age=0'
  );
  return res;
}
