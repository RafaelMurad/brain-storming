import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FrontendForge - Learn Frontend Development with AI",
  description: "Master modern frontend technologies through AI-generated exercises and real GitHub projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
