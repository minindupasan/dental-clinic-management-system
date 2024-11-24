"use client";

import React, { useState, useCallback } from "react";
import TreatmentManager from "@/components/treatments/TreatmentsTable";
import { Toaster } from "react-hot-toast";

export default function TreatmentsManagement() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTreatmentUpdated = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <>
      <TreatmentManager
        key={refreshKey}
        onTreatmentUpdated={handleTreatmentUpdated}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-background text-foreground",
        }}
      />
    </>
  );
}
