import FinancialSummary from "@/components/FinancialSummaryCard";
import PendingPayments from "@/components/PendingPaymentsCard";
import TreatmentsCard from "@/components/TreatmentsCard";
import React from "react";

export default function Profile() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 ">
      <FinancialSummary />
      <TreatmentsCard />
      <PendingPayments />
    </div>
  );
}
