"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Button,
  Link,
  Chip,
} from "@nextui-org/react";
import {
  Truck,
  CreditCard,
  AlertCircle,
  FileText,
  RefreshCw,
  Calendar,
  Clock,
  DollarSign,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardX,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

type Denture = {
  dentureId: number;
  patient: Patient;
  dentureType: string;
  materialType: string;
  trialDentureDate: string;
  estimatedDeliveryDate: string;
  receivedDate: string | null;
  deliveryStatus: string;
  remarks: string;
  cost: number;
  paymentStatus: string;
  labName: string;
  orderedDate: string;
};

export default function DenturesCard() {
  const [dentures, setDentures] = useState<Denture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchDentures = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/dentures`);
      if (!response.ok) {
        throw new Error("Failed to fetch dentures");
      }
      const data: Denture[] = await response.json();
      console.log("Fetched dentures:", data);
      const sortedDentures = data.sort((a, b) => {
        return (
          new Date(a.estimatedDeliveryDate).getTime() -
          new Date(b.estimatedDeliveryDate).getTime()
        );
      });
      setDentures(sortedDentures);
    } catch (err) {
      console.error("Error fetching dentures:", err);
      setError("Failed to load dentures");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDentures();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "default";
    switch (status.toLowerCase()) {
      case "in progress":
        return "warning";
      case "completed":
        return "success";
      case "delayed":
        return "danger";
      default:
        return "default";
    }
  };

  const getDeliveryStatusColor = (status: string | undefined) => {
    if (!status) return "default";
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: string | undefined) => {
    if (!status) return "default";
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "paid":
        return "success";
      case "partially paid":
        return "primary";
      case "overdue":
        return "danger";
      default:
        return "default";
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <ClipboardCheck className="w-12 h-12 text-primary m-5" />;
      case "pending":
        return <ClipboardCopy className="w-12 h-12 text-primary m-5" />;
      case "cancelled":
      case "not completed":
        return <ClipboardX className="w-12 h-12 text-primary m-5" />;
      default:
        return <ClipboardCheck className="w-12 h-12 text-primary m-5" />;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-background to-background/80 dark:from-default-100 dark:to-default-50 backdrop-blur-xl backdrop-saturate-150 border border-divider shadow-xl">
      <CardHeader className="flex justify-between items-center px-6 py-4 bg-background/60 dark:bg-default-100/50 border-b border-divider">
        <h2 className="text-2xl font-bold flex items-center text-foreground">
          <FileText className="w-8 h-8 mr-2 text-primary" />
          Dentures in Progress
        </h2>
        <div className="flex space-x-2">
          <Button
            isIconOnly
            color="primary"
            variant="light"
            onPress={fetchDentures}
            aria-label="Refresh dentures"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/Dentures">
            <Button color="primary" variant="flat">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardBody className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner label="Loading dentures..." color="primary" size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-danger flex flex-col items-center justify-center p-4 bg-danger-50 rounded-lg">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        ) : dentures.length === 0 ? (
          <div className="text-center text-foreground/60 flex flex-col items-center justify-center p-4 bg-default-100 rounded-lg">
            <FileText className="w-12 h-12 mb-2 text-primary" />
            <p className="text-lg font-semibold">No dentures in progress</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dentures.map((denture) => (
              <Card key={denture.dentureId} className="min-h-[130px]">
                <CardBody className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 items-center">
                      <div>{getOrderStatusIcon(denture.deliveryStatus)}</div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Denture ID: {denture.dentureId}
                        </h3>
                        <p className="text-sm mb-2">
                          Patient: {denture.patient.firstName}{" "}
                          {denture.patient.lastName}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-medium mr-1">
                              Trial Date:
                            </span>
                            {formatDate(denture.trialDentureDate)}
                          </p>
                          <p className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-medium mr-1">
                              Est. Delivery:
                            </span>
                            {formatDate(denture.estimatedDeliveryDate)}
                          </p>
                          <p className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-medium mr-1">Lab:</span>
                            {denture.labName}
                          </p>
                          <p className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-medium mr-1">Cost:</span>$
                            {denture.cost.toFixed(2)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <Chip
                            color={getStatusColor(denture.deliveryStatus)}
                            variant="flat"
                            size="sm"
                            className="px-2 gap-1"
                          >
                            {denture.deliveryStatus}
                          </Chip>
                          <Chip
                            startContent={<Truck className="w-4 h-4" />}
                            color={getDeliveryStatusColor(
                              denture.deliveryStatus
                            )}
                            variant="flat"
                            size="sm"
                            className="px-2 gap-1"
                          >
                            {denture.deliveryStatus}
                          </Chip>
                          <Chip
                            startContent={<CreditCard className="w-4 h-4" />}
                            color={getPaymentStatusColor(denture.paymentStatus)}
                            variant="flat"
                            size="sm"
                            className="px-2 gap-1"
                          >
                            {denture.paymentStatus}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
