"use client";
import { Tabs, Tab } from "@nextui-org/react";
import ThemeSwitch from "./ThemeSwitch";
import Button from "./Button"; // Use ButtonComponent here
import { DentCareLogo } from "./icons/DentCareLogo";
import { fontSerif } from "@/config/fonts";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const router = usePathname();
  const currentPath = router;

  return (
    <div className="w-full bg-gray-100 py-4 px-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex-grow flex items-center">
          <DentCareLogo />
          <div
            className={clsx(
              "text-lg font-bold text-gray-800 ml-3",
              fontSerif.className
            )}
          >
            DentCare
          </div>
        </div>

        <div className=" hidden lg:flex-grow lg:flex lg:justify-center)">
          <Tabs radius={"full"}>
            <Tab
              key="dashboard"
              title={<Link href="/">Dashboard</Link>}
              value="/"
            />
            <Tab
              key="appointments"
              title={<Link href="/Appointments">Appointments</Link>}
              value="/Appointments"
            />
            <Tab
              key="orders"
              title={<Link href="/Orders">Orders</Link>}
              value="/Orders"
            />
            <Tab
              key="earnings"
              title={<Link href="/Earnings">Earnings</Link>}
              value="/Earnings"
            />
            <Tab
              key="profile"
              title={<Link href="/Profile">Profile</Link>}
              value="/Profile"
            />
          </Tabs>
        </div>
        <div className="hidden lg:flex-grow lg:flex lg:justify-end lg:items-center">
          <ThemeSwitch />
        </div>
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
