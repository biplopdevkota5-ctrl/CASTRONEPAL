
"use client";

import Link from 'next/link';
import { Search, ShoppingCart, User, Gamepad2, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Gamepad2 className="w-8 h-8 text-primary neon-glow" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tighter text-white uppercase italic">
            Castro<span className="text-primary group-hover:text-secondary transition-colors">Nepal</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Home</Link>
          <Link href="/products" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Shop</Link>
          <Link href="/products?category=PlayStation" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">PlayStation</Link>
          <Link href="/products?category=Xbox" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Xbox</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:text-primary">
            <Search className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel border-white/10 p-2 min-w-[200px] rounded-2xl">
              {user ? (
                <>
                  <div className="px-3 py-2 text-[10px] uppercase font-black text-primary/50 tracking-widest border-b border-white/5 mb-1">
                    PLAYER: {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer font-bold uppercase tracking-wider text-xs p-3">
                      <User className="w-4 h-4 mr-2" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer font-bold uppercase tracking-wider text-xs p-3">
                      <ShoppingCart className="w-4 h-4 mr-2" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-bold uppercase tracking-wider text-xs p-3 text-red-500 hover:text-red-400">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer font-bold uppercase tracking-wider text-xs p-3">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="cursor-pointer font-bold uppercase tracking-wider text-xs p-3">Create Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer font-bold uppercase tracking-wider text-xs p-3 text-primary">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Admin Access
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-6 rounded-full shadow-[0_0_20px_rgba(26,128,230,0.3)]">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 top-20 bg-background z-40 transition-transform duration-500 md:hidden",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col p-8 gap-8">
          <Link href="/" className="text-2xl font-headline font-black uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/products" className="text-2xl font-headline font-black uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link href="/products?category=PlayStation" className="text-2xl font-headline font-black uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>PlayStation</Link>
          <Link href="/products?category=Xbox" className="text-2xl font-headline font-black uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Xbox</Link>
          <hr className="border-white/10" />
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button className="w-full h-14 bg-primary font-bold text-lg rounded-xl">My Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="w-full h-14 text-red-500 font-bold text-lg rounded-xl">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button className="w-full h-14 bg-primary font-bold text-lg rounded-xl">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full h-14 border-white/10 font-bold text-lg rounded-xl">Sign Up</Button>
                </Link>
              </>
            )}
            <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="w-full">
              <Button variant="ghost" className="w-full h-14 text-primary font-bold text-lg rounded-xl">Admin Panel</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
