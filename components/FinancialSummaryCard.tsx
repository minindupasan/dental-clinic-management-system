"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Tabs,
  Tab,
  Spinner,
} from "@nextui-org/react";
import { AlertCircle, RefreshCw } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Treatment {
  treatmentID: number;
  appointmentID: number;
  treatmentType: string;
  startDate: string;
  endDate: string | null;
  totalPaid: number | null;
  dueAmount: number | null;
  paymentStatus: string;
  treatmentStatus: string;
  notes: string | null;
  patient: any | null;
}

export default function FinancialSummaryCard() {
  const [activeTab, setActiveTab] = useState("weekly");
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [summaryData, setSummaryData] = useState({
    weekly: { earned: "LKR 0", patientsTreated: 0 },
    monthly: { earned: "LKR 0", patientsTreated: 0 },
    yearly: { earned: "LKR 0", patientsTreated: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTreatments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/treatments`);
      if (!response.ok) {
        throw new Error(`Failed to fetch treatments: ${response.statusText}`);
      }
      const data: Treatment[] = await response.json();
      setTreatments(data);
      calculateSummary(data);
    } catch (err) {
      console.error("Error fetching treatments:", err);
      setError("Error fetching the records");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSummary = (treatmentData: Treatment[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const oneYearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );

    const summary = {
      weekly: { earned: 0, patientsTreated: 0 },
      monthly: { earned: 0, patientsTreated: 0 },
      yearly: { earned: 0, patientsTreated: 0 },
    };

    const uniqueAppointments = new Set<number>();

    treatmentData.forEach((treatment) => {
      const startDate = new Date(treatment.startDate);
      const totalPaid = treatment.totalPaid || 0;

      if (startDate >= oneWeekAgo) {
        summary.weekly.earned += totalPaid;
        uniqueAppointments.add(treatment.appointmentID);
      }
      if (startDate >= oneMonthAgo) {
        summary.monthly.earned += totalPaid;
      }
      if (startDate >= oneYearAgo) {
        summary.yearly.earned += totalPaid;
      }
    });

    summary.weekly.patientsTreated = uniqueAppointments.size;
    summary.monthly.patientsTreated = treatmentData.filter(
      (t) => new Date(t.startDate) >= oneMonthAgo
    ).length;
    summary.yearly.patientsTreated = treatmentData.filter(
      (t) => new Date(t.startDate) >= oneYearAgo
    ).length;

    setSummaryData({
      weekly: {
        earned: `LKR ${summary.weekly.earned.toFixed(2)}`,
        patientsTreated: summary.weekly.patientsTreated,
      },
      monthly: {
        earned: `LKR ${summary.monthly.earned.toFixed(2)}`,
        patientsTreated: summary.monthly.patientsTreated,
      },
      yearly: {
        earned: `LKR ${summary.yearly.earned.toFixed(2)}`,
        patientsTreated: summary.yearly.patientsTreated,
      },
    });
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleTabChange = (key: React.Key) => {
    setActiveTab(key.toString());
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Spinner label="Loading summary..." color="primary" size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-danger flex flex-col items-center justify-center p-4 rounded-lg">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p className="text-lg font-semibold">{error}</p>
          <Button
            color="primary"
            variant="flat"
            onPress={fetchTreatments}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return (
      <>
        <h3 className="text-3xl font-bold mb-1">
          {summaryData[activeTab as keyof typeof summaryData].earned}
        </h3>
        <p className="text-default-400 mb-4">Earned</p>
        <h3 className="text-3xl font-bold mb-1">
          {summaryData[activeTab as keyof typeof summaryData].patientsTreated}
        </h3>
        <p className="text-default-400">No. of Patients Treated</p>
      </>
    );
  };

  return (
    <Card className="min-h-72 h-auto">
      <CardHeader>
        <div className="w-full pt-3 flex justify-between items-center mx-6">
          <h2 className="text-xl font-semibold">Summary</h2>
          <Button
            isIconOnly
            color="primary"
            variant="ghost"
            onPress={fetchTreatments}
            aria-label="Refresh summary"
          >
            <RefreshCw size={16}/>
          </Button>
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
          <Tab key="weekly" title="Weekly" />
          <Tab key="monthly" title="Monthly" />
          <Tab key="yearly" title="Yearly" />
        </Tabs>
      </div>
      <CardBody className="mx-6">{renderContent()}</CardBody>
    </Card>
  );
}
