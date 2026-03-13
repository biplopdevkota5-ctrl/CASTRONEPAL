import type {Metadata} from 'next';
import { Poppins, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { FloatingCallButton } from '@/components/ui/FloatingCallButton';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Castro Nepal | Nepal’s Trusted Gaming & Hardware Store',
  description: 'Buy Gaming Hardware, GPUs, Monitors and Digital Redeem Codes in Nepal. Secure, fast, and professional retail service.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased bg-white text-foreground min-h-screen flex flex-col gaming-grid">
        <FirebaseClientProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingCallButton />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
