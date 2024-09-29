"use client";

import React from "react";
import { usePathname } from "next/navigation";

import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const menuItems = [
    { menuItemName: "Dashboard", menuItemPath: "/Dashboard" },
    { menuItemName: "Appointments", menuItemPath: "/Appointments" },
    { menuItemName: "Profile", menuItemPath: "/Profile" },
    { menuItemName: "Notification", menuItemPath: "/Notification" },
    { menuItemName: "Log Out", menuItemPath: "/LogOut" },
    { menuItemName: "Services", menuItemPath: "/Services" },
    { menuItemName: "About", menuItemPath: "/About" },
    { menuItemName: "Contact", menuItemPath: "/Contact" },
  ];

  const navItems = [
    { itemName: "Dashboard", itemPath: "/Dashboard" },
    { itemName: "Appointments", itemPath: "/Appointments" },
    { itemName: "Notification", itemPath: "/Notification" },
    { itemName: "Services", itemPath: "/Services" },
    { itemName: "About", itemPath: "/About" },
    { itemName: "Contact", itemPath: "/Contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-neutral-900"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-white">
            <Link href="/">DentCare+</Link>
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-white">
            <Link href="/">DentCare+</Link>
          </p>
        </NavbarBrand>

        {navItems.map((navItem, index) => (
          <NavbarItem key={`${navItem.itemName}-${index}`}>
            <Link
              className={`w-full ${
                isActive(navItem.itemPath)
                  ? "text-green-500" // Highlight color for the active item
                  : "text-white hover:text-purple-300" // Default foreground color (white) with hover effect
              }`}
              href={navItem.itemPath}
            >
              {navItem.itemName}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link
            href="/login"
            className={
              isActive("/login")
                ? "text-green-500"
                : "text-white hover:text-purple-300"
            }
          >
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="./SignUp"
            variant="flat"
            className={isActive("./SignUp") ? "bg-purple-700 text-white" : ""}
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-neutral-900">
        {menuItems.map((menuItem, index) => (
          <NavbarMenuItem key={`${menuItem.menuItemName}-${index}`}>
            <Link
              className={`w-full ${
                isActive(menuItem.menuItemPath)
                  ? "text-green-500" // Highlight color for the active item
                  : index === menuItems.length - 1
                    ? "text-red-500" // Danger color (red) for "Log Out"
                    : "text-white hover:text-purple-300" // Default foreground color (white) with hover effect
              }`}
              href={menuItem.menuItemPath}
              size="lg"
            >
              {menuItem.menuItemName}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
