import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FlowZone AI | Automate Your Business in 48 Hours';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo row: three dots + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '52px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1E3A8A', display: 'flex' }} />
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#60A5FA', display: 'flex' }} />
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#BAE6FD', display: 'flex' }} />
          </div>
          <span style={{ fontSize: '48px', fontWeight: '800', color: '#111827', letterSpacing: '-1px' }}>
            FlowZone <span style={{ color: '#3B82F6' }}>AI</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: '800',
            color: '#111827',
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            marginBottom: '32px',
            maxWidth: '1000px',
          }}
        >
          Automate Your Business in 48 Hours
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: '28px',
            color: '#6B7280',
            textAlign: 'center',
            maxWidth: '780px',
            lineHeight: 1.5,
            marginBottom: '52px',
          }}
        >
          Done-for-you AI workflows that eliminate manual work and scale your operations.
        </div>

        {/* CTA pill */}
        <div
          style={{
            background: '#1D4ED8',
            color: 'white',
            padding: '20px 52px',
            borderRadius: '999px',
            fontSize: '28px',
            fontWeight: '700',
            display: 'flex',
          }}
        >
          Get Your Free AI Audit
        </div>
      </div>
    ),
    { ...size }
  );
}
