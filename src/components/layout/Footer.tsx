
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Gamepad2, Send, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="w-8 h-8 text-primary" />
              <span className="font-headline text-2xl font-bold tracking-tighter uppercase italic">
                Castro<span className="text-primary">Nepal</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Nepal’s Trusted Gaming Redeem Code Store. Providing premium digital gaming assets instantly to gamers across the nation.
            </p>
            <div className="flex gap-4">
              <Link href="https://www.facebook.com/profile.php?id=61585287878669" target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://www.tiktok.com/@castro.nepal" target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-headline text-lg font-bold mb-6 text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Store Home</Link></li>
              <li><Link href="/products?category=PlayStation" className="text-muted-foreground hover:text-primary transition-colors">PlayStation Codes</Link></li>
              <li><Link href="/products?category=Xbox" className="text-muted-foreground hover:text-primary transition-colors">Xbox Gift Cards</Link></li>
              <li><Link href="/products?category=Steam" className="text-muted-foreground hover:text-primary transition-colors">Steam Cards</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-headline text-lg font-bold mb-6 text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span>+977 9702663187</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@castronepal.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-headline text-lg font-bold mb-6 text-white uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">Get the latest deals and new redeem code alerts.</p>
            <div className="flex gap-2">
              <Input placeholder="Enter Email" className="bg-white/5 border-white/10" />
              <Button size="icon" className="bg-primary hover:bg-primary/90 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 Castro Nepal. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
