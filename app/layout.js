import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
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
  title: 'Samatha Boutique | Samatha Reddy Sarees Collection & Boutique Services',
  description: 'Premium Indian sarees, designer blouses, lehengas & boutique wear. Handpicked Banarasi, Kanjivaram, Pochampally silk sarees from Hyderabad, Nagole, Telangana.',
  keywords: 'sarees, boutique, hyderabad, nagole, kanjivaram, banarasi, pochampally, silk saree, lehenga, designer blouse',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-center" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
