"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Button,
  Link,
  Badge,
} from "@nextui-org/react";
import {
  User,
  AlertCircle,
  Calendar,
  DollarSign,
  List,
  FileText,
  File,
  Clock,
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
  dentureID: number;
  patient: Patient;
  type: string;
  material: string;
  status: string;
  startDate: string;
  estimatedCompletionDate: string;
  cost: number;
};

export default function DenturesCard() {
  const [dentures, setDentures] = useState<Denture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchDentures = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dentures`);
      if (!response.ok) {
        throw new Error("Failed to fetch dentures");
      }
      const data: Denture[] = await response.json();
      const sortedDentures = data
        .filter((denture) => denture && denture.status) // Filter out dentures with undefined status
        .sort((a, b) => {
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        });
      setDentures(sortedDentures);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load dentures");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDentures();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
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

  return (
    <Card className="w-full max-w-3xl h-full mx-auto bg-background/60 dark:bg-default-100/50 backdrop-blur-lg backdrop-saturate-150">
      <CardHeader className="flex justify-between items-center px-6 py-4">
        <h2 className="text-2xl font-bold flex items-center text-foreground">
          <File className="w-8 h-8 mr-2 text-primary" />
          Dentures in Progress
        </h2>
        <Link href="/Dentures">
          <Button
            color="primary"
            variant="flat"
            endContent={<List className="h-4 w-4" />}
          >
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardBody className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner label="Loading dentures..." color="primary" size="lg" />
          </div>
        ) : error ? (
          <p className="text-center text-danger flex items-center justify-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </p>
        ) : dentures.length === 0 ? (
          <p className="text-center text-foreground/60">
            No dentures in progress.
          </p>
        ) : (
          <div className="space-y-4">
            {dentures.map((denture) => (
              <Card
                key={denture.dentureID}
                className="shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <CardBody className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-primary mb-2" />
                        <Badge
                          color={getStatusColor(denture.status)}
                          variant="flat"
                        >
                          {denture.status || "Unknown"}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {denture.type || "Unknown Type"}
                        </h3>
                        <p className="text-sm text-foreground/60 mb-2">
                          {denture.material || "Unknown Material"}
                        </p>
                        <p className="flex items-center text-sm mb-1">
                          <User className="w-4 h-4 mr-2 text-foreground/60" />
                          <span className="font-medium mr-1">Patient:</span>
                          {denture.patient
                            ? `${denture.patient.firstName} ${denture.patient.lastName}`
                            : "Unknown"}
                        </p>
                        <p className="flex items-center text-sm mb-1">
                          <Calendar className="w-4 h-4 mr-2 text-foreground/60" />
                          <span className="font-medium mr-1">Start:</span>
                          {formatDate(denture.startDate)}
                        </p>
                        <p className="flex items-center text-sm mb-1">
                          <Clock className="w-4 h-4 mr-2 text-foreground/60" />
                          <span className="font-medium mr-1">
                            Est. Completion:
                          </span>
                          {formatDate(denture.estimatedCompletionDate)}
                        </p>
                        <p className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 mr-2 text-foreground/60" />
                          <span className="font-medium mr-1">Cost:</span>$
                          {denture.cost ? denture.cost.toFixed(2) : "N/A"}
                        </p>
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
