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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { toast, Toaster } from "react-hot-toast";
import { UserPlus } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    gender: "",
    dob: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
      if (response.ok) {
        toast.success("Patient created successfully");
        setIsOpen(false);
        setPatientData({
          firstName: "",
          lastName: "",
          email: "",
          contactNo: "",
          gender: "",
          dob: "",
        });
        // Auto refresh after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create patient");
      }
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <Button
        onPress={() => setIsOpen(true)}
        color="primary"
        variant="ghost"
        radius="full"
        startContent={<UserPlus size={16} />}
      >
        Create New Patient
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Patient
              </ModalHeader>
              <ModalBody>
                <form
                  id="patientForm"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={patientData.firstName}
                      onChange={handleInputChange}
                      isRequired
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={patientData.lastName}
                      onChange={handleInputChange}
                      isRequired
                    />
                  </div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={patientData.email}
                    onChange={handleInputChange}
                    isRequired
                  />
                  <Input
                    label="Contact Number"
                    name="contactNo"
                    value={patientData.contactNo}
                    onChange={handleInputChange}
                    isRequired
                  />
                  <Select
                    label="Gender"
                    name="gender"
                    selectedKeys={
                      patientData.gender ? [patientData.gender] : []
                    }
                    onSelectionChange={(keys) =>
                      setPatientData((prev) => ({
                        ...prev,
                        gender: Array.from(keys)[0] as string,
                      }))
                    }
                    isRequired
                  >
                    <SelectItem key="Male" value="Male">
                      Male
                    </SelectItem>
                    <SelectItem key="Female" value="Female">
                      Female
                    </SelectItem>
                    <SelectItem key="Other" value="Other">
                      Other
                    </SelectItem>
                  </Select>
                  <Input
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={patientData.dob}
                    onChange={handleInputChange}
                    isRequired
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onPress={onClose}
                  variant="flat"
                  radius="full"
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  variant="flat"
                  radius="full"
                  type="submit"
                  form="patientForm"
                  isLoading={isLoading}
                >
                  Create Patient
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
