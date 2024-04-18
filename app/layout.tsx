import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";

import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";

import { Analytics } from "@vercel/analytics/react";

const font = Rajdhani({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "enalotto",
  description: "a system to break the lottery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
