"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { aiProductRecommendations } from '@/ai/flows/ai-product-recommendations';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Gamepad2, Share2, Star, ChevronLeft, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { CheckoutDialog } from '@/components/checkout/CheckoutDialog';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const db = useFirestore();
  
  const productRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, 'products', id);
  }, [db, id]);
  
  const { data: productData, isLoading: productLoading } = useDoc<any>(productRef);

  const [aiDescription, setAiDescription] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function fetchAiData() {
      if (!productData) return;
      setAiLoading(true);
      try {
        const { detailedDescription: desc } = await generateProductDescription({
          productName: productData.name,
          category: productData.categoryId,
          shortDescription: productData.shortDescription || "Premium gaming asset.",
          price: productData.price,
          features: []
        });
        setAiDescription(desc);
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
        <h1 className="text-4xl font-headline font-bold uppercase italic">ASSET NOT FOUND</h1>
        <p className="text-muted-foreground">The item you're looking for doesn't exist in the current armory.</p>
        <Link href="/products">
          <Button variant="outline" className="rounded-full">BACK TO SHOP</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 py-8">
        <Link href="/products" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass-panel border-primary/20">
              {productData.imageUrl ? (
                <img src={productData.imageUrl} alt={productData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center"><Gamepad2 className="w-20 h-20 text-white/10" /></div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary/30 text-primary uppercase font-bold tracking-widest bg-primary/5 px-3">
                  {productData.categoryId}
                </Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SKU: {id.slice(0, 8)}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-black uppercase italic tracking-tighter leading-none text-[#0a0c10]">{productData.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-[#0a0c10] font-headline">Rs. {Math.round(productData.price).toLocaleString()}</span>
                <Badge className={productData.stockStatus === 'In Stock' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                  {productData.stockStatus?.toUpperCase() || 'IN STOCK'}
                </Badge>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed font-medium">{productData.shortDescription}</p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <CheckoutDialog product={productData}>
                <Button size="lg" className="h-16 px-12 bg-primary hover:bg-primary/90 text-white text-xl font-black rounded-2xl flex-grow group italic tracking-tighter">
                  <ShoppingCart className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                  BUY NOW
                </Button>
              </CheckoutDialog>
              <Button size="icon" variant="outline" className="h-16 w-16 rounded-2xl border-border shrink-0 hover:bg-primary/5 hover:text-primary transition-colors">
                <Share2 className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start h-auto bg-transparent border-b border-border p-0 gap-8 rounded-none">
              <TabsTrigger value="description" className="px-0 py-4 font-headline font-bold text-lg uppercase italic border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent">Technical Details</TabsTrigger>
              <TabsTrigger value="location" className="px-0 py-4 font-headline font-bold text-lg uppercase italic border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent">Store Location</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-10">
              <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-[2rem] border-white/5 bg-gray-50/50">
                <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed mb-8">
                  {productData.fullDescription || productData.shortDescription}
                </div>
                {aiLoading ? (
                  <div className="flex flex-col items-center py-12 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Generating AI Insights...</p>
                  </div>
                ) : (
                  <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Star className="w-12 h-12 fill-primary" />
                    </div>
                    <h4 className="text-primary font-bold mb-4 uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                      <Star className="w-3 h-3 fill-current" /> CASTRO AI RECOMMENDATION
                    </h4>
                    <div className="text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: aiDescription.replace(/\n/g, '<br />') }} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="location" className="pt-10">
              <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-8 p-12 glass-panel rounded-[2rem]">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center transform rotate-3">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-headline font-black uppercase italic text-[#0a0c10] tracking-tighter">VISIT THE HUB</h3>
                  <p className="text-xl text-primary font-bold">Sitapaila, Kathmandu, Nepal</p>
                </div>
                <p className="max-w-md text-muted-foreground font-medium">
                  Experience premium hardware first-hand. Our Sitapaila showroom is open for physical inspections, testing, and same-day pickups.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
