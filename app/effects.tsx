"use client";

import { ScrollShadow } from "@nextui-org/react";
import { useEffect, useState } from "react";

export function Effects({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <ScrollShadow>{children}</ScrollShadow>;
}
