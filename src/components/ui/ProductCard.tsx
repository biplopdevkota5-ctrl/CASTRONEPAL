"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Zap, Info } from 'lucide-react';
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
}

export function ProductCard({ product, className }: ProductCardProps) {
  const displayImage = product.imageUrl || 'https://picsum.photos/seed/hardware/600/800';

  return (
    <div className={cn(
      "group relative flex flex-col bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
      className
    )}>
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden shrink-0 bg-black/40">
        <Image 
          src={displayImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.categoryId && (
            <Badge className="bg-black/60 text-white backdrop-blur-md border border-white/10 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
              {product.categoryId}
            </Badge>
          )}
          {product.customTag && (
            <Badge className="bg-primary text-white border-none px-2 py-0.5 text-[9px] font-black tracking-widest uppercase shadow-lg">
              {product.customTag}
            </Badge>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[4px]">
          <Link href={`/products/${product.id}`}>
            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 hover:bg-primary hover:text-white transition-all duration-300">
              <Eye className="w-5 h-5" />
            </Button>
          </Link>
          <Button size="icon" className="rounded-full h-12 w-12 bg-white text-black hover:bg-primary hover:text-white transition-all duration-300">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <div className={cn(
            "flex items-center gap-1.5 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border",
            product.stockStatus === 'In Stock' 
              ? "bg-green-500/10 text-green-400 border-green-500/20" 
              : "bg-red-500/10 text-red-400 border-red-500/20"
          )}>
            <Zap className="w-2.5 h-2.5" />
            {product.stockStatus || 'Available'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-transparent to-black/20">
        <div className="flex-grow space-y-2">
          <h3 className="text-base font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300 uppercase tracking-tight">
            {product.name}
          </h3>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Pricing</div>
            <div className="text-xl font-black text-white font-headline tracking-tighter">
              Rs. {Math.round(product.price).toLocaleString()}
            </div>
          </div>
          <Link href={`/products/${product.id}`}>
            <Button size="sm" className="h-9 px-6 bg-white text-black hover:bg-primary hover:text-white font-bold rounded-lg transition-all duration-300">
              BUY
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}