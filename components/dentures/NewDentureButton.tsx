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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { SmileIcon as Tooth } from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Denture = {
  patientID: string;
  dentureType: string;
  materialType: string;
  trialDentureDate: string;
  estimatedDeliveryDate: string;
  receivedDate: string;
  deliveryStatus: string;
  remarks: string;
  cost: number;
  paymentStatus: string;
  labName: string;
  orderedDate: string;
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
  const [newDenture, setNewDenture] = useState<Denture>({
    patientID: "",
    dentureType: "",
    materialType: "",
    trialDentureDate: "",
    estimatedDeliveryDate: "",
    receivedDate: "",
    deliveryStatus: "In Progress",
    remarks: "",
    cost: 0,
    paymentStatus: "Pending",
    labName: "",
    orderedDate: "",
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

  const handleSelectChange = (name: string, value: string) => {
    setNewDenture((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateDates = () => {
    const trial = new Date(newDenture.trialDentureDate);
    const estimated = new Date(newDenture.estimatedDeliveryDate);
    return trial <= estimated;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDates()) {
      toast.error(
        "Estimated delivery date must be after or on the trial denture date."
      );
      return;
    }

    const toastId = toast.loading("Adding new denture...");
    try {
      const dentureWithOrderDate = {
        ...newDenture,
        orderedDate: new Date().toISOString().split("T")[0], // Set to current date
      };

      const response = await fetch(
        `${API_BASE_URL}/api/dentures/create/${newDenture.patientID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dentureWithOrderDate),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add new denture");
      }

      const result = await response.json();
      toast.success(`New denture added successfully!`, {
        id: toastId,
      });
      setNewDenture({
        patientID: "",
        dentureType: "",
        materialType: "",
        trialDentureDate: "",
        estimatedDeliveryDate: "",
        receivedDate: "",
        deliveryStatus: "In Progress",
        remarks: "",
        cost: 0,
        paymentStatus: "Pending",
        labName: "",
        orderedDate: "",
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Button
        color="primary"
        variant="ghost"
        onClick={onOpen}
        radius="full"
        startContent={<Tooth className="w-4 h-4" />}
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
                <Select
                  label="Patient"
                  placeholder="Select patient"
                  onChange={(e) =>
                    handleSelectChange("patientID", e.target.value)
                  }
                  required
                >
                  {patients.map((patient) => (
                    <SelectItem
                      key={patient.patientID}
                      value={patient.patientID}
                    >
                      {`${patient.firstName} ${patient.lastName}`}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Denture Type"
                  placeholder="Select denture type"
                  onChange={(e) =>
                    handleSelectChange("dentureType", e.target.value)
                  }
                  required
                >
                  <SelectItem key="Full Denture" value="Full Denture">
                    Full Denture
                  </SelectItem>
                  <SelectItem key="Partial Denture" value="Partial Denture">
                    Partial Denture
                  </SelectItem>
                  <SelectItem
                    key="Fixed Prosthodontics"
                    value="Fixed Prosthodontics"
                  >
                    Fixed Prosthodontics
                  </SelectItem>
                </Select>
                <Select
                  label="Material Type"
                  placeholder="Select material type"
                  onChange={(e) =>
                    handleSelectChange("materialType", e.target.value)
                  }
                  required
                >
                  <SelectItem key="Acrylic" value="Acrylic">
                    Acrylic
                  </SelectItem>
                  <SelectItem key="Metal" value="Metal">
                    Metal
                  </SelectItem>
                  <SelectItem key="Flexible" value="Flexible">
                    Flexible
                  </SelectItem>
                </Select>
                <Input
                  label="Trial Denture Date"
                  name="trialDentureDate"
                  type="date"
                  value={newDenture.trialDentureDate}
                  onChange={handleInputChange}
                  min={today}
                  required
                />
                <Input
                  label="Estimated Delivery Date"
                  name="estimatedDeliveryDate"
                  type="date"
                  value={newDenture.estimatedDeliveryDate}
                  onChange={handleInputChange}
                  min={newDenture.trialDentureDate || today}
                  required
                />
                <Input
                  label="Cost (LKR)"
                  name="cost"
                  type="number"
                  value={newDenture.cost.toString()}
                  onChange={handleInputChange}
                  startContent={
                    <span className="text-default-400 text-small">LKR</span>
                  }
                  required
                />
                <Select
                  label="Lab Name"
                  placeholder="Select lab"
                  onChange={(e) =>
                    handleSelectChange("labName", e.target.value)
                  }
                  required
                >
                  <SelectItem key="Dental Craft Lab" value="Dental Craft Lab">
                    Dental Craft Lab
                  </SelectItem>
                  <SelectItem key="Precision Dental" value="Precision Dental">
                    Precision Dental
                  </SelectItem>
                  <SelectItem key="Smile Solutions" value="Smile Solutions">
                    Smile Solutions
                  </SelectItem>
                </Select>
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
