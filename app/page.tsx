// app/page.tsx  →  홈 진입점
import TrendsetterApp from '@/components/TrendsetterApp';

export default function HomePage() {
  return <TrendsetterApp defaultShowReports={false} />;
}