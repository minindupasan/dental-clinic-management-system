"use client";

import UpcomingAppointmentsCard from "@/components/UpcomingAppointmentsCard";
import TodayAppointmentsCard from "@/components/TodayAppointmentsCard";
import DentureCard from "@/components/DentureCard";
import FinancialSummaryCard from "@/components/FinancialSummaryCard";
import PendingPayments from "@/components/PendingPaymentsCard";
import PatientsTableCard from "@/components/PatientsTableCard";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-full px-4 sm:px-4 lg:px-4 py-8 text-foreground-light">
      <div className="grid gap-3 grid-cols-1 grid-rows-5 lg:grid-cols-2">
        {/*Today's Appointments*/}
        <div className="col-span-1 lg:col-span-1 lg:row-span-1 lg:row-start-1 lg:row-end-2 lg:col-start-1">
          <TodayAppointmentsCard />
        </div>

        {/* Upcoming Appointments */}
        <div className="col-span-1 lg:col-span-1 lg:row-span-1 lg:row-start-2 lg:col-start-1 ">
          <UpcomingAppointmentsCard />
        </div>

        {/* Dentures */}
        <div className="col-span-1 row-start-3 lg:col-span-1 lg:row-span-2 lg:col-start-2">
          <DentureCard />
        </div>

        <div className="grid grid-cols-1 grid-rows-2 gap-3 lg:grid-cols-6 lg:grid-rows-1  lg:col-span-2 lg:row-span-1 lg:row-start-3">
          {/* Summary */}
          <div className="col-span-1 lg:col-span-2">
            <FinancialSummaryCard />
          </div>
          {/* Pending Payments */}
          <div className="col-span-1 lg:col-span-4">
            <PendingPayments />
          </div>
        </div>

        {/* Patients */}
        <div className="hidden lg:flex lg:col-span-2">
          <PatientsTableCard />
        </div>
      </div>
    </div>
  );
}
