
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingCallButton() {
  return (
    <a 
      href="tel:9702663187"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Call Support"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <Button 
        size="icon" 
        className="relative h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl text-white"
      >
        <Phone className="w-6 h-6 animate-pulse" />
      </Button>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-card border border-white/10 px-3 py-1 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
        Call Support
      </span>
    </a>
  );
}
