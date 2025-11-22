import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navigation from '@/components/ui/Navigation';
import CustomCursor from '@/components/ui/CustomCursor';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Alex Morgan | UX Designer & Researcher',
  description:
    'Senior UX Designer crafting digital experiences that matter. View my portfolio of case studies in fintech, healthcare, and SaaS.',
  keywords: ['UX Designer', 'Product Designer', 'UX Research', 'Portfolio', 'Case Studies'],
  authors: [{ name: 'Alex Morgan' }],
  openGraph: {
    title: 'Alex Morgan | UX Designer & Researcher',
    description: 'Senior UX Designer crafting digital experiences that matter.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-body`}>
        <CustomCursor />
        <Navigation />
        <main>{children}</main>

        {/* Grain overlay */}
        <div className="grain" />

        {/* Footer */}
        <footer className="border-t border-ux-border/50 py-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-ux-muted">
                © {new Date().getFullYear()} Alex Morgan. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ux-muted hover:text-ux-text transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://dribbble.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ux-muted hover:text-ux-text transition-colors"
                >
                  Dribbble
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ux-muted hover:text-ux-text transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
