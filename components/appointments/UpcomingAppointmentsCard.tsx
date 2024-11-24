"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
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
  FileText,
  Stethoscope,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";
import NewAppointmentButton from "./NewAppointmentButton";
import MedicalHistoryButton from "../MedicalHistory";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Appointment = {
  appointmentID: number;
  patientID: number;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
};

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

type AppointmentWithPatient = Appointment & { patient: Patient };

export default function TodayAppointmentsCard() {
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointmentsAndPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const todayDate = new Date().toISOString().split("T")[0];
      const appointmentsResponse = await fetch(
        `${API_BASE_URL}/api/appointments?date=${todayDate}`
      );
      if (!appointmentsResponse.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const appointmentsData: Appointment[] = await appointmentsResponse.json();

      const appointmentsWithPatients = await Promise.all(
        appointmentsData.map(async (appointment) => {
          const patientResponse = await fetch(
            `${API_BASE_URL}/api/patients/${appointment.patientID}`
          );
          if (!patientResponse.ok) {
            throw new Error(
              `Failed to fetch patient with ID ${appointment.patientID}`
            );
          }
          const patientData: Patient = await patientResponse.json();
          return { ...appointment, patient: patientData };
        })
      );

      setAppointments(
        appointmentsWithPatients.sort((a, b) =>
          a.appointmentTime.localeCompare(b.appointmentTime)
        )
      );
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentsAndPatients();
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

  return (
    <Card className="w-full mx-auto h-[calc(100vh-520px)]">
      <CardBody className="p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Calendar className="w-8 h-8 mr-3" />
            Today's Appointments
          </h2>
          <div className="flex items-center space-x-2">
            <Tooltip content="Refresh">
              <Button
                variant="ghost"
                color="primary"
                isIconOnly
                aria-label="Refresh"
                onClick={fetchAppointmentsAndPatients}
              >
                <RefreshCw size={16} />
              </Button>
            </Tooltip>
            <NewAppointmentButton
              onAppointmentAdded={fetchAppointmentsAndPatients}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <Spinner size="lg" color="primary" />
          </div>
        ) : error ? (
          <div className="text-center text-danger-500 p-6 rounded-xl shadow-inner">
            <AlertCircle className="w-10 h-10 mx-auto mb-3" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center p-10 ">
            <Calendar className="w-16 h-16 mx-auto mb-4 " />
            <p className="text-xl font-semibold">
              No appointments scheduled for today.
            </p>
          </div>
        ) : (
          <div className="space-y-6 overflow-y-auto pr-2">
            {appointments.map((appointment) => (
              <Card key={appointment.appointmentID} className="overflow-hidden">
                <CardBody className="p-0">
                  <div className="flex ">
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
                              <Link href={"../Appointments"}>
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
                            <User className="inline w-4 h-4 mr-1" />
                            Age: {calculateAge(appointment.patient.dob)} |{" "}
                            {appointment.patient.gender}
                          </p>
                          <p className="mb-1">
                            <Mail className="inline w-4 h-4 mr-1" />
                            {appointment.patient.email}
                          </p>
                          <p className="mb-1">
                            <Phone className="inline w-4 h-4 mr-1" />
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
        )}
      </CardBody>
    </Card>
  );
}
