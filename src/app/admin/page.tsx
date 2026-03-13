
"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Bell, 
  Plus, 
  LogOut, 
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Gamepad2,
  X,
  Upload,
  Loader2,
  Clock,
  Database,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'announcements'>('dashboard');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();

  // Firestore Collections with properly memoized queries using useMemoFirebase
  // We only run these queries if isAuthenticated is true to avoid permission errors on mount
  const productsQuery = useMemoFirebase(() => {
    if (!db || !isAuthenticated) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db, isAuthenticated]);
  const { data: products, loading: productsLoading } = useCollection<any>(productsQuery);

  const ordersQuery = useMemoFirebase(() => {
    if (!db || !isAuthenticated) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db, isAuthenticated]);
  const { data: orders, loading: ordersLoading } = useCollection<any>(ordersQuery);

  const announcementsQuery = useMemoFirebase(() => {
    if (!db || !isAuthenticated) return null;
    return query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  }, [db, isAuthenticated]);
  const { data: announcements, loading: announcementsLoading } = useCollection<any>(announcementsQuery);

  // Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'PlayStation',
    price: '',
    status: 'In Stock',
    description: '',
    imageUrl: ''
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '901020304050') {
      // Sign in to Firebase to satisfy security rules (SignedIn check)
      signInAnonymously(auth).then(() => {
        setIsAuthenticated(true);
        toast({ title: 'Authorized', description: 'Admin session started.' });
      }).catch(() => {
        toast({ variant: 'destructive', title: 'Auth Error', description: 'Could not establish secure session.' });
      });
    } else {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'Invalid Admin Password' });
    }
  };

  const handleImageUpload = (file: File) => {
    if (file.size > 3 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File too large', description: 'Maximum image size is 3MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductForm(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (!isAuthenticated) return;
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) handleImageUpload(file);
      }
    }
  }, [isAuthenticated]);

  const saveProduct = () => {
    if (!productForm.name || !productForm.price) {
      toast({ variant: 'destructive', title: 'Missing Info', description: 'Please fill name and price.' });
      return;
    }
    
    setIsSaving(true);
    const productId = doc(collection(db, 'products')).id;
    const productRef = doc(db, 'products', productId);
    
    const data = {
      ...productForm,
      id: productId,
      price: parseFloat(productForm.price),
      createdAt: serverTimestamp(),
      features: [] 
    };

    setDoc(productRef, data)
      .then(() => {
        setIsAddProductOpen(false);
        setProductForm({ name: '', category: 'PlayStation', price: '', status: 'In Stock', description: '', imageUrl: '' });
        toast({ title: 'Success', description: `${data.name} uploaded to database.` });
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: productRef.path,
          operation: 'create',
          requestResourceData: data
        }));
      })
      .finally(() => setIsSaving(false));
  };

  const seedDatabase = async () => {
    setIsSaving(true);
    const sampleProducts = [
      { name: "PSN $50 Gift Card", category: "PlayStation", price: 6650, status: "In Stock", description: "Instant digital code for US accounts.", imageUrl: "https://picsum.photos/seed/psn1/400/600" },
      { name: "Xbox $25 Card", category: "Xbox", price: 3400, status: "In Stock", description: "Global digital code for Xbox Store.", imageUrl: "https://picsum.photos/seed/xbox1/400/600" },
      { name: "RTX 4090 GPU", category: "GPU", price: 285000, status: "In Stock", description: "The ultimate gaming graphics card.", imageUrl: "https://picsum.photos/seed/gpu1/400/600" },
      { name: "Nintendo $20 Card", category: "Nintendo", price: 2750, status: "In Stock", description: "eShop digital redeem code.", imageUrl: "https://picsum.photos/seed/nintendo1/400/600" },
      { name: "Steam $10 Wallet", category: "Steam", price: 1450, status: "In Stock", description: "Steam Wallet code for global users.", imageUrl: "https://picsum.photos/seed/steam1/400/600" }
    ];

    try {
      for (const p of sampleProducts) {
        const id = doc(collection(db, 'products')).id;
        await setDoc(doc(db, 'products', id), { ...p, id, createdAt: serverTimestamp() });
      }
      toast({ title: "Database Seeded", description: "Real products have been added to your store." });
    } catch (e) {
      toast({ variant: 'destructive', title: "Error", description: "Failed to seed database." });
    } finally {
      setIsSaving(false);
    }
  };

  const saveAnnouncement = () => {
    if (!announcementForm.title || !announcementForm.content) {
      toast({ variant: 'destructive', title: 'Missing Info', description: 'Please fill title and content.' });
      return;
    }

    setIsSaving(true);
    const announcementId = doc(collection(db, 'announcements')).id;
    const announcementRef = doc(db, 'announcements', announcementId);
    
    const data = {
      ...announcementForm,
      id: announcementId,
      date: new Date().toLocaleDateString(),
      createdAt: serverTimestamp()
    };

    setDoc(announcementRef, data)
      .then(() => {
        setIsAddAnnouncementOpen(false);
        setAnnouncementForm({ title: '', content: '' });
        toast({ title: 'Update Published', description: 'New store announcement is live.' });
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: announcementRef.path,
          operation: 'create',
          requestResourceData: data
        }));
      })
      .finally(() => setIsSaving(false));
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const orderRef = doc(db, 'orders', orderId);
    updateDoc(orderRef, { status: newStatus })
      .then(() => toast({ title: 'Order Updated', description: `Order status changed to ${newStatus}` }))
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: orderRef.path,
          operation: 'update'
        }));
      });
  };

  const deleteItem = (id: string, coll: string) => {
    const itemRef = doc(db, coll, id);
    deleteDoc(itemRef).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: itemRef.path,
        operation: 'delete'
      }));
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-panel w-full max-w-md p-8 space-y-8 rounded-[2rem]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-headline font-black uppercase italic tracking-tighter">ADMIN <span className="text-primary">ACCESS</span></h1>
            <p className="text-muted-foreground">Please enter the master password to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="password" 
              placeholder="Enter Access Key" 
              className="h-14 text-center text-2xl tracking-[0.5em] bg-white/5 border-white/10 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full h-14 bg-primary text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(26,128,230,0.3)]">
              AUTHORIZE
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background" onPaste={handlePaste}>
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-card border-r border-white/5 p-6 space-y-8 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <span className="font-headline font-bold uppercase italic text-xl tracking-tighter">
            ADMIN<span className="text-primary">CORE</span>
          </span>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
            { id: 'products', icon: <Package className="w-5 h-5" />, label: 'Products' },
            { id: 'orders', icon: <ShoppingBag className="w-5 h-5" />, label: 'Orders' },
            { id: 'announcements', icon: <Bell className="w-5 h-5" />, label: 'Updates' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-4">
          <Button 
            variant="outline" 
            className="w-full border-primary/20 text-primary hover:bg-primary/10" 
            onClick={seedDatabase}
            disabled={isSaving}
          >
            <Database className="w-4 h-4 mr-2" />
            SEED STORE
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-400" onClick={() => setIsAuthenticated(false)}>
            <LogOut className="w-4 h-4 mr-2" />
            LOGOUT
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 space-y-8 bg-black/20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-black uppercase italic tracking-tighter">
              {activeTab} <span className="text-primary">Management</span>
            </h2>
            <p className="text-muted-foreground">Manage your store operations and database assets.</p>
          </div>
          <div className="flex gap-4">
            {activeTab === 'products' && (
              <Button onClick={() => setIsAddProductOpen(true)} className="bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl px-6">
                <Plus className="w-4 h-4 mr-2" />
                ADD PRODUCT
              </Button>
            )}
            {activeTab === 'announcements' && (
              <Button onClick={() => setIsAddAnnouncementOpen(true)} className="bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl px-6">
                <Plus className="w-4 h-4 mr-2" />
                NEW UPDATE
              </Button>
            )}
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel border-white/5 p-8 space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Orders</span>
              <div className="text-3xl font-headline font-bold text-primary">{orders?.filter((o: any) => o.status !== 'Delivered').length || 0}</div>
              <div className="text-xs text-muted-foreground">{orders?.length || 0} total orders recorded</div>
            </Card>
            <Card className="glass-panel border-white/5 p-8 space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Inventory</span>
              <div className="text-3xl font-headline font-bold text-secondary">{products?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Assets listed in database</div>
            </Card>
          </div>
        )}

        <div className="glass-panel border-white/5 rounded-2xl overflow-hidden">
          {activeTab === 'products' && (
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Product</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Category</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Price</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                ) : products?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No products found. Use "Seed Store" to add some!</TableCell></TableRow>
                ) : products?.map((row: any) => (
                  <TableRow key={row.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-bold py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                          {row.imageUrl ? <img src={row.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-primary" />}
                        </div>
                        <div>
                          <div className="text-sm">{row.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">ID: {row.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{row.category}</Badge></TableCell>
                    <TableCell className="font-bold">Rs. {Math.round(row.price).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={row.status === 'In Stock' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => deleteItem(row.id, 'products')} size="icon" variant="ghost" className="text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === 'orders' && (
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="uppercase font-bold text-xs tracking-widest">Order / Customer</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest">Product</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest">Total</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest">Status</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                ) : orders?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No orders yet.</TableCell></TableRow>
                ) : orders?.map((order: any) => (
                  <TableRow key={order.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="py-6">
                      <div className="space-y-1">
                        <div className="text-sm font-bold">{order.customerName}</div>
                        <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {order.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                        </div>
                        <div className="text-[10px] text-primary font-mono">{order.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-bold">{order.productName}</div>
                      <div className="text-[10px] text-muted-foreground">Qty: {order.quantity}</div>
                    </TableCell>
                    <TableCell className="font-bold text-white">Rs. {Math.round(order.totalPrice).toLocaleString()}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={order.status} 
                        onValueChange={(v) => updateOrderStatus(order.id, v)}
                      >
                        <SelectTrigger className={cn(
                          "h-8 text-[10px] font-bold uppercase",
                          order.status === 'Pending' ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/10" :
                          order.status === 'Delivered' ? "text-green-500 border-green-500/20 bg-green-500/10" :
                          "text-primary border-primary/20 bg-primary/10"
                        )}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => deleteItem(order.id, 'orders')} size="icon" variant="ghost" className="text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === 'announcements' && (
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Title</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Date</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcementsLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                ) : announcements?.map((row: any) => (
                  <TableRow key={row.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-bold py-6">{row.title}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{row.date}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => deleteItem(row.id, 'announcements')} size="icon" variant="ghost" className="text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Product Modal */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[600px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold uppercase italic">UPLOAD PRODUCT</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</Label>
              <Input 
                placeholder="e.g. RTX 4090" 
                className="bg-white/5 border-white/10" 
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
              <Select value={productForm.category} onValueChange={(v) => setProductForm({...productForm, category: v})}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PlayStation">PlayStation</SelectItem>
                  <SelectItem value="Xbox">Xbox</SelectItem>
                  <SelectItem value="Steam">Steam</SelectItem>
                  <SelectItem value="Nintendo">Nintendo</SelectItem>
                  <SelectItem value="GPU">GPU</SelectItem>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price (NPR)</Label>
              <Input 
                type="number" 
                placeholder="6650" 
                className="bg-white/5 border-white/10" 
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image (Paste or Browse)</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center space-y-4 hover:border-primary/50 cursor-pointer"
              >
                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                {productForm.imageUrl ? (
                  <img src={productForm.imageUrl} className="max-h-[120px] mx-auto rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Drop here, Browse, or <strong>Paste (Ctrl+V)</strong></p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveProduct} disabled={isSaving} className="bg-primary text-white font-bold w-full rounded-xl h-12">
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : 'UPLOAD PRODUCT'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Announcement Modal */}
      <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[500px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold uppercase italic">PUBLISH UPDATE</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Headline</Label>
              <Input 
                placeholder="e.g. New RTX 50-Series Stock Arrived" 
                className="bg-white/5 border-white/10" 
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</Label>
              <Textarea 
                placeholder="Provide details for your customers..." 
                className="bg-white/5 border-white/10 min-h-[150px]" 
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveAnnouncement} disabled={isSaving} className="bg-primary text-white font-bold w-full rounded-xl h-12">
              {isSaving ? <Loader2 className="animate-spin mr-2" /> : 'PUBLISH NOW'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
