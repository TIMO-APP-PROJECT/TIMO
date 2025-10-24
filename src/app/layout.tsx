import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav/BottomNav';
import Providers from './providers';

const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TIMO',
  description: 'Daily log',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="KO">
      <body
        className={`${interSans.variable} ${jetbrainsMono.variable} antialiased min-h-dvh bg-neutral-100 text-gray-900`} // 브라우저 화면 동적 높이, 바깥 회색 배경,  전체 텍스트 색상 기본 값
      >
        <Providers>
          <div className="mx-auto w-full min-h-dvh max-w-app tab:max-w-tablet bg-white shadow-sm">
            {children}
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
