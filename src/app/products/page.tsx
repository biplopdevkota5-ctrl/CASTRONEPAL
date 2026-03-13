
"use client";

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, Grid2X2, List, ChevronDown, Loader2 } from 'lucide-react';
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
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';

function ProductContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const db = useFirestore();
  
  const productsRef = useMemoFirebase(() => {
    if (!db) return null;
    const colRef = collection(db, 'products');
    
    if (activeCategory) {
      // Filter by category if present in URL
      return query(
        colRef, 
        where('categoryId', '==', activeCategory)
      );
    }
    
    return query(colRef, orderBy('createdAt', 'desc'));
  }, [db, activeCategory]);
  
  const { data: dbProducts, isLoading: productsLoading } = useCollection<any>(productsRef);

  const displayProducts = searchResults || dbProducts;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      setSearchResults(null);
      return;
    }
    
    setIsSearching(true);
    try {
      const { suggestions } = await semanticProductSearch({ query: searchQuery });
      const mappedResults = suggestions.map((s, idx) => ({
        id: `search-${idx}`,
        name: s.name,
        description: s.description,
        category: s.category,
        price: 1500,
        imageUrl: `https://picsum.photos/seed/${s.name}/400/600`
      }));
      setSearchResults(mappedResults);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <h1 className="text-4xl font-headline font-bold uppercase italic tracking-tighter">
            THE <span className="text-primary">ARMORY</span>
          </h1>
          <p className="text-muted-foreground">
            {activeCategory 
              ? `Exploring our premium collection of ${activeCategory} hardware.`
              : "Explore our vast collection of gaming hardware and digital assets. Verified and instant."
            }
          </p>
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by gear or category..." 
              className="h-14 pl-12 pr-4 bg-card/50 border-white/10 rounded-2xl focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-white rounded-xl">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SEARCH'}
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

      {productsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-96 rounded-3xl glass-panel animate-pulse bg-gray-50"></div>
          ))}
        </div>
      ) : displayProducts && displayProducts.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          : "flex flex-col gap-6"
        }>
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-4 bg-gray-50 rounded-full">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or category selection.</p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setSearchResults(null); }}>Clear All Filters</Button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
      <ProductContent />
    </Suspense>
  );
}
