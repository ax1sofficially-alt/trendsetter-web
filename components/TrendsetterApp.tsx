'use client';

import React, { useState, useEffect, useRef } from 'react';

/* ─── 칩 로고 ─── */
function ChipLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Trendsetter logo">
      <rect x="11" y="9" width="18" height="22" rx="1" stroke="white" strokeWidth="1.4"/>
      <circle cx="14" cy="12.5" r="1.5" fill="white"/>
      <line x1="13" y1="9"  x2="13" y2="3"  stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="20" y1="9"  x2="20" y2="3"  stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="27" y1="9"  x2="27" y2="3"  stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="11" y1="17" x2="5"  y2="17" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="11" y1="25" x2="5"  y2="25" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="29" y1="17" x2="35" y2="17" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="29" y1="25" x2="35" y2="25" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── AI 반도체 성능 차트 ─── */
function PerfChart() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { Chart, registerables } = await import('chart.js');
      if (!mounted || !canvasRef.current) return;
      Chart.register(...registerables);
      if (instanceRef.current) instanceRef.current.destroy();
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const grad = ctx.createLinearGradient(0, 0, 0, 300);
      grad.addColorStop(0,   'rgba(255,255,255,0.12)');
      grad.addColorStop(0.7, 'rgba(255,255,255,0.03)');
      grad.addColorStop(1,   'rgba(255,255,255,0)');

      instanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["'18", "'19", "'20", "'21", "'22", "'23", "'24"],
          datasets: [{
            data: [112, 260, 624, 1100, 3958, 5200, 8900],
            borderColor: 'rgba(255,255,255,0.85)',
            borderWidth: 1.5,
            fill: true,
            backgroundColor: grad,
            tension: 0.42,
            pointRadius: 2.5,
            pointHoverRadius: 5,
            pointBackgroundColor: '#ffffff',
            pointBorderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1200, easing: 'easeInOutQuart' },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.85)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              titleColor: 'rgba(255,255,255,0.5)',
              bodyColor: '#ffffff',
              padding: 8,
              callbacks: {
                title: (items) => items[0].label + ' 세대',
                label: (item) => ` ${Number(item.parsed.y).toLocaleString()} TOPS`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              border: { color: 'rgba(255,255,255,0.08)' },
              ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 9, family: 'inherit' }, maxRotation: 0 },
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              border: { color: 'rgba(255,255,255,0.08)' },
              ticks: {
                color: 'rgba(255,255,255,0.35)',
                font: { size: 9, family: 'inherit' },
                maxTicksLimit: 4,
                callback: (v: any) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v),
              },
            },
          },
        },
      });
    };
    init();
    return () => { mounted = false; instanceRef.current?.destroy(); };
  }, []);

  return (
    /* 
      모바일  : 세로 전체에서 텍스트+차트 둘 다 flex-1 경쟁 → 차트는 min-h-0 + h-full
      lg 이상 : 고정 너비 320px, 차트 높이 220px
    */
    <div className="flex flex-col gap-2 min-h-0 h-full">
      {/* 헤더 */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500 mb-0.5">Performance Trend</p>
          <p className="text-[11px] text-zinc-300 leading-tight">
            AI 반도체 추론 성능
            <span className="text-zinc-600 ml-1">INT8 TOPS</span>
          </p>
        </div>
        <p className="text-[9px] text-zinc-700 tracking-widest uppercase">2018–2024</p>
      </div>

      {/* 캔버스 — flex-1로 남은 공간 전부 차지, min-h-0 필수 */}
      <div className="relative flex-1 min-h-0 border-b border-zinc-800">
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </div>

      <div className="flex justify-between text-[9px] text-zinc-700 tracking-widest uppercase shrink-0">
        <span>V100</span>
        <span>→</span>
        <span>H100+</span>
      </div>
    </div>
  );
}

/* ─── 메인 앱 ─── */
interface Props { defaultShowReports?: boolean; }

