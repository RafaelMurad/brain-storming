import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SplitPay - Smart Bill Splitting for Restaurants",
  description: "QR-based bill splitting and payment system for restaurants",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
