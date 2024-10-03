"use client";
import ThemeSwitch from "./ThemeSwitch";
import Button from "./Button";
import { fontSerif } from "@/config/fonts";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import NavBarTabs from "./NavBarTabs";
import MenuBar from "./MenuBar";
import Link from "next/link";

export default function NavBar() {
  const router = usePathname();
  const currentPath = router;

  return (
    <div className="w-full bg-gray-100 py-1 px-4">
      <div className="flex items-center w-full">
        <div className="flex items-center">
          <MenuBar />
        </div>
        <div className="flex-grow flex justify-center">
          <div className="hidden lg:flex-grow lg:flex lg:justify-center">
            <NavBarTabs />
          </div>
        </div>

        <div className="flex justify-end items-center">
          <div className="hidden md:flex md:justify-end md:items-center">
            <ThemeSwitch />
          </div>
          <div className="md:hidden flex">
            <Button
              size="sm"
              radius={"full"}
              variant="bordered"
              className="mr-3 text-default-500 border-default-500"
            >
              Login
            </Button>

            <Button
              size="sm"
              radius={"full"}
              variant="solid"
              className="mr-3 bg-default-500 text-white"
            >
              Sign Up
            </Button>
          </div>
          <div className="hidden md:flex">
            <Link href="/Login">
              <Button
                radius={"full"}
                variant="bordered"
                className="mr-3 text-default-500 border-default-500"
              >
                Login
              </Button>
            </Link>
            <Link href="/SignUp">
              <Button
                radius={"full"}
                variant="solid"
                className="mr-3 bg-default-500 text-white"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
