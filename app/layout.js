import { Playfair_Display, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { CartProvider } from '@/lib/cart-context';
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
  title: 'Samatha Reddy Boutique & Saree Collection | Hyderabad',
  description: 'Premium Indian sarees, designer blouses, lehengas & boutique wear. Handpicked Banarasi, Kanjivaram, Pochampally silk sarees from Hyderabad, Telangana.',
  keywords: 'sarees, boutique, hyderabad, kanjivaram, banarasi, pochampally, silk saree, lehenga, designer blouse',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background antialiased">
        <CartProvider>
          {children}
          <Toaster position="top-center" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
