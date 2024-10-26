"use client";

import React, { useState, useCallback } from "react";
import AppointmentsTable from "@/components/AppointmentsTable";
import NewAppointmentButton from "@/components/NewAppointmentButton";
import { Toaster } from "react-hot-toast";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

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
