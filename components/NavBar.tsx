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
        <div className="flex-grow flex ">
          <DentCareLogo />
          <div
            className={clsx(
              "text-lg font-bold text-gray-800",
              fontSerif.className
            )}
          >
            DentCare
          </div>
        </div>
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
        <Button
          radius={"full"}
          variant="bordered"
          className="mx-5 text-default-500 border-default-500"
        >
          Login
        </Button>
        <Button
          radius={"full"}
          variant="solid"
          className="bg-default-500 text-white"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}
