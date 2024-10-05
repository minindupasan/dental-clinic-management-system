"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  Link,
} from "@nextui-org/react";
import { DentCareLogo } from "./icons/DentCareLogo";
import { fontSerif } from "@/config/fonts";
import clsx from "clsx";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { itemName: "Dashboard", itemPath: "/" },
    { itemName: "Appointments", itemPath: "/Appointments" },
    { itemName: "Orders", itemPath: "/Orders" },
    { itemName: "Earnings", itemPath: "/Earnings" },
    { itemName: "Profile", itemPath: "/Profile" },
    { itemName: "Log Out", itemPath: "/LogOut" },
  ];

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarMenuToggle
        className="md:hidden text-white" // Change 'text-white' to the desired color (e.g., 'text-red-500')
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      />
      <NavbarContent>
        <NavbarBrand>
          <Link color="foreground" href="/">
            <DentCareLogo />
            <div
              className={clsx(
                "hidden lg:block lg:font-bold lg:text-white lg:ml-3 lg:text-xl lg:font-serif ",
                fontSerif.className
              )}
            >
              DentCare+
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarMenu className="bg-background-dark backdrop-blur-md bg-opacity-50">
        {menuItems.map(({ itemName, itemPath }, index) => (
          <NavbarMenuItem key={`${itemName}-${index}`}>
            <Link
              className={clsx(
                "w-full",
                index === menuItems.length - 1
                  ? "text-danger-500"
                  : "text-foreground-dark"
              )}
              href={itemPath}
              size="lg"
            >
              {itemName}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
