"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import {
  Pencil,
  Trash2,
  AtSign,
  Phone,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from "lucide-react";

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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | "none";
    clickCount: number;
  }>({ key: "", direction: "none", clickCount: 0 });
  const [filterValue, setFilterValue] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "recent" | "older">("all");

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/patients");
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

  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    switch (viewMode) {
      case "recent":
        filtered = filtered.filter(
          (patient) => new Date(patient.createdDate) >= thirtyDaysAgo
        );
        break;
      case "older":
        filtered = filtered.filter(
          (patient) => new Date(patient.createdDate) < thirtyDaysAgo
        );
        break;
    }

    if (filterValue) {
      filtered = filtered.filter((patient) =>
        Object.values(patient).some((value) =>
          value?.toString().toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    if (sortConfig.direction !== "none") {
      filtered.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "fullName") {
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        } else {
          aValue = a[sortConfig.key as keyof Patient] ?? "";
          bValue = b[sortConfig.key as keyof Patient] ?? "";
        }
        const aValueStr = String(aValue);
        const bValueStr = String(bValue);

        if (sortConfig.direction === "ascending") {
          return aValueStr.localeCompare(bValueStr);
        } else {
          return bValueStr.localeCompare(aValueStr);
        }
      });
    }

    return filtered;
  }, [patients, filterValue, viewMode, sortConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPatient((prev) => ({ ...prev, gender: e.target.value }));
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
        `http://localhost:8080/api/patients/delete/${patientID}`,
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
        "http://localhost:8080/api/patients/create",
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
        `http://localhost:8080/api/patients/update/${currentPatient.patientID}`,
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

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        const clickCount = prevConfig.clickCount + 1;
        if (clickCount === 3) {
          return { key: "", direction: "none", clickCount: 0 };
        }
        return {
          key,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
          clickCount,
        };
      }
      return { key, direction: "ascending", clickCount: 1 };
    });
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="inline-block ml-1" />
    ) : (
      <ChevronDown className="inline-block ml-1" />
    );
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
      <div className="mb-6 flex items-center justify-between">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-0 pt-6 px-6">
          <Dropdown>
            <DropdownTrigger className="w-[200px]">
              <Button
                radius="full"
                startContent={<Filter className="h-4 w-4" />}
                endContent={<ChevronDown className="h-4 w-4" />}
                className="px-5 py-1 text-sm bg-white border w-[200px] flex justify-between items-center"
              >
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Patients
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="View options"
              onAction={(key) => setViewMode(key as any)}
              className="w-[200px] text-foreground-light"
            >
              <DropdownItem key="all">All Patients</DropdownItem>
              <DropdownItem key="recent">
                Recent Patients (30 days)
              </DropdownItem>
              <DropdownItem key="older">Older Patients</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Input
            placeholder="Search patients..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            radius="full"
            startContent={<Search className="h-4 w-4" />}
            className="w-[300px]"
          />
        </div>
      </div>
      <Table aria-label="Patient data table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              onClick={() => column.key !== "actions" && handleSort(column.key)}
              style={{
                cursor: column.key !== "actions" ? "pointer" : "default",
              }}
            >
              {column.label}
              {renderSortIcon(column.key)}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {filteredPatients.map((patient) => (
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
                        className="text-warning-500 bg-warning-100"
                        variant="light"
                        aria-label="Edit"
                        onClick={() => handleEdit(patient)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        isIconOnly
                        className="text-danger-500 bg-danger-100"
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
