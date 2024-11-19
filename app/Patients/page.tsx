"use client";

import React, { useState, useCallback } from "react";
import PatientTable from "@/components/patients/PatientsTable";
import AddPatientButton from "@/components/patients/NewPatientButton";
import { Toaster } from "react-hot-toast";

export default function PatientManagement() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePatientAdded = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <PatientTable key={refreshKey} />
    </>
  );
}
