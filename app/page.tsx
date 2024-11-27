"use client";

import React from "react";
import LoginCard from "@/components/LoginCard";
import Catalogue from "@/components/Catalogue";
import AboutCard from "@/components/AboutCard";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { DentCareLogo } from "@/components/icons/DentCareLogo";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 lg:row-span-2">
            <Catalogue />
          </div>
          <div className="lg:col-span-2 lg:col-start-4 lg:col-end-6 lg:row-start-1 lg:row-end-2">
            <LoginCard />
          </div>
          <div className="lg:col-span-2 lg:col-start-4 lg:col-end-6 lg:row-start-2 lg:row-end-3">
            <AboutCard />
          </div>
        </div>
      </div>
    </div>
  );
}
