"use client";

import UpcomingAppointmentsCard from "@/components/appointments/UpcomingAppointmentsCard";
import TodayAppointmentsCard from "@/components/appointments/TodayAppointmentsCard";
import DentureCard from "@/components/dentures/DenturesCard";
import FinancialSummaryCard from "@/components/inventory/InventoryCard";
import PendingPayments from "@/components/treatments/PendingPaymentsCard";
import PatientsTableCard from "@/components/patients/PatientsTableCard";

export default function Dashboard() {
  return (
    <div className=" max-w-full mx-4 md:mx-6 lg:mx-10 my-4 lg:my-8 text-foreground-light">
      {/* Grid layout for the dashboard */}
      <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-[38vh,38vh,46vh,auto]">
        {/* Today's Appointments Card */}
        <div className="row-start-1 col-start-1 lg:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2">
          <TodayAppointmentsCard />
        </div>

        {/* Upcoming Appointments Card */}
        <div className="row-start-2 col-start-1 lg:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3">
          <UpcomingAppointmentsCard />
        </div>

        {/* Dentures Card */}
        <div className="row-start-3 col-start-1 lg:col-span-1 lg:row-span-2 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3">
          <DentureCard />
        </div>

        {/* Inventory Card*/}
        <div className="row-start-3 col-start-1 lg:col-span-1 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4">
          <FinancialSummaryCard />
        </div>
        <div className="row-start-3 lg:col-span-1 lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4">
          <PendingPayments />
        </div>

        {/* Patients Table */}
        <div className="hidden lg:flex lg:col-span-2 lg:row-start-4 lg:col-start-1 lg:col-end-3">
          <PatientsTableCard />
        </div>
      </div>
    </div>
  );
}
