"use client";

import React, { useState } from "react";
import PatientTable from "@/components/PatientsTable";
import AddPatientButton from "@/components/NewPatientButton";
export default function PatientManagement() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePatientAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Patient Management</h1>
        <AddPatientButton onPatientAdded={handlePatientAdded} />
      </div>
      <PatientTable key={refreshKey} />
    </div>
  );
}
