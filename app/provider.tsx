"use client";

import { NextUIProvider, ScrollShadow } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/NavBar";
import { Toaster } from "react-hot-toast";

export function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <NavBar />
          {children}
          <Toaster position="top-right" />
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
