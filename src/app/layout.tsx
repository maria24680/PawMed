import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';    

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PawMed - Veterinary Clinic',
  description: 'Pet clinic management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-[#F8FAFC]">
          {children}
        </main>
        <Footer />    
        <Toaster position="top-right" />
      </body>
    </html>
  );
}