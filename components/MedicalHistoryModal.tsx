"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Textarea,
  Input,
} from "@nextui-org/react";
import { ClipboardList, HeartPulse } from "lucide-react";

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
  bloodType: string;
  surgeries: string;
  chronicConditions: string;
  previousIllnesses: string;
  currentMedications: string;
  previousMedications: string;
  drugAllergies: string;
  cardiovascularIssues: string;
};

interface MedicalHistoryModalProps {
  patient: Patient;
  appointmentDate: string;
  appointmentTime: string;
  treatment: string;
}

const medicalConditions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Cancer",
  "Arthritis",
  "Depression",
  "Anxiety",
  "Obesity",
  "Chronic Pain",
  "Allergies",
  "Thyroid Disorder",
  "Kidney Disease",
  "Liver Disease",
  "Stroke",
];

export default function MedicalHistoryModal({
  patient,
  appointmentDate,
  appointmentTime,
  treatment,
}: MedicalHistoryModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [checkedConditions, setCheckedConditions] = useState<
    Record<string, boolean>
  >(
    Object.fromEntries(medicalConditions.map((condition) => [condition, false]))
  );
  const [notes, setNotes] = useState("");

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleConditionCheck = (condition: string, isChecked: boolean) => {
    setCheckedConditions((prev) => ({
      ...prev,
      [condition]: isChecked,
    }));
  };

  return (
    <>
      <Button
        radius="full"
        onPress={onOpen}
        size="sm"
        variant="light"
        startContent={<HeartPulse size={16} />}
        className="bg-pink-600 text-pink-50"
      >
        Medical History
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Medical History
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Age"
                    value={calculateAge(patient.dob).toString()}
                    readOnly
                  />
                  <Input label="Gender" value={patient.gender} readOnly />
                </div>
                <Input label="Blood Type" value={patient.bloodType} readOnly />
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Medical Conditions:
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {medicalConditions.map((condition) => (
                      <Checkbox
                        key={condition}
                        isSelected={checkedConditions[condition]}
                        onValueChange={(isChecked) =>
                          handleConditionCheck(condition, isChecked)
                        }
                      >
                        {condition}
                      </Checkbox>
                    ))}
                  </div>
                </div>
                <Textarea
                  label="Surgeries"
                  value={patient.surgeries}
                  readOnly
                />
                <Textarea
                  label="Current Medications"
                  value={patient.currentMedications}
                  readOnly
                />
                <Textarea
                  label="Drug Allergies"
                  value={patient.drugAllergies}
                  readOnly
                />
                <Input label="Treatment" value={treatment} readOnly />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Appointment Date"
                    value={appointmentDate}
                    readOnly
                  />
                  <Input
                    label="Appointment Time"
                    value={appointmentTime}
                    readOnly
                  />
                </div>
                <Textarea
                  label="Notes"
                  value={notes}
                  onValueChange={setNotes}
                  placeholder="Enter any additional notes here..."
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
