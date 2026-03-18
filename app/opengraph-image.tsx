import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Trendsetter — 반도체 산업 데이터 분석';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px 96px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 상단 얇은 라인 */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: '#3f3f46' }} />

        {/* 우측 하단 배경 장식 — 칩 핀 배열 느낌 */}
        <div style={{
          position: 'absolute', right: 80, top: 120,
          display: 'flex', flexDirection: 'column', gap: 20, opacity: 0.08,
        }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{ display: 'flex', gap: 16 }}>
              {[0,1,2,3,4,5,6,7].map(j => (
                <div key={j} style={{ width: 6, height: 6, background: 'white', borderRadius: 1 }} />
              ))}
            </div>
          ))}
        </div>

        {/* 로고 + 워드마크 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* 칩 SVG — ImageResponse 안에서는 SVG 직접 못 씀, div로 근사 */}
          <div style={{
            width: 36, height: 44, border: '1.8px solid white', borderRadius: 2,
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 5, height: 5, background: 'white', borderRadius: '50%', position: 'absolute', top: 6, left: 6 }} />
          </div>
          <span style={{ color: 'white', fontSize: 22, letterSpacing: '0.22em', fontWeight: 400 }}>
            Trendsetter
          </span>
        </div>

        {/* 메인 타이틀 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
          <div style={{ color: '#71717a', fontSize: 15, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Data Analysis · Semiconductor · AI
          </div>
          <div style={{ color: 'white', fontSize: 80, fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            반도체 산업의<br />흐름을 읽다
          </div>
        </div>

        {/* 하단 메타 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          {[
            { label: 'School', value: 'Jinseong High School' },
            { label: 'Focus',  value: 'Semiconductor · AI' },
            { label: 'Year',   value: '2026' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ color: '#52525b', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {label}
              </span>
              <span style={{ color: '#a1a1aa', fontSize: 14 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* 하단 라인 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: '#27272a' }} />
      </div>
    ),
    { ...size }
  );
}