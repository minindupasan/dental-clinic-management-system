"use client";
import React from "react";

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

  const menuItems = [
    { menuItemName: "Dashboard", menuItemPath: "./Dashboard" },
    { menuItemName: "Appointments", menuItemPath: "./Appointments" },
    { menuItemName: "Profile", menuItemPath: "./Profile" },
    { menuItemName: "Notification", menuItemPath: "./Notification" },
    { menuItemName: "Log Out", menuItemPath: "./LogOut" },
  ];

  const navItems = [
    { itemName: "Services", itemPath: "./Services" },
    { itemName: "About", itemPath: "./About" },
    { itemName: "Contact", itemPath: "./Contact" },
  ];

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
            <Link href="./">DentCare+</Link>
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-white">
            <Link href="/">DentCare+</Link>
          </p>
        </NavbarBrand>
        <NavbarItem isActive className="justify-center">
          <Link href="Page/">Home</Link>
        </NavbarItem>
        {navItems.map((item, index) => (
          <NavbarItem key={`${item.itemPath}-${index}`}>
            <Link
              color={index === 0 ? "foreground" : "primary"}
              href={item.itemPath}
            >
              {item.itemName}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="warning" href="./SignUp" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-neutral-900">
        {menuItems.map((menuItem, index) => (
          <NavbarMenuItem key={`${menuItem}-${index}`}>
            <Link
              className={`w-full ${
                index === 2
                  ? "text-white" // Warning color (yellow)
                  : index === menuItems.length - 1
                    ? "text-red-500" // Danger color (red)
                    : "text-white" // Default foreground color (white)
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
