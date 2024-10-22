import { Navbar } from "@/components/navbar";
import TRPCProvider from "@/components/provider/trpc-provider";
import { cn, constructMetadata } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased grainy",
          inter.className,
        )}
      >
        <ClerkProvider>
          <TRPCProvider>
            <SessionProvider>
              <Navbar />
              {children}
              <Toaster />
            </SessionProvider>
          </TRPCProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
