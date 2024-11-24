"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spinner,
  Button,
  Chip,
  Tooltip,
  Divider,
  Link,
} from "@nextui-org/react";
import {
  AlertCircle,
  RefreshCw,
  Calendar,
  DollarSign,
  Clock,
  User,
  Tag,
  List,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Patient = {
  patientID: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  gender: string;
  dob: string;
  createdDate: string;
};

type Treatment = {
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
  patient: Patient;
};

export default function PendingPayments() {
  const [pendingTreatments, setPendingTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/treatments`);
      if (!response.ok) {
        throw new Error(`Failed to fetch treatments: ${response.statusText}`);
      }
      const data: Treatment[] = await response.json();
      const filteredTreatments = data.filter(
        (treatment) => treatment.paymentStatus === "Pending"
      );
      setPendingTreatments(filteredTreatments);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Spinner
            label="Loading pending payments..."
            color="primary"
            size="lg"
          />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-danger flex flex-col items-center justify-center p-4 rounded-lg">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p className="text-lg font-semibold">Error: {error}</p>
          <Button
            color="primary"
            variant="flat"
            onPress={fetchData}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (pendingTreatments.length === 0) {
      return (
        <div className="text-center p-4">
          <p className="text-lg font-semibold">No pending payments</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pendingTreatments.map((treatment, index) => (
          <Card key={treatment.treatmentID} className="w-full overflow-hidden">
            <CardBody className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <User size={18} className="mr-2 text-primary" />
                    {treatment.patient.firstName} {treatment.patient.lastName}
                  </h3>
                  <p className="text-sm mb-1">
                    ID: {treatment.patient.patientID}
                  </p>
                  <p className="text-sm">
                    Treatment ID: {treatment.treatmentID}
                  </p>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <Calendar size={18} className="mr-2 text-primary" />
                    <span className="text-sm font-medium">
                      Start: {formatDate(treatment.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Tag size={18} className="mr-2 text-primary" />
                    <Tooltip content={treatment.treatmentType}>
                      <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="max-w-[150px] truncate"
                      >
                        {treatment.treatmentType}
                      </Chip>
                    </Tooltip>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-2 text-primary" />
                    <span className="text-sm font-medium">
                      {treatment.treatmentStatus}
                    </span>
                  </div>
                </div>
                <div className="p-4 ml-10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Total Paid:</span>
                    <span className="text-sm">
                      ${treatment.totalPaid?.toFixed(2) ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Due Amount:</span>
                    <Chip color="warning" variant="flat" size="sm">
                      ${treatment.dueAmount?.toFixed(2) ?? "N/A"}
                    </Chip>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <Chip color="danger" variant="flat" size="sm">
                      {treatment.paymentStatus}
                    </Chip>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full h-[35vh] overflow-hidden">
      <CardHeader className="flex justify-between items-center px-6 py-4">
        <h2 className="text-xl font-semibold">Pending Payments</h2>
        <div className="flex space-x-2">
          <Button
            isIconOnly
            color="primary"
            variant="ghost"
            onPress={fetchData}
            aria-label="Refresh pending payments"
          >
            <RefreshCw size={20} />
          </Button>
          <Tooltip content="View All Dentures" color="primary">
            <Link href="../Treatments">
              <Button
                isIconOnly
                color="primary"
                variant="ghost"
                startContent={<List size={16} />}
              />
            </Link>
          </Tooltip>
        </div>
      </CardHeader>
      <CardBody className="overflow-y-auto px-6 py-4">
        {renderContent()}
      </CardBody>
      <CardFooter className="flex justify-between items-center px-6 py-4">
        <p className="text-sm">
          Total Pending:{" "}
          <span className="font-semibold">{pendingTreatments.length}</span>
        </p>
      </CardFooter>
    </Card>
  );
}
