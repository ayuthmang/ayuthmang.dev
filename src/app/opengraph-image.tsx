import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'Ayuth Mangmesap - Full-Stack Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #020617, #0f172a, #1e293b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '2px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '32px',
            padding: '80px',
            width: '100%',
            height: '100%',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '96px',
              fontWeight: 800,
              color: '#f8fafc',
              marginBottom: '32px',
              letterSpacing: '-4px',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            AYUTH MANGMESAP
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '42px',
              fontWeight: 500,
              color: '#94a3b8',
              textAlign: 'center',
              lineHeight: 1.4,
              maxWidth: '85%',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            Full-Stack Developer specializing in React, Next.js, and Node.js
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginTop: '64px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                color: '#38bdf8',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              ayuthmang.dev
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
