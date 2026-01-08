import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from '@/components/providers/Web3Provider'

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chibbi-Cyrene NFT",
  description: "A premium NFT collection on Sepolia testnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
