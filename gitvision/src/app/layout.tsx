import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "GitVision - GitHub Repository Intelligence Dashboard",
  description:
    "Visualize and manage all your GitHub repositories in one place. Interactive architecture canvas, deployment triggers, commit history, and documentation viewer.",
  keywords: [
    "GitHub",
    "repositories",
    "dashboard",
    "architecture",
    "visualization",
    "developer tools",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
