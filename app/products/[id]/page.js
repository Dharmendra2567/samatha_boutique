'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'sonner';
import { Star, Heart, ShoppingBag, Zap, Truck, ShieldCheck, RotateCcw, Award } from 'lucide-react';
import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import ProductCard from '@/components/site/product-card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/products/${id}`).then((r) => setData(r.data));
  }, [id]);

  if (!data) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-8">
        <div className="aspect-[3/4] bg-muted animate-pulse rounded-xl" />
        <div className="space-y-4">
          <div className="h-6 bg-muted animate-pulse rounded w-2/3" />
          <div className="h-10 bg-muted animate-pulse rounded w-1/2" />
          <div className="h-24 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );

  const p = data.product;
  const buyNow = () => { addItem(p, qty); router.push('/checkout'); };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <nav className="text-xs text-muted-foreground mb-6"><a href="/" className="hover:text-maroon">Home</a> / <a href={`/products?category=${p.category}`} className="hover:text-maroon">{p.categoryName}</a> / <span className="text-foreground">{p.name}</span></nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-blush group">
              <Image src={p.images[activeImg]} alt={p.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              {p.discount > 0 && <span className="absolute top-4 left-4 bg-maroon text-cream text-sm font-semibold px-3 py-1.5 rounded">{p.discount}% OFF</span>}
            </div>
            <div className="flex gap-3">
              {p.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition ${activeImg === i ? 'border-maroon' : 'border-transparent'}`}>
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-5">
            <div>
              <div className="text-xs tracking-[0.3em] text-gold-dark uppercase mb-2">{p.categoryName}</div>
              <h1 className="font-serif text-3xl md:text-4xl text-maroon-dark leading-tight">{p.name}</h1>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                <span className="font-semibold">{p.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-muted-foreground">{p.reviewCount} reviews</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-green-700">In stock ({p.stock} left)</span>
            </div>

            <div className="flex items-baseline gap-3 pb-4 border-b border-border/50">
              <span className="font-serif text-4xl font-bold text-maroon">₹{p.price.toLocaleString('en-IN')}</span>
              {p.mrp > p.price && <><span className="text-lg line-through text-muted-foreground">₹{p.mrp.toLocaleString('en-IN')}</span><span className="text-green-700 font-medium text-sm">You save ₹{(p.mrp - p.price).toLocaleString('en-IN')}</span></>}
            </div>

            <p className="text-foreground/80 leading-relaxed">{p.description}</p>

            <div className="grid grid-cols-2 gap-3 py-4 border-y border-border/50">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} className="text-sm">
                  <div className="text-xs text-gold-dark uppercase tracking-wider">{k}</div>
                  <div className="font-medium text-foreground mt-0.5">{v}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 hover:text-maroon">−</button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 hover:text-maroon">+</button>
              </div>
              <Button variant="ghost" size="icon" className="border border-border rounded-full h-10 w-10" onClick={() => toast.success('Added to wishlist')}><Heart className="w-4 h-4" /></Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => { addItem(p, qty); toast.success('Added to bag', { description: p.name }); }} className="flex-1 bg-white border-2 border-maroon text-maroon hover:bg-maroon hover:text-cream rounded-full h-12">
                <ShoppingBag className="w-4 h-4 mr-2" /> Add to Bag
              </Button>
              <Button size="lg" onClick={buyNow} className="flex-1 bg-maroon hover:bg-maroon-light text-cream rounded-full h-12">
                <Zap className="w-4 h-4 mr-2" /> Buy Now
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { icon: Truck, t: 'Free Shipping', s: 'Orders ₹2999+' },
                { icon: RotateCcw, t: '7-Day Returns', s: 'Easy exchange' },
                { icon: ShieldCheck, t: 'Authentic', s: 'Handloom certified' },
                { icon: Award, t: 'Boutique Quality', s: 'Curated in Hyderabad' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs bg-cream rounded-lg p-3">
                  <f.icon className="w-4 h-4 text-gold-dark shrink-0" />
                  <div><div className="font-medium text-foreground">{f.t}</div><div className="text-muted-foreground">{f.s}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIMILAR */}
        {data.similar?.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-3xl text-maroon-dark mb-6">You may also love</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {data.similar.slice(0, 4).map((s) => <ProductCard key={s.id} product={s} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
