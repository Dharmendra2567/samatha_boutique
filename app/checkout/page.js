'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import axios from 'axios';
import { toast } from 'sonner';
import { CheckCircle2, Truck, CreditCard, Banknote, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, savings, shipping, total, clear } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);
  const [rzpConfigured, setRzpConfigured] = useState(false);
  const [rzpKeyId, setRzpKeyId] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    line1: '', city: 'Hyderabad', state: 'Telangana', pincode: '', landmark: '',
    payment: 'razorpay',
  });

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
        phone: user.phone || f.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    axios.get('/api/razorpay/config').then(({ data }) => {
      setRzpConfigured(!!data.configured);
      setRzpKeyId(data.keyId || null);
      if (!data.configured) setForm((f) => ({ ...f, payment: 'cod' }));
    }).catch(() => {});
  }, []);

  if (order) {
    return (
      <div className="min-h-screen bg-background">
        {/* Web UI only - Hidden during printing */}
        <div className="print:hidden">
          <Header />
          <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-serif text-4xl text-maroon-dark mt-6">Order Confirmed!</h1>
            <p className="text-muted-foreground mt-3">Thank you for shopping with Samatha Reddy Sarees Collection & Boutique Services. A confirmation has been sent.</p>
            <div className="bg-white rounded-xl border border-gold/30 p-6 mt-8 text-left">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-medium">{order.id}</span></div>
              <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Total</span><span className="font-sans text-lg text-maroon font-bold">₹{order.total.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Payment</span><span className="font-medium">{order.payment === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</span></div>
              {order.razorpayPaymentId && <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Payment ID</span><span className="font-mono text-xs">{order.razorpayPaymentId}</span></div>}
              <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Status</span><span className="font-medium text-green-700">{order.status}</span></div>
            </div>
            <div className="flex gap-3 mt-8 justify-center">
              <Button variant="outline" onClick={() => router.push('/')}>Continue Shopping</Button>
              <Button className="bg-maroon hover:bg-maroon-light text-cream" onClick={() => window.print()}>Download Invoice</Button>
            </div>
          </div>
          <Footer />
        </div>

        {/* Print-only Invoice Template */}
        <div className="hidden print:block bg-white p-8 text-black min-h-screen font-sans">
          {/* Header Section */}
          <div className="border-b-2 border-maroon pb-6 flex justify-between items-start">
            <div>
              <h1 className="font-serif text-3xl font-bold text-maroon leading-none">Samatha Reddy</h1>
              <p className="text-[10px] tracking-[0.12em] text-gold-dark uppercase mt-1 font-semibold">Sarees Collection & Boutique Services</p>
              <p className="text-xs text-muted-foreground mt-3">Road No. 12, Banjara Hills, Hyderabad, Telangana - 500034</p>
              <p className="text-xs text-muted-foreground">Email: contact@samathareddy.com | Phone: +91 99887 76655</p>
            </div>
            <div className="text-right">
              <h2 className="font-serif text-2xl font-bold text-maroon uppercase tracking-wider">Invoice</h2>
              <p className="text-sm font-mono mt-1"><span className="font-semibold">Invoice No:</span> {order.id}</p>
              <p className="text-xs text-muted-foreground mt-1"><span className="font-semibold">Date:</span> {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Billing & Shipping Addresses */}
          <div className="grid grid-cols-2 gap-8 my-8 text-sm">
            <div className="space-y-1">
              <h3 className="font-serif text-xs uppercase tracking-wider text-muted-foreground font-semibold border-b border-border pb-1 mb-2">Billed To</h3>
              <p className="font-semibold text-base text-foreground">{order.customer?.name}</p>
              {order.customer?.email && <p className="text-muted-foreground">{order.customer.email}</p>}
              {order.customer?.phone && <p className="text-muted-foreground">Phone: {order.customer.phone}</p>}
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xs uppercase tracking-wider text-muted-foreground font-semibold border-b border-border pb-1 mb-2">Shipped To</h3>
              <p className="font-semibold text-base text-foreground">{order.customer?.name}</p>
              <p className="text-muted-foreground">{order.shippingAddress?.line1}</p>
              {order.shippingAddress?.landmark && <p className="text-muted-foreground">Landmark: {order.shippingAddress.landmark}</p>}
              <p className="text-muted-foreground">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>
          </div>

          {/* Payment Info Box */}
          <div className="bg-cream rounded-lg p-4 mb-8 text-sm grid grid-cols-2 gap-4 border border-gold/20">
            <div>
              <span className="text-xs uppercase text-muted-foreground font-semibold block">Payment Method</span>
              <span className="font-medium mt-1 block text-maroon">{order.payment === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay (Online Payment)'}</span>
            </div>
            <div>
              <span className="text-xs uppercase text-muted-foreground font-semibold block">Payment Status</span>
              <span className="font-semibold text-green-700 mt-1 block uppercase tracking-wider text-xs">{order.status === 'Confirmed' ? 'Paid & Confirmed' : order.status}</span>
              {order.razorpayPaymentId && <span className="text-[11px] text-muted-foreground block font-mono">TXN: {order.razorpayPaymentId}</span>}
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full mb-8 text-sm border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-gold/30 text-xs uppercase text-maroon font-semibold">
                <th className="py-3 w-8">#</th>
                <th className="py-3">Item Description</th>
                <th className="py-3 text-center w-16">Qty</th>
                <th className="py-3 text-right w-32">Unit Price</th>
                <th className="py-3 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-border/40 align-top">
                  <td className="py-3 font-mono text-muted-foreground">{idx + 1}</td>
                  <td className="py-3">
                    <span className="font-medium text-foreground block">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground">ID: {item.id}</span>
                  </td>
                  <td className="py-3 text-center text-muted-foreground">{item.qty || item.quantity}</td>
                  <td className="py-3 text-right">₹{(item.price || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right font-medium text-foreground">₹{((item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pricing Summary */}
          <div className="flex justify-end text-sm">
            <div className="w-80 space-y-2.5">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{(order.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              {order.savings > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Savings</span>
                  <span className="font-sans">− ₹{(order.savings || 0).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-sans">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between font-sans text-lg font-bold text-maroon pt-3 border-t-2 border-maroon">
                <span>Total Amount</span>
                <span className="font-sans">₹{(order.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Terms & Thank You */}
          <div className="mt-20 pt-8 border-t border-border/60 text-xs text-muted-foreground text-center space-y-2">
            <p className="font-serif text-sm font-semibold text-maroon">Thank you for shopping with Samatha Reddy!</p>
            <p>We appreciate your purchase of our custom designs and handcrafted textiles.</p>
            <p className="text-[10px] pt-2 border-t border-gold/10 max-w-md mx-auto">
              This is a computer-generated invoice. For returns or support, please email support@samathareddy.com within 7 days of delivery.
            </p>
          </div>
        </div>
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

  const openRazorpay = ({ keyId, razorpayOrderId, amount, currency, internalOrderId }) => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded. Please refresh and try again.'));
        return;
      }
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'Samatha Reddy Sarees Collection & Boutique Services',
        description: `Order ${internalOrderId}`,
        image: '/favicon.ico',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        notes: { address: form.line1, city: form.city },
        theme: { color: '#722F37' },
        handler: async (result) => {
          try {
            const { data } = await axios.post('/api/razorpay/verify', {
              orderId: internalOrderId,
              razorpay_order_id: result.razorpay_order_id,
              razorpay_payment_id: result.razorpay_payment_id,
              razorpay_signature: result.razorpay_signature,
            });
            if (data.ok && data.status === 'Confirmed') {
              resolve(data.order);
            } else {
              reject(new Error(data.error || 'Payment could not be confirmed'));
            }
          } catch (e) {
            reject(new Error(e.response?.data?.error || 'Payment verification failed'));
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
      });
      rzp.on('payment.failed', (resp) => reject(new Error(resp.error?.description || 'Payment failed')));
      rzp.open();
    });
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const { data: createRes } = await axios.post('/api/orders', {
        items, customer: { name: form.name, phone: form.phone, email: form.email },
        address: { line1: form.line1, city: form.city, state: form.state, pincode: form.pincode, landmark: form.landmark },
        payment: form.payment,
        subtotal, shipping, total,
      });
      const internalOrder = createRes.order;

      if (form.payment === 'cod') {
        setOrder(internalOrder);
        clear();
        setPlacing(false);
        return;
      }

      // Razorpay flow
      const { data: rzpOrder } = await axios.post('/api/razorpay/order', { orderId: internalOrder.id });
      const confirmed = await openRazorpay(rzpOrder);
      setOrder(confirmed);
      clear();
    } catch (e) {
      const msg = e.response?.data?.error || e.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
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
                {!rzpConfigured && (
                  <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3">
                    Razorpay keys not configured on the server. Add <code className="font-mono">RAZORPAY_KEY_ID</code>, <code className="font-mono">RAZORPAY_KEY_SECRET</code> and <code className="font-mono">NEXT_PUBLIC_RAZORPAY_KEY_ID</code> to <code className="font-mono">.env</code>, then restart the server to enable online payment. COD is available meanwhile.
                  </div>
                )}
                <RadioGroup value={form.payment} onValueChange={(v) => setForm({ ...form, payment: v })} className="space-y-3">
                  <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer ${form.payment === 'razorpay' ? 'border-maroon bg-cream' : 'border-border'} ${!rzpConfigured ? 'opacity-50 pointer-events-none' : ''}`}>
                    <RadioGroupItem value="razorpay" id="razorpay" disabled={!rzpConfigured} />
                    <CreditCard className="w-5 h-5 text-maroon" />
                    <div className="flex-1">
                      <div className="font-medium">Razorpay (Card / UPI / Netbanking / Wallets)</div>
                      <div className="text-xs text-muted-foreground">Secure payment powered by Razorpay</div>
                    </div>
                    {rzpConfigured
                      ? <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700 uppercase tracking-wider">Live</span>
                      : <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">Not configured</span>}
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
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} disabled={placing}>Back</Button>
                  <Button onClick={placeOrder} disabled={placing} className="bg-maroon hover:bg-maroon-light text-cream flex-1">
                    {placing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{form.payment === 'razorpay' ? 'Opening payment…' : 'Placing order…'}</> : (form.payment === 'razorpay' ? `Pay ₹${total.toLocaleString('en-IN')} with Razorpay` : `Place Order – ₹${total.toLocaleString('en-IN')}`)}
                  </Button>
                </div>
                {form.payment === 'razorpay' && <p className="text-[11px] text-muted-foreground">You'll be redirected to Razorpay's secure checkout to complete the payment.</p>}
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
                <div className="flex justify-between font-sans text-lg font-bold text-maroon pt-2 border-t"><span>Total</span><span className="font-sans">₹{total.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
