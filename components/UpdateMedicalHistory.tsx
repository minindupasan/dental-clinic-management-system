"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Textarea,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { HeartPulse } from "lucide-react";

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
};

type MedicalHistory = {
  recordID: number;
  patient: Patient;
  bloodType: string;
  diabetes: boolean;
  hypertension: boolean;
  heartDisease: boolean;
  bleedingDisorders: boolean;
  osteoporosis: boolean;
  arthritis: boolean;
  asthma: boolean;
  epilepsy: boolean;
  hivAids: boolean;
  hepatitis: boolean;
  thyroidDisorder: boolean;
  pregnancy: boolean | null;
  surgeries: string;
  currentMedications: string;
  drugAllergies: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
};

export default function MedicalHistoryModal({
  patientId,
}: {
  patientId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedicalHistory();
    }
  }, [isOpen]);

  const fetchMedicalHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/medical-records");
      if (!response.ok) {
        throw new Error("Failed to fetch medical history");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setMedicalHistory(data[0]);
      } else {
        throw new Error("No medical history found");
      }
    } catch (err) {
      setError("An error occurred while fetching data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConditionChange = (condition: keyof MedicalHistory) => {
    if (medicalHistory) {
      setMedicalHistory((prev) => ({
        ...prev!,
        [condition]: !prev![condition as keyof MedicalHistory],
      }));
    }
  };

  const handleInputChange = (
    field: keyof MedicalHistory,
    value: string | boolean | null
  ) => {
    if (medicalHistory) {
      setMedicalHistory((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const handleUpdate = async (onClose: () => void) => {
    if (!medicalHistory) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(
        `http://localhost:8080/api/medical-records/update/${medicalHistory.recordID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(medicalHistory),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update medical history");
      }

      const updatedMedicalHistory: MedicalHistory = await response.json();
      setMedicalHistory(updatedMedicalHistory);
      setSuccessMessage("Medical history updated successfully!");

      // Show success message for 3 seconds, then close the modal
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 3000);
    } catch (err) {
      setError("An error occurred while updating data. Please try again.");
      console.error("Error updating data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="flat"
        color="secondary"
        onPress={onOpen}
        startContent={<HeartPulse size={16} />}
        isIconOnly
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="xl"
        className="text-foreground-light"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Medical History
              </ModalHeader>
              <ModalBody>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500">{error}</div>
                ) : successMessage ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center text-green-500">
                      <Spinner color="success" size="lg" className="mb-4" />
                      <p>{successMessage}</p>
                    </div>
                  </div>
                ) : medicalHistory ? (
                  <>
                    <Select
                      label="Blood Type"
                      selectedKeys={[medicalHistory.bloodType]}
                      onChange={(e) =>
                        handleInputChange("bloodType", e.target.value)
                      }
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        )
                      )}
                    </Select>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        Medical Conditions:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(medicalHistory)
                          .filter(([key, value]) => typeof value === "boolean")
                          .map(([key, value]) => (
                            <Checkbox
                              className="text-danger-700"
                              color="primary"
                              key={key}
                              isSelected={value as boolean}
                              onValueChange={() =>
                                handleConditionChange(
                                  key as keyof MedicalHistory
                                )
                              }
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Checkbox>
                          ))}
                      </div>
                    </div>
                    <Textarea
                      label="Surgeries"
                      value={medicalHistory.surgeries}
                      onChange={(e) =>
                        handleInputChange("surgeries", e.target.value)
                      }
                    />
                    <Textarea
                      label="Current Medications"
                      value={medicalHistory.currentMedications}
                      onChange={(e) =>
                        handleInputChange("currentMedications", e.target.value)
                      }
                    />
                    <Textarea
                      label="Drug Allergies"
                      value={medicalHistory.drugAllergies}
                      onChange={(e) =>
                        handleInputChange("drugAllergies", e.target.value)
                      }
                    />
                    <Textarea
                      label="Allergies"
                      value={medicalHistory.allergies}
                      onChange={(e) =>
                        handleInputChange("allergies", e.target.value)
                      }
                    />
                    <Textarea
                      label="Medical Conditions"
                      value={medicalHistory.medicalConditions}
                      onChange={(e) =>
                        handleInputChange("medicalConditions", e.target.value)
                      }
                    />
                    <Input
                      label="Emergency Contact Name"
                      value={medicalHistory.emergencyContactName}
                      onChange={(e) =>
                        handleInputChange(
                          "emergencyContactName",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      label="Emergency Contact Number"
                      value={medicalHistory.emergencyContactNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "emergencyContactNumber",
                          e.target.value
                        )
                      }
                    />
                  </>
                ) : (
                  <div className="text-center">No medical history found.</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleUpdate(onClose)}
                  isLoading={isLoading}
                  isDisabled={!medicalHistory}
                >
                  Update Details
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
