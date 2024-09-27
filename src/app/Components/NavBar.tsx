import React from "react";
import NavItem from "./NavItem";
const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "./About/" },
  { name: "Contact", path: "./Contact/" },
];
export default function NavBar() {
  return (
    <div className="flex justify-center space-x-3">
      {navItems.map((item) => (
        <NavItem key={item.name} name={item.name} path={item.path} />
      ))}
    </div>
  );
}
