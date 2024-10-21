"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { CirclePlus, Pencil, Trash } from "lucide-react";
import NewPatientPopover from "./NewPatientPopover";

type Patient = {
  key: string;
  date: string;
  name: string;
  treatment: string;
  total: string;
};

const columns = [
  { key: "key", label: "ID" },
  { key: "date", label: "DATE" },
  { key: "name", label: "NAME" },
  { key: "records", label: "PAST RECORDS" },
  { key: "treatment", label: "TREATMENT" },
  { key: "total", label: "TOTAL" },
  { key: "actions", label: "ACTIONS" },
];

export default function PatientRecords() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch patients data from the backend API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/patients");
        if (response.ok) {
          const data = await response.json();
          setPatients(
            data.map((patient: any, index: number) => ({
              key: `P${String(index + 1).padStart(4, "0")}`,
              date: patient.date || new Date().toISOString().split("T")[0], // or however you format the date
              name: patient.firstName + " " + patient.lastName,
              nic: patient.nic || "N/A", // Replace 'N/A' if no NIC is provided
              treatment: patient.treatment || "N/A",
              total: patient.total || "N/A",
            }))
          );
        } else {
          console.error("Failed to fetch patients");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleAdd = () => {
    setEditingPatient({
      key: `P${String(patients.length + 1).padStart(4, "0")}`,
      date: new Date().toISOString().split("T")[0],
      name: "",
      treatment: "",
      total: "",
    });
    onOpen();
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    onOpen();
  };

  const handleDelete = (key: string) => {
    setPatients(patients.filter((patient) => patient.key !== key));
  };

  const handleSave = () => {
    if (editingPatient) {
      setPatients((prevPatients) => {
        const index = prevPatients.findIndex(
          (p) => p.key === editingPatient.key
        );
        if (index !== -1) {
          // Edit existing patient
          return [
            ...prevPatients.slice(0, index),
            editingPatient,
            ...prevPatients.slice(index + 1),
          ];
        } else {
          // Add new patient
          return [...prevPatients, editingPatient];
        }
      });
    }
    onClose();
  };

  return (
    <div className="bg-background-light rounded-xl">
      <div className="py-5 flex items-center justify-between px-10">
        <div className="font-semibold text-xl">Patient Records</div>
        <div>
          <Button
            className="bg-secondary-200"
            radius="full"
            startContent={<CirclePlus />}
            onPress={handleAdd}
          >
            New Patient
          </Button>
        </div>
      </div>
      <Table aria-label="Patient records table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={patients}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "actions" ? (
                    <div className="flex items-center gap-2">
                      <Tooltip content="Edit Patient">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete Patient">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => handleDelete(item.key)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="text-foreground-light"
      >
        <ModalContent>
          <ModalHeader>
            {editingPatient?.key ? "Edit Patient" : "Add New Patient"}
          </ModalHeader>
          <ModalBody>
            <Input
              radius="full"
              label="Name"
              value={editingPatient?.name}
              onChange={(e) =>
                setEditingPatient((prev) => ({
                  ...prev!,
                  name: e.target.value,
                }))
              }
            />
            <Input
              radius="full"
              label="Treatment"
              value={editingPatient?.treatment}
              onChange={(e) =>
                setEditingPatient((prev) => ({
                  ...prev!,
                  treatment: e.target.value,
                }))
              }
            />
            <Input
              radius="full"
              label="Total"
              value={editingPatient?.total}
              onChange={(e) =>
                setEditingPatient((prev) => ({
                  ...prev!,
                  total: e.target.value,
                }))
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              className="text-success-500"
              variant="light"
              onPress={handleSave}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
