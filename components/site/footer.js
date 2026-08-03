import Link from 'next/link';
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-maroon-dark text-cream mt-20">
      <div className="container mx-auto px-4 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="font-serif text-2xl font-bold">Samatha Reddy</div>
          <div className="text-xs tracking-[0.3em] text-gold uppercase mt-1">Boutique • Saree Collection</div>
          <p className="mt-4 text-sm text-cream/70 leading-relaxed">A Hyderabad-based boutique curating the finest sarees, bridal wear and handcrafted ensembles from India’s master weavers.</p>
          <div className="flex gap-3 mt-6">
            <a href="#" className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-maroon-dark transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-maroon-dark transition-colors"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-gold font-semibold mb-4 text-sm tracking-wider uppercase">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/products?category=kanjivaram">Kanjivaram</Link></li>
            <li><Link href="/products?category=banarasi">Banarasi</Link></li>
            <li><Link href="/products?category=pochampally">Pochampally</Link></li>
            <li><Link href="/products?category=bridal">Bridal Couture</Link></li>
            <li><Link href="/products?category=lehenga">Lehengas</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold font-semibold mb-4 text-sm tracking-wider uppercase">Support</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>Shipping & Returns</li>
            <li>Size Guide</li>
            <li>Care Instructions</li>
            <li>Track Order</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold font-semibold mb-4 text-sm tracking-wider uppercase">Visit Boutique</h4>
          <ul className="space-y-3 text-sm text-cream/80">
            <li className="flex gap-2"><MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />Jubilee Hills, Hyderabad, Telangana</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />+91 98765 43210</li>
            <li className="flex gap-2"><Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />hello@samatharedddy.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 py-5 text-xs text-cream/50 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Samatha Reddy Boutique. All rights reserved.</span>
          <span>Crafted with love in Hyderabad • Handloom of India</span>
        </div>
      </div>
    </footer>
  );
}
