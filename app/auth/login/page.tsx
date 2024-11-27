import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const userRole =
      (session.user?.role as string | undefined)?.toLowerCase() || "default";
    redirect(`/dashboard/${userRole}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
