"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  User,
} from "@nextui-org/react";
import NavBarTabs from "./NavBarTabs";
import MenuBar from "./MenuBar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabClick = (path: string) => {
    console.log(`Tab clicked: ${path}`);
  };

  const handleSignInOut = async () => {
    try {
      if (session) {
        await signOut({
          redirect: true,
          callbackUrl: "/",
        });
      } else {
        await signIn(undefined, {
          redirect: true,
          callbackUrl: "/dashboard",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  if (!mounted) return null;

  return (
    <Navbar className="w-full py-2 px-4">
      <NavbarContent className="flex-1">
        <NavbarBrand>
          <MenuBar />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex-1 hidden lg:flex justify-center">
        <NavBarTabs onTabClick={handleTabClick} currentPath={pathname} />
      </NavbarContent>

      <NavbarContent className="w-full">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex-grow">
            {status === "loading" ? (
              <Button variant="flat" isLoading className="w-full">
                Loading...
              </Button>
            ) : session?.user ? (
              <User
                name={session.user.name}
                description={session.user.email}
                avatarProps={{
                  src: session.user.image || undefined,
                  name: session.user.name?.charAt(0) || "U",
                }}
                className="w-full justify-start"
              />
            ) : (
              <Button
                variant="flat"
                onClick={handleSignInOut}
                className="hover:bg-primary-100 w-full"
              >
                Sign In
              </Button>
            )}
          </div>
          {session?.user && (
            <Button
              variant="flat"
              onClick={handleSignInOut}
              className="hover:bg-danger-100"
            >
              Sign Out
            </Button>
          )}
          <Button
            isIconOnly
            variant="light"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </Button>
        </div>
      </NavbarContent>
    </Navbar>
  );
}
