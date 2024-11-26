"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("An error occurred during logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      isLoading={isLoggingOut}
      color="danger"
      variant="flat"
      startContent={<LogOut className="w-4 h-4" />}
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
}
