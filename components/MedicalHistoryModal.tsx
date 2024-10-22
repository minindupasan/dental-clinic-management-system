import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { ClipboardList } from "lucide-react";
import { Patient } from "../app/data/PatientData";

interface MedicalHistoryPopoverProps {
  patient: Patient;
}

export default function MedicalHistoryPopover({
  patient,
}: MedicalHistoryPopoverProps) {
  return (
    <Popover
      showArrow
      backdrop="opaque"
      placement="right"
      classNames={{
        base: ["before:bg-default-200"],
        content: [
          "py-3 px-4 border border-default-200",
          "bg-gradient-to-br from-white to-default-300",
          "dark:from-default-100 dark:to-default-50",
        ],
      }}
    >
      <PopoverTrigger>
        <Button
          variant="shadow"
          size="sm"
          radius="full"
          className="mt-2"
          startContent={<ClipboardList />}
        >
          Medical History
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {(titleProps) => (
          <div className="px-1 py-2 text-foreground-light">
            <h3
              className="text-medium font-bold text-success-700"
              {...titleProps}
            >
              Medical History
            </h3>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">Name:</div>
              <div className="text-tiny">{patient.name}</div>
            </div>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">Age:</div>
              <div className="text-tiny">{patient.age}</div>
            </div>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">Blood Type:</div>
              <div className="text-tiny">{patient.bloodType}</div>
            </div>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">Surgeries:</div>
              <div className="text-tiny">{patient.surgeries}</div>
            </div>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">Chronic Conditions:</div>
              <div className="text-tiny">{patient.chronicConditions}</div>
            </div>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">Previous Illnesses:</div>
              <div className="text-tiny">{patient.previousIllnesses}</div>
            </div>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">
                Current Medications:
              </div>
              <div className="text-tiny">{patient.currentMedications}</div>
            </div>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">
                Previous Medications:
              </div>
              <div className="text-tiny">{patient.previousMedications}</div>
            </div>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">Drug Allergies:</div>
              <div className="text-tiny">{patient.drugAllergies}</div>
            </div>
            <div className="flex space-x-2">
              <div className="text-tiny font-semibold">
                Cardiovascular Issues:
              </div>
              <div className="text-tiny">{patient.cardiovascularIssues}</div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
