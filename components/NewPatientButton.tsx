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
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.API_URL;

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

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export default function AddPatientButton({
  onPatientAdded,
}: {
  onPatientAdded: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPatient, setNewPatient] = useState<
    Omit<Patient, "patientID" | "createdDate">
  >({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    contactNo: "",
    dob: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewPatient((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  const handleRegisteredChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewPatient((prev) => ({
      ...prev,
      isRegistered: e.target.value === "true",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Adding new patient...");
    try {
      const patientWithDate = {
        ...newPatient,
        createdDate: new Date().toISOString().split("T")[0],
      };
      const response = await fetch(`${API_URL}/api/patients/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientWithDate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add new patient");
      }

      const result = await response.json();
      toast.success(`New patient added successfully! ID: ${result.patientID}`, {
        id: toastId,
      });
      setNewPatient({
        firstName: "",
        lastName: "",
        email: "",
        contactNo: "",
        gender: "",
        dob: "",
      });
      onClose();
      onPatientAdded();
    } catch (error) {
      console.error("Error adding new patient:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add new patient. Please try again.",
        { id: toastId }
      );
    }
  };

  return (
    <>
      <Button
        color="primary"
        variant="ghost"
        onPress={onOpen}
        radius="full"
        startContent={<CirclePlus size={16} />}
      >
        Add New Patient
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
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
                  label="Contact No"
                  name="contactNo"
                  type="tel"
                  value={newPatient.contactNo}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={[newPatient.gender]}
                  onChange={handleGenderChange}
                  required
                >
                  {genderOptions.map((option) => (
                    <SelectItem
                      className="text-foreground-light"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={newPatient.dob}
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
