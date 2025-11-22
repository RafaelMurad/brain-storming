import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptLab - AI Prompt Analysis Platform",
  description: "Analyze, rate, and optimize your AI prompts for better performance",
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
