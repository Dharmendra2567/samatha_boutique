import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Domain For Sale | samathaboutique.com',
  description: 'This domain is on sale. Contact at support@samathaboutique.com for purchase and acquisition inquiries.',
  robots: {
    index: true,
    follow: false,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  // All other pages and routes are intentionally unlinked and blocked.
  // Only this "domain is on sale" page is displayed across all routes.
  // To restore the original boutique website, revert this single file (app/layout.js).
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#450a0a] text-white selection:bg-white selection:text-red-900 font-sans relative overflow-x-hidden antialiased">
        {/* Ambient background glow accents */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-500/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[120px]" />
        </div>

        {/* Domain Sale Centered Container */}
        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-10">
          <div className="w-full max-w-2xl bg-black/40 border border-red-400/30 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 md:p-14 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-600/30 border border-red-400/40 text-red-200 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-300" />
              </span>
              Domain Acquisition Notice
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
              This Domain is on Sale
            </h1>

            {/* Domain Highlight */}
            <div className="inline-block mb-6 px-4 py-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-100 font-mono text-base sm:text-xl font-bold tracking-wide shadow-inner">
              samathaboutique.com
            </div>

            {/* Informational Message */}
            <p className="text-red-100/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-8 font-light">
              The domain name <strong className="font-semibold text-white">samathaboutique.com</strong> is currently available for purchase or transfer. Serious inquiries are welcome.
            </p>

            {/* Contact Email Highlight Box */}
            <div className="bg-gradient-to-b from-red-950/70 to-black/60 border border-red-500/40 rounded-2xl p-5 sm:p-7 mb-8 shadow-xl">
              <p className="text-xs uppercase tracking-widest text-red-300/90 font-semibold mb-2">
                Official Inquiries & Offers
              </p>
              <a
                href="mailto:support@samathaboutique.com?subject=Domain%20Purchase%20Inquiry%20-%20samathaboutique.com"
                className="text-lg sm:text-2xl md:text-3xl font-bold text-white hover:text-red-200 transition-colors break-all underline decoration-red-400/60 hover:decoration-white underline-offset-4 block mb-5"
              >
                support@samathaboutique.com
              </a>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="mailto:support@samathaboutique.com?subject=Domain%20Purchase%20Inquiry%20-%20samathaboutique.com"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-red-950 font-bold hover:bg-red-50 transition shadow-lg hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base cursor-pointer"
                >
                  <svg className="w-4 h-4 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Inquiry Email
                </a>

                <button
                  type="button"
                  id="copy-email-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-900/60 hover:bg-red-800/80 border border-red-500/40 text-red-100 font-semibold transition hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base cursor-pointer"
                >
                  <svg className="w-4 h-4 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Email Address
                </button>
              </div>

              {/* Copy Feedback */}
              <div id="copy-msg" className="opacity-0 transition-opacity duration-300 mt-3 text-xs sm:text-sm text-green-300 font-medium">
                ✓ Email copied to clipboard!
              </div>
            </div>

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-red-200/90 pt-2 border-t border-red-500/20">
              <div className="flex items-center justify-center gap-1.5 py-1">
                <span className="text-red-400">✦</span> Verified Ownership
              </div>
              <div className="flex items-center justify-center gap-1.5 py-1">
                <span className="text-red-400">✦</span> Secure Escrow Transfer
              </div>
              <div className="flex items-center justify-center gap-1.5 py-1">
                <span className="text-red-400">✦</span> 24h Inquiry Response
              </div>
            </div>
          </div>

          {/* Footer note */}
          <footer className="mt-8 text-xs text-red-300/60 text-center">
            samathaboutique.com • All Rights Reserved
          </footer>
        </main>

        {/* Lightweight script for copy button */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var btn = document.getElementById('copy-email-btn');
                var msg = document.getElementById('copy-msg');
                if (btn && msg) {
                  btn.addEventListener('click', function() {
                    navigator.clipboard.writeText('support@samathaboutique.com').then(function() {
                      msg.classList.remove('opacity-0');
                      msg.classList.add('opacity-100');
                      setTimeout(function() {
                        msg.classList.remove('opacity-100');
                        msg.classList.add('opacity-0');
                      }, 2500);
                    });
                  });
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
