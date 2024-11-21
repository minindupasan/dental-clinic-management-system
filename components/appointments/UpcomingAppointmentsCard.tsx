"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Button,
  Link,
} from "@nextui-org/react";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  Heart,
  Clipboard,
  List,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MedicalHistoryViewModal from "../MedicalHistory";

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
  treatment: string;
};

export default function UpcomingAppointmentsCard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data: Appointment[] = await response.json();
      const now = new Date();
      const filteredAppointments = data
        .filter((appointment) => {
          const appointmentDate = new Date(
            `${appointment.appointmentDate}T${appointment.appointmentTime}`
          );
          return appointmentDate > now;
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
          const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
          return dateA.getTime() - dateB.getTime();
        });
      setAppointments(filteredAppointments);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load appointments");
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
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
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

  return (
    <Card className="w-full max-w-3xl mx-auto h-60">
      <CardHeader className="flex justify-between items-center px-6 py-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          Upcoming Appointments
        </h2>
        <Link href="/Appointments">
          <Button
            color="secondary"
            radius="full"
            variant="ghost"
            startContent={<List className="h-4 w-4" />}
          >
            View 
          </Button>
        </Link>
      </CardHeader>
      <CardBody className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner label="Loading appointments..." color="primary" />
          </div>
        ) : error ? (
          <p className="text-center text-danger flex items-center justify-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </p>
        ) : appointments.length === 0 ? (
          <p className="text-center">No upcoming appointments scheduled.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.appointmentID}>
                <CardBody>
                  <div className="p-2 flex items-center space-x-1">
                    <div className="py-4 px-2 text-center min-w-[120px] rounded-lg">
                      <div className="text-3xl font-semibold flex items-center justify-center">
                        <Clock className="w-6 h-6 mr-2" />
                        {formatTime(appointment.appointmentTime)}
                      </div>
                      <div className="text-xl font-semibold flex items-center justify-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(appointment.appointmentDate)}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        <span className="font-semibold mr-2">Name:</span>
                        {appointment.patient.firstName}{" "}
                        {appointment.patient.lastName}
                      </p>
                      <p className="flex items-center">
                        <Heart className="w-5 h-5 mr-2" />
                        <span className="font-semibold mr-2">Age:</span>
                        {calculateAge(appointment.patient.dob)}
                      </p>
                      <p className="flex items-center">
                        <Clipboard className="w-5 h-5 mr-2" />
                        <span className="font-semibold mr-2">Reason:</span>
                        {appointment.reason}
                      </p>
                    </div>
                    <MedicalHistoryViewModal
                      patientId={appointment.patient.patientID}
                    />
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
