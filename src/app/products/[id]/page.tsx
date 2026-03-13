
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { aiProductRecommendations } from '@/ai/flows/ai-product-recommendations';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Zap, ShieldCheck, Gamepad2, Share2, Info, Star, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { CheckoutDialog } from '@/components/checkout/CheckoutDialog';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const db = useFirestore();
  
  const productRef = doc(db, 'products', id);
  const { data: productData, loading: productLoading } = useDoc<any>(productRef);

  const [detailedDescription, setDetailedDescription] = useState<string>('');
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function fetchAiData() {
      if (!productData) return;
      setAiLoading(true);
      try {
        // Generate detailed description using AI
        const { detailedDescription: desc } = await generateProductDescription({
          productName: productData.name,
          category: productData.category,
          shortDescription: productData.description || "Premium gaming asset.",
          price: productData.price,
          features: productData.features || []
        });
        setDetailedDescription(desc);

        // Fetch similar products using AI
        const { recommendations } = await aiProductRecommendations({
          recommendationType: 'similarProducts',
          productId: id,
          productCategory: productData.category
        });
        setSimilarProducts(recommendations);
      } catch (err) {
        console.error("AI Fetch failed", err);
      } finally {
        setAiLoading(false);
      }
    }

    if (productData) {
      fetchAiData();
    }
  }, [productData, id]);

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-4xl font-headline font-bold">PRODUCT NOT FOUND</h1>
        <p className="text-muted-foreground">The asset you're looking for doesn't exist in the armory.</p>
        <Link href="/products">
          <Button variant="outline" className="rounded-full">BACK TO SHOP</Button>
        </Link>
      </div>
    );
  }

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
              {productData.imageUrl ? (
                <img 
                  src={productData.imageUrl}
                  alt={productData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <Gamepad2 className="w-20 h-20 text-white/10" />
                </div>
              )}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <Badge className="bg-primary hover:bg-primary text-white text-xs px-4 py-1.5 rounded-full font-bold tracking-widest uppercase">
                  Featured
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
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">SKU: {id.slice(0, 8)}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-black uppercase italic tracking-tighter leading-none">
                {productData.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-white font-headline">
                  Rs. {Math.round(productData.price).toLocaleString()}
                </span>
                <Badge className={productData.status === 'In Stock' ? 'bg-green-500/20 text-green-500 border-green-500/30 font-bold px-3 py-1' : 'bg-red-500/20 text-red-500 border-red-500/30 font-bold px-3 py-1'}>
                  {productData.status?.toUpperCase() || 'IN STOCK'}
                </Badge>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {productData.description || "Experience top-tier gaming performance with our high-quality gaming products. Secured, fast, and built for champions."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 glass-panel rounded-2xl border-white/5">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Secure Asset</h4>
                  <p className="text-xs text-muted-foreground">Verified by Castro Nepal</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 glass-panel rounded-2xl border-white/5">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Official Warranty</h4>
                  <p className="text-xs text-muted-foreground">100% Genuine Products</p>
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
                  By purchasing, you agree to our store policy. Hardware items include standard manufacturer warranty.
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
                AI Insights
              </TabsTrigger>
              <TabsTrigger 
                value="how-to-use" 
                className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-headline font-bold text-lg uppercase italic tracking-wider transition-all"
              >
                How to Order
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="px-0 py-4 bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-headline font-bold text-lg uppercase italic tracking-wider transition-all"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-10">
              <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-[2rem] border-white/5 prose prose-invert">
                {aiLoading ? (
                  <div className="flex flex-col items-center py-12 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-bold uppercase tracking-widest text-primary animate-pulse">Consulting the AI Oracles...</p>
                  </div>
                ) : (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: detailedDescription.replace(/\n/g, '<br />') }} />
                    
                    {productData.features && productData.features.length > 0 && (
                      <>
                        <h3 className="text-2xl font-bold mt-12 mb-6 font-headline uppercase">Key Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                          {productData.features.map((feature: string, i: number) => (
                            <li key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                              <Gamepad2 className="w-5 h-5 text-primary shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="how-to-use" className="pt-10">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase font-headline">Place Your Order</h3>
                    <p className="text-muted-foreground">Click 'Buy Now' and fill in your contact details and delivery address.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase font-headline">Payment Verification</h3>
                    <p className="text-muted-foreground">Our team will contact you for payment verification via your phone number.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase font-headline">Fast Delivery</h3>
                    <p className="text-muted-foreground">Once payment is confirmed, your gaming asset will be delivered instantly or within the scheduled time.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-10">
              <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/5 border-dashed">
                <Star className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold font-headline uppercase italic">Player Feedback Coming Soon</h3>
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
