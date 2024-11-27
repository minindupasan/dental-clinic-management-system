"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Spacer,
} from "@nextui-org/react";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        // Redirect based on user role
        const response = await fetch("/api/user");
        const userData = await response.json();

        const dashboardPath = `/dashboard/${userData.role.toLowerCase()}`;
        router.push(dashboardPath);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="flex justify-center">
        <h1 className="text-2xl font-bold">Sign in</h1>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="text-danger text-center">{error}</div>}
          <Input
            id="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
          <Spacer y={2} />
          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
