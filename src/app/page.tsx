"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Cpu, Monitor, Gamepad2, PcCase, Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ui/ProductCard';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';

export default function Home() {
  const db = useFirestore();

  const announcementsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'announcements'), 
      where('isActive', '==', true),
      orderBy('postedAt', 'desc'), 
      limit(1)
    );
  }, [db]);
  
  const { data: announcements } = useCollection<any>(announcementsQuery);
  const latestAnnouncement = announcements?.[0];

  const featuredQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), where('isFeatured', '==', true), limit(8));
  }, [db]);
  
  const { data: featuredProducts } = useCollection<any>(featuredQuery);

  const trendingQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(10));
  }, [db]);
  
  const { data: products, isLoading: loading } = useCollection<any>(trendingQuery);

  return (
    <div className="flex flex-col gap-16 pb-20 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center pt-20 overflow-hidden bg-gray-50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 animate-in fade-in zoom-in duration-1000">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Premium Hardware & Digital Assets</span>
              </div>
              
              <h1 className="font-headline text-5xl md:text-8xl font-black leading-[1] tracking-tighter uppercase italic text-[#0a0c10]">
                CASTRO HUB
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
                The ultimate destination in Nepal for high-end GPUs, Monitors, and professional gaming systems.
              </p>
            </div>

            <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-10 duration-1000">
              <div className="relative aspect-square w-full max-w-md mx-auto animate-float">
                <div className="absolute inset-0 bg-[#0a0c10] rounded-[3rem] rotate-3 shadow-xl"></div>
                <div className="absolute inset-0 bg-white border border-border rounded-[3rem] shadow-2xl overflow-hidden group">
                  <Image 
                    src="https://firm-emerald-fvkkb8nt2n.edgeone.app/Screenshot%20(6).png" 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="Castro Nepal Armory"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-4xl font-headline font-bold uppercase italic text-[#0a0c10]">CORE CATEGORIES</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {[
            { name: "Graphic Cards", icon: <Cpu className="w-8 h-8" />, href: "/products?category=GPU" },
            { name: "Monitors", icon: <Monitor className="w-8 h-8" />, href: "/products?category=Monitor" },
            { name: "Consoles", icon: <Gamepad2 className="w-8 h-8" />, href: "/products?category=Console" },
            { name: "Computer", icon: <PcCase className="w-8 h-8" />, href: "/products?category=Computer" },
            { name: "Game", icon: <Gamepad className="w-8 h-8" />, href: "/products?category=Game" },
          ].map((cat, idx) => (
            <Link key={cat.name} href={cat.href} className={`animate-in fade-in slide-in-from-bottom-8 duration-700`} style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="category-card-dark group h-48">
                <div className="text-white mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  {cat.icon}
                </div>
                <span className="font-headline font-bold uppercase text-xs tracking-[0.2em] text-white italic text-center px-2 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Update Banner */}
      {latestAnnouncement && (
        <section className="container mx-auto px-4">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0a0c10] text-white p-10 md:p-16 animate-in zoom-in-95 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <Badge className="bg-primary text-white uppercase tracking-widest font-black rounded-sm px-3 border-none animate-bounce">LIVE FEED</Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-black uppercase italic leading-none">
                  {latestAnnouncement.title}
                </h2>
                <p className="text-gray-400 text-lg">
                  {latestAnnouncement.content}
                </p>
                <Link href="/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-12 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(26,128,230,0.5)]">
                    VIEW DETAILS
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                <img src="https://picsum.photos/seed/setup/800/450" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-ai-hint="gaming setup" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Showcase */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-primary tracking-[0.3em] uppercase">Inventory Status</h2>
            <h3 className="text-4xl font-headline font-bold uppercase italic tracking-tighter text-[#0a0c10]">
              New <span className="text-primary">Gear</span>
            </h3>
          </div>
          <Link href="/products" className="group text-muted-foreground hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            Browse All Hardware <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[450px] rounded-3xl bg-gray-50 animate-pulse"></div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 border border-dashed border-border rounded-[3rem]">
            <p className="text-muted-foreground mb-8 font-medium">Armory currently empty. Restock in progress.</p>
          </div>
        )}
      </section>
    </div>
  );
}
