"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Zap, ArrowRight, Star, Gamepad2, Disc } from 'lucide-react';
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
    <div className="flex flex-col gap-16 pb-20 bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-20 overflow-hidden bg-gray-50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Instant Gaming Delivery</span>
              </div>
              
              <h1 className="font-headline text-5xl md:text-7xl font-black leading-[1] tracking-tighter uppercase italic text-[#0a0c10]">
                LEVEL UP YOUR <br />
                <span className="text-primary">GAMING LIBRARY</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
                Get the latest PlayStation, Xbox, and Nintendo redeem codes delivered instantly to your inbox.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <Link href="/products">
                  <Button size="lg" className="h-14 px-10 bg-[#0a0c10] hover:bg-[#1a1d24] text-white font-bold rounded-xl shadow-lg group">
                    EXPLORE SHOP
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-[#0a0c10] rounded-[3rem] rotate-3"></div>
                <div className="absolute inset-0 bg-white border border-border rounded-[3rem] shadow-2xl overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/gaming-console/800/800" 
                    className="w-full h-full object-cover" 
                    alt="Console"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - 20% Dark Colour Accent */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-headline font-bold uppercase italic text-[#0a0c10]">SELECT YOUR PLATFORM</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "PlayStation", icon: <Gamepad2 className="w-10 h-10" />, href: "/products?category=PlayStation" },
            { name: "Xbox", icon: <Disc className="w-10 h-10" />, href: "/products?category=Xbox" },
            { name: "Nintendo", icon: <Gamepad2 className="w-10 h-10" />, href: "/products?category=Nintendo" },
          ].map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <div className="category-card-dark group">
                <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <span className="font-headline font-bold uppercase text-xl tracking-[0.2em] text-white italic">
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
          <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0a0c10] text-white p-10 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <Badge className="bg-primary text-white uppercase tracking-widest font-black rounded-sm px-3 border-none">FLASH UPDATE</Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-black uppercase italic leading-none">
                  {latestAnnouncement.title}
                </h2>
                <p className="text-gray-400 text-lg">
                  {latestAnnouncement.content}
                </p>
                <Link href="/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-12 rounded-xl">
                    CLAIM NOW
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block relative aspect-video rounded-3xl overflow-hidden border border-white/10">
                <img src="https://picsum.photos/seed/deal/800/450" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Showcase */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-primary tracking-[0.3em] uppercase">Latest Arrivals</h2>
            <h3 className="text-4xl font-headline font-bold uppercase italic tracking-tighter text-[#0a0c10]">
              New <span className="text-primary">Stock</span>
            </h3>
          </div>
          <Link href="/products" className="group text-muted-foreground hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            View All Items <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 border border-dashed border-border rounded-[3rem]">
            <p className="text-muted-foreground mb-8 font-medium">No items available currently.</p>
          </div>
        )}
      </section>

      {/* Trust Stats */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: <Zap className="w-5 h-5" />, label: "Delivery", value: "Instant Email" },
            { icon: <ShieldCheck className="w-5 h-5" />, label: "Security", value: "100% Genuine" },
            { icon: <Gamepad2 className="w-5 h-5" />, label: "Support", value: "24/7 Access" },
            { icon: <Star className="w-5 h-5" />, label: "Pricing", value: "Best in Nepal" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl flex items-center gap-4 border border-border shadow-sm">
              <div className="p-3 bg-primary/5 rounded-xl text-primary">{item.icon}</div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</div>
                <div className="font-bold text-[#0a0c10] uppercase text-sm">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}