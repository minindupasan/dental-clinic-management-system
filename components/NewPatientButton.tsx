"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Checkbox,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "lucide-react";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  medicalRecords: string;
  dob: string;
  isRegistered: boolean;
};

export default function AddPatientButton({
  onPatientAdded,
}: {
  onPatientAdded: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPatient, setNewPatient] = useState<Omit<Patient, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    medicalRecords: "",
    dob: "",
    isRegistered: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/patients/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPatient),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add new patient");
      }

      // Reset form and close modal on success
      setNewPatient({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        medicalRecords: "",
        dob: "",
        isRegistered: false,
      });
      onClose();
      // Notify parent component that a new patient was added
      onPatientAdded();
    } catch (error) {
      console.error("Error adding new patient:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary" endContent={<PlusIcon />}>
        Add New Patient
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Add New Patient
            </ModalHeader>
            <ModalBody>
              <Input
                label="First Name"
                name="firstName"
                value={newPatient.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={newPatient.lastName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={newPatient.email}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Gender"
                name="gender"
                value={newPatient.gender}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Medical Records"
                name="medicalRecords"
                value={newPatient.medicalRecords}
                onChange={handleInputChange}
              />
              <Input
                label="Date of Birth"
                name="dob"
                type="date"
                value={newPatient.dob}
                onChange={handleInputChange}
                required
              />
              <Checkbox
                name="isRegistered"
                isSelected={newPatient.isRegistered}
                onValueChange={(checked) =>
                  setNewPatient((prev) => ({ ...prev, isRegistered: checked }))
                }
              >
                Registered
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Add Patient
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
