"use client";

import React, { useState, useCallback } from "react";
import PatientTable from "@/components/PatientsTable";
import AddPatientButton from "@/components/NewPatientButton";
import { Toaster } from "react-hot-toast";

export default function PatientManagement() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePatientAdded = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div className="space-y-4 bg-white text-foreground-light rounded-3xl p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Patient Management</h1>
        <AddPatientButton onPatientAdded={handlePatientAdded} />
      </div>
      <PatientTable key={refreshKey} />
    </div>
  );
}
