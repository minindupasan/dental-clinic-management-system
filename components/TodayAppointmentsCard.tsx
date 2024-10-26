"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
import NewAppointmentButton from "./NewAppointmentButton";
import MedicalHistoryModal from "./MedicalHistoryModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

export default function TodayAppointmentsCard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/appointments`);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data: Appointment[] = await response.json();
      const today = new Date().toISOString().split("T")[0];
      const todayAppointments = data.filter(
        (appointment) => appointment.appointmentDate === today
      );
      setAppointments(todayAppointments);
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
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Today's Appointments</h2>
        <NewAppointmentButton onAppointmentAdded={fetchAppointments} />
      </CardHeader>
      <CardBody className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner label="Loading appointments..." />
          </div>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : appointments.length === 0 ? (
          <p className="text-center">No appointments scheduled for today.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.appointmentID}
                className="bg-default-100 rounded-xl p-4 flex items-start space-x-4 items-center"
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
                    {appointment.patient.firstName}{" "}
                    {appointment.patient.lastName}
                  </p>
                  <p>
                    <span className="font-semibold mr-2">Age:</span>
                    {calculateAge(appointment.patient.dob)}
                  </p>
                  <p>
                    <span className="font-semibold mr-2">Reason:</span>
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
