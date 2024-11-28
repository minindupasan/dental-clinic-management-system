"use client";

import { usePathname } from "next/navigation";
import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import NavBarTabs from "./NavBarTabs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import SignInButton from "./SignInButton";
import { DentCareLogo } from "./icons/DentCareLogo";

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
    <Navbar className="py-2 border-b" maxWidth="full" isBordered>
      <NavbarContent className="flex-1">
        <NavbarBrand>
          <DentCareLogo />
          <p className="font-bold text-inherit hidden sm:block ml-2">
            DentCare
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex-[2_2_0%] justify-center">
        <NavBarTabs onTabClick={handleTabClick} currentPath={pathname} />
      </NavbarContent>

      <NavbarContent className="flex gap-4 justify-end">
        <Button
          isIconOnly
          variant="light"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </Button>

        <SignInButton />
      </NavbarContent>
    </Navbar>
  );
}
