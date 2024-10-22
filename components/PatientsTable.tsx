"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, AtSign, Phone } from "lucide-react";

type Patient = {
  patientID: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  gender: string;
  medicalRecords: string;
  dob: string;
  createdDate: string;
};

const columns = [
  { key: "patientID", label: "PATIENT ID" },
  { key: "fullName", label: "FULL NAME" },
  { key: "email", label: "EMAIL" },
  { key: "contactNo", label: "CONTACT NO" },
  { key: "gender", label: "GENDER" },
  { key: "medicalRecords", label: "MEDICAL RECORDS" },
  { key: "dob", label: "DATE OF BIRTH" },
  { key: "createdDate", label: "CREATED DATE" },
  { key: "actions", label: "ACTIONS" },
];

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const initialPatientState: Patient = {
  patientID: "",
  firstName: "",
  lastName: "",
  email: "",
  contactNo: "",
  gender: "",
  medicalRecords: "",
  dob: "",
  createdDate: "",
};

export default function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPatient, setCurrentPatient] =
    useState<Patient>(initialPatientState);
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        "https://dent-care-plus-springboot.onrender.com/api/patients"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
      setLoading(false);
    } catch (err) {
      toast.error("An error occurred while fetching patient data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPatient((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleAdd = () => {
    setCurrentPatient(initialPatientState);
    onAddOpen();
  };

  const handleEdit = (patient: Patient) => {
    setCurrentPatient({
      ...patient,
      dob: patient.dob.split("T")[0],
    });
    onEditOpen();
  };

  const handleDelete = (patientID: string) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this patient?</p>
          <div className="mt-2 flex justify-end space-x-2">
            <Button
              size="sm"
              variant="light"
              color="default"
              onPress={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={() => confirmDelete(patientID, t.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const confirmDelete = async (patientID: string, toastId: string) => {
    try {
      const response = await fetch(
        `https://dent-care-plus-springboot.onrender.com/api/patients/delete/${patientID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete patient");
      }
      toast.success("Patient deleted successfully");
      fetchPatients();
    } catch (err) {
      toast.error("An error occurred while deleting the patient");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://dent-care-plus-springboot.onrender.com/api/patients/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentPatient),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create patient");
      }

      toast.success("Patient added successfully");
      fetchPatients();
      onAddClose();
      setCurrentPatient(initialPatientState);
    } catch (err) {
      toast.error("An error occurred while creating the patient");
    }
  };

  const handleUpdatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://dent-care-plus-springboot.onrender.com/api/patients/update/${currentPatient.patientID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentPatient),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update patient");
      }

      toast.success("Patient updated successfully");
      fetchPatients();
      onEditClose();
      setCurrentPatient(initialPatientState);
    } catch (err) {
      toast.error("An error occurred while updating the patient");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label="Loading patient data..." color="primary" />
      </div>
    );
  }

  return (
    <>
      <Button onClick={handleAdd} color="primary" className="mb-4">
        Add New Patient
      </Button>
      <Table aria-label="Patient data table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.patientID}>
              {columns.map((column) => (
                <TableCell key={`${patient.patientID}-${column.key}`}>
                  {column.key === "fullName" ? (
                    `${patient.firstName} ${patient.lastName}`
                  ) : column.key === "dob" || column.key === "createdDate" ? (
                    new Date(
                      patient[column.key as keyof Patient]
                    ).toLocaleDateString()
                  ) : column.key === "actions" ? (
                    <div className="flex space-x-2">
                      <Button
                        isIconOnly
                        className="text-warning-600 bg-warning-300"
                        variant="light"
                        aria-label="Edit"
                        onClick={() => handleEdit(patient)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        isIconOnly
                        className="text-danger-600 bg-danger-300"
                        variant="light"
                        aria-label="Delete"
                        onClick={() => handleDelete(patient.patientID)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    patient[column.key as keyof Patient]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isAddOpen}
        onClose={() => {
          onAddClose();
          setCurrentPatient(initialPatientState);
        }}
        size="2xl"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleCreatePatient}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                Add New Patient
              </ModalHeader>
              <ModalBody>
                <Input
                  label="First Name"
                  name="firstName"
                  value={currentPatient.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={currentPatient.lastName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={currentPatient.email}
                  onChange={handleInputChange}
                  required
                  endContent={<AtSign className="text-secondary-600" />}
                />
                <Input
                  label="Contact No"
                  name="contactNo"
                  type="tel"
                  value={currentPatient.contactNo}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  endContent={<Phone className="text-secondary-600" />}
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={[currentPatient.gender]}
                  onChange={handleGenderChange}
                  required
                >
                  {genderOptions.map((option) => (
                    <SelectItem
                      className="text-foreground-light"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Medical Records"
                  name="medicalRecords"
                  value={currentPatient.medicalRecords}
                  onChange={handleInputChange}
                />
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={currentPatient.dob}
                  onChange={handleInputChange}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="light"
                  type="submit"
                  className="text-success-600"
                >
                  Add Patient
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setCurrentPatient(initialPatientState);
        }}
        size="2xl"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdatePatient}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                Edit Patient
              </ModalHeader>
              <ModalBody>
                <Input
                  label="First Name"
                  name="firstName"
                  value={currentPatient.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={currentPatient.lastName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={currentPatient.email}
                  onChange={handleInputChange}
                  required
                  endContent={<AtSign className="text-secondary-600" />}
                />
                <Input
                  label="Contact No"
                  name="contactNo"
                  type="tel"
                  value={currentPatient.contactNo}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  endContent={<Phone className="text-secondary-600" />}
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={[currentPatient.gender]}
                  onChange={handleGenderChange}
                  required
                >
                  {genderOptions.map((option) => (
                    <SelectItem
                      className="text-foreground-light"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Medical Records"
                  name="medicalRecords"
                  value={currentPatient.medicalRecords}
                  onChange={handleInputChange}
                />
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={currentPatient.dob}
                  onChange={handleInputChange}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="light"
                  type="submit"
                  className="text-success-600"
                >
                  Update Patient
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
