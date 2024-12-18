"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Tooltip,
  Spinner,
} from "@nextui-org/react";
import {
  Calendar,
  User,
  AlertCircle,
  Stethoscope,
  Phone,
  Mail,
  RefreshCw,
  List,
} from "lucide-react";
import NewAppointmentButton from "./NewAppointmentButton";
import MedicalHistoryButton from "../MedicalHistory";
import Link from "next/link";

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

type Appointment = {
  appointmentID: number;
  patient: Patient;
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
      const today = new Date();
      const todayString = today.toISOString().split("T")[0];
      const response = await fetch(
        `${API_BASE_URL}/api/appointments?date=${todayString}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.statusText}`);
      }
      const data: Appointment[] = await response.json();

      // Filter appointments for today only
      const todayAppointments = data.filter(
        (appointment) => appointment.appointmentDate === todayString
      );

      setAppointments(
        todayAppointments.sort((a, b) =>
          a.appointmentTime.localeCompare(b.appointmentTime)
        )
      );
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "warning";
      case "confirmed":
        return "success";
      case "cancelled":
        return "danger";
      case "completed":
        return "primary";
      default:
        return "default";
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Spinner label="Loading appointments..." color="primary" size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full text-center text-danger flex flex-col items-center justify-center p-4 rounded-lg">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p className="text-lg font-semibold">Error: {error}</p>
          <Button
            color="danger"
            variant="flat"
            onPress={fetchAppointments}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (appointments.length === 0) {
      return (
        <div className="h-full text-center flex flex-col items-center justify-center p-4">
          <Calendar className="w-12 h-12 mb-2 text-primary" />
          <p className="text-lg">No appointments scheduled for today</p>
          <Button
            color="primary"
            variant="flat"
            onPress={fetchAppointments}
            className="mt-4"
          >
            Refresh
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 overflow-y-auto pr-2">
        {appointments.map((appointment) => (
          <Card key={appointment.appointmentID} className="overflow-hidden">
            <CardBody className="p-0">
              <div className="flex">
                <div className="flex-shrink-0 w-24 sm:w-32 p-4 flex flex-col justify-center items-center text-center">
                  <div className="text-2xl sm:text-3xl font-bold">
                    {formatTime(appointment.appointmentTime)}
                  </div>
                  <div className="text-xs sm:text-sm my-2">
                    {formatDate(appointment.appointmentDate)}
                  </div>
                  <Chip
                    variant="flat"
                    size="sm"
                    color={getStatusColor(appointment.status)}
                  >
                    {appointment.status}
                  </Chip>
                </div>
                <div className="flex-grow p-2 sm:p-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        {appointment.patient.firstName}{" "}
                        {appointment.patient.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <MedicalHistoryButton
                          patientId={appointment.patient.patientID}
                        />
                        <Tooltip content="View Full Details">
                          <Link href="../Appointments">
                            <Button
                              size="sm"
                              variant="ghost"
                              isIconOnly
                              aria-label="View Details"
                              color="primary"
                            >
                              <Stethoscope size={16} />
                            </Button>
                          </Link>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="w-full text-left text-sm mb-1">
                      <p className="mb-1">
                        <User className="inline w-4 h-4 mr-1 text-primary" />
                        Age: {calculateAge(appointment.patient.dob)} |{" "}
                        {appointment.patient.gender}
                      </p>
                      <p className="mb-1">
                        <Mail className="inline w-4 h-4 mr-1 text-primary" />
                        {appointment.patient.email}
                      </p>
                      <p className="mb-1">
                        <Phone className="inline w-4 h-4 mr-1 text-primary" />
                        {appointment.patient.contactNo}
                      </p>
                      <p className="inline mb-1 text-xs">
                        Patient ID: {appointment.patient.patientID}
                      </p>
                    </div>
                  </div>
                  <Chip color="primary" size="sm" variant="dot">
                    <strong>Reason:</strong> {appointment.reason}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex justify-between items-center px-6 py-4">
        <h2 className="text-xl font-bold flex items-center">
          <Calendar className="w-8 h-8 mr-3" />
          Today's Appointments
        </h2>
        <div className="flex items-center space-x-2">
          <NewAppointmentButton onAppointmentAdded={fetchAppointments} />
          <Tooltip content="Refresh" color="primary">
            <Button
              isIconOnly
              color="primary"
              variant="ghost"
              onPress={fetchAppointments}
              aria-label="Refresh appointments"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="View All Appointments" color="primary">
            <Link href="/appointments">
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
