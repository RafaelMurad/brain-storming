import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MealPlanAI - Smart Meal Planning",
  description: "AI-powered meal planning with personalized recipes and grocery lists",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
