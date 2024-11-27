"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear the token from localStorage
    localStorage.removeItem("authToken");

    // Sign out using NextAuth
    await signOut({ redirect: false });

    // Redirect to login page
    router.push("/auth/login");
  };

  return (
    <Button onClick={handleLogout} color="danger" className="font-bold">
      Log out
    </Button>
  );
}
