"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import NavBarTabs from "./NavBarTabs";
import MenuBar from "./MenuBar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <Navbar className="w-full py-1 px-4">
      <NavbarBrand>
        <MenuBar />
      </NavbarBrand>
      <NavbarContent
        className="hidden lg:flex lg:justify-center"
        justify="center"
      >
        <NavBarTabs onTabClick={handleTabClick} currentPath={pathname} />
      </NavbarContent>
      <NavbarContent justify="end">
        {/* Hidden on medium and larger screens, visible only on small screens */}
        <div className="md:hidden flex items-center space-x-2">
          <Button
            radius="full"
            as={Link}
            href="/Login"
            variant="bordered"
            size="sm" // Small size for mobile
          >
            Login
          </Button>
          <Button
            radius="full"
            as={Link}
            href="/SignUp"
            variant="solid"
            size="sm" // Small size for mobile
          >
            Sign Up
          </Button>
        </div>

        {/* Visible only on medium and larger screens */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            radius="full"
            as={Link}
            href="/Login"
            variant="bordered"
            size="lg"
          >
            Login
          </Button>
          <Button
            radius="full"
            as={Link}
            href="/SignUp"
            variant="solid"
            size="lg"
          >
            Sign Up
          </Button>
        </div>
      </NavbarContent>
    </Navbar>
  );
}
