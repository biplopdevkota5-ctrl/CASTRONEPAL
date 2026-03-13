
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
  Gamepad2,
  Upload,
  Loader2,
  Database,
  Tag
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
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();

  // Queries wait for both password auth AND firebase auth user object to be ready
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
    category: 'PlayStation',
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
        setProductForm({ name: '', category: 'PlayStation', price: '', stockStatus: 'In Stock', customTag: '', shortDescription: '', fullDescription: '', imageUrl: '' });
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
    const sampleProducts = [
      { name: "PSN $50 Gift Card", categoryId: "PlayStation", price: 6650, stockStatus: "In Stock", customTag: "POPULAR", shortDescription: "Instant digital code for US accounts.", imageUrl: "https://picsum.photos/seed/psn1/400/600" },
      { name: "Xbox $25 Card", categoryId: "Xbox", price: 3400, stockStatus: "In Stock", customTag: "HOT", shortDescription: "Global digital code for Xbox Store.", imageUrl: "https://picsum.photos/seed/xbox1/400/600" },
      { name: "RTX 4090 GPU", categoryId: "GPU", price: 285000, stockStatus: "In Stock", customTag: "NEW", shortDescription: "The ultimate gaming graphics card.", imageUrl: "https://picsum.photos/seed/gpu1/400/600" }
    ];

    try {
      for (const p of sampleProducts) {
        const id = doc(collection(db, 'products')).id;
        await setDoc(doc(db, 'products', id), { 
          ...p, 
          id, 
          fullDescription: p.shortDescription,
          availability: true,
          isFeatured: true,
          viewCount: 0,
          purchaseCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp() 
        });
      }
      toast({ title: "Database Seeded", description: "Sample products added." });
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
          <Button variant="outline" className="w-full border-primary/20 text-primary" onClick={seedDatabase} disabled={isSaving}>
            <Database className="w-4 h-4 mr-2" /> SEED STORE
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-500" onClick={() => setIsAuthenticated(false)}>
            <LogOut className="w-4 h-4 mr-2" /> LOGOUT
          </Button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-12 space-y-8 bg-black/20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-headline font-black uppercase italic tracking-tighter">
              {activeTab} <span className="text-primary">Management</span>
            </h2>
          </div>
          <div className="flex gap-4">
            {activeTab === 'products' && <Button onClick={() => setIsAddProductOpen(true)} className="bg-primary text-white"><Plus className="w-4 h-4 mr-2" /> ADD PRODUCT</Button>}
            {activeTab === 'announcements' && <Button onClick={() => setIsAddAnnouncementOpen(true)} className="bg-primary text-white"><Plus className="w-4 h-4 mr-2" /> NEW UPDATE</Button>}
          </div>
        </header>

        <div className="glass-panel border-white/5 rounded-2xl overflow-hidden">
          {activeTab === 'products' && (
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Tag</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {products?.map((row: any) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 overflow-hidden">{row.imageUrl && <img src={row.imageUrl} className="w-full h-full object-cover" />}</div>
                        <div>{row.name}</div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{row.categoryId}</Badge></TableCell>
                    <TableCell>Rs. {Math.round(row.price).toLocaleString()}</TableCell>
                    <TableCell>{row.customTag ? <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">{row.customTag}</Badge> : '-'}</TableCell>
                    <TableCell><Badge className={row.stockStatus === 'In Stock' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>{row.stockStatus}</Badge></TableCell>
                    <TableCell className="text-right"><Button onClick={() => deleteItem(row.id, 'products')} size="icon" variant="ghost"><Trash2 className="w-4 h-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === 'orders' && (
            <Table>
              <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {orders?.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.customerName}<div className="text-[10px] text-muted-foreground">{order.customerPhoneNumber}</div></TableCell>
                    <TableCell>Rs. {Math.round(order.totalAmount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Select defaultValue={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}>
                        <SelectTrigger className="h-8 text-[10px]"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Processing">Processing</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right"><Button onClick={() => deleteItem(order.id, 'orders')} size="icon" variant="ghost"><Trash2 className="w-4 h-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activeTab === 'announcements' && (
            <Table>
              <TableHeader><TableRow><TableHead>Headline</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {announcements?.map((ann: any) => (
                  <TableRow key={ann.id}>
                    <TableCell className="font-bold">{ann.title}</TableCell>
                    <TableCell>{ann.postedAt?.toDate ? ann.postedAt.toDate().toLocaleDateString() : 'Pending'}</TableCell>
                    <TableCell><Badge className={ann.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}>{ann.isActive ? 'Active' : 'Hidden'}</Badge></TableCell>
                    <TableCell className="text-right"><Button onClick={() => deleteItem(ann.id, 'announcements')} size="icon" variant="ghost"><Trash2 className="w-4 h-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[600px]">
          <DialogHeader><DialogTitle>UPLOAD PRODUCT</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="col-span-2 space-y-2">
              <Label>Product Name</Label>
              <Input value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={productForm.category} onValueChange={(v) => setProductForm({...productForm, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['PlayStation', 'Xbox', 'Steam', 'Nintendo', 'GPU', 'PC', 'Mobile'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price (NPR)</Label>
              <Input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Stock Status</Label>
              <Select value={productForm.stockStatus} onValueChange={(v) => setProductForm({...productForm, stockStatus: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Limited Stock">Limited Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Tag className="w-3 h-3" /> Custom Tag (e.g. HOT, NEW)</Label>
              <Input placeholder="Leave empty if none" value={productForm.customTag} onChange={(e) => setProductForm({...productForm, customTag: e.target.value})} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Short Description</Label>
              <Textarea value={productForm.shortDescription} onChange={(e) => setProductForm({...productForm, shortDescription: e.target.value})} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Image (Paste or Browse)</Label>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer">
                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                {productForm.imageUrl ? <img src={productForm.imageUrl} className="max-h-[120px] mx-auto rounded-lg" /> : <Upload className="w-10 h-10 mx-auto text-muted-foreground" />}
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={saveProduct} disabled={isSaving} className="w-full">{isSaving ? <Loader2 className="animate-spin" /> : 'UPLOAD PRODUCT'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[500px]">
          <DialogHeader><DialogTitle>PUBLISH UPDATE</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2"><Label>Headline</Label><Input value={announcementForm.title} onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})} /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea value={announcementForm.content} onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})} /></div>
          </div>
          <DialogFooter><Button onClick={saveAnnouncement} disabled={isSaving} className="w-full">PUBLISH NOW</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
