
"use client";

import { useState, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Bell, 
  Plus, 
  LogOut, 
  Trash2,
  Lock,
  Upload,
  Loader2,
  Database,
  Tag,
  Menu,
  X,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import { useFirestore, useCollection, useMemoFirebase, useAuth, useUser } from '@/firebase';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();

  const productsQuery = useMemoFirebase(() => {
    if (!db || !isAuthenticated || !user) return null;
    return query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  }, [db, isAuthenticated, user]);
  const { data: products } = useCollection<any>(productsQuery);

  const ordersQuery = useMemoFirebase(() => {
    if (!db || !isAuthenticated || !user) return null;
    return query(collection(db, 'orders'), orderBy('orderTime', 'desc'));
  }, [db, isAuthenticated, user]);
  const { data: orders } = useCollection<any>(ordersQuery);

  const announcementsQuery = useMemoFirebase(() => {
    if (!db || !isAuthenticated || !user) return null;
    return query(collection(db, 'announcements'), orderBy('postedAt', 'desc'));
  }, [db, isAuthenticated, user]);
  const { data: announcements } = useCollection<any>(announcementsQuery);

  const [productForm, setProductForm] = useState({
    name: '',
    category: 'GPU',
    price: '',
    stockStatus: 'In Stock',
    customTag: '',
    shortDescription: '',
    fullDescription: '',
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
      signInAnonymously(auth).then(() => {
        setIsAuthenticated(true);
        toast({ title: 'Authorized', description: 'Admin session started.' });
      }).catch((err) => {
        console.error(err);
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

  const saveProduct = () => {
    if (!productForm.name || !productForm.price) {
      toast({ variant: 'destructive', title: 'Missing Info', description: 'Please fill name and price.' });
      return;
    }
    
    setIsSaving(true);
    const productId = doc(collection(db, 'products')).id;
    const productRef = doc(db, 'products', productId);
    
    const data = {
      id: productId,
      name: productForm.name,
      categoryId: productForm.category,
      price: parseFloat(productForm.price),
      stockStatus: productForm.stockStatus,
      customTag: productForm.customTag || '',
      availability: true,
      shortDescription: productForm.shortDescription,
      fullDescription: productForm.fullDescription || productForm.shortDescription,
      imageUrl: productForm.imageUrl,
      isFeatured: false,
      viewCount: 0,
      purchaseCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    setDoc(productRef, data)
      .then(() => {
        setIsAddProductOpen(false);
        setProductForm({ name: '', category: 'GPU', price: '', stockStatus: 'In Stock', customTag: '', shortDescription: '', fullDescription: '', imageUrl: '' });
        toast({ title: 'Success', description: `${data.name} saved successfully.` });
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
    const id = doc(collection(db, 'products')).id;
    const data = {
      id,
      name: "NVIDIA RTX 4090",
      categoryId: "GPU",
      price: 285000,
      stockStatus: "In Stock",
      customTag: "TOP TIER",
      shortDescription: "Ultimate gaming performance.",
      fullDescription: "The ultimate GPU for professional gaming and rendering.",
      imageUrl: "https://picsum.photos/seed/gpu1/400/600",
      availability: true,
      isFeatured: true,
      viewCount: 0,
      purchaseCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'products', id), data);
      toast({ title: "Database Seeded", description: "Sample RTX 4090 added." });
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
      id: announcementId,
      title: announcementForm.title,
      content: announcementForm.content,
      postedAt: serverTimestamp(),
      isActive: true
    };

    setDoc(announcementRef, data)
      .then(() => {
        setIsAddAnnouncementOpen(false);
        setAnnouncementForm({ title: '', content: '' });
        toast({ title: 'Published', description: 'Announcement is live.' });
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
      .then(() => toast({ title: 'Updated', description: `Order is now ${newStatus}` }))
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="glass-panel w-full max-w-md p-8 space-y-8 rounded-[2rem] border-border shadow-xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-headline font-black uppercase italic tracking-tighter text-[#0a0c10]">ADMIN <span className="text-primary">ACCESS</span></h1>
            <p className="text-muted-foreground text-sm font-medium">Enter master password to access the hub.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="••••••••" 
              className="h-14 w-full text-center text-2xl tracking-[0.5em] bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full h-14 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20">
              AUTHORIZE
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const NavItems = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'products', icon: <Package className="w-5 h-5" />, label: 'Products' },
    { id: 'orders', icon: <ShoppingBag className="w-5 h-5" />, label: 'Orders' },
    { id: 'announcements', icon: <Bell className="w-5 h-5" />, label: 'Updates' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-border sticky top-0 z-[110]">
        <div className="flex flex-col leading-none">
          <span className="font-headline font-bold uppercase italic text-sm tracking-tighter text-[#0a0c10]">CASTRO<span className="text-primary">HUB</span></span>
          <span className="text-[6px] font-black uppercase tracking-widest text-muted-foreground">ADMIN HUB</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={cn(
        "fixed inset-0 z-[105] bg-white p-6 flex flex-col transition-transform md:relative md:translate-x-0 md:w-72 md:bg-white md:border-r md:border-border md:flex md:z-10",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="hidden md:flex flex-col mb-8 leading-none">
          <span className="font-headline font-bold uppercase italic text-xl tracking-tighter text-[#0a0c10]">
            CASTRO<span className="text-primary">HUB</span>
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">ADMIN HUB</span>
        </div>
        <nav className="space-y-2 flex-grow mt-12 md:mt-0 overflow-y-auto pr-2">
          {NavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-gray-100"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="pt-8 border-t border-border space-y-4">
          <Button variant="outline" className="w-full border-primary/20 text-primary rounded-xl" onClick={seedDatabase} disabled={isSaving}>
            <Database className="w-4 h-4 mr-2" /> SEED ARMORY
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-500 rounded-xl" onClick={() => setIsAuthenticated(false)}>
            <LogOut className="w-4 h-4 mr-2" /> LOGOUT
          </Button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col bg-gray-50/50 min-h-screen overflow-y-auto">
        <header className="p-4 md:p-8 border-b border-border bg-white sticky top-0 md:relative z-[100]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-headline font-black uppercase italic tracking-tighter text-[#0a0c10]">
              {activeTab} <span className="text-primary">Management</span>
            </h2>
            <div className="flex gap-2">
              {activeTab === 'products' && (
                <Button onClick={() => setIsAddProductOpen(true)} className="bg-primary text-white flex-grow sm:flex-none h-11 px-6 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                  <PlusCircle className="w-4 h-4 mr-2" /> ADD ITEM
                </Button>
              )}
              {activeTab === 'announcements' && (
                <Button onClick={() => setIsAddAnnouncementOpen(true)} className="bg-primary text-white flex-grow sm:flex-none h-11 px-6 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                  <Bell className="w-4 h-4 mr-2" /> NEW UPDATE
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12">
          <div className="glass-panel border-border bg-white rounded-2xl overflow-hidden shadow-sm">
            {activeTab === 'dashboard' && (
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                  <LayoutDashboard className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-black uppercase italic tracking-tighter">Command Center</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <Card className="p-6 rounded-2xl border-border bg-gray-50">
                    <div className="text-3xl font-black text-primary">{products?.length || 0}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Active Products</div>
                  </Card>
                  <Card className="p-6 rounded-2xl border-border bg-gray-50">
                    <div className="text-3xl font-black text-primary">{orders?.length || 0}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Total Orders</div>
                  </Card>
                  <Card className="p-6 rounded-2xl border-border bg-gray-50">
                    <div className="text-3xl font-black text-primary">{announcements?.length || 0}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">Announcements</div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="font-bold uppercase tracking-widest text-[10px]">Product</TableHead><TableHead className="hidden sm:table-cell font-bold uppercase tracking-widest text-[10px]">Category</TableHead><TableHead className="font-bold uppercase tracking-widest text-[10px]">Price</TableHead><TableHead className="text-right font-bold uppercase tracking-widest text-[10px]">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {products?.map((row: any) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-bold py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-border">{row.imageUrl && <img src={row.imageUrl} className="w-full h-full object-cover" />}</div>
                            <div className="truncate max-w-[120px] sm:max-w-[200px] text-xs uppercase tracking-tight">{row.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-[9px] uppercase font-bold">{row.categoryId}</Badge></TableCell>
                        <TableCell className="whitespace-nowrap font-headline font-bold text-xs">Rs. {Math.round(row.price).toLocaleString()}</TableCell>
                        <TableCell className="text-right"><Button onClick={() => deleteItem(row.id, 'products')} size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="font-bold uppercase tracking-widest text-[10px]">Customer</TableHead><TableHead className="font-bold uppercase tracking-widest text-[10px]">Total</TableHead><TableHead className="hidden sm:table-cell font-bold uppercase tracking-widest text-[10px]">Status</TableHead><TableHead className="text-right font-bold uppercase tracking-widest text-[10px]">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {orders?.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="py-4">
                          <div className="font-bold text-[11px] uppercase truncate max-w-[100px] sm:max-w-none">{order.customerName}</div>
                          <div className="text-[9px] text-muted-foreground">{order.customerPhoneNumber}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-headline font-bold text-xs">Rs. {Math.round(order.totalAmount).toLocaleString()}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Select defaultValue={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}>
                            <SelectTrigger className="h-8 text-[10px] w-28 rounded-lg"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Processing">Processing</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right"><Button onClick={() => deleteItem(order.id, 'orders')} size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="font-bold uppercase tracking-widest text-[10px]">Headline</TableHead><TableHead className="hidden sm:table-cell font-bold uppercase tracking-widest text-[10px]">Date</TableHead><TableHead className="text-right font-bold uppercase tracking-widest text-[10px]">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {announcements?.map((ann: any) => (
                      <TableRow key={ann.id}>
                        <TableCell className="font-bold truncate max-w-[200px] text-[11px] py-4 uppercase">{ann.title}</TableCell>
                        <TableCell className="hidden sm:table-cell text-[10px] uppercase text-muted-foreground">{ann.postedAt?.toDate ? ann.postedAt.toDate().toLocaleDateString() : 'Pending'}</TableCell>
                        <TableCell className="text-right"><Button onClick={() => deleteItem(ann.id, 'announcements')} size="icon" variant="ghost" className="text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Product Dialog - Re-Architected for Perfect Mobile Entry */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="w-[96vw] sm:max-w-[600px] max-h-[92vh] overflow-hidden flex flex-col p-0 rounded-2xl border-border bg-white shadow-2xl focus:outline-none">
          <div className="p-6 md:p-8 border-b border-border bg-white shrink-0">
            <DialogHeader>
              <DialogTitle className="font-headline font-black uppercase italic tracking-tighter text-xl text-[#0a0c10]">
                ADD NEW PRODUCT
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="product-name-input" className="text-[10px] uppercase font-black tracking-widest text-primary">Official Product Name</Label>
                <Input 
                  id="product-name-input" 
                  autoComplete="off"
                  autoFocus
                  value={productForm.name} 
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})} 
                  className="bg-gray-50 border-border h-12 rounded-xl text-base focus:ring-2 focus:ring-primary/20" 
                  placeholder="e.g. NVIDIA RTX 4090 OC" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Category</Label>
                  <Select value={productForm.category} onValueChange={(v) => setProductForm({...productForm, category: v})}>
                    <SelectTrigger className="bg-gray-50 border-border h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['GPU', 'Monitor', 'Console', 'Computer', 'Game'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Price (NPR)</Label>
                  <Input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="bg-gray-50 border-border h-12 rounded-xl text-base" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Stock Status</Label>
                  <Select value={productForm.stockStatus} onValueChange={(v) => setProductForm({...productForm, stockStatus: v})}>
                    <SelectTrigger className="bg-gray-50 border-border h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Limited Stock">Limited Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2"><Tag className="w-3 h-3" /> Badge Tag</Label>
                  <Input placeholder="HOT, NEW, etc." value={productForm.customTag} onChange={(e) => setProductForm({...productForm, customTag: e.target.value})} className="bg-gray-50 border-border h-12 rounded-xl text-base" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Short Description</Label>
                <Textarea value={productForm.shortDescription} onChange={(e) => setProductForm({...productForm, shortDescription: e.target.value})} className="bg-gray-50 border-border min-h-[100px] rounded-xl text-base" placeholder="Brief summary for display..." />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Product Image</Label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors bg-gray-50">
                  <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  {productForm.imageUrl ? (
                    <div className="relative group mx-auto w-full max-w-[240px]">
                      <img src={productForm.imageUrl} className="w-full rounded-lg shadow-lg border border-border" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"><p className="text-[10px] text-white font-bold">REPLACE IMAGE</p></div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-10 h-10 text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Tap to browse files</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 border-t border-border bg-white shrink-0">
            <DialogFooter>
              <Button onClick={saveProduct} disabled={isSaving} className="w-full h-14 bg-primary text-white font-black uppercase italic tracking-tighter text-lg rounded-xl shadow-lg shadow-primary/20">
                {isSaving ? <Loader2 className="animate-spin" /> : 'SAVE TO DATABASE'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Announcement Dialog */}
      <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
        <DialogContent className="w-[96vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-border bg-white focus:outline-none">
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader><DialogTitle className="font-headline font-black uppercase italic tracking-tighter text-xl text-[#0a0c10]">NEW UPDATE</DialogTitle></DialogHeader>
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Announcement Headline</Label>
                <Input value={announcementForm.title} onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} className="bg-gray-50 border-border h-12 rounded-xl text-base" placeholder="Enter headline" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Content Message</Label>
                <Textarea value={announcementForm.content} onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})} className="bg-gray-50 border-border min-h-[180px] rounded-xl text-base" placeholder="Write your message..." />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-border">
              <Button onClick={saveAnnouncement} disabled={isSaving} className="w-full h-14 bg-primary text-white font-black uppercase italic tracking-tighter text-lg rounded-xl shadow-lg shadow-primary/20">PUBLISH ANNOUNCEMENT</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
