'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, savings, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="w-24 h-24 rounded-full bg-blush flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-maroon" />
          </div>
          <h1 className="font-serif text-4xl text-maroon-dark">Your bag is empty</h1>
          <p className="text-muted-foreground mt-3">Discover our latest collection of handpicked sarees & boutique wear.</p>
          <Link href="/products"><Button size="lg" className="mt-6 bg-maroon hover:bg-maroon-light text-cream rounded-full px-8">Shop the Collection <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-maroon-dark mb-8">Your Shopping Bag <span className="text-muted-foreground text-lg">({items.length} items)</span></h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.id} className="bg-white rounded-xl border border-border/50 p-4 flex gap-4">
                <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-blush shrink-0">
                  <Image src={i.image} alt={i.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${i.id}`} className="font-medium text-foreground hover:text-maroon line-clamp-2">{i.name}</Link>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-sans text-lg font-semibold text-maroon">₹{i.price.toLocaleString('en-IN')}</span>
                    {i.mrp > i.price && <span className="font-sans text-xs line-through text-muted-foreground">₹{i.mrp.toLocaleString('en-IN')}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-full">
                      <button onClick={() => updateQty(i.id, i.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:text-maroon"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-medium">{i.qty}</span>
                      <button onClick={() => updateQty(i.id, i.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:text-maroon"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => removeItem(i.id)} className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"><Trash2 className="w-4 h-4" /> Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-xl border border-border/50 p-6 space-y-4">
              <h3 className="font-serif text-xl text-maroon-dark">Price Details</h3>
              <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-sans">₹{subtotal.toLocaleString('en-IN')}</span></div>
              {savings > 0 && <div className="flex justify-between text-sm text-green-700"><span>You save</span><span className="font-sans">− ₹{savings.toLocaleString('en-IN')}</span></div>}
              <div className="flex justify-between text-sm"><span>Shipping</span><span className={shipping === 0 ? 'text-green-700 font-sans' : 'font-sans'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="flex items-center gap-2 bg-cream rounded-lg p-3 text-sm text-gold-dark"><Tag className="w-4 h-4" /> Apply coupon at checkout</div>
              <div className="pt-3 border-t border-border/50 flex justify-between font-sans text-lg"><span>Total</span><span className="text-maroon font-bold font-sans">₹{total.toLocaleString('en-IN')}</span></div>
              <Link href="/checkout"><Button size="lg" className="w-full bg-maroon hover:bg-maroon-light text-cream rounded-full h-12">Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
              <div className="text-[11px] text-muted-foreground text-center pt-2">Free shipping on orders above ₹2999 • Secure checkout</div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
