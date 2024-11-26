"use client";

import { NextUIProvider, ScrollShadow } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/NavBar";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      <NextUIProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <NavBar />
          <ScrollShadow>{children}</ScrollShadow>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
