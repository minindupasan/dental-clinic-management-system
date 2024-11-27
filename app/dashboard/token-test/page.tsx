"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TokenTestPage() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      // Attempt to get token from localStorage
      const storedToken = localStorage.getItem("authToken");

      // If token is not in localStorage, use the one from the session
      const tokenToUse =
        storedToken || (session?.user as any)?.accessToken || null;

      setToken(tokenToUse);
      setLoading(false);
    }
  }, [status, router, session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex justify-center">
          <h1 className="text-2xl font-bold">Token Test Page</h1>
        </CardHeader>
        <CardBody>
          {token ? (
            <div>
              <h2 className="text-xl mb-2 text-success">Your token:</h2>
              <p className="break-all">{token}</p>
            </div>
          ) : (
            <p className="text-danger">
              No token found in localStorage or session
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
