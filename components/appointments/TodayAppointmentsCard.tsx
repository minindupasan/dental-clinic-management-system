"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clipboard,
  Heart,
} from "lucide-react";
import MedicalHistory from "../MedicalHistory";
import NewAppointmentButton from "./NewAppointmentButton";

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

export default function TodayAppointmentsCard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
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
  const handleAppointmentAdded = useCallback(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  return (
    <Card className="w-full max-w-3xl mx-auto h-60 ">
      <CardHeader className="flex justify-between items-center px-6 py-4 ">
        <h2 className="text-xl font-bold  flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          Today's Appointments
        </h2>
        <NewAppointmentButton onAppointmentAdded={handleAppointmentAdded} />
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
          <p className="text-center">No appointments scheduled for today.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card>
                <CardBody>
                  <div
                    key={appointment.appointmentID}
                    className=" p-2 flex items-center space-x-1"
                  >
                    <div className="px-2 py-4 text-center min-w-[120px] rounded-lg">
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
                    <MedicalHistory patientId={appointment.patient.patientID} />
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
