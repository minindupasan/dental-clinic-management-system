"use client";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React from "react";
import { SelectorIcon } from "./icons/SelectorIcon";
export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
  { key: "dolphin", label: "Dolphin" },
  { key: "penguin", label: "Penguin" },
  { key: "zebra", label: "Zebra" },
  { key: "shark", label: "Shark" },
  { key: "whale", label: "Whale" },
  { key: "otter", label: "Otter" },
  { key: "crocodile", label: "Crocodile" },
];
export default function TreatmentsCard() {
  return (
    <Card className="min-h-72 h-auto bg-white text-foreground-light">
      <CardHeader>
        <div className="w-full pt-3 flex justify-between items-center mx-6">
          <h2 className="text-xl font-semibold">Treatment Summary</h2>
        </div>
      </CardHeader>
      <CardBody className="mx-6 max-h-96 overflow-y-auto">
        <Select
          size="sm"
          variant="bordered"
          label="Treatment"
          radius="full"
          placeholder="Select treatment"
          labelPlacement="outside"
          className="max-w-xs"
          disableSelectorIconRotation
          selectorIcon={<SelectorIcon />}
        >
          {animals.map((animal) => (
            <SelectItem key={animal.key}>{animal.label}</SelectItem>
          ))}
        </Select>
        <div className="flex w-full h-full my-3 justify-between items-center outline outline-4 outline-gray-900">
          asdfsdf
        </div>
      </CardBody>
      <CardFooter className="p-2"></CardFooter>
    </Card>
  );
}
