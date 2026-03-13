
"use client";

import { useState, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Bell, 
  Plus, 
  LogOut, 
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Gamepad2,
  X,
  Upload,
  Loader2
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
import { useFirestore, useCollection } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
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

  // Firestore Collections
  const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const { data: products, loading: productsLoading } = useCollection<any>(productsQuery);

  const announcementsQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
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
      setIsAuthenticated(true);
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
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) handleImageUpload(file);
      }
    }
  }, []);

  const saveProduct = () => {
    if (!productForm.name || !productForm.price) return;
    setIsSaving(true);
    const productId = doc(collection(db, 'products')).id;
    const productRef = doc(db, 'products', productId);
    
    const data = {
      ...productForm,
      id: productId,
      price: parseFloat(productForm.price),
      createdAt: serverTimestamp()
    };

    setDoc(productRef, data)
      .then(() => {
        setIsAddProductOpen(false);
        setProductForm({ name: '', category: 'PlayStation', price: '', status: 'In Stock', description: '', imageUrl: '' });
        toast({ title: 'Product Added', description: `${data.name} is now live.` });
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

  const saveAnnouncement = () => {
    if (!announcementForm.title || !announcementForm.content) return;
    setIsSaving(true);
    const annId = doc(collection(db, 'announcements')).id;
    const annRef = doc(db, 'announcements', annId);
    
    const data = {
      ...announcementForm,
      id: annId,
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: serverTimestamp()
    };

    setDoc(annRef, data)
      .then(() => {
        setIsAddAnnouncementOpen(false);
        setAnnouncementForm({ title: '', content: '' });
        toast({ title: 'Update Posted', description: 'The announcement is now visible.' });
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: annRef.path,
          operation: 'create',
          requestResourceData: data
        }));
      })
      .finally(() => setIsSaving(false));
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

        <div className="pt-8 border-t border-white/5">
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
            <p className="text-muted-foreground">Manage your store operations and inventory.</p>
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
                POST UPDATE
              </Button>
            )}
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-white/5 p-8 space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Revenue</span>
              <div className="text-3xl font-headline font-bold text-primary">Rs. 248,500</div>
              <div className="text-xs text-green-500 font-bold">+12% from last month</div>
            </Card>
            <Card className="glass-panel border-white/5 p-8 space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Orders</span>
              <div className="text-3xl font-headline font-bold">142</div>
              <div className="text-xs text-green-500 font-bold">+5 new today</div>
            </Card>
            <Card className="glass-panel border-white/5 p-8 space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Stock Status</span>
              <div className="text-3xl font-headline font-bold text-secondary">Healthy</div>
              <div className="text-xs text-muted-foreground">{products.length} products listed</div>
            </Card>
          </div>
        )}

        <div className="glass-panel border-white/5 rounded-2xl overflow-hidden">
          {activeTab === 'products' && (
            <>
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="relative max-w-sm w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-10 h-10 bg-white/5 border-white/10 rounded-lg" />
                </div>
              </div>
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
                  ) : products.map((row, i) => (
                    <TableRow key={row.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-bold py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary overflow-hidden">
                            {row.imageUrl ? <img src={row.imageUrl} className="w-full h-full object-cover" /> : `#${i + 1}`}
                          </div>
                          <div>
                            <div className="text-sm">{row.name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono uppercase">SKU: CST-{row.id.slice(0, 5)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/10 text-xs font-bold">{row.category}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-white">Rs. {Math.round(row.price).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {row.status === 'In Stock' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                          <span className={cn(
                            "text-xs font-bold uppercase",
                            row.status === 'In Stock' ? "text-green-500" : row.status === 'Out of Stock' ? "text-red-500" : "text-yellow-500"
                          )}>{row.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button onClick={() => deleteItem(row.id, 'products')} size="icon" variant="ghost" className="h-8 w-8 text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {activeTab === 'announcements' && (
            <div className="p-8 space-y-6">
              {announcementsLoading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : announcements.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No updates posted yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {announcements.map((ann) => (
                    <Card key={ann.id} className="bg-white/5 border-white/10 p-6 space-y-4 hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] uppercase">{ann.date}</Badge>
                          <h4 className="text-xl font-headline font-bold uppercase italic">{ann.title}</h4>
                        </div>
                        <Button onClick={() => deleteItem(ann.id, 'announcements')} size="icon" variant="ghost" className="text-red-500/50 hover:text-red-500 -mt-2 -mr-2">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Product Modals */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[600px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold uppercase italic tracking-tighter">ADD NEW <span className="text-primary">PRODUCT</span></DialogTitle>
            <DialogDescription className="text-muted-foreground">Add a new asset to your store. You can paste an image (Ctrl+V) here.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</Label>
              <Input 
                placeholder="e.g. NVIDIA RTX 4090" 
                className="bg-white/5 border-white/10" 
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
              <Select value={productForm.category} onValueChange={(v) => setProductForm({...productForm, category: v})}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PlayStation">PlayStation</SelectItem>
                  <SelectItem value="Xbox">Xbox</SelectItem>
                  <SelectItem value="Steam">Steam</SelectItem>
                  <SelectItem value="Nintendo">Nintendo</SelectItem>
                  <SelectItem value="GPU">GPU</SelectItem>
                  <SelectItem value="PC">Gaming PC</SelectItem>
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
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
              <Textarea 
                placeholder="Detailed product information..." 
                className="bg-white/5 border-white/10 min-h-[100px]" 
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Image (File or Paste)</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group relative min-h-[150px] flex flex-col items-center justify-center"
              >
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} 
                />
                {productForm.imageUrl ? (
                  <img src={productForm.imageUrl} className="max-h-[120px] rounded-lg" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground group-hover:text-primary" />
                    <p className="text-sm text-muted-foreground">Drop image here, click to browse, or <strong>Paste (Ctrl+V)</strong></p>
                    <p className="text-[10px] text-muted-foreground/50">Supports JPG, PNG (Max 3MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddProductOpen(false)} variant="ghost" className="rounded-xl">CANCEL</Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8" 
              onClick={saveProduct}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              SAVE PRODUCT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Announcement Modal */}
      <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[500px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold uppercase italic tracking-tighter">POST <span className="text-primary">UPDATE</span></DialogTitle>
            <DialogDescription className="text-muted-foreground">This will be visible on the store's homepage for all users.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Update Title</Label>
              <Input 
                placeholder="e.g. New Steam Codes Added" 
                className="bg-white/5 border-white/10" 
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content</Label>
              <Textarea 
                placeholder="Write your announcement details here..." 
                className="bg-white/5 border-white/10 min-h-[150px]" 
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddAnnouncementOpen(false)} variant="ghost" className="rounded-xl">CANCEL</Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8" 
              onClick={saveAnnouncement}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              POST UPDATE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
