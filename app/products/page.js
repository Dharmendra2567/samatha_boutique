'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { SlidersHorizontal, X } from 'lucide-react';
import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import ProductCard from '@/components/site/product-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

function CatalogInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 60000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sort, setSort] = useState('featured');

  const category = params.get('category') || 'all';
  const q = params.get('q') || '';
  const flag = params.get('flag') || '';

  useEffect(() => {
    axios.get('/api/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (category && category !== 'all') qs.set('category', category);
    if (q) qs.set('q', q);
    if (flag) qs.set('flag', flag);
    qs.set('minPrice', String(priceRange[0]));
    qs.set('maxPrice', String(priceRange[1]));
    qs.set('sort', sort);
    axios.get(`/api/products?${qs.toString()}`).then((r) => {
      let items = r.data;
      if (selectedColors.length) items = items.filter((p) => selectedColors.includes(p.color));
      setProducts(items);
      setLoading(false);
    });
  }, [category, q, flag, priceRange, sort, selectedColors]);

  const setCategory = (c) => {
    const qs = new URLSearchParams(params.toString());
    if (c === 'all') qs.delete('category'); else qs.set('category', c);
    qs.delete('flag');
    router.push(`/products?${qs.toString()}`);
  };

  const toggleColor = (color) => setSelectedColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);

  const activeCategory = categories.find((c) => c.slug === category);
  const headerTitle = activeCategory?.name || (flag ? { featured: 'Featured', new: 'New Arrivals', bestseller: 'Bestsellers', bridal: 'Bridal Collection' }[flag] : q ? `Search: “${q}”` : 'All Sarees & Boutique');

  const availableColors = ['Maroon', 'Emerald Green', 'Royal Blue', 'Ivory', 'Blush Pink', 'Deep Red', 'Mustard Yellow', 'Peacock Teal', 'Wine', 'Sage', 'Onyx Black'];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-br from-cream via-white to-blush py-6 md:py-8 border-b border-gold/20">
        <div className="container mx-auto px-4 text-center">
          {activeCategory && <div className="text-[10px] md:text-xs tracking-[0.3em] text-gold-dark uppercase mb-1">{activeCategory.group}</div>}
          <h1 className="font-serif text-3xl md:text-5xl text-maroon-dark leading-tight">{headerTitle}</h1>
          {activeCategory && <p className="text-xs md:text-sm text-muted-foreground mt-1.5 max-w-lg mx-auto">{activeCategory.tagline}</p>}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>
          <div className="text-sm text-muted-foreground">{loading ? 'Loading...' : `${products.length} products`}</div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px] rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* FILTERS */}
          <aside className={`${showFilters ? 'block fixed inset-0 z-40 bg-white overflow-auto p-6' : 'hidden'} lg:block lg:relative lg:p-0 lg:bg-transparent`}>
            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="flex items-center justify-between lg:hidden">
                <h3 className="font-serif text-xl">Filters</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></Button>
              </div>

              <div>
                <h4 className="font-serif text-lg text-maroon-dark mb-3">Category</h4>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={() => setCategory('all')} className={`hover:text-maroon ${category === 'all' ? 'text-maroon font-medium' : 'text-foreground/70'}`}>All Categories</button></li>
                  {categories.map((c) => (
                    <li key={c.slug}><button onClick={() => setCategory(c.slug)} className={`hover:text-maroon ${category === c.slug ? 'text-maroon font-medium' : 'text-foreground/70'}`}>{c.name}</button></li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-serif text-lg text-maroon-dark mb-3">Price</h4>
                <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={60000} step={500} />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                  <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-lg text-maroon-dark mb-3">Colour</h4>
                <div className="space-y-2">
                  {availableColors.map((c) => (
                    <div key={c} className="flex items-center gap-2">
                      <Checkbox id={c} checked={selectedColors.includes(c)} onCheckedChange={() => toggleColor(c)} />
                      <Label htmlFor={c} className="text-sm cursor-pointer">{c}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* GRID */}
          <div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No products found. Try adjusting filters.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CatalogInner />
    </Suspense>
  );
}
