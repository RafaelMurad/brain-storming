import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowMatic - Visual Workflow Automation",
  description: "Build powerful automation workflows with a visual drag-and-drop editor",
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
