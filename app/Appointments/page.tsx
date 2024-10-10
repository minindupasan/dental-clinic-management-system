"use client";
import AppointmentsTable from "@/components/AppointmentsTable";
import React from "react";

export default function appointments() {
  return (
    <div className="text-foreground-light mx-4 md:mx-6 lg:mx-10 my-4 lg:my-8">
      <AppointmentsTable />
    </div>
  );
}
