
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Gamepad2, Mail, Lock, LogIn, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth logic handled by Firebase (not implemented in this visual draft)
    alert("Authentication feature is coming soon!");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-[450px] relative">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to Site
        </Link>

        <Card className="glass-panel border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardHeader className="text-center space-y-6 pt-12 pb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Gamepad2 className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-headline font-black uppercase italic tracking-tighter">
                Welcome <span className="text-primary">Back</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">Access your gaming portal and orders.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <Button variant="outline" className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 font-bold rounded-xl flex gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-background px-4 text-muted-foreground">Or manual login</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase font-bold tracking-widest text-muted-foreground ml-1">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@gmail.com" 
                    className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Password</Label>
                  <Link href="#" className="text-[10px] uppercase font-bold text-primary hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50" 
                    required 
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl neon-border">
                <LogIn className="w-5 h-5 mr-2" />
                SIGN IN
              </Button>
            </form>
          </CardContent>
          <CardFooter className="px-8 pb-10 justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Join Now</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
