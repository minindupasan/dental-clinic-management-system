"use client";

import React, { useState, useCallback } from "react";
import AppointmentsTable from "@/components/AppointmentsTable";
import NewAppointmentButton from "@/components/NewAppointmentButton";
import { Toaster } from "react-hot-toast";

export default function Appointments() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAppointmentAdded = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div className="max-w-full overflow-x-auto space-y-6 bg-white text-foreground-light rounded-3xl p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground-light">
          Appointments
        </h1>
        <NewAppointmentButton onAppointmentAdded={handleAppointmentAdded} />
      </div>
      <AppointmentsTable key={refreshKey} />
    </div>
  );
}
