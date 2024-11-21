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
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Denture = {
  dentureId: number;
  patientID: string;
  dentureType: string;
  materialType: string;
  trialDentureDate: string;
  estimatedDeliveryDate: string;
  receivedDate: string | null;
  deliveryStatus: string;
  remarks: string;
  cost: number;
  paymentStatus: string;
  labName: string;
  orderDateToLab: string;
};

type Patient = {
  patientID: string;
  firstName: string;
  lastName: string;
};

export default function NewDentureButton({
  onDentureAdded,
}: {
  onDentureAdded: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newDenture, setNewDenture] = useState<Omit<Denture, "dentureId">>({
    patientID: "",
    dentureType: "",
    materialType: "",
    trialDentureDate: "",
    estimatedDeliveryDate: "",
    receivedDate: null,
    deliveryStatus: "In Progress",
    remarks: "",
    cost: 0,
    paymentStatus: "Pending",
    labName: "",
    orderDateToLab: "",
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
      [name]: name === "cost" ? parseFloat(value) : value,
    }));
  };

  const handlePatientChange = (patientID: string) => {
    setNewDenture((prev) => ({
      ...prev,
      patientID,
    }));
  };

  const validateDentureDates = () => {
    const now = new Date();
    const trialDate = new Date(newDenture.trialDentureDate);
    const estimatedDeliveryDate = new Date(newDenture.estimatedDeliveryDate);
    const orderDate = new Date(newDenture.orderDateToLab);

    return (
      trialDate > now && estimatedDeliveryDate > trialDate && orderDate <= now
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDentureDates()) {
      toast.error("Please check the dates. They must be in a logical order.");
      return;
    }

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
      toast.success(`New denture added successfully! ID: ${result.dentureId}`, {
        id: toastId,
      });
      setNewDenture({
        patientID: "",
        dentureType: "",
        materialType: "",
        trialDentureDate: "",
        estimatedDeliveryDate: "",
        receivedDate: null,
        deliveryStatus: "In Progress",
        remarks: "",
        cost: 0,
        paymentStatus: "Pending",
        labName: "",
        orderDateToLab: "",
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
        startContent={<Plus className="w-4 h-4" />}
      >
        New Denture
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="md" hideCloseButton>
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
                  onSelectionChange={(patientID) =>
                    handlePatientChange(patientID as string)
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
                <Input
                  label="Denture Type"
                  name="dentureType"
                  value={newDenture.dentureType}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Material Type"
                  name="materialType"
                  value={newDenture.materialType}
                  onChange={handleInputChange}
                  required
                />
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
                <Input
                  label="Cost"
                  name="cost"
                  type="number"
                  value={newDenture.cost.toString()}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Lab Name"
                  name="labName"
                  value={newDenture.labName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Order Date to Lab"
                  name="orderDateToLab"
                  type="date"
                  value={newDenture.orderDateToLab}
                  onChange={handleInputChange}
                  required
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
