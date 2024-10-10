import FinancialSummary from "@/components/FinancialSummaryCard";
import PendingPayments from "@/components/PendingPaymentsCard";
import TreatmentsCard from "@/components/TreatmentsCard";
import React from "react";

export default function Profile() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 mx-4 md:mx-6 lg:mx-10 my-4 lg:my-8">
      <FinancialSummary />
      <TreatmentsCard />
      <div className="lg:col-span-2">
        <PendingPayments />
      </div>
    </div>
  );
}
