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
import { ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { sendOrderToDiscord } from '@/app/actions/notifications';

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

    setDoc(orderRef, orderData)
      .then(async () => {
        // Send notification to Discord via Server Action
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

        // Update flag in database if webhook sent successfully
        if (discordSuccess) {
          updateDoc(orderRef, { discordWebhookSent: true }).catch(() => {});
        }

        setIsSuccess(true);
        toast({
          title: "Order Placed Successfully!",
          description: "Our armory has received your request.",
        });
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: orderRef.path,
          operation: 'create',
          requestResourceData: orderData
        }));
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] glass-panel border-white/10 p-0 overflow-hidden rounded-[2rem]">
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 animate-in zoom-in" />
            </div>
            <h2 className="text-3xl font-headline font-bold uppercase italic tracking-tighter">ORDER CONFIRMED!</h2>
            <p className="text-muted-foreground max-w-sm">
              Thank you for choosing Castro Nepal. We'll contact you at <strong>{formData.phone}</strong> for payment and delivery within 30 minutes.
            </p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-bold w-full h-12 rounded-xl"
              onClick={() => {
                setIsOpen(false);
                setIsSuccess(false);
                setFormData({ fullName: '', phone: '', email: '', address: '', quantity: '1', notes: '' });
              }}
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-bold uppercase italic tracking-tighter flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                Checkout <span className="text-primary">Details</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Finalize your order for <strong>{product.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Full Name</Label>
                <Input id="fullName" required className="bg-white/5 border-white/10 rounded-xl" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Phone Number</Label>
                <Input id="phone" required type="tel" className="bg-white/5 border-white/10 rounded-xl" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Email Address</Label>
                <Input id="email" required type="email" className="bg-white/5 border-white/10 rounded-xl" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Quantity</Label>
                <Input id="quantity" required type="number" min="1" className="bg-white/5 border-white/10 rounded-xl" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Full Address</Label>
                <Input id="address" required className="bg-white/5 border-white/10 rounded-xl" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Order Notes (Optional)</Label>
                <Textarea id="notes" className="bg-white/5 border-white/10 rounded-xl min-h-[100px]" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-4">
              <div className="flex-grow flex items-center justify-between text-lg font-bold">
                <span className="text-muted-foreground font-medium text-sm">TOTAL:</span>
                <span className="text-primary font-headline italic">Rs. {Math.round(product.price * parseInt(formData.quantity || '1')).toLocaleString()}</span>
              </div>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-xl neon-border min-w-[200px]">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'CONFIRM ORDER'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
