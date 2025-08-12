import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/util/QueryProvider";
import "./globals.css";
import { Birthstone } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const birthstone = Birthstone({
  weight: "400",
  subsets: ["latin"],

});

export const metadata: Metadata = {
  title: "Salvatorre Inmuebles",
  description: "Inmuebleria de confianza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${
          (geistSans.variable, birthstone)
        }} font-sans, font-birthstone`}
      >
        <QueryProvider>
          <Navbar />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
