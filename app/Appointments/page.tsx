"use client";

import React, { useState, useCallback } from "react";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import { Toaster } from "react-hot-toast";

export default function Appointments() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAppointmentAdded = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <>
      <AppointmentsTable key={refreshKey} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-background text-foreground",
        }}
      />
    </>
  );
}