export default function TrendsetterApp({ defaultShowReports = false }: Props) {
  const [showReports, setShowReports] = useState(defaultShowReports);
  const hasTriggered = useRef(defaultShowReports);

  useEffect(() => {
    const onPopState = () => {
      const isReports = window.location.pathname === '/reports';
      setShowReports(isReports);
      hasTriggered.current = isReports;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const goToReports = () => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    window.history.pushState({}, '', '/reports');
    setShowReports(true);
  };

  const goToHome = () => {
    setShowReports(false);
    hasTriggered.current = false;
    window.history.pushState({}, '', '/');
  };

  useEffect(() => {
    if (showReports) return;
    const handleWheel      = (e: WheelEvent)    => { if (e.deltaY > 8) goToReports(); };
    let startY = 0;
    const handleTouchStart = (e: TouchEvent)    => { startY = e.touches[0].clientY; };
    const handleTouchMove  = (e: TouchEvent)    => { if (startY - e.touches[0].clientY > 24) goToReports(); };
    const handleKey        = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); goToReports(); }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove',  handleTouchMove,  { passive: true });
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove',  handleTouchMove);
      window.removeEventListener('keydown', handleKey);
    };
  }, [showReports]);

  return (
    <main className="h-[100dvh] overflow-hidden bg-black text-white font-sans relative">
      <div className="w-full h-[1px] bg-zinc-700 fixed top-0 z-50" />

      {/* ══════════════ HERO ══════════════ */}
      <div
        className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
        style={{ transform: showReports ? 'translateY(-100%)' : 'translateY(0%)' }}
      >
        <div className="max-w-screen-xl mx-auto px-5 sm:px-6 lg:px-12 w-full h-full flex flex-col">

          {/* Nav — shrink-0으로 고정 */}
          <nav className="flex justify-between items-center py-4 sm:py-6 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <ChipLogo size={16} />
              <span className="text-xs sm:text-sm font-medium tracking-[0.2em]">Trendsetter</span>
            </div>
            <div className="flex gap-5 sm:gap-8 text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-400">
              <button onClick={goToReports} className="hover:text-white transition">Archive</button>
              <span className="cursor-default">About</span>
            </div>
          </nav>

          {/*
            핵심 레이아웃:
            · flex-1 + min-h-0 = nav·hint를 제외한 나머지 높이 전부 사용
            · 모바일 : flex-col  텍스트(shrink-0) / 차트(flex-1)
            · lg+    : flex-row  텍스트(flex-1)   / 차트(320px 고정)
          */}
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row lg:items-center
                          gap-4 sm:gap-5 lg:gap-16
                          py-4 sm:py-5 lg:py-0">

            {/* 텍스트 블록 */}
            <div className="shrink-0 lg:flex-1 flex flex-col gap-3 sm:gap-4">
              <h1 className="font-light tracking-tighter leading-[1.0]
                             text-[clamp(2.2rem,9vw,5.5rem)]">
                Trendsetter
              </h1>

              <p className="text-zinc-300 font-light leading-snug
                             text-[13px] sm:text-base lg:text-xl max-w-xl">
                진성고등학교 동아리{' '}
                <span className="text-white font-medium">Trendsetter</span>는
                반도체 등 최신 기술을 데이터 분석 관점에서 탐구합니다.
                <span className="hidden sm:inline">
                  {' '}우리는 수치 너머의 본질을 꿰뚫고, 기술적 통찰을 통해 미래의 흐름을 정의합니다.
                </span>
              </p>

              <div className="flex items-center gap-5 mt-0.5">
                <button
                  onClick={goToReports}
                  className="text-xs sm:text-sm border-b border-white pb-0.5 hover:text-zinc-400 hover:border-zinc-400 transition"
                >
                  View Reports
                </button>
                <a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition">
                  Contact Us
                </a>
              </div>

              {/* 메타 — lg 이상 */}
              <div className="hidden lg:flex gap-8 mt-1 pt-4 border-t border-zinc-800">
                {[
                  { label: 'Location', value: 'Jinseong High School' },
                  { label: 'Focus',    value: 'Semiconductor · Data Analytics' },
                  { label: 'Year',     value: '2026' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{label}</p>
                    <p className="text-xs text-zinc-300">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/*
              차트 컨테이너
              · 모바일  : flex-1 min-h-0 → 텍스트 아래 남은 공간 전부 차지
              · lg 이상 : 고정 너비 320px, 자체 높이는 부모(flex-row)가 결정
              border-t는 모바일에서만 (lg에서는 border-l로 전환)
            */}
            <div className="flex-1 min-h-0
                            lg:flex-none lg:w-[320px] xl:w-[380px] lg:h-full
                            border-t border-zinc-800 pt-3
                            lg:border-t-0 lg:pt-0 lg:border-l lg:border-zinc-800 lg:pl-10 xl:pl-14">
              <PerfChart />
            </div>
          </div>

          {/* 스크롤 힌트 — shrink-0으로 고정 */}
          <div className="py-4 sm:py-6 flex flex-col items-center gap-2 shrink-0">
            <span
              className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-zinc-400"
              style={{ animation: 'fadeUpDown 1.8s ease-in-out infinite' }}
            >
              Scroll
            </span>
            <div className="relative w-[1px] h-7 sm:h-9 bg-zinc-700 overflow-hidden">
              <div className="absolute left-0 w-full bg-zinc-200"
                   style={{ animation: 'drip 1.8s ease-in-out infinite' }} />
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════ REPORTS ══════════════ */}
      <div
        className="absolute inset-0 flex flex-col transition-all duration-700 ease-in-out"
        style={{
          transform: showReports ? 'translateY(0%)' : 'translateY(100%)',
          pointerEvents: showReports ? 'auto' : 'none',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-5 sm:px-6 lg:px-12 w-full flex flex-col h-full overflow-y-auto">
          <nav className="flex justify-between items-center py-4 sm:py-6 border-b border-zinc-800 sticky top-0 bg-black z-10 shrink-0">
            <button
              onClick={goToHome}
              className="flex items-center gap-2.5 text-zinc-300 hover:text-white transition"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <ChipLogo size={16} />
              <span className="text-xs sm:text-sm font-medium tracking-[0.2em]">Trendsetter</span>
            </button>
            <div className="flex gap-5 sm:gap-8 text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-400">
              <span className="text-white border-b border-white pb-0.5">Archive</span>
              <button onClick={goToHome} className="hover:text-white transition">About</button>
            </div>
          </nav>

          <section className="flex-1 py-10 sm:py-16 md:py-24">
            <div className="flex items-baseline justify-between mb-10 sm:mb-16 border-b border-zinc-800 pb-5">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight">Reports</h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">2026</span>
            </div>
            <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center">
              <div className="w-[1px] h-16 bg-zinc-700 mb-10" />
              <p className="text-zinc-400 text-sm tracking-[0.15em] uppercase mb-2">아직 등록된 리포트가 없습니다</p>
              <p className="text-zinc-600 text-[11px] tracking-widest uppercase">No reports published yet</p>
            </div>
          </section>

          <footer className="py-8 sm:py-12 border-t border-zinc-800 flex flex-col sm:flex-row justify-between gap-3 shrink-0">
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase">© 2026 Trendsetter. All rights reserved.</p>
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Designed for Insights.</p>
          </footer>
        </div>
      </div>

      <style>{`
        @keyframes drip {
          0%   { height: 0%;   top: -10%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { height: 110%; top: 0%;  opacity: 0; }
        }
        @keyframes fadeUpDown {
          0%, 100% { opacity: 0.3; transform: translateY(-2px); }
          50%       { opacity: 1;   transform: translateY(0px);  }
        }
      `}</style>
    </main>
  );
}