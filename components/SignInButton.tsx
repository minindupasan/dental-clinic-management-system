"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, HelpCircle } from "lucide-react";

const SignInButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (session && session.user) {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: session.user.image ?? undefined,
              alt: session.user.name ?? "User Avatar",
              size: "sm",
            }}
            className="transition-transform"
            description={session.user.email}
            name={session.user.name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User menu actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{session.user.email}</p>
          </DropdownItem>
          <DropdownItem key="settings" startContent={<Settings size={16} />}>
            My Settings
          </DropdownItem>
          <DropdownItem
            key="help_and_feedback"
            startContent={<HelpCircle size={16} />}
          >
            Help & Feedback
          </DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
            <div className="flex items-center gap-2">
              <LogOut size={16} />
              Log Out
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      color="primary"
      variant="flat"
      className="font-semibold"
    >
      Sign In
    </Button>
  );
};

export default SignInButton;
