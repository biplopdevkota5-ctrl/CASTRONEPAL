"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Cpu, Monitor, Gamepad2, PcCase, Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ui/ProductCard';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function Home() {
  const db = useFirestore();

  const trendingQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(8));
  }, [db]);
  
  const { data: products, isLoading: loading } = useCollection<any>(trendingQuery);

  return (
    <div className="flex flex-col gap-10 pb-20 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center pt-16 overflow-hidden bg-gray-50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Authorized Retailer</span>
              </div>
              
              <h1 className="font-headline text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic text-[#0a0c10]">
                LEVEL <span className="text-primary">UP</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
                The ultimate destination in Nepal for high-end GPUs, Monitors, and professional gaming systems.
              </p>
            </div>

            <div className="hidden lg:block relative animate-fade-up animate-stagger-2">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-[#0a0c10] rounded-[2rem] rotate-1 shadow-lg transition-transform duration-700 hover:rotate-0"></div>
                <div className="absolute inset-0 bg-white border border-border rounded-[2rem] shadow-xl overflow-hidden transition-transform duration-700 hover:-translate-y-2">
                  <Image 
                    src="https://firm-emerald-fvkkb8nt2n.edgeone.app/Screenshot%20(6).png" 
                    fill
                    className="object-cover" 
                    alt="Hardware Armory"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                    fetchPriority="high"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-6 animate-fade-up animate-stagger-1">
          <h3 className="text-xl font-headline font-bold uppercase italic text-[#0a0c10]">THE ARMORY</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-7xl mx-auto">
          {[
            { name: "Graphic Cards", icon: <Cpu className="w-7 h-7" />, href: "/products?category=GPU" },
            { name: "Monitors", icon: <Monitor className="w-7 h-7" />, href: "/products?category=Monitor" },
            { name: "Consoles", icon: <Gamepad2 className="w-7 h-7" />, href: "/products?category=Console" },
            { name: "Computer", icon: <PcCase className="w-7 h-7" />, href: "/products?category=Computer" },
            { name: "Game", icon: <Gamepad className="w-7 h-7" />, href: "/products?category=Game" },
          ].map((cat, idx) => (
            <Link 
              key={cat.name} 
              href={cat.href} 
              className={`group animate-fade-up animate-stagger-${Math.min(idx + 1, 4)}`}
            >
              <div className="category-card-dark h-32 p-4">
                <div className="text-white mb-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {cat.icon}
                </div>
                <span className="font-headline font-bold uppercase text-[8px] tracking-widest text-white italic text-center leading-tight">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4 animate-fade-up">
          <div className="space-y-1">
            <h2 className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase">Inventory Status</h2>
            <h3 className="text-2xl font-headline font-bold uppercase italic tracking-tighter text-[#0a0c10]">
              New <span className="text-primary">Gear</span>
            </h3>
          </div>
          <Link href="/products" className="group text-muted-foreground hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
            Browse All Hardware <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-xl bg-gray-50 animate-pulse"></div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, idx) => (
              <div 
                key={product.id} 
                className={`animate-fade-up animate-stagger-${Math.min((idx % 4) + 1, 4)}`}
              >
                <ProductCard 
                  product={product} 
                  priority={idx < 4} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 border border-dashed border-border rounded-[2rem] animate-fade-up">
            <p className="text-muted-foreground font-medium">Armory currently empty. Restock in progress.</p>
          </div>
        )}
      </section>
    </div>
  );
}
