"use client";

import React, { useState } from "react";
import {
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { AtSign, Eye } from "lucide-react";
import { EyeClosed } from "lucide-react";
import { LogIn } from "lucide-react";
import { Key } from "lucide-react";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasNumber = /\d/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    } else if (!hasNumber.test(password)) {
      return "Password must include at least one number.";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setError(validatePassword(value));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!error && password) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Login successful:", data);
          // Handle successful login (e.g., redirect to dashboard)
        } else {
          console.error("Login failed:", data.message);
          // Handle login error (e.g., show error message)
        }
      } catch (err) {
        console.error("Error during login:", err);
        // Handle network or other errors
      }
    }
  };

  return (
    <div className="lg:col-span-1 lg:row-span-1 lg:col-start-2 lg:h-full">
      <Card className="h-full ">
        <CardHeader className="text-foreground text-2xl font-semibold mt-5 mx-3">
          Login
        </CardHeader>
        <CardBody className="justify-center">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-10 last">
              <Input
                isRequired
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<AtSign size={18} />}
              />
              <Input
                isRequired
                type={isVisible ? "text" : "password"}
                label="Password"
                placeholder="Include at least 8 characters"
                value={password}
                onChange={handlePasswordChange}
                startContent={<Key size={18} />}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? <Eye size={24} /> : <EyeClosed size={24} />}
                  </button>
                }
              />
              {error && <p className="text-danger text-sm">{error}</p>}
            </div>
            <div className="flex flex-col justify-between items-center space-y-4">
              <Button
                type="submit"
                color={email && password && !error ? "primary" : "default"}
                startContent={<LogIn />}
                isDisabled={!!error}
              >
                Login
              </Button>
              <Link href="#" size="sm">
                Forgot Password?
              </Link>
            </div>
          </form>
          <div className="my-2 text-center text-sm">
            <span className="text-foreground">Not a member?</span>{" "}
            <Link href="../app/SignUp" size="sm">
              Sign up
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
