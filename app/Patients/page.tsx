"use client";
import PatientsTable from "@/components/PatientsTable";
import React from "react";

export default function patients() {
  return (
    <div className="text-foreground-light mx-4 md:mx-6 lg:mx-10 my-4 lg:my-8">
      <PatientsTable />
    </div>
  );
}
