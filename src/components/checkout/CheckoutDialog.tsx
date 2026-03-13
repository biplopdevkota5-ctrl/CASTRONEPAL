"use client";

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Loader2, CheckCircle2, MessageCircle } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { sendOrderToDiscord, getWhatsAppOrderLink } from '@/app/actions/notifications';

interface CheckoutDialogProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  children: React.ReactNode;
}

export function CheckoutDialog({ product, children }: CheckoutDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [waLink, setWaLink] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    quantity: '1',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderId = doc(collection(db, 'orders')).id;
    const orderRef = doc(db, 'orders', orderId);
    const totalPrice = product.price * parseInt(formData.quantity || '1');

    const orderData = {
      id: orderId,
      userId: user?.uid || null,
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhoneNumber: formData.phone,
      customerAddress: formData.address,
      notes: formData.notes,
      orderTime: serverTimestamp(),
      totalAmount: totalPrice,
      status: 'Pending',
      discordWebhookSent: false
    };

    try {
      await setDoc(orderRef, orderData);
      
      const discordSuccess = await sendOrderToDiscord({
        id: orderId,
        productName: product.name,
        quantity: formData.quantity,
        totalAmount: totalPrice,
        customerName: formData.fullName,
        customerPhoneNumber: formData.phone,
        customerEmail: formData.email,
        customerAddress: formData.address,
        notes: formData.notes
      });

      if (discordSuccess) {
        await updateDoc(orderRef, { discordWebhookSent: true });
      }

      const link = await getWhatsAppOrderLink({
        productName: product.name,
        quantity: formData.quantity,
        totalAmount: totalPrice,
        customerName: formData.fullName,
        customerPhoneNumber: formData.phone
      });
      setWaLink(link);

      setIsSuccess(true);
      toast({
        title: "Order Placed!",
        description: "Admin notified via Discord and WhatsApp portal ready.",
      });
    } catch (error: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: orderRef.path,
        operation: 'create',
        requestResourceData: orderData
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] w-[96vw] max-h-[85vh] overflow-y-auto overflow-x-hidden bg-[#050505] text-white border-white/5 p-0 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_0_50px_rgba(255,0,0,0.15)] focus:outline-none scrollbar-hide">
        {isSuccess ? (
          <div className="p-6 md:p-10 flex flex-col items-center text-center space-y-5">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mb-1">
              <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 text-primary animate-in zoom-in" />
            </div>
            <h2 className="text-xl md:text-3xl font-headline font-bold uppercase italic tracking-tighter text-white">ORDER PLACED!</h2>
            <p className="text-xs md:text-base text-white/60 max-w-sm">
              We have received your order. To complete your purchase, click the button below to message our admin on WhatsApp.
            </p>
            <div className="flex flex-col gap-3 w-full pt-2">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black w-full h-12 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 italic text-sm md:text-lg">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                  CONFIRM ON WHATSAPP
                </Button>
              </a>
              <Button 
                variant="outline"
                className="border-white/10 hover:bg-white/5 text-white font-bold w-full h-12 rounded-xl"
                onClick={() => {
                  setIsOpen(false);
                  setIsSuccess(false);
                  setFormData({ fullName: '', phone: '', email: '', address: '', quantity: '1', notes: '' });
                }}
              >
                BACK TO SHOP
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-5 md:space-y-6 touch-pan-y">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg md:text-2xl font-headline font-bold uppercase italic tracking-tighter flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Checkout <span className="text-primary">Portal</span>
              </DialogTitle>
              <DialogDescription className="text-white/40 text-[10px] md:text-sm">
                Ordering: <strong className="text-white">{product.name}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-[9px] uppercase font-black tracking-[0.15em] text-primary">Full Name</Label>
                <Input id="fullName" required className="bg-white/5 border-white/10 rounded-lg h-10 md:h-12 text-white text-xs md:text-sm placeholder:text-white/20 focus:ring-primary/50" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[9px] uppercase font-black tracking-[0.15em] text-primary">Phone Number</Label>
                <Input id="phone" required type="tel" className="bg-white/5 border-white/10 rounded-lg h-10 md:h-12 text-white text-xs md:text-sm placeholder:text-white/20 focus:ring-primary/50" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[9px] uppercase font-black tracking-[0.15em] text-primary">Email Address</Label>
                <Input id="email" required type="email" className="bg-white/5 border-white/10 rounded-lg h-10 md:h-12 text-white text-xs md:text-sm placeholder:text-white/20 focus:ring-primary/50" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quantity" className="text-[9px] uppercase font-black tracking-[0.15em] text-primary">Quantity</Label>
                <Input id="quantity" required type="number" min="1" className="bg-white/5 border-white/10 rounded-lg h-10 md:h-12 text-white text-xs md:text-sm placeholder:text-white/20 focus:ring-primary/50" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="address" className="text-[9px] uppercase font-black tracking-[0.15em] text-primary">Full Address</Label>
                <Input id="address" required placeholder="Sitapaila, Kathmandu..." className="bg-white/5 border-white/10 rounded-lg h-10 md:h-12 text-white text-xs md:text-sm placeholder:text-white/20 focus:ring-primary/50" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="notes" className="text-[9px] uppercase font-black tracking-[0.15em] text-primary">Order Notes (Optional)</Label>
                <Textarea id="notes" className="bg-white/5 border-white/10 rounded-lg min-h-[60px] md:min-h-[80px] text-white text-xs md:text-sm placeholder:text-white/20 focus:ring-primary/50" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5 pb-2">
              <div className="flex-grow flex items-center justify-between sm:justify-start gap-4">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Grand Total</div>
                  <div className="text-lg md:text-2xl font-headline font-black italic text-white">Rs. {Math.round(product.price * parseInt(formData.quantity || '1')).toLocaleString()}</div>
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white font-black h-12 md:h-16 px-8 rounded-xl md:rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.3)] min-w-[150px] text-sm md:text-lg italic uppercase tracking-tighter">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'CONFIRM ORDER'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}