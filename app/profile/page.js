'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import axios from 'axios';
import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ShoppingBag, LogOut, User as UserIcon, Calendar, ClipboardList, CheckCircle2, Truck, Box } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Redirect if guest
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch orders
  useEffect(() => {
    if (user) {
      axios
        .get('/api/orders/history')
        .then(({ data }) => {
          setOrders(data.orders || []);
        })
        .catch((err) => {
          console.error('Error fetching order history:', err);
        })
        .finally(() => {
          setOrdersLoading(false);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'failed':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'cancelled':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getTimelineStep = (status) => {
    const steps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    const lowerStatus = status?.toLowerCase();
    
    if (lowerStatus === 'failed' || lowerStatus === 'cancelled') return -1;
    if (lowerStatus === 'delivered') return 3;
    if (lowerStatus === 'shipped') return 2;
    if (lowerStatus === 'confirmed') return 1;
    return 0; // Pending
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-maroon" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-gold/30 shadow-md bg-white">
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-cream border border-gold/40 rounded-full flex items-center justify-center mx-auto text-maroon font-serif text-3xl font-bold mb-4 shadow-inner">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h2 className="font-serif text-xl text-maroon font-bold leading-tight">{user.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                <Badge className="mt-3 bg-cream hover:bg-cream border-gold/40 text-gold-dark capitalize text-xs">
                  {user.role} Account
                </Badge>
                
                <div className="mt-4 text-xs text-left space-y-2 text-muted-foreground border-t border-gold/15 pt-4">
                  <div>
                    <span className="font-semibold text-foreground uppercase tracking-wider block text-[10px]">Phone</span>
                    <span>{user.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground uppercase tracking-wider block text-[10px]">Delivery Address</span>
                    <span className="block whitespace-pre-wrap">{user.address || 'No address saved'}</span>
                  </div>
                </div>

                <Separator className="my-6 bg-gold/15" />

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full rounded-full border-maroon/20 hover:border-maroon hover:text-maroon text-muted-foreground gap-2 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order History Panel */}
          <div className="md:col-span-3 space-y-6">
            <Card className="border-gold/30 shadow-md">
              <CardHeader className="border-b border-gold/10 pb-4">
                <CardTitle className="font-serif text-2xl text-maroon-dark flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-gold-dark" />
                  Your Order History
                </CardTitle>
                <CardDescription>Track shipping, view receipt detail, or get updates on previous purchases</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {ordersLoading ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-maroon" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <ShoppingBag className="w-16 h-16 text-gold/30 mx-auto" />
                    <h3 className="font-serif text-xl text-muted-foreground">You haven&apos;t placed any orders yet.</h3>
                    <Button onClick={() => router.push('/products')} className="bg-maroon hover:bg-maroon-light text-cream rounded-full px-6">
                      Explore Saree Collection
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map((order) => {
                      const currentStep = getTimelineStep(order.status);
                      return (
                        <div key={order.id} className="border border-border rounded-xl p-5 md:p-6 bg-cream/10 space-y-6">
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order Reference</span>
                              <h4 className="font-mono text-sm font-bold text-foreground">{order.id}</h4>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-2">
                              <Badge className={`${getStatusColor(order.status)} border px-2.5 py-1 text-xs font-semibold`}>
                                {order.status}
                              </Badge>
                              <div className="font-sans text-lg font-bold text-maroon mt-1">
                                ₹{order.total.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>

                          {/* Shipment Progress Indicator */}
                          {currentStep >= 0 && (
                            <div className="space-y-4 px-2">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Shipment Status</span>
                              <div className="relative flex justify-between items-center w-full max-w-lg mx-auto">
                                {/* Connecting Progress Line */}
                                <div className="absolute top-4 left-0 right-0 h-1 bg-border -z-10" />
                                <div
                                  className="absolute top-4 left-0 h-1 bg-maroon -z-10 transition-all duration-500"
                                  style={{ width: `${(currentStep / 3) * 100}%` }}
                                />

                                {/* Step Points */}
                                {[
                                  { label: 'Pending', icon: Box },
                                  { label: 'Confirmed', icon: CheckCircle2 },
                                  { label: 'Shipped', icon: Truck },
                                  { label: 'Delivered', icon: CheckCircle2 }
                                ].map((step, idx) => {
                                  const IconComponent = step.icon;
                                  const isPassed = currentStep >= idx;
                                  const isActive = currentStep === idx;
                                  return (
                                    <div key={step.label} className="flex flex-col items-center">
                                      <div
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                          isPassed
                                            ? 'bg-maroon border-maroon text-cream'
                                            : 'bg-white border-border text-muted-foreground'
                                        } ${isActive ? 'ring-4 ring-maroon/20 scale-110' : ''}`}
                                      >
                                        <IconComponent className="w-4 h-4" />
                                      </div>
                                      <span className={`text-[10px] md:text-xs mt-1.5 font-medium ${isPassed ? 'text-maroon font-semibold' : 'text-muted-foreground'}`}>
                                        {step.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Product Items Breakdown */}
                          <div className="space-y-3">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Items Purchased</span>
                            <div className="divide-y divide-border border border-border rounded-lg bg-white overflow-hidden">
                              {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 text-sm">
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-12 h-16 object-cover rounded-md border border-border shadow-sm shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-serif font-bold text-foreground truncate">{item.name}</h5>
                                    <div className="text-xs text-muted-foreground flex gap-3 mt-1 flex-wrap">
                                      <span>Fabric: {item.fabric}</span>
                                      <span>Color: {item.color}</span>
                                      <span>Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-semibold text-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    {item.quantity > 1 && (
                                      <div className="text-[10px] text-muted-foreground">₹{item.price} each</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Address & Payments */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-muted/40 p-4 rounded-lg border border-border/50">
                            <div>
                              <span className="font-semibold text-muted-foreground block mb-1">Delivery Address:</span>
                              <p className="text-foreground">
                                <span className="font-medium">{order.customer?.name}</span> ({order.customer?.phone})<br />
                                {order.shippingAddress?.line1}
                                {order.shippingAddress?.landmark && `, ${order.shippingAddress.landmark}`}<br />
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-muted-foreground block mb-1">Payment summary:</span>
                              <p className="text-foreground">
                                Method: <span className="capitalize">{order.payment === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay Secure'}</span><br />
                                Subtotal: ₹{order.subtotal?.toLocaleString('en-IN')}<br />
                                Shipping: {order.shipping > 0 ? `₹${order.shipping}` : 'Free'}<br />
                                {order.savings > 0 && <span className="text-green-600">Savings: -₹{order.savings.toLocaleString('en-IN')}</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
