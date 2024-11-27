"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar } from "@nextui-org/react";
const SigninButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex gap-2 items-center">
        <p className="text-sm">{session.user.name}</p>
        <Avatar
          radius="full"
          src={session.user.image ?? ""}
          alt={session.user.name ?? ""}
          size="md"
        />
        <button onClick={() => signOut()} className="text-red-600">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <button onClick={() => signIn()} className="text-green-600 ml-auto">
      Sign In
    </button>
  );
};

export default SigninButton;
