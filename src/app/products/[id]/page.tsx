"use client";

import { useState, useEffect, useMemo } from 'react';
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
  
  const productRef = useMemo(() => {
    if (!db || !id) return null;
    return doc(db, 'products', id);
  }, [db, id]);
  
  const { data: productData, loading: productLoading } = useDoc<any>(productRef);

  const [aiDescription, setAiDescription] = useState<string>('');
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
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

        const { recommendations } = await aiProductRecommendations({
          recommendationType: 'similarProducts',
          productId: id,
          productCategory: productData.categoryId
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
      <div className="container mx-auto px-4 py-8">
        <Link href="/products" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
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
                <Badge variant="outline" className="border-primary/30 text-primary uppercase font-bold tracking-widest bg-primary/5">
                  {productData.categoryId}
                </Badge>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">SKU: {id.slice(0, 8)}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-black uppercase italic tracking-tighter leading-none">{productData.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-white font-headline">Rs. {Math.round(productData.price).toLocaleString()}</span>
                <Badge className={productData.stockStatus === 'In Stock' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                  {productData.stockStatus?.toUpperCase() || 'IN STOCK'}
                </Badge>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{productData.shortDescription}</p>

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
          </div>
        </div>

        <div className="mt-20">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start h-auto bg-transparent border-b border-white/10 p-0 gap-8 rounded-none">
              <TabsTrigger value="description" className="px-0 py-4 font-headline font-bold text-lg uppercase italic">Details</TabsTrigger>
              <TabsTrigger value="how-to-order" className="px-0 py-4 font-headline font-bold text-lg uppercase italic">How to Order</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-10">
              <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-[2rem] border-white/5">
                <div className="prose prose-invert mb-8">
                  {productData.fullDescription || productData.shortDescription}
                </div>
                {aiLoading ? (
                  <div className="flex flex-col items-center py-12 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm font-bold uppercase tracking-widest text-primary">Consulting the AI Oracles...</p>
                  </div>
                ) : (
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                    <h4 className="text-primary font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2"><Star className="w-4 h-4 fill-current" /> AI Insights</h4>
                    <div dangerouslySetInnerHTML={{ __html: aiDescription.replace(/\n/g, '<br />') }} />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="how-to-order" className="pt-10">
              <div className="max-w-3xl mx-auto space-y-8">
                {['Place Order', 'Payment Verification', 'Fast Delivery'].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl shrink-0">{i+1}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 uppercase font-headline">{step}</h3>
                      <p className="text-muted-foreground">{i === 0 ? "Fill details and click confirm." : i === 1 ? "Our team will call you for verification." : "Get your gear instantly after confirmation."}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}