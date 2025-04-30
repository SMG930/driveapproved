import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DriveApproved - AI-Powered Auto Financing",
  description: "Streamline your financing process with our advanced AI platform.",
};

// Placeholder Logo Component
const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <span className="font-bold text-xl">Drive Approved</span>
  </div>
);

// Header Component
const Header = () => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <Link href="/">
        <Logo />
      </Link>
      {/* Placeholder for mobile menu button */}
      <button className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      {/* Placeholder for desktop navigation */}
      <div className="hidden md:flex space-x-4">
        {/* Add navigation links here if needed */}
      </div>
    </nav>
  </header>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Header />
        {children}
        {/* Add Footer here if needed */}
      </body>
    </html>
  );
}

