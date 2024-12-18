"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Card, CardBody, CardHeader, Button, Link } from "@nextui-org/react";
import { LogIn } from "lucide-react";

export default function LoginCard() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader className="flex flex-col items-center pb-0 pt-8 px-4">
        <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-sm text-default-500 mt-1">Sign in to continue</p>
      </CardHeader>
      <CardBody className="flex flex-col items-center gap-6 px-8 py-6">
        <Button
          startContent={
            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          }
          color="primary"
          variant="flat"
          size="lg"
          className="w-full font-semibold"
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-default-200"></div>
          <span className="px-4 text-sm text-default-500">OR</span>
          <div className="flex-1 h-px bg-default-200"></div>
        </div>
        <Button
          startContent={<LogIn size={18} />}
          color="default"
          variant="flat"
          size="lg"
          className="w-full font-semibold"
        >
          Sign in with Email
        </Button>
        <p className="text-center text-sm text-default-500">
          Don't have an account?{" "}
          <Link href="/signup" size="sm" className="font-semibold">
            Sign up
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
