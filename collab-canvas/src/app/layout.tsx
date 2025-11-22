import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CollabCanvas - Real-time Collaborative Whiteboard",
  description: "Draw, create, and collaborate in real-time with your team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
