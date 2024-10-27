"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Chip,
} from "@nextui-org/react";
import {
  HeartPulse,
  User,
  Droplet,
  Stethoscope,
  Syringe,
  AlertTriangle,
  Phone,
  Pill,
} from "lucide-react";
import { toast } from "react-hot-toast";

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

interface MedicalHistoryViewModalProps {
  patientId: number;
}

export default function MedicalHistoryViewModal({
  patientId,
}: MedicalHistoryViewModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/medical-records/${patientId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedicalHistory(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`An error occurred while fetching data: ${errorMessage}`);
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch medical history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    onOpen();
    fetchMedicalHistory();
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    content: React.ReactNode
  ) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {content}
    </div>
  );

  return (
    <>
      <Button
        size="md"
        color="secondary"
        variant="flat"
        onPress={handleOpen}
        startContent={<HeartPulse size={16} />}
        isIconOnly
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
        classNames={{
          header: "border-b border-divider",
          footer: "border-t border-divider",
          body: "p-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">Medical History</h2>
              </ModalHeader>
              <ModalBody>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" color="primary" />
                  </div>
                ) : error ? (
                  <div className="text-center text-danger">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-4">{error}</p>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={fetchMedicalHistory}
                    >
                      Retry
                    </Button>
                  </div>
                ) : medicalHistory ? (
                  <div className="space-y-6">
                    {renderSection(
                      "Patient Information",
                      <User className="w-5 h-5" />,
                      <div className="grid grid-cols-2 gap-2">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {medicalHistory.patient.firstName}{" "}
                          {medicalHistory.patient.lastName}
                        </p>
                        <p className="flex gap-2">
                          <Droplet className="w-5 h-5" />
                          <span className="font-medium">Blood Type:</span>{" "}
                          <Chip color="danger" variant="flat">
                            {medicalHistory.bloodType}
                          </Chip>
                        </p>
                      </div>
                    )}

                    {renderSection(
                      "Medical Conditions",
                      <Stethoscope className="w-5 h-5" />,
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(medicalHistory)
                          .filter(
                            ([key, value]) =>
                              typeof value === "boolean" && value === true
                          )
                          .map(([key]) => (
                            <Chip key={key} color="warning" variant="flat">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Chip>
                          ))}
                      </div>
                    )}

                    {renderSection(
                      "Additional Information",
                      <Pill className="w-5 h-5" />,
                      <div className="grid gap-2">
                        <p>
                          <span className="font-medium">Surgeries:</span>{" "}
                          {medicalHistory.surgeries}
                        </p>
                        <p>
                          <span className="font-medium">
                            Current Medications:
                          </span>{" "}
                          {medicalHistory.currentMedications}
                        </p>
                        <p>
                          <span className="font-medium">Drug Allergies:</span>{" "}
                          {medicalHistory.drugAllergies}
                        </p>
                        <p>
                          <span className="font-medium">Allergies:</span>{" "}
                          {medicalHistory.allergies}
                        </p>
                        <p>
                          <span className="font-medium">
                            Medical Conditions:
                          </span>{" "}
                          {medicalHistory.medicalConditions}
                        </p>
                      </div>
                    )}

                    {renderSection(
                      "Emergency Contact",
                      <Phone className="w-5 h-5" />,
                      <div className="grid gap-2">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {medicalHistory.emergencyContactName}
                        </p>
                        <p>
                          <span className="font-medium">Number:</span>{" "}
                          {medicalHistory.emergencyContactNumber}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-lg font-medium">
                    No medical history found.
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
