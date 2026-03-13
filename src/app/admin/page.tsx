
"use client";

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Bell, 
  Plus, 
  Settings, 
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
  ArrowRight
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
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'announcements'>('dashboard');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);

  // Mock Global State
  const [products, setProducts] = useState([
    { id: '1', name: "PS Plus 12-Month", category: "PlayStation", price: "15958", status: "In Stock" },
    { id: '2', name: "Xbox Game Pass", category: "Xbox", price: "7978", status: "In Stock" },
    { id: '3', name: "Steam Wallet $50", category: "Steam", price: "6650", status: "Low Stock" },
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: '1', title: "PS Plus Back in Stock!", date: "2024-02-24", content: "The most awaited subscription cards are back." },
    { id: '2', title: "New Year Sale Ends Soon", date: "2024-02-20", content: "Last chance to grab 20% off on all gift cards." },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '901020304050') {
      setIsAuthenticated(true);
    } else {
      alert("Invalid Admin Password");
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
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
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
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

        {/* Dynamic Section Based on Tab */}
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
                  {products.map((row, i) => (
                    <TableRow key={row.id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-bold py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">#{i + 1}</div>
                          <div>
                            <div className="text-sm">{row.name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono uppercase">SKU: CST-{row.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/10 text-xs font-bold">{row.category}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-white">Rs. {parseInt(row.price).toLocaleString()}</TableCell>
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
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white"><Edit className="w-4 h-4" /></Button>
                          <Button onClick={() => deleteProduct(row.id)} size="icon" variant="ghost" className="h-8 w-8 text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
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
              {announcements.length === 0 ? (
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
                        <Button onClick={() => deleteAnnouncement(ann.id)} size="icon" variant="ghost" className="text-red-500/50 hover:text-red-500 -mt-2 -mr-2">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                      <div className="pt-2 flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-lg h-8 px-4 text-xs font-bold">EDIT</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Order ID</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Customer</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Product</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="uppercase font-bold text-xs tracking-widest text-muted-foreground text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "ORD-9920", customer: "Rahul Sharma", product: "PS Plus 12-Month", status: "New" },
                  { id: "ORD-9919", customer: "Suman Giri", product: "Steam Wallet $50", status: "Processing" },
                  { id: "ORD-9918", customer: "Anjali KC", product: "Xbox Pass", status: "Completed" },
                ].map((order, i) => (
                  <TableRow key={i} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-mono text-xs">{order.id}</TableCell>
                    <TableCell className="font-bold">{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[10px] uppercase",
                        order.status === 'New' ? "bg-red-500/10 text-red-500" : order.status === 'Completed' ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                      )}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-bold">VIEW</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Product Modals */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[600px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold uppercase italic tracking-tighter">ADD NEW <span className="text-primary">PRODUCT</span></DialogTitle>
            <DialogDescription className="text-muted-foreground">Add a new digital asset to your store inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</Label>
              <Input placeholder="e.g. PlayStation Store $50" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
              <Input placeholder="e.g. PlayStation" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price (NPR)</Label>
              <Input type="number" placeholder="6650" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
              <Textarea placeholder="Detailed product information..." className="bg-white/5 border-white/10 min-h-[100px]" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Image</Label>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground group-hover:text-primary" />
                <p className="text-sm text-muted-foreground">Drop image here or click to browse</p>
                <p className="text-[10px] text-muted-foreground/50">Supports JPG, PNG (Max 5MB)</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddProductOpen(false)} variant="ghost" className="rounded-xl">CANCEL</Button>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8" onClick={() => setIsAddProductOpen(false)}>SAVE PRODUCT</Button>
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
              <Input placeholder="e.g. New Steam Codes Added" className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content</Label>
              <Textarea placeholder="Write your announcement details here..." className="bg-white/5 border-white/10 min-h-[150px]" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddAnnouncementOpen(false)} variant="ghost" className="rounded-xl">CANCEL</Button>
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8" onClick={() => setIsAddAnnouncementOpen(false)}>POST UPDATE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
