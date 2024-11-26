"use client";

import { ReactNode } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogOutButtton";
import NavBar from "@/components/NavBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <main>
        <NavBar />
        {children}
      </main>
    </div>
  );
}
