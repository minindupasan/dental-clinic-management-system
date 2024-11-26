"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import NavBarTabs from "./NavBarTabs";
import MenuBar from "./MenuBar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabClick = (path: string) => {
    console.log(`Tab clicked: ${path}`);
  };

  if (!mounted) return null;

  return (
    <Navbar className="w-full py-2 px-4">
      <NavbarContent className="flex-1">
        <NavbarBrand>
          <MenuBar />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex-1 hidden lg:flex justify-center">
        <NavBarTabs onTabClick={handleTabClick} currentPath={pathname} />
      </NavbarContent>

      <NavbarContent className="flex-1 justify-end gap-4">
        <Button
          isIconOnly
          variant="light"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </Button>

        <Button
          as={Link}
          href="/login"
          variant="flat"
          className="hidden md:flex"
        >
          Login
        </Button>
      </NavbarContent>
    </Navbar>
  );
}
