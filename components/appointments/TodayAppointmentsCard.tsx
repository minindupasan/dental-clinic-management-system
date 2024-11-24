"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Calendar,
  Clock,
  User,
  AlertCircle,
  RefreshCw,
  Clipboard,
  List,
} from "lucide-react";
import MedicalHistory from "../MedicalHistory";
import NewAppointmentButton from "./NewAppointmentButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Appointment = {
  appointmentID: number;
  patientID: number;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
};

export default function TodayAppointmentsCard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data: Appointment[] = await response.json();
      const today = new Date().toISOString().split("T")[0];
      const todayAppointments = data
        .filter((appointment) => appointment.appointmentDate === today)
        .sort((a, b) => {
          const timeA = new Date(
            `${a.appointmentDate}T${a.appointmentTime}`
          ).getTime();
          const timeB = new Date(
            `${b.appointmentDate}T${b.appointmentTime}`
          ).getTime();
          return timeA - timeB;
        });
      setAppointments(todayAppointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleAppointmentAdded = useCallback(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "warning";
      case "treated":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

  return (
    <Card className="w-full mx-auto max-h-[290px] h-full">
      <CardHeader className="flex justify-between items-center px-6 py-4">
        <h2 className="text-xl font-semibold flex items-center text-foreground">
          <Calendar className="w-8 h-8 mr-2" />
          Today's Appointments
        </h2>
        <div className="flex space-x-2">
          <Button
            isIconOnly
            color="primary"
            variant="ghost"
            onPress={fetchAppointments}
            aria-label="Refresh appointments"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/Appointments">
            <Button
              color="primary"
              variant="ghost"
              startContent={<List className="w-4 h-4" />}
              isIconOnly
            ></Button>
          </Link>
          <NewAppointmentButton onAppointmentAdded={handleAppointmentAdded} />
        </div>
      </CardHeader>
      <CardBody className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner
              label="Loading appointments..."
              color="primary"
              size="lg"
            />
          </div>
        ) : error ? (
          <div className="text-center text-danger flex flex-col items-center justify-center p-4 bg-danger-50 rounded-lg">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center flex flex-col items-center justify-center p-4">
            <Calendar className="w-12 h-12 mb-2 text-primary" />
            <p className="text-lg font-semibold">
              No appointments scheduled for today.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.appointmentID} className="min-h-[130px]">
                <CardBody className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4 items-center">
                      <div className="px-2 py-4 text-center min-w-[120px] rounded-lg">
                        <div className="text-2xl font-semibold flex items-center justify-center">
                          <Clock className="w-6 h-6 mr-2 text-primary" />
                          {formatTime(appointment.appointmentTime)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          Patient ID: {appointment.patientID}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="flex items-center">
                            <Clipboard className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-medium mr-1">Reason:</span>
                            {appointment.reason}
                          </p>
                          <p className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-medium mr-1">Status:</span>
                            <Chip
                              color={getStatusColor(appointment.status)}
                              size="sm"
                            >
                              {appointment.status}
                            </Chip>
                          </p>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <MedicalHistory patientId={appointment.patientID} />
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
