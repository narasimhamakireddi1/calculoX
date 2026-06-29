import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb 0%, #a855f7 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
          }}
        />

        {/* CX logo tile */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: '40px',
              fontWeight: '900',
              letterSpacing: '-2px',
            }}
          >
            CX
          </span>
        </div>

        {/* Brand name */}
        <div
          style={{
            color: 'white',
            fontSize: '88px',
            fontWeight: '900',
            letterSpacing: '-4px',
            marginBottom: '20px',
            display: 'flex',
          }}
        >
          calculox
        </div>

        {/* Tagline */}
        <div
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '36px',
            fontWeight: '400',
            marginBottom: '36px',
            display: 'flex',
          }}
        >
          14 Free Online Calculators for India
        </div>

        {/* Calculator pill tags */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {['EMI', 'SIP', 'FD', 'Tax', 'BMI', 'GST', '+8 more'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.18)',
                color: 'white',
                padding: '10px 22px',
                borderRadius: '100px',
                fontSize: '24px',
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '22px',
            marginTop: '40px',
            display: 'flex',
          }}
        >
          www.calculox.in
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
