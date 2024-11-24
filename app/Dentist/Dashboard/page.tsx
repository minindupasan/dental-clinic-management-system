"use client";

import UpcomingAppointmentsCard from "@/components/appointments/UpcomingAppointmentsCard";
import TodayAppointmentsCard from "@/components/appointments/TodayAppointmentsCard";
import DentureCard from "@/components/dentures/DenturesCard";
import FinancialSummaryCard from "@/components/FinancialSummaryCard";
import PendingPayments from "@/components/treatments/PendingPaymentsCard";
import PatientsTableCard from "@/components/patients/PatientsTableCard";

export default function Dashboard() {
  return (
    <div className=" max-w-full mx-4 md:mx-6 lg:mx-10 my-4 lg:my-8 text-foreground-light">
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
        <div className="row-start-3 col-start-1 lg:col-span-3 lg:row-span-2 lg:col-start-4 lg:row-start-1">
          <DentureCard />
        </div>

        {/* Financial Summary and Pending Payments */}
        <div className="row-start-4 col-start-1 lg:col-span-2 lg:col-start-1 lg:row-start-3">
          <FinancialSummaryCard />
        </div>
        <div className="lg:col-span-4 lg:col-start-3">
          <PendingPayments />
        </div>

        {/* Patients Table */}
        <div className="hidden lg:flex lg:col-span-6 lg:row-start-4">
          <PatientsTableCard />
        </div>
      </div>
    </div>
  );
}
