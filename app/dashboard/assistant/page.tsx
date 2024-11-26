import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TodayAppointmentsCard from "@/components/appointments/TodayAppointmentsCard";
import UpcomingAppointmentsCard from "@/components/appointments/UpcomingAppointmentsCard";
import InventoryCard from "@/components/inventory/InventoryCard";
import PatientsTableCard from "@/components/patients/PatientsTableCard";
import DenturesCard from "@/components/dentures/DenturesCard";

export default async function AssistantDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ASSISTANT") {
    redirect("/auth/login");
  }

  return (
    <div className=" max-w-full mx-4 md:mx-6 lg:mx-10 my-4 lg:my-8">
      {/* Grid layout for the dashboard */}
      <div className="grid gap-2 lg:gap-4 lg:grid-cols-2 lg:grid-rows-[38vh,38vh,auto]">
        {/* Today's Appointments Card */}
        <div className="row-start-1 col-start-1 lg:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2">
          <TodayAppointmentsCard />
        </div>

        {/* Upcoming Appointments Card */}
        <div className="row-start-2 col-start-1 lg:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3">
          <UpcomingAppointmentsCard />
        </div>

        {/* Inventory */}
        <div className="row-start-3 col-start-1 lg:col-span-1 lg:row-span-2 lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3">
          <InventoryCard />
        </div>

        {/* Dentures Card */}
        <div className="row-start-3 col-start-1 lg:col-span-1 lg:row-span-2 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2">
          <DenturesCard />
        </div>

        {/* Patients Table */}
        <div className="hidden lg:flex lg:col-span-2 lg:row-start-3">
          <PatientsTableCard />
        </div>
      </div>
    </div>
  );
}
