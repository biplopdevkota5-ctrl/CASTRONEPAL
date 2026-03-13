
import type {Metadata} from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { FloatingCallButton } from '@/components/ui/FloatingCallButton';

export const metadata: Metadata = {
  title: 'Castro Nepal | Nepal’s Trusted Gaming Redeem Code Store',
  description: 'Buy PlayStation, Xbox, Nintendo, and Steam redeem codes instantly in Nepal. Secure and fast gaming products e-commerce.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col gaming-grid">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingCallButton />
        <Toaster />
      </body>
    </html>
  );
}
