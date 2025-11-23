import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkBio - One Link for Everything",
  description: "Create a beautiful link-in-bio page for your social media",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
