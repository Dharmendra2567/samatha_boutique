'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';

export default function ProductCard({ product, priority = false }) {
  const { addItem, toggleWishlist, isInWishlist } = useCart();
  const p = product;
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden hover-lift border border-border/50">
      <Link href={`/products/${p.id}`} className="block relative aspect-[3/4] overflow-hidden bg-blush">
        <Image
          src={p.images[0]}
          alt={p.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {p.discount > 0 && (
          <span className="absolute top-3 left-3 bg-maroon text-cream text-[11px] font-semibold px-2 py-1 rounded">
            {p.discount}% OFF
          </span>
        )}
        {p.isBestSeller && (
          <span className="absolute top-3 right-3 gradient-gold text-maroon-dark text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">Bestseller</span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(p);
          }}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full backdrop-blur flex items-center justify-center transition shadow-sm z-10 ${isInWishlist(p.id) ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white/90 text-maroon hover:bg-white'}`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist(p.id) ? 'fill-white text-white' : 'text-maroon'}`} />
        </button>
      </Link>
      <div className="p-4 space-y-2">
        <div className="text-[10px] tracking-widest text-gold-dark uppercase">{p.categoryName}</div>
        <Link href={`/products/${p.id}`} className="block">
          <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-snug hover:text-maroon transition">{p.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="font-medium text-foreground">{p.rating}</span>
          <span>({p.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-sans text-lg font-semibold text-maroon">₹{p.price.toLocaleString('en-IN')}</span>
          {p.mrp > p.price && <span className="font-sans text-xs line-through text-muted-foreground">₹{p.mrp.toLocaleString('en-IN')}</span>}
        </div>
        <Button
          onClick={() => { addItem(p); toast.success('Added to bag', { description: p.name }); }}
          className="w-full mt-2 bg-maroon hover:bg-maroon-light text-cream h-9 text-xs tracking-wider uppercase"
        >
          <ShoppingBag className="w-3 h-3 mr-2" /> Add to Bag
        </Button>
      </div>
    </div>
  );
}
