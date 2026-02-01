import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoanEase - Best Loan Rates in India | Personal, Home, Business Loans",
  description: "Get the lowest interest rates on personal loans, home loans, business loans, car loans & more. Quick approval, minimal documentation. 10-20% cashback on first 3 EMIs!",
  keywords: "loan, personal loan, home loan, business loan, car loan, education loan, gold loan, low interest rate, quick approval, India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
