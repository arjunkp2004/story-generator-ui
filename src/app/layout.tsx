"use client"; // Marking as a client component

import localFont from "next/font/local";
import "./globals.css";
import Header from "./reusable-components/Header"; // Import Header component
import Footer from "./reusable-components/Footer"; // Import Footer component
import { ReactNode } from "react";
import { usePathname } from "next/navigation"; // Hook to get the current route
import { metadata } from "./metadata"; // Import metadata

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname(); // Get current route

  const isLoginPage = pathname === "/login" || pathname === "/"; // Check if the current page is the login page

  // Ensure metadata values are always strings
  const title = String(metadata.title || "Default Title"); // Explicitly convert to string
  const description = String(
    metadata.description || "Default description for the app."
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white`}
      >
        {!isLoginPage && <Header />} {/* Conditionally render Header */}
        <main className="flex-grow">{children}</main>
        {!isLoginPage && <Footer />} {/* Conditionally render Footer */}
      </body>
    </html>
  );
}
