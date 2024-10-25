"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Button, Spinner } from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import MedicalHistoryModal from "./MedicalHistoryModal";
import NewAppointmentButton from "./NewAppointmentButton";

type Patient = {
  patientID: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  gender: string;
  medicalRecords: string;
  dob: string;
  createdDate: string;
  bloodType: string;
  surgeries: string;
  chronicConditions: string;
  previousIllnesses: string;
  currentMedications: string;
  previousMedications: string;
  drugAllergies: string;
  cardiovascularIssues: string;
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

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/appointments");
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data: Appointment[] = await response.json();
      const now = new Date();
      const upcomingAppointments = data
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
      setAppointments(upcomingAppointments);
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
        <h2 className="text-xl font-bold">Today's Appointments</h2>
      </CardHeader>
      <CardBody className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner label="Loading appointments..." />
          </div>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : appointments.length === 0 ? (
          <p className="text-center">No upcoming appointments scheduled.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.appointmentID}
                className="bg-primary-100 rounded-xl p-4 flex items-start space-x-4"
              >
                <div className="bg-content1 rounded-xl p-4 text-center min-w-[120px]">
                  <div className="text-3xl font-semibold">
                    {formatTime(appointment.appointmentTime)}
                  </div>
                  <div className="text-default-500">
                    {formatDate(appointment.appointmentDate)}
                  </div>
                </div>
                <div className="flex-grow">
                  <p>
                    <span className="font-semibold mr-2">Name:</span>
                    Name: {appointment.patient.firstName}{" "}
                    {appointment.patient.lastName}
                  </p>
                  <p>
                    <span className="font-semibold mr-2">Age:</span>{" "}
                    {calculateAge(appointment.patient.dob)}
                  </p>
                  <p>
                    <span className="font-semibold mr-2">Reason:</span>{" "}
                    {appointment.reason}
                  </p>
                  <MedicalHistoryModal patientId={""} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
