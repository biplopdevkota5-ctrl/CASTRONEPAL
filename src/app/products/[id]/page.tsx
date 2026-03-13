
import { aiProductRecommendations } from '@/ai/flows/ai-product-recommendations';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Zap, ShieldCheck, Gamepad2, Share2, Info, Star, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { CheckoutDialog } from '@/components/checkout/CheckoutDialog';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Mock fetching product data based on ID
  // In a real app, this would be a Firestore fetch
  const productData = {
    id: id,
    name: "PlayStation Plus Premium 12-Month Membership",
    category: "PlayStation",
    price: 119.99,
    imageUrl: "https://picsum.photos/seed/ps-detail/800/1000",
    features: [
      "Online Multiplayer access",
      "Monthly free games",
      "Exclusive discounts",
      "Cloud storage",
      "Game Catalog (hundreds of titles)",
      "Ubisoft+ Classics",
      "Classics Catalog"
    ]
  };

  // Generate detailed description using AI
  const { detailedDescription } = await generateProductDescription({
    productName: productData.name,
    category: productData.category,
    shortDescription: "Unlock the full potential of your PlayStation console with the Premium membership tier.",
    price: productData.price,
    features: productData.features
  });

  // Fetch similar products using AI
  const { recommendations: similarProducts } = await aiProductRecommendations({
    recommendationType: 'similarProducts',
    productId: id,
    productCategory: productData.category
  });

  return (
    <div className="pb-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/products" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass-panel border-primary/20 shadow-[0_0_50px_rgba(26,128,230,0.1)]">
              <Image 
                src={productData.imageUrl}
                alt={productData.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <Badge className="bg-primary hover:bg-primary text-white text-xs px-4 py-1.5 rounded-full font-bold tracking-widest uppercase">
                  Best Seller
                </Badge>
                <div className="flex items-center gap-1 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold uppercase italic text-primary">
                  <Star className="w-3 h-3 fill-current" />
                  4.9 Rating
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary/30 text-primary uppercase font-bold tracking-widest bg-primary/5">
                  {productData.category}
                </Badge>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ID: {id}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-black uppercase italic tracking-tighter leading-none">
                {productData.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-white font-headline">
                  Rs. {Math.round(productData.price * 133).toLocaleString()}
                </span>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30 font-bold px-3 py-1">
                  IN STOCK
                </Badge>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Unlock hundreds of games, from the latest hits to timeless classics. Get the ultimate PlayStation experience with instant digital delivery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 glass-panel rounded-2xl border-white/5">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Instant Access</h4>
                  <p className="text-xs text-muted-foreground">Delivered via Email/Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 glass-panel rounded-2xl border-white/5">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Official Codes</h4>
                  <p className="text-xs text-muted-foreground">100% Genuine and Valid</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <CheckoutDialog product={productData}>
                <Button size="lg" className="h-16 px-12 bg-primary hover:bg-primary/90 text-white text-xl font-bold rounded-2xl neon-border flex-grow group">
                  <ShoppingCart className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                  BUY NOW
                </Button>
              </CheckoutDialog>
              <Button size="icon" variant="outline" className="h-16 w-16 rounded-2xl border-white/10 shrink-0">
                <Share2 className="w-6 h-6" />
              </Button>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-white/10 bg-white/5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  By purchasing, you agree to our digital content policy. Digital codes are non-refundable once delivered.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="mt-20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start h-auto bg-transparent border-b border-white/10 p-0 gap-8 rounded-none">
              <TabsTrigger 
                value="description" 
                className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-headline font-bold text-lg uppercase italic tracking-wider transition-all"
              >
                Detailed Description
              </TabsTrigger>
              <TabsTrigger 
                value="how-to-use" 
                className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-headline font-bold text-lg uppercase italic tracking-wider transition-all"
              >
                How to Redeem
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-headline font-bold text-lg uppercase italic tracking-wider transition-all"
              >
                Customer Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-10">
              <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-[2rem] border-white/5 prose prose-invert">
                <div dangerouslySetInnerHTML={{ __html: detailedDescription.replace(/\n/g, '<br />') }} />
                
                <h3 className="text-2xl font-bold mt-12 mb-6 font-headline uppercase">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {productData.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                      <Gamepad2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="how-to-use" className="pt-10">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase font-headline">Open the Store</h3>
                    <p className="text-muted-foreground">Log in to your PlayStation Network account on your console or web browser.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase font-headline">Enter the Code</h3>
                    <p className="text-muted-foreground">Select 'Redeem Codes' from the PlayStation Store menu and enter your 12-digit digital code.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase font-headline">Confirm & Enjoy</h3>
                    <p className="text-muted-foreground">Confirm your redemption and your balance or subscription will be added immediately.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-10">
              <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/5 border-dashed">
                <Star className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold font-headline uppercase italic">Verified Customer Reviews Coming Soon</h3>
                <p className="text-muted-foreground">We are currently migrating our review system.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <section className="mt-32 space-y-10">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-headline font-bold uppercase italic tracking-tighter">
              Related <span className="text-primary">Gear</span>
            </h2>
            <Link href="/products" className="text-primary hover:underline font-bold text-sm">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
