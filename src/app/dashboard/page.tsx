
"use client";

import { useState, useMemo } from 'react';
import { 
  User, 
  ShoppingBag, 
  Settings, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Package,
  Star,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useFirestore, useCollection, useAuth } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const ordersQuery = useMemo(() => {
    if (!db || !user?.email) return null;
    return query(
      collection(db, 'orders'), 
      where('customerEmail', '==', user.email),
      orderBy('createdAt', 'desc')
    );
  }, [db, user?.email]);

  const { data: orders, loading: ordersLoading } = useCollection<any>(ordersQuery);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-panel border-white/10 rounded-[2rem] overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-secondary opacity-20"></div>
            <CardContent className="px-8 -mt-12 pb-8 text-center space-y-4">
              <div className="mx-auto w-24 h-24 bg-card border-4 border-background rounded-3xl flex items-center justify-center text-3xl font-bold text-primary shadow-xl">
                {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-headline font-bold uppercase italic">{user.displayName || 'Player One'}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">ELITE MEMBER</Badge>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="text-center">
                  <div className="text-xl font-bold">{orders?.length || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{(orders?.length || 0) * 100}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">XP Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <nav className="glass-panel border-white/10 rounded-[2rem] p-4 space-y-2">
            {[
              { icon: <ShoppingBag className="w-4 h-4" />, label: "Order History", active: true },
              { icon: <CreditCard className="w-4 h-4" />, label: "Payment Methods", active: false },
              { icon: <ShieldCheck className="w-4 h-4" />, label: "Security", active: false },
              { icon: <Settings className="w-4 h-4" />, label: "Account Settings", active: false },
            ].map((item, idx) => (
              <button 
                key={idx}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-3 font-bold text-sm uppercase tracking-wider">
                  {item.icon}
                  {item.label}
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
            <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-400 p-4 rounded-2xl mt-4">
              <LogOut className="w-4 h-4 mr-3" />
              <span className="font-bold uppercase tracking-wider text-sm">Sign Out</span>
            </Button>
          </nav>
        </div>

        {/* Main Dashboard Area */}
        <div className="lg:col-span-8 space-y-8">
          <header>
            <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter">
              PLAYER <span className="text-primary">DASHBOARD</span>
            </h1>
            <p className="text-muted-foreground">Manage your gaming assets and order history.</p>
          </header>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="bg-transparent h-auto p-0 gap-8 mb-8">
              <TabsTrigger value="orders" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2 font-headline font-bold text-lg uppercase italic">Recent Orders</TabsTrigger>
              <TabsTrigger value="wishlist" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2 font-headline font-bold text-lg uppercase italic">Saved Items</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              {ordersLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
              ) : orders && orders.length > 0 ? (
                orders.map((order, i) => (
                  <div key={i} className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                        <Package className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          {order.createdAt?.toDate().toLocaleDateString() || 'Recently'} • {order.id.slice(0,8)}
                        </div>
                        <h4 className="text-lg font-bold font-headline uppercase">{order.productName}</h4>
                        <p className="text-sm font-bold text-white mt-1">Rs. {Math.round(order.totalPrice).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <Badge className={
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }>
                        {order.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="rounded-xl border-white/10 hover:bg-white/5">VIEW DETAILS</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <Package className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-headline uppercase italic">No Orders Yet</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-2">Ready to level up? Visit the armory to place your first order.</p>
                  <Button className="mt-8 bg-primary hover:bg-primary/90 rounded-xl px-8 font-bold" onClick={() => router.push('/products')}>START SHOPPING</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="wishlist">
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <Star className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-headline uppercase italic">Your Armory is Empty</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2">Start adding redeem codes to your saved items to track prices and availability.</p>
                <Button className="mt-8 bg-primary hover:bg-primary/90 rounded-xl px-8 font-bold" onClick={() => router.push('/products')}>START SHOPPING</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
