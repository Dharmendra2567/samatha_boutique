'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/site/header';
import Footer from '@/components/site/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Phone, MapPin } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, signup, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('+91 ');
  const [signupAddress, setSignupAddress] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setLoading(true);
    try {
      const loggedUser = await login(loginEmail, loginPassword);
      if (loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    } catch {
      // toast is handled in auth-context
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupPhone) return;
    setLoading(true);
    try {
      const loggedUser = await signup(signupName, signupEmail, signupPassword, signupPhone, signupAddress);
      if (loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    } catch {
      // toast is handled in auth-context
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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
      <main className="flex-1 py-16 flex items-center justify-center px-4 bg-gradient-to-br from-cream/30 to-background">
        <Card className="w-full max-w-md border-gold/30 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-cream/40 rounded-none border-b border-border h-14 p-0">
              <TabsTrigger
                value="login"
                className="rounded-none data-[state=active]:bg-white data-[state=active]:text-maroon data-[state=active]:font-semibold text-sm border-r border-border h-full transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-none data-[state=active]:bg-white data-[state=active]:text-maroon data-[state=active]:font-semibold text-sm h-full transition-all"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Panel */}
            <TabsContent value="login" className="m-0">
              <CardHeader className="pt-8 pb-4 text-center">
                <CardTitle className="font-serif text-3xl text-maroon-dark">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 focus-visible:ring-maroon"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="login-password">Password</Label>
                      <Link href="#" className="text-xs text-maroon hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4.5 h-4.5 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 focus-visible:ring-maroon"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-4 pb-8">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-maroon hover:bg-maroon-light text-cream font-medium rounded-full py-6 transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Signing In...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                </CardFooter>
              </form>
            </TabsContent>

            {/* Signup Panel */}
            <TabsContent value="signup" className="m-0">
              <CardHeader className="pt-8 pb-4 text-center">
                <CardTitle className="font-serif text-3xl text-maroon-dark">Create Account</CardTitle>
                <CardDescription>Join us to track orders and save your favorites</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4.5 h-4.5 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Samatha Reddy"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-10 focus-visible:ring-maroon"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4.5 h-4.5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10 focus-visible:ring-maroon"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4.5 h-4.5 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 pr-10 focus-visible:ring-maroon"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4.5 h-4.5 text-muted-foreground" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+91 9988776655"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="pl-10 focus-visible:ring-maroon"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-address">Delivery Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-muted-foreground" />
                      <Input
                        id="signup-address"
                        type="text"
                        placeholder="House / Flat No, Street, City, State, Pincode"
                        value={signupAddress}
                        onChange={(e) => setSignupAddress(e.target.value)}
                        className="pl-10 focus-visible:ring-maroon"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-4 pb-8">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-maroon hover:bg-maroon-light text-cream font-medium rounded-full py-6 transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
                      </span>
                    ) : (
                      'Register Now'
                    )}
                  </Button>

                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
