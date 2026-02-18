import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VSMS Assessment System - Occupational Therapy Foundation",
  description: "Clinical assessment system for Vineland Social Maturity Scale (VSMS) - Occupational Therapy Foundation, Erode.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
