"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AboutCard from "@/components/AboutCard";
import Catalogue from "@/components/Catalogue";
import LoginCard from "@/components/LoginCard";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      router.push(`/dashboard/${session.user.role}`);
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 lg:row-span-2">
            <Catalogue />
          </div>
          <div className="lg:col-span-2 lg:col-start-4 lg:col-end-6 lg:row-start-1 lg:row-end-2">
            <LoginCard />
          </div>
          <div className="lg:col-span-2 lg:col-start-4 lg:col-end-6 lg:row-start-2 lg:row-end-3">
            <AboutCard />
          </div>
        </div>
      </div>
    </div>
  );
}
