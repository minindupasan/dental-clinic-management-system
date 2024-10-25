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
} from "@nextui-org/react";
import { FileText, HeartPulse } from "lucide-react";
import { toast } from "react-hot-toast";

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
        `http://localhost:8080/api/medical-records/${patientId}`
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

  return (
    <>
      <Button
        size="sm"
        color="primary"
        variant="flat"
        onClick={handleOpen}
        startContent={<HeartPulse size={16} />}
        isIconOnly
      />
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Medical History
              </ModalHeader>
              <ModalBody>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner
                      label="Loading medical history..."
                      color="primary"
                    />
                  </div>
                ) : error ? (
                  <div className="text-center text-danger">
                    <p>{error}</p>
                    <Button
                      color="primary"
                      variant="light"
                      onClick={fetchMedicalHistory}
                      className="mt-4"
                    >
                      Retry
                    </Button>
                  </div>
                ) : medicalHistory ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Patient Information
                      </h3>
                      <p>
                        Name: {medicalHistory.patient.firstName}{" "}
                        {medicalHistory.patient.lastName}
                      </p>
                      <p>Blood Type: {medicalHistory.bloodType}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Medical Conditions
                      </h3>
                      <ul className="list-disc list-inside">
                        {Object.entries(medicalHistory)
                          .filter(
                            ([key, value]) =>
                              typeof value === "boolean" && value === true
                          )
                          .map(([key]) => (
                            <li key={key}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Additional Information
                      </h3>
                      <p>Surgeries: {medicalHistory.surgeries}</p>
                      <p>
                        Current Medications: {medicalHistory.currentMedications}
                      </p>
                      <p>Drug Allergies: {medicalHistory.drugAllergies}</p>
                      <p>Allergies: {medicalHistory.allergies}</p>
                      <p>
                        Medical Conditions: {medicalHistory.medicalConditions}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Emergency Contact
                      </h3>
                      <p>Name: {medicalHistory.emergencyContactName}</p>
                      <p>Number: {medicalHistory.emergencyContactNumber}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">No medical history found.</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
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
