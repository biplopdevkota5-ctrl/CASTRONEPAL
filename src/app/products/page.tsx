
"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Grid2X2, List, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ProductCard } from '@/components/ui/ProductCard';
import { semanticProductSearch } from '@/ai/flows/semantic-product-search';
import { aiProductRecommendations } from '@/ai/flows/ai-product-recommendations';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      // Using trending recommendations as default products
      const { recommendations } = await aiProductRecommendations({ recommendationType: 'trending' });
      setProducts(recommendations);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsLoading(true);
    const { suggestions } = await semanticProductSearch({ query: searchQuery });
    // Map suggestions to product card format
    const searchResults = suggestions.map((s, idx) => ({
      id: `search-${idx}`,
      name: s.name,
      description: s.description,
      category: s.category,
      price: 15 + Math.random() * 50, // Mock price
      imageUrl: `https://picsum.photos/seed/${s.name}/400/600`
    }));
    setProducts(searchResults);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <h1 className="text-4xl font-headline font-bold uppercase italic tracking-tighter">
            THE <span className="text-primary">ARMORY</span>
          </h1>
          <p className="text-muted-foreground">
            Explore our vast collection of gaming redeem codes and digital gift cards. Verified and instant.
          </p>
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by game, platform or category..." 
              className="h-14 pl-12 pr-4 bg-card/50 border-white/10 rounded-2xl focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-white rounded-xl">
              SEARCH
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-card/50 p-1 rounded-xl border border-white/10">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-10 w-10 rounded-lg"
              onClick={() => setViewMode('grid')}
            >
              <Grid2X2 className="w-5 h-5" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              className="h-10 w-10 rounded-lg"
              onClick={() => setViewMode('list')}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 px-6 rounded-xl bg-card/50 border-white/10">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Sort By
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-white/10">
              <DropdownMenuItem>Newest Arrivals</DropdownMenuItem>
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Most Popular</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="h-12 px-6 rounded-xl bg-card/50 border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-96 rounded-3xl glass-panel animate-pulse bg-white/5"></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          : "flex flex-col gap-6"
        }>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-4 bg-white/5 rounded-full">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          <Button variant="outline" onClick={() => setSearchQuery('')}>Clear All Filters</Button>
        </div>
      )}
    </div>
  );
}
