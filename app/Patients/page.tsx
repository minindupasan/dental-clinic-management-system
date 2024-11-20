"use client";

import React, { useState, useCallback } from "react";
import PatientTable from "@/components/patients/PatientsTable";
import { Toaster } from "react-hot-toast";

export default function PatientManagement() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <Toaster position="top-right" />
      <PatientTable key={refreshKey} />
    </>
  );
}
