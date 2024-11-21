"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { PlusCircle, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Denture = {
  patientID: number;
  dentureType: string;
  materialType: string;
  trialDentureDate: string;
  estimatedDeliveryDate: string;
  deliveryStatus: string;
  cost: number;
  paymentStatus: string;
  labName: string;
  orderDateToLab: string;
  remarks: string;
};

type Patient = {
  patientID: string;
  firstName: string;
  lastName: string;
};

const dentureTypeOptions = [
  { label: "Partial", value: "Partial" },
  { label: "Full", value: "Full" },
];

const materialTypeOptions = [
  { label: "Acrylic", value: "Acrylic" },
  { label: "Metal", value: "Metal" },
  { label: "Flexible", value: "Flexible" },
];

const deliveryStatusOptions = [
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Delayed", value: "Delayed" },
];

const paymentStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Partially Paid", value: "Partially Paid" },
];

export default function NewDentureButton({
  onDentureAdded,
}: {
  onDentureAdded: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newDenture, setNewDenture] = useState<Denture>({
    patientID: 0,
    dentureType: "",
    materialType: "",
    trialDentureDate: "",
    estimatedDeliveryDate: "",
    deliveryStatus: "In Progress",
    cost: 0,
    paymentStatus: "Pending",
    labName: "",
    orderDateToLab: "",
    remarks: "",
  });
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients`);
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDenture((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDenture((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading("Adding new denture...");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dentures/create/${newDenture.patientID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDenture),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add new denture");
      }

      const result = await response.json();
      toast.success(`New denture added successfully! ID: ${result.id}`, {
        id: toastId,
      });
      setNewDenture({
        patientID: 0,
        dentureType: "",
        materialType: "",
        trialDentureDate: "",
        estimatedDeliveryDate: "",
        deliveryStatus: "In Progress",
        cost: 0,
        paymentStatus: "Pending",
        labName: "",
        orderDateToLab: "",
        remarks: "",
      });
      onClose();
      onDentureAdded();
    } catch (error) {
      console.error("Error adding new denture:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add new denture. Please try again.",
        { id: toastId }
      );
    }
  };

  return (
    <>
      <Button
        color="primary"
        variant="ghost"
        onClick={onOpen}
        radius="full"
        startContent={<UserPlus size={16} />}
      >
        New Denture
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                New Denture
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  label="Patient"
                  placeholder="Select patient"
                  onSelectionChange={(value) =>
                    handleSelectChange("patientID", value as string)
                  }
                  required
                >
                  {patients.map((patient) => (
                    <AutocompleteItem
                      key={patient.patientID}
                      value={patient.patientID}
                    >
                      {`${patient.firstName} ${patient.lastName}`}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Select
                  label="Denture Type"
                  placeholder="Select denture type"
                  onChange={(e) =>
                    handleSelectChange("dentureType", e.target.value)
                  }
                  required
                >
                  {dentureTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Material Type"
                  placeholder="Select material type"
                  onChange={(e) =>
                    handleSelectChange("materialType", e.target.value)
                  }
                  required
                >
                  {materialTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Trial Denture Date"
                  name="trialDentureDate"
                  type="date"
                  value={newDenture.trialDentureDate}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Estimated Delivery Date"
                  name="estimatedDeliveryDate"
                  type="date"
                  value={newDenture.estimatedDeliveryDate}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Delivery Status"
                  placeholder="Select delivery status"
                  onChange={(e) =>
                    handleSelectChange("deliveryStatus", e.target.value)
                  }
                  required
                >
                  {deliveryStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Cost"
                  name="cost"
                  type="number"
                  value={newDenture.cost.toString()}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Payment Status"
                  placeholder="Select payment status"
                  onChange={(e) =>
                    handleSelectChange("paymentStatus", e.target.value)
                  }
                  required
                >
                  {paymentStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Lab Name"
                  name="labName"
                  value={newDenture.labName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Order Date to Lab"
                  name="orderDateToLab"
                  type="date"
                  value={newDenture.orderDateToLab}
                  onChange={handleInputChange}
                />
                <Input
                  label="Remarks"
                  name="remarks"
                  value={newDenture.remarks}
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="ghost"
                  radius="full"
                  color="danger"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  radius="full"
                  color="success"
                  type="submit"
                >
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
