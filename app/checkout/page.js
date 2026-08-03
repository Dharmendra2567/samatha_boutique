'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { CheckCircle2, Truck, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, savings, shipping, total, clear } = useCart();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    line1: '', city: 'Hyderabad', state: 'Telangana', pincode: '', landmark: '',
    payment: 'cod',
  });

  if (order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl text-maroon-dark mt-6">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-3">Thank you for shopping with Samatha Reddy Boutique. A confirmation has been sent.</p>
          <div className="bg-white rounded-xl border border-gold/30 p-6 mt-8 text-left">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-medium">{order.id}</span></div>
            <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Total</span><span className="font-serif text-lg text-maroon font-bold">₹{order.total.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Payment</span><span className="font-medium">{order.payment === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</span></div>
            <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Status</span><span className="font-medium text-green-700">{order.status}</span></div>
          </div>
          <div className="flex gap-3 mt-8 justify-center">
            <Button variant="outline" onClick={() => router.push('/')}>Continue Shopping</Button>
            <Button className="bg-maroon hover:bg-maroon-light text-cream" onClick={() => window.print()}>Download Invoice</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-3xl text-maroon-dark">Your bag is empty</h1>
          <Button onClick={() => router.push('/products')} className="mt-6 bg-maroon hover:bg-maroon-light text-cream rounded-full">Shop Now</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.phone || !form.line1 || !form.pincode)) {
      toast.error('Please fill all required fields'); return;
    }
    setStep(step + 1);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await axios.post('/api/orders', {
        items, customer: { name: form.name, phone: form.phone, email: form.email },
        address: { line1: form.line1, city: form.city, state: form.state, pincode: form.pincode, landmark: form.landmark },
        payment: form.payment,
        subtotal, shipping, total,
      });
      setOrder(data.order);
      clear();
    } catch (e) {
      toast.error('Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-serif text-4xl text-maroon-dark mb-2">Checkout</h1>

        <div className="flex items-center gap-4 my-6 text-sm">
          {[{ n: 1, l: 'Address' }, { n: 2, l: 'Payment' }, { n: 3, l: 'Review' }].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step >= s.n ? 'bg-maroon text-cream' : 'bg-muted text-muted-foreground'}`}>{s.n}</div>
              <span className={step >= s.n ? 'text-maroon font-medium' : 'text-muted-foreground'}>{s.l}</span>
              {i < 2 && <div className="w-8 h-[2px] bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="bg-white rounded-xl border border-border/50 p-6">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-maroon-dark flex items-center gap-2"><Truck className="w-5 h-5" /> Delivery Address</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Full Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
                  <div><Label>Mobile *</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
                  <div className="md:col-span-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
                  <div className="md:col-span-2"><Label>Address Line *</Label><Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="mt-1" placeholder="Flat, House no., Street" /></div>
                  <div><Label>Landmark</Label><Input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className="mt-1" /></div>
                  <div><Label>Pincode *</Label><Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="mt-1" /></div>
                  <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" /></div>
                  <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="mt-1" /></div>
                </div>
                <Button onClick={nextStep} className="bg-maroon hover:bg-maroon-light text-cream mt-4">Continue to Payment</Button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-maroon-dark flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h2>
                <RadioGroup value={form.payment} onValueChange={(v) => setForm({ ...form, payment: v })} className="space-y-3">
                  <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer ${form.payment === 'razorpay' ? 'border-maroon bg-cream' : 'border-border'}`}>
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <CreditCard className="w-5 h-5 text-maroon" />
                    <div className="flex-1">
                      <div className="font-medium">Razorpay (Card / UPI / Netbanking)</div>
                      <div className="text-xs text-muted-foreground">Secure payment powered by Razorpay</div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-gold/20 text-gold-dark uppercase tracking-wider">Preview</span>
                  </label>
                  <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer ${form.payment === 'cod' ? 'border-maroon bg-cream' : 'border-border'}`}>
                    <RadioGroupItem value="cod" id="cod" />
                    <Banknote className="w-5 h-5 text-maroon" />
                    <div className="flex-1">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-xs text-muted-foreground">Pay when you receive your order</div>
                    </div>
                  </label>
                </RadioGroup>
                <div className="flex gap-3"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={nextStep} className="bg-maroon hover:bg-maroon-light text-cream">Review Order</Button></div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-maroon-dark">Review your order</h2>
                <div className="bg-cream rounded-lg p-4 text-sm">
                  <div className="font-medium">{form.name}</div>
                  <div className="text-muted-foreground">{form.line1}, {form.city}, {form.state} – {form.pincode}</div>
                  <div className="text-muted-foreground">Phone: {form.phone}</div>
                </div>
                <div className="text-sm"><span className="text-muted-foreground">Payment: </span><span className="font-medium">{form.payment === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</span></div>
                <div className="border-t border-border pt-4 space-y-2">
                  {items.map((i) => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="line-clamp-1">{i.name} × {i.qty}</span>
                      <span>₹{(i.price * i.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button onClick={placeOrder} disabled={placing} className="bg-maroon hover:bg-maroon-light text-cream flex-1">{placing ? 'Placing...' : `Place Order – ₹${total.toLocaleString('en-IN')}`}</Button></div>
              </div>
            )}
          </div>

          <aside className="h-fit">
            <div className="bg-white rounded-xl border border-border/50 p-6 space-y-3">
              <h3 className="font-serif text-xl text-maroon-dark">Order Summary</h3>
              <div className="space-y-2 max-h-64 overflow-auto no-scrollbar">
                {items.map((i) => (
                  <div key={i.id} className="flex gap-3 items-center text-sm">
                    <div className="w-12 h-14 bg-blush rounded overflow-hidden shrink-0 relative"><img src={i.image} alt="" className="object-cover w-full h-full" /></div>
                    <div className="flex-1 min-w-0"><div className="line-clamp-1">{i.name}</div><div className="text-xs text-muted-foreground">Qty {i.qty}</div></div>
                    <div className="font-medium">₹{(i.price * i.qty).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                {savings > 0 && <div className="flex justify-between text-green-700"><span>Savings</span><span>− ₹{savings.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span className={shipping === 0 ? 'text-green-700' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between font-serif text-lg font-bold text-maroon pt-2 border-t"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
