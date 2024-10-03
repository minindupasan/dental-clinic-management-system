"use client";
import { Tabs, Tab } from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";
import Button from "./Button"; // Use ButtonComponent here
import { DentCareLogo } from "./icons/DentCareLogo";
import { fontSerif } from "@/config/fonts";
import clsx from "clsx";

export default function NavBar() {
  return (
    <div className="w-full bg-gray-100 py-4 px-4">
      <div className="flex justify-between items-center w-full">
        <DentCareLogo />
        <span
          className={clsx(
            "text-lg font-bold text-gray-800 font-serif prima",
            fontSerif.variable
          )}
        >
          DentCare
        </span>
        <div className="flex-grow flex justify-center">
          <Tabs radius={"full"}>
            <Tab key="dashboard" title="Dashboard" />
            <Tab key="appointments" title="Appointments" />
            <Tab key="orders" title="Orders" />
            <Tab key="earnings" title="Earnings" />
            <Tab key="profile" title="Profile" />
          </Tabs>
        </div>
        <ThemeSwitch />
        <Button variant="solid">Dashboard</Button>
      </div>
    </div>
  );
}