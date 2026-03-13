
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category?: string;
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={cn(
      "group relative glass-panel rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(26,128,230,0.2)]",
      className
    )}>
      {/* Category Badge */}
      {product.category && (
        <Badge className="absolute top-4 left-4 z-10 bg-primary/80 hover:bg-primary text-white backdrop-blur-md border-none px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
          {product.category}
        </Badge>
      )}

      {/* Stock status badge (mocked) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-green-500/20 text-green-500 border border-green-500/30 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-bold uppercase">
        <Zap className="w-3 h-3 fill-current" />
        Instant
      </div>

      {/* Product Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image 
          src={product.imageUrl || 'https://picsum.photos/seed/placeholder/400/600'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          data-ai-hint="gaming product"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
        
        {/* Hover Action Layer */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <Link href={`/products/${product.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 shadow-xl hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </Button>
          </Link>
          <Button size="icon" className="rounded-full h-12 w-12 bg-primary hover:bg-primary shadow-xl hover:scale-110 transition-transform">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors font-headline uppercase italic">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[2.5rem]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Price</span>
            <span className="text-xl font-bold text-white font-headline">
              Rs. {Math.round(product.price * 133).toLocaleString()}
            </span>
          </div>
          <Link href={`/products/${product.id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6 shadow-lg shadow-primary/20">
              BUY NOW
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
