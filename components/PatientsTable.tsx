"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  CardHeader,
  Card,
} from "@nextui-org/react";
import { toast, Toaster } from "react-hot-toast";
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  RefreshCw,
  FileText,
} from "lucide-react";
import MedicalHistoryModal from "./MedicalHistoryModal";
import AddPatientButton from "./NewPatientButton";

type Patient = {
  patientID: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  gender: string;
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
  dob: "",
  createdDate: "",
};

export default function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPatient, setCurrentPatient] =
    useState<Patient>(initialPatientState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | "none";
    clickCount: number;
  }>({ key: "", direction: "none", clickCount: 0 });
  const [filterValue, setFilterValue] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "recent" | "older">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      toast.error("An error occurred while fetching patient data.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

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
    onOpen();
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
      onClose();
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

  const handlePatientAdded = () => {
    fetchPatients();
  };

  return (
    <Card className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Loading patient data..." color="primary" />
        </div>
      ) : (
        <>
          <Toaster position="top-right" />
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold">Patients</h1>
              <AddPatientButton onPatientAdded={handlePatientAdded} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Dropdown>
                <DropdownTrigger className="w-full sm:w-[200px]">
                  <Button
                    color="primary"
                    variant="ghost"
                    radius="full"
                    startContent={<Filter className="h-4 w-4" />}
                    endContent={<ChevronDown className="h-4 w-4" />}
                    className="flex justify-between"
                  >
                    {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}{" "}
                    Patients
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="View options"
                  onAction={(key) => setViewMode(key as any)}
                  className="w-[200px]"
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
                className="w-full sm:w-[300px]"
              />
              <Button
                isIconOnly
                color="primary"
                variant="ghost"
                aria-label="Refresh"
                onClick={fetchPatients}
                isLoading={isRefreshing}
              >
                {isRefreshing ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <Table aria-label="Patient data table">
            <TableHeader>
              {columns.map((column) => (
                <TableColumn
                  key={column.key}
                  onClick={() =>
                    column.key !== "actions" &&
                    column.key !== "medicalRecords" &&
                    handleSort(column.key)
                  }
                  style={{
                    cursor:
                      column.key !== "actions" &&
                      column.key !== "medicalRecords"
                        ? "pointer"
                        : "default",
                    textAlign: "center",
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
                    <TableCell
                      key={`${patient.patientID}-${column.key}`}
                      className="text-center"
                    >
                      {column.key === "fullName" ? (
                        `${patient.firstName} ${patient.lastName}`
                      ) : column.key === "dob" ||
                        column.key === "createdDate" ? (
                        new Date(
                          patient[column.key as keyof Patient]
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      ) : column.key === "medicalRecords" ? (
                        <MedicalHistoryModal patientId={patient.patientID} />
                      ) : column.key === "actions" ? (
                        <div className="flex justify-center space-x-2">
                          <Button
                            isIconOnly
                            color="warning"
                            variant="light"
                            aria-label="Edit"
                            onClick={() => handleEdit(patient)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            isIconOnly
                            color="danger"
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
        </>
      )}
    </Card>
  );
}
