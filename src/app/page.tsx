"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Zap, Sparkles, ArrowRight, Star, Cpu, Monitor, Gamepad2, Smartphone, Headphones, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';
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
      {/* Hero Section - Clean Pro Light */}
      <section className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
          <Image 
            src="https://picsum.photos/seed/pc-mod-hero/1920/1080"
            alt="Premium Gaming Setup"
            fill
            className="object-cover opacity-10 grayscale"
            priority
            data-ai-hint="gaming setup"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">Nepal's Premier Hardware Hub</span>
              </div>
              
              <h1 className="font-headline text-5xl md:text-7xl font-black leading-[1] tracking-tighter uppercase italic text-foreground">
                DOMINATE THE <br />
                <span className="text-primary">DIGITAL REALM</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
                From high-performance GPUs to custom cooling. We equip champions across Nepal with world-class hardware.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <Link href="/products">
                  <Button size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg group">
                    EXPLORE INVENTORY
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" size="lg" className="h-14 px-8 border-border hover:bg-gray-50 rounded-xl font-bold">
                    BUILD YOUR RIG
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-8">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold text-foreground">5,000+ Gamers</div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Equipped & Ready</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-[3rem] rotate-6"></div>
                <div className="absolute inset-0 bg-white border border-border rounded-[3rem] shadow-2xl overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/hardware-showcase/800/800" 
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-700" 
                    alt="Hardware"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: <Zap className="w-5 h-5" />, label: "Express", value: "Instant Delivery" },
            { icon: <ShieldCheck className="w-5 h-5" />, label: "Verified", value: "Genuine Gear" },
            { icon: <Gamepad2 className="w-5 h-5" />, label: "Support", value: "Expert Advice" },
            { icon: <Star className="w-5 h-5" />, label: "Pricing", value: "Competitive" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl flex items-center gap-4 group border border-border shadow-sm hover:shadow-md transition-all">
              <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</div>
                <div className="font-bold text-foreground uppercase text-sm">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid - Clean Pro */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-sm font-bold text-primary tracking-[0.3em] uppercase">The Armory</h2>
          <h3 className="text-4xl font-headline font-bold uppercase italic text-foreground">Specialized Categories</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "GPU", icon: <Cpu className="w-6 h-6" />, color: "bg-purple-50 text-purple-600" },
            { name: "Monitors", icon: <Monitor className="w-6 h-6" />, color: "bg-blue-50 text-blue-600" },
            { name: "Console", icon: <Gamepad2 className="w-6 h-6" />, color: "bg-red-50 text-red-600" },
            { name: "Mobile", icon: <Smartphone className="w-6 h-6" />, color: "bg-orange-50 text-orange-600" },
            { name: "Audio", icon: <Headphones className="w-6 h-6" />, color: "bg-cyan-50 text-cyan-600" },
            { name: "Peripherals", icon: <MousePointer2 className="w-6 h-6" />, color: "bg-green-50 text-green-600" },
          ].map((cat) => (
            <Link key={cat.name} href={`/products?category=${cat.name}`}>
              <div className={cn(
                "group relative bg-white border border-border p-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 shadow-sm"
              )}>
                <div className={cn("p-4 rounded-2xl transition-all group-hover:scale-110", cat.color)}>
                  {cat.icon}
                </div>
                <span className="font-headline font-bold uppercase text-xs tracking-widest text-foreground">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Update Banner */}
      {latestAnnouncement && (
        <section className="container mx-auto px-4">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-50 p-10 md:p-16 border border-border">
            <div className="absolute top-0 right-0 p-8">
              <Sparkles className="w-12 h-12 text-primary/10 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <Badge className="bg-primary text-white uppercase tracking-widest font-black rounded-sm px-3">FLASH UPDATE</Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-black uppercase italic leading-none text-foreground">
                  {latestAnnouncement.title}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {latestAnnouncement.content}
                </p>
                <Link href="/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-12 rounded-xl shadow-lg">
                    CLAIM OFFER
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block relative aspect-video rounded-3xl overflow-hidden border border-border shadow-xl">
                <img src="https://picsum.photos/seed/announcement/800/450" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Showcase */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-primary tracking-[0.3em] uppercase">Hardware Inventory</h2>
            <h3 className="text-4xl font-headline font-bold uppercase italic tracking-tighter text-foreground">
              New <span className="text-primary">Arrivals</span>
            </h3>
          </div>
          <Link href="/products" className="group text-muted-foreground hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            View the entire armory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            <p className="text-muted-foreground mb-8 font-medium">The vault is currently empty. Ready to restock?</p>
            <Link href="/admin">
              <Button variant="outline" className="h-12 px-10 rounded-xl border-primary/20 text-primary">ACCESS COMMAND CENTER</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Featured Hardware Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-24 border-y border-border">
          <div className="container mx-auto px-4 space-y-16">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] font-bold px-4">Elite Choice</Badge>
              <h2 className="text-5xl font-headline font-black uppercase italic tracking-tighter text-foreground">Featured <span className="text-primary">Picks</span></h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}