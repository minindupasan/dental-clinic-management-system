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
  Input,
  Textarea,
  Switch,
} from "@nextui-org/react";
import {
  HeartPulse,
  User,
  Droplet,
  Stethoscope,
  Pill,
  AlertTriangle,
  Phone,
  Plus,
  Edit,
  Save,
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

interface MedicalHistoryButtonProps {
  patientId: number;
}

export default function MedicalHistoryButton({
  patientId,
}: MedicalHistoryButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchMedicalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/medical-records/${patientId}`
      );
      if (response.status === 404) {
        setMedicalHistory(null);
        return;
      }
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

  const createNewMedicalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/medical-records/create/${patientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patientId }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedicalHistory(data);
      setIsEditing(true);
      toast.success("New medical history created successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        `An error occurred while creating new medical history: ${errorMessage}`
      );
      console.error("Error creating new medical history:", err);
      toast.error("Failed to create new medical history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateMedicalHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/medical-records/update/${patientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(medicalHistory),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMedicalHistory(data);
      setIsEditing(false);
      toast.success("Medical history updated successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        `An error occurred while updating medical history: ${errorMessage}`
      );
      console.error("Error updating medical history:", err);
      toast.error("Failed to update medical history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    onOpen();
    fetchMedicalHistory();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMedicalHistory((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSwitchChange = (name: string) => (isSelected: boolean) => {
    setMedicalHistory((prev) =>
      prev ? { ...prev, [name]: isSelected } : null
    );
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

  const renderEditableField = (
    label: string,
    name: string,
    value: string,
    type: "input" | "textarea" = "input"
  ) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {type === "input" ? (
        <Input
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full"
        />
      ) : (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full"
        />
      )}
    </div>
  );

  const renderEditableSwitches = () => (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(medicalHistory!)
        .filter(([key, value]) => typeof value === "boolean")
        .map(([key, value]) => (
          <Switch
            key={key}
            isSelected={value as boolean}
            onValueChange={handleSwitchChange(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Switch>
        ))}
    </div>
  );

  return (
    <>
      <Button
        size="md"
        color="primary"
        variant="flat"
        onPress={handleOpen}
        startContent={<HeartPulse size={16} />}
      >
        Medical History
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
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
                    {isEditing ? (
                      <>
                        {renderSection(
                          "Patient Information",
                          <User className="w-5 h-5" />,
                          <div className="grid grid-cols-2 gap-4">
                            {renderEditableField(
                              "Blood Type",
                              "bloodType",
                              medicalHistory.bloodType
                            )}
                          </div>
                        )}
                        {renderSection(
                          "Medical Conditions",
                          <Stethoscope className="w-5 h-5" />,
                          renderEditableSwitches()
                        )}
                        {renderSection(
                          "Additional Information",
                          <Pill className="w-5 h-5" />,
                          <>
                            {renderEditableField(
                              "Surgeries",
                              "surgeries",
                              medicalHistory.surgeries,
                              "textarea"
                            )}
                            {renderEditableField(
                              "Current Medications",
                              "currentMedications",
                              medicalHistory.currentMedications,
                              "textarea"
                            )}
                            {renderEditableField(
                              "Drug Allergies",
                              "drugAllergies",
                              medicalHistory.drugAllergies,
                              "textarea"
                            )}
                            {renderEditableField(
                              "Allergies",
                              "allergies",
                              medicalHistory.allergies,
                              "textarea"
                            )}
                            {renderEditableField(
                              "Medical Conditions",
                              "medicalConditions",
                              medicalHistory.medicalConditions,
                              "textarea"
                            )}
                          </>
                        )}
                        {renderSection(
                          "Emergency Contact",
                          <Phone className="w-5 h-5" />,
                          <>
                            {renderEditableField(
                              "Name",
                              "emergencyContactName",
                              medicalHistory.emergencyContactName
                            )}
                            {renderEditableField(
                              "Number",
                              "emergencyContactNumber",
                              medicalHistory.emergencyContactNumber
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
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
                              <span className="font-medium">
                                Blood Type:
                              </span>{" "}
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
                              <span className="font-medium">
                                Drug Allergies:
                              </span>{" "}
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
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-medium mb-4">
                      No medical history found.
                    </p>
                    <Button
                      color="primary"
                      startContent={<Plus size={16} />}
                      onPress={createNewMedicalHistory}
                    >
                      Create New Medical History
                    </Button>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {medicalHistory &&
                  (isEditing ? (
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={updateMedicalHistory}
                      startContent={<Save size={16} />}
                    >
                      Save Changes
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={() => setIsEditing(true)}
                      startContent={<Edit size={16} />}
                    >
                      Edit Medical History
                    </Button>
                  ))}
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
