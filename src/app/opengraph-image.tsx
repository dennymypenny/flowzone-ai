import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FlowZone AI — Stop Doing It Manually. We Automate Everything in 48 Hours.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'white',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', width: '20px', height: '20px', borderRadius: '10px', background: '#1E3A8A' }} />
          <div style={{ display: 'flex', width: '20px', height: '20px', borderRadius: '10px', background: '#60A5FA' }} />
          <div style={{ display: 'flex', width: '20px', height: '20px', borderRadius: '10px', background: '#BAE6FD' }} />
          <div style={{ display: 'flex', fontSize: '38px', fontWeight: '800', color: '#111827', marginLeft: '8px' }}>
            FlowZone AI
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: '22px', fontWeight: '700', color: '#3B82F6', letterSpacing: '3px', marginBottom: '24px' }}>
          DONE FOR YOU IN 48 HOURS
        </div>
        <div style={{ display: 'flex', fontSize: '66px', fontWeight: '900', color: '#111827', textAlign: 'center', lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '24px', maxWidth: '960px' }}>
          Stop Doing It Manually. We Automate Everything.
        </div>
        <div style={{ display: 'flex', fontSize: '24px', color: '#6B7280', textAlign: 'center', maxWidth: '700px', lineHeight: 1.5, marginBottom: '44px' }}>
          Custom AI workflows built and live in 48 hours — or your money back.
        </div>
        <div style={{ display: 'flex', background: '#1D4ED8', color: 'white', padding: '18px 48px', borderRadius: '100px', fontSize: '24px', fontWeight: '700' }}>
          Get Your Free AI Audit
        </div>
      </div>
    ),
    { ...size }
  );
}
