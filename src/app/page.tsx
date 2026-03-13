
import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2, ShieldCheck, Zap, Sparkles, ArrowRight, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { aiProductRecommendations } from '@/ai/flows/ai-product-recommendations';
import { ProductCard } from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';

export default async function Home() {
  // Fetch trending products using AI flow
  const { recommendations: trendingProducts } = await aiProductRecommendations({ 
    recommendationType: 'trending' 
  });

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-1000">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-widest uppercase text-primary">Limited Time Deals Available</span>
            </div>
            
            <h1 className="font-headline text-5xl md:text-8xl font-black leading-[1.1] tracking-tighter uppercase italic animate-in fade-in slide-in-from-top-4 duration-1000">
              LEVEL UP YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-glow">GAMING EXPERIENCE</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed animate-in fade-in slide-in-from-left-6 duration-1000 delay-200">
              Nepal’s Trusted Gaming Redeem Code Store. Get instant delivery on PlayStation, Xbox, Steam, and Nintendo codes. 100% Secure.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
              <Link href="/products">
                <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-full neon-border group">
                  SHOP NOW
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/10 hover:bg-white/5 rounded-full font-bold">
                <Play className="mr-2 w-4 h-4 fill-current" />
                WATCH TRAILER
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stats / Trust */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="w-6 h-6 text-primary" />, title: "Instant Delivery", desc: "Codes are delivered within minutes of purchase." },
            { icon: <ShieldCheck className="w-6 h-6 text-secondary" />, title: "100% Secure", desc: "Secure payment gateway and genuine product codes." },
            { icon: <Star className="w-6 h-6 text-yellow-500" />, title: "Trusted by Many", desc: "Thousands of satisfied gamers across Nepal." },
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

      {/* Announcements Banner */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-12 border-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px]"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">LATEST UPDATE</Badge>
              <h2 className="text-3xl md:text-4xl font-headline font-bold uppercase italic">
                PlayStation Plus 12-Month <br /> Now Back In Stock!
              </h2>
              <p className="text-muted-foreground max-w-lg">
                The most awaited subscription cards are finally here. Claim yours before they run out again. Limited stock available.
              </p>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-10 rounded-full">
              CLAIM NOW
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="container mx-auto px-4 space-y-10">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold uppercase italic tracking-tighter">
              Trending <span className="text-primary">Redeem Codes</span>
            </h2>
            <p className="text-muted-foreground">The most popular digital assets right now.</p>
          </div>
          <Link href="/products" className="text-primary hover:underline font-bold text-sm flex items-center gap-1">
            VIEW ALL PRODUCTS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Navigation */}
      <section className="container mx-auto px-4 py-20 bg-card/30 rounded-[3rem] border border-white/5">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-headline font-bold uppercase italic">Browse by Platform</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Choose your favorite platform and get started with instant gaming codes.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { name: "PlayStation", icon: "/ps-logo.png", color: "hover:border-blue-600" },
            { name: "Xbox", icon: "/xbox-logo.png", color: "hover:border-green-600" },
            { name: "Steam", icon: "/steam-logo.png", color: "hover:border-slate-500" },
            { name: "Nintendo", icon: "/nintendo-logo.png", color: "hover:border-red-600" },
          ].map((cat) => (
            <Link key={cat.name} href={`/products?category=${cat.name}`}>
              <div className={cn(
                "glass-panel p-8 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:-translate-y-2 border-transparent",
                cat.color
              )}>
                <div className="w-16 h-16 relative grayscale hover:grayscale-0 transition-all">
                  <Gamepad2 className="w-full h-full text-white/40" />
                </div>
                <span className="font-headline font-bold uppercase">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20 border border-white/10 p-12 md:p-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-headline font-bold uppercase italic tracking-tight">
              JOIN THE ELITE <br /> GAMING COMMUNITY
            </h2>
            <p className="text-muted-foreground text-lg">
              Get exclusive early access to discounts, new code drops, and gaming updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your gaming email" 
                className="flex-grow h-14 bg-white/5 border border-white/10 rounded-full px-8 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-full neon-border">
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
