import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Creative Framework App | Boost Your Creativity',
  description: 'Learn creative frameworks, flows, concepts and patterns. Use AI to generate ideas and boost your creativity.',
  keywords: ['creativity', 'design thinking', 'brainstorming', 'innovation', 'creative frameworks', 'ideation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="animated-bg" />
        {children}
      </body>
    </html>
  )
}
