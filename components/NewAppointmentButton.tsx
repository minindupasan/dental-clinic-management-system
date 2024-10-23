"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { CalendarPlus, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

type Appointment = {
  appointmentID: string;
  patientID: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
};

type Patient = {
  patientID: string;
  firstName: string;
  lastName: string;
};

export default function NewAppointmentButton({
  onAppointmentAdded,
}: {
  onAppointmentAdded: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAppointment, setNewAppointment] = useState<
    Omit<Appointment, "appointmentID">
  >({
    patientID: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewAppointment((prev) => ({
      ...prev,
      patientID: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Adding new appointment...");
    try {
      const response = await fetch(
        "http://localhost:8080/api/appointments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAppointment),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add new appointment");
      }

      const result = await response.json();
      toast.success(
        `New appointment added successfully! ID: ${result.appointmentID}`,
        {
          id: toastId,
        }
      );
      setNewAppointment({
        patientID: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
      });
      onClose();
      onAppointmentAdded();
    } catch (error) {
      console.error("Error adding new appointment:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add new appointment. Please try again.",
        { id: toastId }
      );
    }
  };

  return (
    <>
      <Button
        className="bg-primary-200 text-primary-600"
        onPress={onOpen}
        radius="full"
        startContent={<CalendarPlus className="w-4 h-4" />}
      >
        New Appointment
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                New Appointment
              </ModalHeader>
              <ModalBody>
                <Select
                  label="Patient"
                  placeholder="Select patient"
                  selectedKeys={[newAppointment.patientID]}
                  onChange={handlePatientChange}
                  required
                >
                  {patients.map((patient) => (
                    <SelectItem
                      className="text-foreground-light"
                      key={patient.patientID}
                      value={patient.patientID}
                    >
                      {`${patient.firstName} ${patient.lastName}`}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Appointment Date"
                  name="appointmentDate"
                  type="date"
                  value={newAppointment.appointmentDate}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Appointment Time"
                  name="appointmentTime"
                  type="time"
                  value={newAppointment.appointmentTime}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Reason"
                  name="reason"
                  value={newAppointment.reason}
                  onChange={handleInputChange}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="solid"
                  radius="full"
                  color="danger"
                  onPress={onClose}
                  className="text-danger-500 bg-danger-100"
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  radius="full"
                  className="text-success-600 bg-success-100"
                  type="submit"
                >
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
