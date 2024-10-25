"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Tabs,
  Tab,
} from "@nextui-org/react";

export default function FinancialSummaryCard() {
  // State must be declared inside the component
  const [activeTab, setActiveTab] = useState("daily");

  const handleTabChange = (key: React.Key) => {
    setActiveTab(key.toString());
  };

  // Data for summary, based on selected tab
  const summaryData = {
    daily: {
      earned: "LKR 16,350",
      patientsTreated: 24,
    },
    monthly: {
      earned: "LKR 487,500",
      patientsTreated: 720,
    },
    yearly: {
      earned: "LKR 5,850,000",
      patientsTreated: 8640,
    },
  };

  return (
    <div>
      <Card className="min-h-72 h-auto bg-default-900 text-foreground">
        <CardHeader>
          <div className="w-full pt-3 flex justify-between items-center mx-6">
            <h2 className="text-xl font-semibold">Summary</h2>
          </div>
        </CardHeader>
        <div className="flex flex-wrap gap-4 mx-6">
          <Tabs
            radius="full"
            size="sm"
            variant="bordered"
            aria-label="Summary time period"
            selectedKey={activeTab}
            onSelectionChange={handleTabChange}
          >
            <Tab key="daily" title="Daily" />
            <Tab key="monthly" title="Monthly" />
            <Tab key="yearly" title="Yearly" />
          </Tabs>
        </div>
        <CardBody className="mx-6">
          <h3 className="text-3xl font-bold mb-1">
            {summaryData[activeTab as keyof typeof summaryData].earned}
          </h3>
          <p className="text-gray-600 mb-4">Earned</p>
          <h3 className="text-3xl font-bold mb-1">
            {summaryData[activeTab as keyof typeof summaryData].patientsTreated}
          </h3>
          <p className="text-gray-600">No. of Patients Treated</p>
        </CardBody>
      </Card>
    </div>
  );
}
