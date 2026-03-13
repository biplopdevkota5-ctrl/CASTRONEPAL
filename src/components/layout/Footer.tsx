import Link from 'next/link';
import { Facebook, Send, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-[#0a0c10] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <h4 className="font-headline text-2xl font-bold tracking-tighter uppercase italic text-white">
              CASTRO<span className="text-primary">HUB</span>
            </h4>
            <p className="text-gray-400 leading-relaxed">
              Nepal’s Trusted Store for High-End Gaming Hardware and Professional Computers. BUY CHEAP SAVE HIGH.
            </p>
            <div className="flex gap-4">
              <Link href="https://www.facebook.com/profile.php?id=61585287878669" target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="https://www.tiktok.com/@castro.nepal" target="_blank" className="p-2 bg-white/5 rounded-full hover:bg-primary/20 hover:text-primary transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.89 2.89 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-headline text-lg font-bold mb-6 uppercase tracking-wider text-white">The Armory</h4>
            <ul className="space-y-4">
              <li><Link href="/products?category=GPU" className="text-gray-400 hover:text-primary transition-colors uppercase text-xs font-bold">Graphic Cards</Link></li>
              <li><Link href="/products?category=Monitor" className="text-gray-400 hover:text-primary transition-colors uppercase text-xs font-bold">Monitors</Link></li>
              <li><Link href="/products?category=Console" className="text-gray-400 hover:text-primary transition-colors uppercase text-xs font-bold">Consoles</Link></li>
              <li><Link href="/products?category=Computer" className="text-gray-400 hover:text-primary transition-colors uppercase text-xs font-bold">Computers</Link></li>
              <li><Link href="/products?category=Game" className="text-gray-400 hover:text-primary transition-colors uppercase text-xs font-bold">Games</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-primary transition-colors uppercase text-xs font-bold">My Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-headline text-lg font-bold mb-6 uppercase tracking-wider text-white">Support</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-primary" />
                <span>+977 9702663187</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-primary" />
                <span>support@castrohub.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Sitapaila, Kathmandu, Nepal</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-headline text-lg font-bold mb-6 uppercase tracking-wider text-white">Alerts</h4>
            <p className="text-sm text-gray-400 mb-4">Get notified when new hardware arrives.</p>
            <div className="flex gap-2">
              <Input placeholder="Enter Email" className="bg-white/5 border-white/10 text-white" />
              <Button size="icon" className="bg-primary hover:bg-primary/90 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 CASTRO HUB. Gaming Hardware Authority.</p>
          <div className="flex gap-6 font-bold uppercase text-[10px]">
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
