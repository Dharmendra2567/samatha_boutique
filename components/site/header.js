'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldAlert, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { count, hydrated, wishlist = [], toggleWishlist } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setQ(searchParams.get('q') || '');
    }
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    setMenu(false);
    if (q.trim()) {
      router.push(`/products?q=${encodeURIComponent(q.trim())}`);
    } else {
      router.push('/products?category=all');
    }
  };

  const handleClear = () => {
    setQ('');
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('q')) {
        searchParams.delete('q');
        router.push(`${pathname}?${searchParams.toString()}`);
      }
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
      <div className="bg-maroon text-cream text-xs py-2 text-center px-4">
        <span className="tracking-wider">✨ Free shipping on orders above ₹2999 &middot; Handcrafted in Hyderabad &middot; COD available across India</span>
      </div>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img src="/logo.png" alt="Samatha Boutique Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gold/20 shadow-sm bg-white" />
          <div className="flex flex-col">
            <span className="font-serif text-2xl md:text-3xl font-bold text-maroon leading-none">Samatha Reddy</span>
            <span className="text-[9px] md:text-[10px] tracking-[0.12em] text-gold-dark uppercase mt-1 font-semibold">Sarees Collection & Boutique Services</span>
          </div>
        </Link>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sarees, lehengas, blouses..."
            className="pl-11 pr-10 h-11 rounded-full border-gold/30 focus-visible:ring-maroon"
          />
          {q && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors animate-in fade-in zoom-in-95 duration-150"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-1 md:gap-2">
          {user && user.role === 'admin' && (
            <Link href="/admin" className="hidden md:inline-flex mr-1">
              <Button variant="outline" size="sm" className="border-gold text-maroon hover:bg-cream/50 gap-1.5 h-9 rounded-full px-4 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Panel
              </Button>
            </Link>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hidden md:inline-flex">
                <Heart className={`w-5 h-5 ${hydrated && wishlist.length > 0 ? 'fill-maroon text-maroon' : ''}`} />
                {hydrated && wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maroon text-cream text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 border-gold/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                  <h4 className="font-serif text-base font-bold text-maroon-dark">My Wishlist</h4>
                  {hydrated && <Badge variant="outline" className="text-[10px]">{wishlist.length} items</Badge>}
                </div>
                {!hydrated || wishlist.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Your wishlist is empty.</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {wishlist.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 border-b border-gold/5 pb-2 last:border-0 last:pb-0">
                        <Link href={`/products/${item.id}`} className="relative w-10 h-13 rounded overflow-hidden bg-blush shrink-0">
                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.id}`} className="block font-medium text-xs text-foreground hover:text-maroon truncate">
                            {item.name}
                          </Link>
                          <div className="font-sans text-xs font-semibold text-maroon mt-1">
                            ₹{item.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="text-muted-foreground hover:text-red-600 shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {hydrated && wishlist.length > 0 && (
                  <div className="pt-2 border-t border-gold/10">
                    <Link href="/products?category=all">
                      <Button size="sm" className="w-full bg-maroon hover:bg-maroon-light text-cream text-[10px] rounded-full h-8 tracking-wider uppercase">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Link href={user ? '/profile' : '/login'}>
            <Button variant="ghost" size="icon" className="relative">
              <User className="w-5 h-5" />
              {user && (
                <span className="absolute bottom-1 right-1 bg-green-500 rounded-full w-2.5 h-2.5 border-2 border-white" />
              )}
            </Button>
          </Link>
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
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="pl-11 pr-10"
            />
            {q && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
          <ul className="pb-4">
            {user && user.role === 'admin' && (
              <li>
                <Link href="/admin" onClick={() => setMenu(false)} className="block px-6 py-3 border-t border-border font-semibold text-maroon">Admin Dashboard</Link>
              </li>
            )}
            <li>
              <Link href={user ? '/profile' : '/login'} onClick={() => setMenu(false)} className="block px-6 py-3 border-t border-border font-medium">
                {user ? `My Account (${user.name})` : 'Login / Sign Up'}
              </Link>
            </li>
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
