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
    <div className="w-full py-1 px-4">
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
            <Link href="/Login">
              <Button
                size="sm"
                radius={"full"}
                variant="bordered"
                className="mr-3 border-default-100 text-foreground-dark"
              >
                Login
              </Button>
            </Link>
            <Link href="/SignUp">
              <Button
                size="sm"
                radius={"full"}
                variant="solid"
                className="mr-3 bg-default-100 text-foreground-light"
              >
                Sign Up
              </Button>
            </Link>
          </div>
          <div className="hidden md:flex">
            <Link href="/Login">
              <Button
                radius={"full"}
                variant="bordered"
                className="mr-3 border-default-100 text-foreground-dark"
              >
                Login
              </Button>
            </Link>
            <Link href="/SignUp">
              <Button
                radius={"full"}
                variant="solid"
                className="mr-3 bg-default-100 text-foreground-light"
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
