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
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { CalendarPlus } from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Appointment = {
  appointmentID: string;
  formattedAppointmentID: string;
  patientID: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
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
    Omit<Appointment, "appointmentID" | "status"> & { status: string }
  >({
    patientID: "",
    formattedAppointmentID: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "Scheduled",
  });
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients`);
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
    const { value } = e.target;
    setNewAppointment((prev) => ({
      ...prev,
      patientID: value,
    }));
  };

  const validateAppointmentDateTime = () => {
    const now = new Date();
    const appointmentDateTime = new Date(
      `${newAppointment.appointmentDate}T${newAppointment.appointmentTime}`
    );
    return appointmentDateTime > now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAppointmentDateTime()) {
      toast.error("Appointment date and time must be in the future.");
      return;
    }

    const toastId = toast.loading("Adding new appointment...");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/appointments/create/${newAppointment.patientID}`,
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
        `New appointment added successfully! ID: ${result.formattedAppointmentID}`,
        {
          id: toastId,
        }
      );
      setNewAppointment({
        patientID: "",
        formattedAppointmentID: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        status: "Scheduled",
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
        color="primary"
        variant="solid"
        onClick={onOpen}
        radius="full"
        startContent={<CalendarPlus className="w-4 h-4" />}
      >
        New Appointment
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="md" hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                New Appointment
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  label="Patient"
                  placeholder="Select patient"
                  onChange={(e) =>
                    handlePatientChange(
                      e as unknown as React.ChangeEvent<HTMLSelectElement>
                    )
                  }
                  required
                >
                  {patients.map((patient) => (
                    <AutocompleteItem
                      key={patient.patientID}
                      value={patient.patientID}
                    >
                      {`${patient.firstName} ${patient.lastName}`}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
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
                  variant="ghost"
                  radius="full"
                  color="danger"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  radius="full"
                  color="success"
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
