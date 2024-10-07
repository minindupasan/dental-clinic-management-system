"use client";

import UpcomingAppointmentsCard from "@/components/UpcomingAppointmentsCard";
import TodayAppointmentsCard from "@/components/TodayAppointmentsCard";
import DentureCard from "@/components/DenturesCard";
import FinancialSummaryCard from "@/components/FinancialSummaryCard";
import PendingPayments from "@/components/PendingPaymentsCard";
import PatientsTableCard from "@/components/PatientsTableCard";

export default function Dashboard() {
  return (
    <div className=" max-w-full px-4 sm:px-4 lg:px-4 py-8 text-foreground-light">
      {/* Grid layout for the dashboard */}
      <div className="grid gap-4 lg:grid-cols-6 lg:grid-rows-[auto,auto,auto,auto]">
        {/* Today's Appointments Card */}
        <div className="row-start-1 col-start-1 lg:col-span-3 lg:col-start-1 lg:row-start-1">
          <TodayAppointmentsCard />
        </div>

        {/* Upcoming Appointments Card */}
        <div className="row-start-2 col-start-1 lg:col-span-3 lg:col-start-1 lg:row-start-2">
          <UpcomingAppointmentsCard />
        </div>

        {/* Dentures Card */}
        <div className="row-start-3 col-start-1 lg:col-span-3 lg:row-span-2 lg:col-start-2">
          <DentureCard />
        </div>

        {/* Financial Summary and Pending Payments */}
        <div className="row-start-4 col-start-1 lg:col-span-2">
          <FinancialSummaryCard />
        </div>
        <div className="lg:col-span-4">
          <PendingPayments />
        </div>

        {/* Patients Table */}
        <div className="hidden lg:flex lg:col-span-6">
          <PatientsTableCard />
        </div>
      </div>
    </div>
  );
}
