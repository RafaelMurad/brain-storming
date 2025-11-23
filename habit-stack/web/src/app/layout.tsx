import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HabitStack - Build Better Habits",
  description: "Track your habits, build streaks, and transform your life",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
