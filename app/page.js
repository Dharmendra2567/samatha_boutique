'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Award, Star } from 'lucide-react';
import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import ProductCard from '@/components/site/product-card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [bridal, setBridal] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    (async () => {
      const [f, n, b, br, c, t] = await Promise.all([
        axios.get('/api/products?flag=featured&limit=8'),
        axios.get('/api/products?flag=new&limit=8'),
        axios.get('/api/products?flag=bestseller&limit=8'),
        axios.get('/api/products?flag=bridal&limit=6'),
        axios.get('/api/categories'),
        axios.get('/api/testimonials'),
      ]);
      setFeatured(f.data);
      setNewArrivals(n.data);
      setBestSellers(b.data);
      setBridal(br.data);
      setCategories(c.data);
      setTestimonials(t.data);
    })().catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-white to-blush">
        <div className="container mx-auto px-4 pt-8 pb-16 md:py-24 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-gold-dark uppercase">
              <Sparkles className="w-4 h-4" /> Hyderabad • Est. Hand-Curated
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-maroon-dark leading-[1.05]">
              Woven for<br />
              the <span className="italic text-gradient-gold">modern</span><br />
              Indian woman.
            </h1>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
              From heirloom Kanjivarams to featherlight Pochampallys — discover a boutique that celebrates craft, colour and the confident woman.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products?category=all"><Button size="lg" className="bg-maroon hover:bg-maroon-light text-cream rounded-full px-8">Shop the Collection <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
              <Link href="/products?category=bridal"><Button size="lg" variant="outline" className="border-maroon text-maroon hover:bg-maroon hover:text-cream rounded-full px-8">Bridal Couture</Button></Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-gold" /> Free shipping ₹2999+</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> Authentic handloom</div>
              <div className="flex items-center gap-2"><Award className="w-4 h-4 text-gold" /> Hyderabad boutique</div>
            </div>
          </div>
          <div className="relative h-[400px] min-[380px]:h-[460px] sm:h-[540px] md:h-[620px] order-1 md:order-2">
            <div className="absolute -top-2 right-0 sm:-top-4 sm:-right-4 w-44 h-60 min-[380px]:w-48 min-[380px]:h-64 sm:w-60 sm:h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl animate-float">
              <Image src="https://images.unsplash.com/photo-1600685890506-593fdf55949b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800" alt="Bridal saree" fill className="object-cover" priority />
            </div>
            <div className="absolute top-24 left-0 sm:top-32 w-40 h-52 min-[380px]:w-44 min-[380px]:h-56 sm:w-52 sm:h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-xl" style={{ animation: 'float 5s ease-in-out infinite 1s' }}>
              <Image src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800" alt="Silk saree" fill className="object-cover" priority />
            </div>
            <div className="absolute bottom-0 right-4 sm:right-10 w-36 h-48 min-[380px]:w-40 min-[380px]:h-52 sm:w-44 sm:h-60 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-xl" style={{ animation: 'float 6s ease-in-out infinite 2s' }}>
              <Image src="https://images.pexels.com/photos/17154861/pexels-photo-17154861.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=800&w=800" alt="Bridal" fill className="object-cover" />
            </div>
            <div className="absolute bottom-4 left-0 sm:bottom-8 sm:-left-4 bg-white rounded-xl shadow-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 max-w-[160px] min-[380px]:max-w-[180px] sm:max-w-[220px]">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-gold flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4 sm:w-5 h-5 text-white" /></div>
              <div>
                <div className="font-serif font-semibold text-xs sm:text-sm text-maroon">15,000+</div>
                <div className="text-[8px] sm:text-[10px] text-muted-foreground leading-tight">Happy Brides Across India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold-dark uppercase mb-3">Explore Categories</div>
          <h2 className="font-serif text-4xl md:text-5xl text-maroon-dark">Curated by <em className="text-gradient-gold not-italic">Craft</em></h2>
          <div className="paisley-divider max-w-md mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden">
              <Image src={c.img} alt={c.name} fill sizes="20vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/85 via-maroon-dark/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold">{c.group}</div>
                <div className="font-serif text-lg leading-tight mt-1">{c.name}</div>
                <div className="text-[11px] text-cream/70 mt-1">{c.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <ProductRow title="Featured Sarees" subtitle="Handpicked by Samatha" items={featured} link="/products?flag=featured" />

      {/* BRIDAL BANNER */}
      <section className="relative py-24 my-10 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600" alt="Bridal" fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-dark/90 via-maroon-dark/70 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 max-w-3xl text-cream">
          <div className="text-xs tracking-[0.3em] text-gold uppercase mb-4">The Bridal Edit</div>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight">For the once-in-a-lifetime <em className="text-gradient-gold not-italic">moment</em>.</h2>
          <p className="mt-4 text-cream/80 max-w-lg">Curated Kanjivarams, statement lehengas and hand-embroidered blouses crafted for the modern Indian bride.</p>
          <Link href="/products?category=bridal"><Button size="lg" className="mt-6 bg-gold hover:bg-gold-light text-maroon-dark rounded-full px-8">Explore Bridal Couture <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
        </div>
      </section>

      <ProductRow title="New Arrivals" subtitle="Fresh weaves this week" items={newArrivals} link="/products?flag=new" />
      <ProductRow title="Bestsellers" subtitle="Loved by 15,000+ women" items={bestSellers} link="/products?flag=bestseller" />
      <ProductRow title="Bridal Collection" subtitle="Regal pieces for your big day" items={bridal} link="/products?category=bridal" />

      {/* TESTIMONIALS */}
      <section className="bg-gradient-to-br from-blush via-cream to-blush py-20 my-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.3em] text-gold-dark uppercase mb-3">Words from our Sisters</div>
            <h2 className="font-serif text-4xl md:text-5xl text-maroon-dark">Loved across <em className="text-gradient-gold not-italic">India</em></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex gap-1 mb-3">{Array(t.rating).fill(0).map((_, k) => <Star key={k} className="w-4 h-4 fill-gold text-gold" />)}</div>
                <p className="text-sm text-foreground/80 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full gradient-maroon flex items-center justify-center text-cream font-serif font-semibold">{t.avatar}</div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="font-serif text-3xl md:text-4xl text-maroon-dark">Join the <em className="text-gradient-gold not-italic">inner circle</em></h3>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">Early access to new arrivals, bridal previews and boutique-exclusive drops.</p>
        <form className="max-w-md mx-auto mt-6 flex gap-2">
          <input type="email" placeholder="your@email.com" className="flex-1 h-12 px-5 rounded-full border border-gold/40 focus:outline-none focus:ring-2 focus:ring-maroon" />
          <Button type="button" onClick={(e) => e.preventDefault()} className="bg-maroon hover:bg-maroon-light text-cream rounded-full px-6 h-12">Subscribe</Button>
        </form>
      </section>

      <Footer />
    </div>
  );
}

function ProductRow({ title, subtitle, items, link }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-xs tracking-[0.3em] text-gold-dark uppercase mb-2">{subtitle}</div>
          <h2 className="font-serif text-3xl md:text-4xl text-maroon-dark">{title}</h2>
        </div>
        <Link href={link} className="text-sm text-maroon hover:text-gold-dark flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
