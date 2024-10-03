"use client";
import { Tabs, Tab } from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";
import { DentCareLogo } from "./icons/DentCareLogo";
import { Poppins } from "next/font/google";

export default function NavBar() {
  return (
    <div className="w-full bg-gray-100 py-4 px-4">
      <div className="flex justify-between items-center w-full">
        {/* Aligning the Logo, Tabs, and ThemeSwitch in one line */}
        <DentCareLogo />
        <span className="text-lg font-bold text-gray-800 ">DentCare</span>
        
        {/* Center Tabs */}
        <div className="flex-grow flex justify-center">
          <Tabs radius={"full"}>
            <Tab key="dashboard" title="Dashboard" />
            <Tab key="appointments" title="Appointments" />
            <Tab key="orders" title="Orders" />
            <Tab key="earnings" title="Earnings" />
            <Tab key="profile" title="Profile" />
          </Tabs>
        </div>

        {/* Theme Switch on the right */}
        <ThemeSwitch />
      </div>
    </div>
  );
}