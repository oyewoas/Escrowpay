import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "@/context";

export const metadata: Metadata = {
  title: "EscrowPay - Secure Freelance Payments",
  description:
    "Secure escrow platform for freelance payments with smart contract protection",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ContextProvider cookies={cookies}>
          <Suspense fallback={null}>{children}</Suspense>
        </ContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
