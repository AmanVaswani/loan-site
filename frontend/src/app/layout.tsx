import type { Metadata } from "next";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Loan ki Baat — The cheapest loan you actually qualify for",
  description: "Compare live interest rates from 25+ banks and NBFCs across personal, home, business, car, education and gold loans. Free EMI tools, zero fees for borrowers.",
  keywords: "loan, personal loan, home loan, business loan, car loan, education loan, gold loan, low interest rate, quick approval, India",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/ledger.css" />
      </head>
      <body className="antialiased bg-[#F5F0E4] text-[#12261B]">
        <GoogleAnalytics />
        <ConditionalHeader />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
