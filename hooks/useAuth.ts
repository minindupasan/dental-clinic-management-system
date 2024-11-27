import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/auth/login");
    } else if (requiredRole && session.user.role !== requiredRole) {
      router.push("/auth/login?message=You Are Not Authorized!");
    }
  }, [session, status, requiredRole, router]);

  return { session, status };
}
