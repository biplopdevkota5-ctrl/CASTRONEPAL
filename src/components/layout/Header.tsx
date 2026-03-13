"use client";

import Link from 'next/link';
import { Search, ShoppingCart, User, Gamepad2, Menu, X, LayoutDashboard, LogOut, Package, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    // Increment clicks
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);

    // Clear existing timer and start a new 30s window on the first click
    if (newCount === 1) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        setLogoClicks(0);
      }, 30000);
    }

    // Check if 10 clicks reached
    if (newCount >= 10) {
      e.preventDefault();
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      setLogoClicks(0);
      router.push('/admin');
    }
  };

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    // Start a 5 second timer
    holdTimerRef.current = setTimeout(() => {
      router.push('/admin');
    }, 5000);
  };

  const endHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  return (
    <header className="fixed top-0 z-[100] w-full border-b border-border bg-white">
      {/* Top Bar for Retail Look */}
      <div className="bg-[#0a0c10] text-white py-2 text-[10px] font-bold uppercase tracking-widest">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-primary" /> +977 9702663187</span>
            <span className="hidden sm:flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary" /> Pokhara, Nepal</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="opacity-50 hidden md:inline">Authorized Retailer</span>
            <Link href="/admin" className="flex items-center gap-1.5 hover:text-primary transition-colors border-l border-white/20 pl-4">
              <ShieldCheck className="w-3 h-3" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
          onClick={handleLogoClick}
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
        >
          <div className="relative w-10 h-10 flex items-center justify-center bg-[#0a0c10] rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-headline text-2xl font-black tracking-tighter text-[#0a0c10] uppercase italic select-none">
            CASTRO<span className="text-primary">NEPAL</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {[
            { label: 'Home', href: '/' },
            { label: 'GPU', href: '/products?category=GPU' },
            { label: 'Monitor', href: '/products?category=Monitor' },
            { label: 'Console', href: '/products?category=Console' },
            { label: 'Computer', href: '/products?category=Computer' },
            { label: 'Game', href: '/products?category=Game' },
          ].map(link => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="text-[10px] font-black uppercase tracking-[0.15em] text-[#0a0c10] hover:text-primary transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full">
            <Search className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-border p-2 min-w-[220px] rounded-2xl shadow-xl z-[110]">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-border mb-2">
                    <div className="text-[10px] uppercase font-black text-primary tracking-widest mb-1">Authenticated Player</div>
                    <div className="text-xs font-bold text-foreground truncate">{user.displayName || user.email}</div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl hover:bg-primary/5">
                      <LayoutDashboard className="w-4 h-4 mr-3 text-primary" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl hover:bg-primary/5">
                      <Package className="w-4 h-4 mr-3 text-primary" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl text-red-500 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-3" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl hover:bg-primary/5">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl hover:bg-primary/5">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="hidden sm:flex ml-2 h-11 px-6 bg-[#0a0c10] hover:bg-[#1a1d24] text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart (0)
          </Button>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-[#0a0c10] ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Solid Opaque White */}
      <div className={cn(
        "fixed inset-0 top-[112px] bg-white z-[90] transition-transform duration-500 lg:hidden",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col p-8 gap-6 h-full">
          {['Home', 'GPU', 'Monitor', 'Console', 'Computer', 'Game'].map(label => (
            <Link 
              key={label} 
              href={label === 'Home' ? '/' : `/products?category=${label}`} 
              className="text-2xl font-headline font-black uppercase italic tracking-tighter text-[#0a0c10]" 
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <hr className="border-border my-4" />
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button className="w-full h-14 bg-[#0a0c10] text-white font-bold text-lg rounded-2xl">My Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="w-full h-14 text-red-500 font-bold text-lg rounded-2xl">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button className="w-full h-14 bg-[#0a0c10] text-white font-bold text-lg rounded-2xl">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full h-14 border-border font-bold text-lg rounded-2xl text-[#0a0c10]">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
