"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { ChevronDown } from "lucide-react";

const treatments = [
  { key: "orthodontic", label: "Orthodontic", ongoing: 8, pending: 3 },
  { key: "cleaning", label: "Teeth Cleaning", ongoing: 5, pending: 2 },
  { key: "whitening", label: "Teeth Whitening", ongoing: 3, pending: 1 },
  { key: "filling", label: "Dental Filling", ongoing: 6, pending: 4 },
  { key: "extraction", label: "Tooth Extraction", ongoing: 2, pending: 1 },
];

export default function DentalTreatments() {
  // Use a single string for state to simplify the logic
  const [selected, setSelected] = useState("orthodontic");

  // Find the selected treatment or default to the first item
  const selectedTreatment =
    treatments.find((treatment) => treatment.key === selected) || treatments[0];

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-col items-start pb-0 pt-6 px-6">
        <h2 className="text-2xl font-bold">Ongoing treatments</h2>
      </CardHeader>
      <CardBody className="px-6 py-4">
        <div className="space-y-6">
          <Select
            label="Select treatment"
            placeholder="Select treatment"
            labelPlacement="outside"
            selectedKeys={new Set([selected])} // Ensure a Set is passed
            className="max-w-xs"
            onSelectionChange={(keys) =>
              setSelected(Array.from(keys)[0] as string)
            }
            radius="full"
            selectorIcon={<ChevronDown />}
          >
            {treatments.map((treatment) => (
              <SelectItem key={treatment.key} value={treatment.key}>
                {treatment.label}
              </SelectItem>
            ))}
          </Select>

          {/* Treatment summary */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-4xl font-bold ">{selectedTreatment.ongoing}</p>
              <p className="text-lg text-default-400">Ongoing treatments</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-bold ">{selectedTreatment.pending}</p>
              <p className="text-lg text-default-400">Pending treatments</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
