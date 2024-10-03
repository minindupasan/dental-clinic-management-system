import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import React from "react";

import { fontSans } from "@/config/fonts";
import NavBar from "../components/NavBar";

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
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "themeColor min-h-screen bg-foreground font-sans antialiased",
          fontSans.variable
        )}
      >
        {" "}
        <NavBar />
        <main className={clsx("mx-6")}>{children}</main>
      </body>
    </html>
  );
}
