import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import React from "react";
import { Providers } from "./Providers";
import { fontSans } from "@/config/fonts";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/NavBar";
import { SessionProvider } from "../app/SessionProvider";

export const metadata: Metadata = {
  title: "DentCare+",
  description: "A Project by Beatles",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
            },
          }}
        />
        <SessionProvider>
          <Providers>
            <NavBar />
            <div className="relative flex flex-col h-screen">
              <main className={clsx("flex-grow mx-4 md:mx-6 lg:mx-10")}>
                {children}
              </main>
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
