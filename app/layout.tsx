import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trendsetter',
  description: '반도체 산업 데이터 분석 동아리 — 진성고등학교',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Trendsetter',
    description: '반도체 산업 데이터 분석 동아리 — 진성고등학교',
    url: 'https://x1zz.com',
    siteName: 'Trendsetter',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trendsetter',
    description: '반도체 산업 데이터 분석 동아리 — 진성고등학교',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}