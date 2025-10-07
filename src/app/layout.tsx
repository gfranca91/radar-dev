import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Radar Dev",
  description: "Seu blog de notícias de tecnologia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white flex flex-col min-h-screen`}
      >
        <Header />
        <main className="container mx-auto p-4 flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
