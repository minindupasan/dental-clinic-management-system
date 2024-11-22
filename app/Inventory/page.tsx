"use client";

import React, { useState, useCallback } from "react";
import InventoryTable from "@/components/inventory/InventoryTable";
import { Toaster } from "react-hot-toast";

export default function Inventory() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInventoryUpdated = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <>
      <InventoryTable
        key={refreshKey}
        onInventoryUpdated={handleInventoryUpdated}
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
