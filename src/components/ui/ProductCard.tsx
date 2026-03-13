"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    shortDescription: string;
    imageUrl: string;
    categoryId?: string;
    stockStatus?: string;
    customTag?: string;
  };
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const displayImage = product.imageUrl || 'https://picsum.photos/seed/hardware/400/500';

  return (
    <div className={cn(
      "group relative flex flex-col bg-white border border-border rounded-xl overflow-hidden transition-colors duration-150 hover:border-primary/40",
      className
    )}>
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden shrink-0 bg-gray-50">
        <Image 
          src={displayImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          data-ai-hint="gaming hardware"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.categoryId && (
            <Badge className="bg-white/95 text-foreground border border-border px-1.5 py-0 text-[8px] font-bold tracking-widest uppercase">
              {product.categoryId}
            </Badge>
          )}
          {product.customTag && (
            <Badge className="bg-primary text-white border-none px-1.5 py-0 text-[8px] font-black tracking-widest uppercase shadow-sm">
              {product.customTag}
            </Badge>
          )}
        </div>

        {/* Action Overlay - Optimized for fast hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-2">
          <Link href={`/products/${product.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 bg-white text-foreground hover:bg-primary hover:text-white transition-all shadow-md">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button size="icon" className="rounded-full h-9 w-9 bg-primary text-white hover:bg-primary/90 transition-all shadow-md">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className={cn(
            "flex items-center gap-1 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border",
            product.stockStatus === 'In Stock' 
              ? "bg-green-500/10 text-green-600 border-green-200" 
              : "bg-red-500/10 text-red-600 border-red-200"
          )}>
            <Zap className="w-2 h-2" />
            {product.stockStatus || 'Available'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 flex flex-col flex-grow bg-white">
        <div className="flex-grow space-y-1">
          <h3 className="text-[11px] font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight text-foreground">
            {product.name}
          </h3>
          <p className="text-[9px] text-muted-foreground line-clamp-2 leading-tight">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="space-y-0">
            <div className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Pricing</div>
            <div className="text-sm font-black text-foreground font-headline tracking-tighter">
              Rs. {Math.round(product.price).toLocaleString()}
            </div>
          </div>
          <Link href={`/products/${product.id}`}>
            <Button size="sm" className="h-7 px-3 bg-primary text-white hover:bg-primary/90 font-bold rounded-lg text-[9px]">
              BUY
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
