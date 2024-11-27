"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Spinner, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TokenTestPage() {
  const { status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      updateToken();
    }
  }, [status, router]);

  const updateToken = () => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    updateToken();
  };

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
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Token Test Page</h1>
          <Button onClick={handleRefresh} color="primary">
            Refresh Token
          </Button>
        </CardHeader>
        <CardBody>
          {token ? (
            <div>
              <h2 className="text-xl mb-2 text-success">Your token:</h2>
              <p className="break-all p-2 rounded">{token}</p>
            </div>
          ) : (
            <p className="text-danger">No token found in localStorage</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
