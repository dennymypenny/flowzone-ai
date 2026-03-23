import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FlowZone AI — Your Business, Fully Automated in 48 Hours';
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
          padding: '72px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '44px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#1E3A8A', display: 'flex' }} />
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#60A5FA', display: 'flex' }} />
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#BAE6FD', display: 'flex' }} />
          </div>
          <span style={{ fontSize: '40px', fontWeight: '800', color: '#111827', letterSpacing: '-1px' }}>
            FlowZone <span style={{ color: '#3B82F6' }}>AI</span>
          </span>
        </div>

        {/* Hook line */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#3B82F6',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '20px',
          }}
        >
          Done for you in 48 hours
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '76px',
            fontWeight: '900',
            color: '#111827',
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: '-3px',
            marginBottom: '28px',
            maxWidth: '980px',
          }}
        >
          Stop Doing It Manually.
          <span style={{ color: '#1D4ED8' }}> We Automate Everything.</span>
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: '26px',
            color: '#6B7280',
            textAlign: 'center',
            maxWidth: '720px',
            lineHeight: 1.5,
            marginBottom: '48px',
          }}
        >
          Custom AI workflows built and live in 48 hours — or your money back.
        </div>

        {/* CTA */}
        <div
          style={{
            background: '#1D4ED8',
            color: 'white',
            padding: '20px 52px',
            borderRadius: '999px',
            fontSize: '26px',
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
