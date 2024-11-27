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
  FileText,
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/treatments`);
      if (!response.ok) {
        throw new Error(`Failed to fetch treatments: ${response.statusText}`);
      }
      const text = await response.text();
      let data: Treatment[] = [];
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
        }
      }
      const filteredTreatments = data.filter(
        (treatment) => treatment.paymentStatus === "Pending"
      );
      setPendingTreatments(filteredTreatments);
    } catch (err) {
      console.error("Error fetching data:", err);
      setPendingTreatments([]);
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
        <div className="flex justify-center items-center h-full">
          <Spinner
            label="Loading pending payments..."
            color="primary"
            size="lg"
          />
        </div>
      );
    }

    if (pendingTreatments.length === 0) {
      return (
        <div className="h-full text-center flex flex-col items-center justify-center">
          <FileText className="w-12 h-12 mb-2 text-primary" />
          <p className="text-lg">No pending payments</p>
          <Button
            color="primary"
            variant="flat"
            onPress={fetchData}
            className="mt-4"
          >
            Refresh
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {pendingTreatments.map((treatment) => (
          <Card key={treatment.treatmentID} className="w-full overflow-hidden">
            <CardBody className="max-h-[15vh]">
              <div className="w-full px-2 grid grid-cols-1 md:grid-cols-3 items-center">
                <div className="justify-between items-center">
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
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar size={18} className="mr-2 text-primary" />
                    <span className="text-sm font-medium">
                      Start: {formatDate(treatment.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Tag size={18} className="mr-2 text-primary" />
                    <Tooltip content="Treatment Type">
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
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Total Paid:</span>
                    <Chip color="success" variant="flat" size="sm">
                      LKR {treatment.totalPaid?.toFixed(2) ?? "N/A"}
                    </Chip>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Due Amount:</span>
                    <Chip color="warning" variant="flat" size="sm">
                      LKR {treatment.dueAmount?.toFixed(2) ?? "N/A"}
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

  const totalAmountDue = pendingTreatments.reduce(
    (sum, treatment) => sum + (treatment.dueAmount || 0),
    0
  );
  const totalPaid = pendingTreatments.reduce(
    (sum, treatment) => sum + (treatment.totalPaid || 0),
    0
  );
  const totalPatients = new Set(
    pendingTreatments.map((treatment) => treatment.patient.patientID)
  ).size;

  return (
    <Card className="w-full h-full overflow-hidden">
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
            <RefreshCw size={16} />
          </Button>
          <Tooltip content="View All Treatments" color="primary">
            <Link href="../treatments">
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
      <CardBody className="overflow-y-auto px-6">{renderContent()}</CardBody>
      <CardFooter className="flex justify-between items-center px-6 py-4 pt-6">
        <div className="flex flex-col">
          <p className="text-sm font-semibold ">
            Total Pending:{" "}
            <span className="text-primary">{pendingTreatments.length}</span>
          </p>
          <p className="text-sm font-semibold ">
            Total Patients:{" "}
            <span className="text-primary">{totalPatients}</span>
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm font-semibold ">
            Total Amount Due:{" "}
            <span className="text-warning">
              LKR {totalAmountDue.toFixed(2)}
            </span>
          </p>
          <p className="text-sm font-semibold ">
            Total Paid:{" "}
            <span className="text-success">LKR {totalPaid.toFixed(2)}</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
