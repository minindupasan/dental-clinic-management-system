"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
