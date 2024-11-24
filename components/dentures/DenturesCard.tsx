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
  Tooltip,
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
  List,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Denture = {
  dentureId: number;
  dentureType: string;
  materialType: string;
  trialDentureDate: string;
  estimatedDeliveryDate: string;
  receivedDate: string | null;
  remarks: string;
  cost: number;
  paymentStatus: string;
  deliveryStatus: string;
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
        throw new Error(`Failed to fetch dentures: ${response.statusText}`);
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
      setError("Error fetching the records");
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
    return date.toLocaleDateString("en-GB", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getDeliveryStatusColor = (status: string | undefined) => {
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
      case "in progress":
        return <ClipboardCopy className="w-12 h-12 text-primary m-5" />;
      case "cancelled":
      case "not completed":
        return <ClipboardX className="w-12 h-12 text-primary m-5" />;
      default:
        return <ClipboardCheck className="w-12 h-12 text-primary m-5" />;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Spinner label="Loading dentures..." color="primary" size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full text-center text-danger flex flex-col items-center justify-center p-4 rounded-lg">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p className="text-lg font-semibold">{error}</p>
          <Button
            color="danger"
            variant="flat"
            onPress={fetchDentures}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (dentures.length === 0) {
      return (
        <div className="h-full text-center flex flex-col items-center justify-center p-4">
          <FileText className="w-12 h-12 mb-2 text-primary" />
          <p className="text-lg">No denture records found</p>
          <Button
            color="primary"
            variant="flat"
            onPress={fetchDentures}
            className="mt-4"
          >
            Refresh
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {dentures.map((denture) => (
          <Card key={denture.dentureId} className="min-h-[130px]">
            <CardBody className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 items-center">
                  <div>{getOrderStatusIcon(denture.deliveryStatus)}</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Denture ID: {denture.dentureId}
                    </h3>
                    <p className="text-lg font-semibold mb-2">
                      Type: {denture.dentureType}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium mr-1">Trial Date:</span>
                        {formatDate(denture.trialDentureDate)}
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium mr-1">Est. Delivery:</span>
                        {formatDate(denture.estimatedDeliveryDate)}
                      </p>
                      <p className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium mr-1">Lab:</span>
                        {denture.labName}
                      </p>
                      <p className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium mr-1">Cost:</span>LKR{" "}
                        {denture.cost.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <Chip
                        startContent={<Truck className="w-4 h-4" />}
                        color={getDeliveryStatusColor(denture.deliveryStatus)}
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
    );
  };

  return (
    <Card className="w-full max-w-full mx-auto h-[80vh]">
      <CardHeader className="flex justify-between items-center px-6 py-4">
        <h2 className="text-2xl font-bold flex items-center text-foreground">
          <FileText className="w-8 h-8 mr-2" />
          Dentures in Progress
        </h2>
        <div className="flex space-x-2">
          <Tooltip content="New Denture" color="primary">
            <Button
              isIconOnly
              color="primary"
              variant="ghost"
              onPress={fetchDentures}
              aria-label="Refresh dentures"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="View All Dentures" color="primary">
            <Link href="../Dentures">
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
      <CardBody className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {renderContent()}
      </CardBody>
    </Card>
  );
}
