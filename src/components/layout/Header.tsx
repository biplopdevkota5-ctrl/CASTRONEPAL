"use client";

import Link from 'next/link';
import { Search, ShoppingCart, User, Gamepad2, Menu, X, LayoutDashboard, LogOut, Package } from 'lucide-react';
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
    <header className="fixed top-0 z-[100] w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex items-center justify-center bg-primary rounded-xl overflow-hidden shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-headline text-2xl font-black tracking-tighter text-white uppercase italic">
            CASTRO<span className="text-primary">NEPAL</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { label: 'Home', href: '/' },
            { label: 'The Armory', href: '/products' },
            { label: 'PlayStation', href: '/products?category=PlayStation' },
            { label: 'Graphics Cards', href: '/products?category=GPU' },
          ].map(link => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-primary transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-primary hover:bg-primary/5 rounded-full">
            <Search className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-primary hover:bg-primary/5 rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel border-white/10 p-2 min-w-[220px] rounded-2xl">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <div className="text-[10px] uppercase font-black text-primary tracking-widest mb-1">Authenticated Player</div>
                    <div className="text-xs font-bold text-white truncate">{user.displayName || user.email}</div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl hover:bg-primary/10">
                      <LayoutDashboard className="w-4 h-4 mr-3 text-primary" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl hover:bg-primary/10">
                      <Package className="w-4 h-4 mr-3 text-primary" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl text-red-500 hover:bg-red-500/10">
                    <LogOut className="w-4 h-4 mr-3" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl hover:bg-primary/10">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl hover:bg-primary/10">Register</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer font-bold uppercase tracking-wider text-[10px] p-3 rounded-xl text-primary hover:bg-primary/10">
                      Admin Access
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="ml-4 h-11 px-6 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart (0)
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 top-20 bg-background z-[90] transition-transform duration-500 lg:hidden",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col p-8 gap-6">
          {['Home', 'Shop', 'PlayStation', 'Xbox'].map(label => (
            <Link 
              key={label} 
              href={label === 'Home' ? '/' : `/products?category=${label}`} 
              className="text-3xl font-headline font-black uppercase italic tracking-tighter" 
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <hr className="border-white/5 my-4" />
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button className="w-full h-14 bg-primary font-bold text-lg rounded-2xl">My Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="w-full h-14 text-red-500 font-bold text-lg rounded-2xl">Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button className="w-full h-14 bg-primary font-bold text-lg rounded-2xl">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full h-14 border-white/10 font-bold text-lg rounded-2xl">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}