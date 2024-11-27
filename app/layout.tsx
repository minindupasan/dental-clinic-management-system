import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import React from "react";
import { fontSans } from "@/config/fonts";
import { Toaster } from "react-hot-toast";
import { Provider } from "./Provider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider session={session}>
          <div className="relative flex flex-col h-screen">
            <main className={clsx("flex-grow mx-4 md:mx-6 lg:mx-10")}>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 3000,
                  },
                }}
              />
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
