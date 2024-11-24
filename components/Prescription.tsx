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
  Input,
  Textarea,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import {
  Pill,
  AlertTriangle,
  Plus,
  Edit,
  Save,
  Calendar,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Medication = {
  medicationName: string;
  dosage: string;
  frequency: number;
  duration: number;
  frequencyDisplay?: string;
  durationDisplay?: string;
};

type Prescription = {
  prescriptionId: number;
  appointmentId: number;
  dateIssued: string;
  notes: string;
  medications: Medication[];
};

interface PrescriptionButtonProps {
  appointmentId: number;
}

export default function PrescriptionButton({
  appointmentId,
}: PrescriptionButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchPrescription = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/prescriptions/${appointmentId}`
      );
      if (response.status === 404) {
        setPrescription(null);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPrescription(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`An error occurred while fetching data: ${errorMessage}`);
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createNewPrescription = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/prescriptions/create/${appointmentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dateIssued: new Date().toISOString().split("T")[0],
            notes: "Patient should take medications after meals.",
            medications: [
              {
                medicationName: "Amoxicillin",
                dosage: "500 mg",
                frequency: 3,
                duration: 7,
              },
            ],
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPrescription(data);
      setIsEditing(true);
      toast.success("New prescription created successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        `An error occurred while creating new prescription: ${errorMessage}`
      );
      console.error("Error creating new prescription:", err);
      toast.error("Failed to create new prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updatePrescription = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/prescriptions/update/${prescription?.prescriptionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prescription),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPrescription(data);
      setIsEditing(false);
      toast.success("Prescription updated successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        `An error occurred while updating prescription: ${errorMessage}`
      );
      console.error("Error updating prescription:", err);
      toast.error("Failed to update prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    onOpen();
    fetchPrescription();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPrescription((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string | number
  ) => {
    setPrescription((prev) => {
      if (!prev) return null;
      const newMedications = [...prev.medications];
      newMedications[index] = { ...newMedications[index], [field]: value };
      return { ...prev, medications: newMedications };
    });
  };

  const addMedication = () => {
    setPrescription((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        medications: [
          ...prev.medications,
          { medicationName: "", dosage: "", frequency: 1, duration: 1 },
        ],
      };
    });
  };

  const removeMedication = (index: number) => {
    setPrescription((prev) => {
      if (!prev) return null;
      const newMedications = prev.medications.filter((_, i) => i !== index);
      return { ...prev, medications: newMedications };
    });
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
        className="block text-sm font-medium text-neutral-400 mb-1"
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

  return (
    <>
      <Tooltip content="View Prescription">
        <Button
          size="md"
          color="secondary"
          variant="flat"
          onPress={handleOpen}
          isIconOnly
          aria-label="View Prescription"
        >
          <Pill size={16} />
        </Button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
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
                <h2 className="text-2xl font-bold">Prescription</h2>
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
                      onPress={fetchPrescription}
                    >
                      Retry
                    </Button>
                  </div>
                ) : prescription ? (
                  <div className="space-y-6">
                    {isEditing ? (
                      <>
                        {renderSection(
                          "Prescription Details",
                          <Calendar className="w-5 h-5" />,
                          <>
                            {renderEditableField(
                              "Date Issued",
                              "dateIssued",
                              prescription.dateIssued
                            )}
                            {renderEditableField(
                              "Notes",
                              "notes",
                              prescription.notes,
                              "textarea"
                            )}
                          </>
                        )}
                        {renderSection(
                          "Medications",
                          <Pill className="w-5 h-5" />,
                          <>
                            <Table aria-label="Medications table">
                              <TableHeader>
                                <TableColumn>Medication Name</TableColumn>
                                <TableColumn>Dosage</TableColumn>
                                <TableColumn>Frequency</TableColumn>
                                <TableColumn>Duration</TableColumn>
                                <TableColumn>Actions</TableColumn>
                              </TableHeader>
                              <TableBody>
                                {prescription.medications.map(
                                  (medication, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        <Input
                                          value={medication.medicationName}
                                          onChange={(e) =>
                                            handleMedicationChange(
                                              index,
                                              "medicationName",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          value={medication.dosage}
                                          onChange={(e) =>
                                            handleMedicationChange(
                                              index,
                                              "dosage",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          value={medication.frequency.toString()}
                                          onChange={(e) =>
                                            handleMedicationChange(
                                              index,
                                              "frequency",
                                              parseInt(e.target.value)
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          type="number"
                                          value={medication.duration.toString()}
                                          onChange={(e) =>
                                            handleMedicationChange(
                                              index,
                                              "duration",
                                              parseInt(e.target.value)
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          color="danger"
                                          variant="light"
                                          onPress={() =>
                                            removeMedication(index)
                                          }
                                          isIconOnly
                                        >
                                          <Trash2 size={16} />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                            <Button
                              color="primary"
                              variant="flat"
                              onPress={addMedication}
                              startContent={<Plus size={16} />}
                              className="mt-4"
                            >
                              Add Medication
                            </Button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {renderSection(
                          "Prescription Details",
                          <Calendar className="w-5 h-5" />,
                          <div className="grid gap-2">
                            <p>
                              <span className="font-medium">Date Issued:</span>{" "}
                              {prescription.dateIssued}
                            </p>
                            <p>
                              <span className="font-medium">Notes:</span>{" "}
                              {prescription.notes}
                            </p>
                          </div>
                        )}
                        {renderSection(
                          "Medications",
                          <Pill className="w-5 h-5" />,
                          <Table aria-label="Medications table">
                            <TableHeader>
                              <TableColumn>Medication Name</TableColumn>
                              <TableColumn>Dosage</TableColumn>
                              <TableColumn>Frequency</TableColumn>
                              <TableColumn>Duration</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {prescription.medications.map(
                                (medication, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      {medication.medicationName}
                                    </TableCell>
                                    <TableCell>{medication.dosage}</TableCell>
                                    <TableCell>
                                      {medication.frequencyDisplay ||
                                        `${medication.frequency} times per day`}
                                    </TableCell>
                                    <TableCell>
                                      {medication.durationDisplay ||
                                        `${medication.duration} days`}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-medium mb-4">
                      No prescription found for this appointment.
                    </p>
                    <Button
                      color="primary"
                      startContent={<Plus size={16} />}
                      onPress={createNewPrescription}
                    >
                      Create New Prescription
                    </Button>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                {prescription &&
                  (isEditing ? (
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={updatePrescription}
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
                      Edit Prescription
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
