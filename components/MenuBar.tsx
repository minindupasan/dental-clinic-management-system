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
        className="md:hidden"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      />
      <NavbarContent>
        <NavbarBrand>
          <Link color="foreground" href="/">
            <DentCareLogo />
            <div
              className={clsx(
                "hidden lg:block lg:font-bold lg:text-gray-800 lg:ml-3 lg:text-xl lg:font-serif lg:",
                fontSerif.className
              )}
            >
              DentCare+
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map(({ itemName, itemPath }, index) => (
          <NavbarMenuItem key={`${itemName}-${index}`}>
            <Link
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              href={itemPath}
            >
              {itemName}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
