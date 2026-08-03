'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { count, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
      <div className="bg-maroon text-cream text-xs py-2 text-center px-4">
        <span className="tracking-wider">✨ Free shipping on orders above ₹2999 &middot; Handcrafted in Hyderabad &middot; COD available across India</span>
      </div>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex flex-col shrink-0">
          <span className="font-serif text-2xl md:text-3xl font-bold text-maroon leading-none">Samatha Reddy</span>
          <span className="text-[10px] md:text-xs tracking-[0.35em] text-gold-dark uppercase mt-1">Boutique • Saree Collection</span>
        </Link>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sarees, lehengas, blouses..."
            className="pl-11 h-11 rounded-full border-gold/30 focus-visible:ring-maroon"
          />
        </form>

        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex"><Heart className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex"><User className="w-5 h-5" /></Button>
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="w-5 h-5" />
              {hydrated && count > 0 && (
                <span className="absolute -top-1 -right-1 bg-maroon text-cream text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenu(!menu)}>
            {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <nav className="hidden md:block border-t border-b border-gold/20 bg-cream/50">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3 text-sm font-medium">
            {[
              { name: 'All Sarees', href: '/products?category=all' },
              { name: 'Kanjivaram', href: '/products?category=kanjivaram' },
              { name: 'Banarasi', href: '/products?category=banarasi' },
              { name: 'Pochampally', href: '/products?category=pochampally' },
              { name: 'Bridal', href: '/products?category=bridal' },
              { name: 'Lehengas', href: '/products?category=lehenga' },
              { name: 'Blouses', href: '/products?category=blouse' },
              { name: 'Kurtis', href: '/products?category=kurti' },
              { name: 'New Arrivals', href: '/products?flag=new' },
            ].map((l) => (
              <li key={l.name}>
                <Link href={l.href} className="text-foreground/80 hover:text-maroon transition-colors relative group">
                  {l.name}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gold group-hover:w-full transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {menu && (
        <div className="md:hidden border-t border-gold/20 bg-white">
          <form onSubmit={submitSearch} className="p-4 relative">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="pl-11" />
          </form>
          <ul className="pb-4">
            {['all', 'kanjivaram', 'banarasi', 'pochampally', 'bridal', 'lehenga', 'blouse', 'kurti'].map((c) => (
              <li key={c}>
                <Link href={`/products?category=${c}`} onClick={() => setMenu(false)} className="block px-6 py-3 border-t border-border capitalize">{c === 'all' ? 'All Sarees' : c}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
