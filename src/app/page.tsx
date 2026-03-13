"use client";

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2, ShieldCheck, Zap, Sparkles, ArrowRight, Play, Star, Cpu, Monitor, Smartphone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function Home() {
  const db = useFirestore();

  const announcementsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(1));
  }, [db]);
  
  const { data: announcements } = useCollection<any>(announcementsQuery);
  const latestAnnouncement = announcements?.[0];

  const trendingQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(10));
  }, [db]);
  
  const { data: products, loading } = useCollection<any>(trendingQuery);

  return (
    <div className="flex flex-col gap-20 pb-20">
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <Image 
            src="https://picsum.photos/seed/castro-hero/1920/1080"
            alt="Gaming Hero"
            fill
            className="object-cover opacity-20"
            priority
            data-ai-hint="gaming setup"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-widest uppercase text-primary">New Gear & Codes Available</span>
            </div>
            
            <h1 className="font-headline text-5xl md:text-8xl font-black leading-[1.1] tracking-tighter uppercase italic">
              LEVEL UP YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-glow">GAMING EXPERIENCE</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Nepal’s Trusted Store. Get instant delivery on PlayStation, Xbox, Steam, and Nintendo codes, plus premium GPUs, PCs, and Mobile devices.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-full neon-border group">
                  SHOP THE ARMORY
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="w-6 h-6 text-primary" />, title: "Instant Delivery", desc: "Digital codes delivered instantly via Email." },
            { icon: <ShieldCheck className="w-6 h-6 text-secondary" />, title: "Genuine Products", desc: "100% official codes and certified hardware." },
            { icon: <Star className="w-6 h-6 text-yellow-500" />, title: "Best Prices", desc: "Competitive pricing for Nepal's gaming community." },
          ].map((item, idx) => (
            <Card key={idx} className="glass-panel hover:border-primary/50 transition-colors group">
              <CardContent className="p-8 flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {latestAnnouncement && (
        <section className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-12 border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest font-bold">LATEST UPDATE • {latestAnnouncement.date}</Badge>
                <h2 className="text-3xl md:text-4xl font-headline font-bold uppercase italic">
                  {latestAnnouncement.title}
                </h2>
                <p className="text-muted-foreground max-w-lg">
                  {latestAnnouncement.content}
                </p>
              </div>
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-10 rounded-full">
                  CHECK IT OUT
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold uppercase italic tracking-tighter">
              New <span className="text-primary">In Stock</span>
            </h2>
            <p className="text-muted-foreground">The latest additions to our gaming armory.</p>
          </div>
          <Link href="/products" className="text-primary hover:underline font-bold text-sm flex items-center gap-1">
            VIEW ALL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl glass-panel animate-pulse bg-white/5"></div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <p className="text-muted-foreground mb-6">No products found in the database.</p>
            <Link href="/admin">
              <Button variant="outline" className="rounded-full">GO TO ADMIN PANEL TO ADD DATA</Button>
            </Link>
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-20 bg-card/30 rounded-[3rem] border border-white/5">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-headline font-bold uppercase italic">Browse by Category</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">From digital codes to high-end hardware.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
          {[
            { name: "PlayStation", icon: <Gamepad2 className="w-8 h-8" />, color: "hover:border-blue-600" },
            { name: "Xbox", icon: <Gamepad2 className="w-8 h-8" />, color: "hover:border-green-600" },
            { name: "Steam", icon: <Gamepad2 className="w-8 h-8" />, color: "hover:border-slate-500" },
            { name: "Nintendo", icon: <Gamepad2 className="w-8 h-8" />, color: "hover:border-red-600" },
            { name: "GPU", icon: <Cpu className="w-8 h-8" />, color: "hover:border-purple-600" },
            { name: "PC", icon: <Monitor className="w-8 h-8" />, color: "hover:border-cyan-600" },
            { name: "Mobile", icon: <Smartphone className="w-8 h-8" />, color: "hover:border-orange-600" },
          ].map((cat) => (
            <Link key={cat.name} href={`/products?category=${cat.name}`}>
              <div className={cn(
                "glass-panel p-6 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:-translate-y-2 border-transparent group",
                cat.color
              )}>
                <div className="text-white/40 group-hover:text-primary transition-colors">
                  {cat.icon}
                </div>
                <span className="font-headline font-bold uppercase text-xs tracking-wider">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
