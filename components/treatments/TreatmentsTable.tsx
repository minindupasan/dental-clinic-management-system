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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Patient = {
  patientID: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  gender: string;
  dob: string;
  createdDate: string;
};

type Treatment = {
  treatmentID: number;
  appointmentID: number;
  treatmentType: string;
  startDate: string | null;
  endDate: string | null;
  totalPaid: number | null;
  dueAmount: number | null;
  paymentStatus: string;
  treatmentStatus: string;
  notes: string | null;
  patient: Patient;
};

interface TreatmentManagerProps {
  onTreatmentUpdated: () => void;
}

const columns = [
  { key: "treatmentID", label: "ID" },
  { key: "patientName", label: "PATIENT NAME" },
  { key: "treatmentType", label: "TYPE" },
  { key: "startDate", label: "START DATE" },
  { key: "endDate", label: "END DATE" },
  { key: "totalPaid", label: "TOTAL PAID" },
  { key: "dueAmount", label: "DUE AMOUNT" },
  { key: "paymentStatus", label: "PAYMENT STATUS" },
  { key: "treatmentStatus", label: "TREATMENT STATUS" },
  { key: "actions", label: "ACTIONS" },
];

const statusOptions = ["Scheduled", "In Progress", "Completed", "Cancelled"];

const TreatmentManager: React.FC<TreatmentManagerProps> = ({
  onTreatmentUpdated,
}) => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTreatment, setCurrentTreatment] = useState<Treatment | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | "none";
    clickCount: number;
  }>({ key: "", direction: "none", clickCount: 0 });
  const [filterValue, setFilterValue] = useState("");
  const [viewMode, setViewMode] = useState<
    "all" | "ongoing" | "completed" | "scheduled"
  >("all");

  const fetchTreatments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/treatments`);
      if (!response.ok) {
        throw new Error("Failed to fetch treatments");
      }
      const data = await response.json();
      setTreatments(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching treatments:", err);
      toast.error("Failed to fetch treatments");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const filteredTreatments = useMemo(() => {
    let filtered = [...treatments];

    switch (viewMode) {
      case "ongoing":
        filtered = filtered.filter(
          (treatment) => treatment.treatmentStatus === "In Progress"
        );
        break;
      case "completed":
        filtered = filtered.filter(
          (treatment) => treatment.treatmentStatus === "Completed"
        );
        break;
      case "scheduled":
        filtered = filtered.filter(
          (treatment) => treatment.treatmentStatus === "Scheduled"
        );
        break;
    }

    if (filterValue) {
      filtered = filtered.filter(
        (treatment) =>
          Object.values(treatment).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(filterValue.toLowerCase())
          ) ||
          treatment.patient.firstName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          treatment.patient.lastName
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    }

    if (sortConfig.direction !== "none") {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "patientName") {
          aValue = `${a.patient.firstName} ${a.patient.lastName}`;
          bValue = `${b.patient.firstName} ${b.patient.lastName}`;
        } else {
          aValue = a[sortConfig.key as keyof Treatment];
          bValue = b[sortConfig.key as keyof Treatment];
        }
        if (aValue === null || bValue === null) return 0;
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [treatments, filterValue, viewMode, sortConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTreatment((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEdit = (treatment: Treatment) => {
    setCurrentTreatment(treatment);
    onOpen();
  };

  const handleDelete = (treatmentID: number) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this treatment?</p>
          <div className="mt-2 flex justify-end space-x-2">
            <Button
              size="sm"
              variant="light"
              color="warning"
              onPress={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={() => confirmDelete(treatmentID, t.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const confirmDelete = async (treatmentID: number, toastId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/treatments/delete/${treatmentID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete treatment");
      }
      toast.success("Treatment deleted successfully");
      setTreatments((prevTreatments) =>
        prevTreatments.filter((t) => t.treatmentID !== treatmentID)
      );
      onTreatmentUpdated();
    } catch (err) {
      console.error("Error deleting treatment:", err);
      toast.error("An error occurred while deleting the treatment");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUpdateTreatment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentTreatment) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/treatments/update/${currentTreatment.treatmentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentTreatment),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update treatment");
      }

      const updatedTreatment = await response.json();
      setTreatments((prevTreatments) => {
        const index = prevTreatments.findIndex(
          (t) => t.treatmentID === updatedTreatment.treatmentID
        );
        if (index !== -1) {
          return [
            ...prevTreatments.slice(0, index),
            updatedTreatment,
            ...prevTreatments.slice(index + 1),
          ];
        }
        return prevTreatments;
      });

      toast.success("Treatment updated successfully");
      onTreatmentUpdated();
      onClose();
      setCurrentTreatment(null);
    } catch (err) {
      console.error("Error updating treatment:", err);
      toast.error("An error occurred while updating the treatment");
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

  const handleStatusChange = async (treatmentID: number, newStatus: string) => {
    try {
      const treatmentToUpdate = treatments.find(
        (treatment) => treatment.treatmentID === treatmentID
      );
      if (!treatmentToUpdate) {
        throw new Error("Treatment not found");
      }

      const updatedTreatment = {
        ...treatmentToUpdate,
        treatmentStatus: newStatus,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/treatments/update/${treatmentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTreatment),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update treatment status");
      }

      const updatedTreatmentData = await response.json();
      setTreatments((prevTreatments) => {
        const index = prevTreatments.findIndex(
          (t) => t.treatmentID === treatmentID
        );
        if (index !== -1) {
          return [
            ...prevTreatments.slice(0, index),
            updatedTreatmentData,
            ...prevTreatments.slice(index + 1),
          ];
        }
        return prevTreatments;
      });

      toast.success(`Treatment status updated to ${newStatus}`);
      onTreatmentUpdated();
    } catch (error) {
      console.error("Error updating treatment status:", error);
      toast.error("An error occurred while updating the treatment status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-foreground-light">
        <Spinner label="Loading treatment data..." />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-0 pt-6 px-6">
          <div className="flex items-center space-x-4">
            <Dropdown>
              <DropdownTrigger className="w-[200px]">
                <Button
                  radius="full"
                  color="primary"
                  variant="ghost"
                  startContent={<Filter className="h-4 w-4" />}
                  endContent={<ChevronDown className="h-4 w-4" />}
                  className="px-5 py-1 w-[200px] flex justify-between items-center"
                  aria-label="Filter treatments"
                >
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}{" "}
                  Treatments
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="View options"
                onAction={(key) => setViewMode(key as any)}
                className="w-[200px] text-foreground-light"
              >
                <DropdownItem key="all">All Treatments</DropdownItem>
                <DropdownItem key="ongoing">Ongoing Treatments</DropdownItem>
                <DropdownItem key="completed">
                  Completed Treatments
                </DropdownItem>
                <DropdownItem key="scheduled">
                  Scheduled Treatments
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Input
              placeholder="Search treatments..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              radius="full"
              startContent={<Search className="h-4 w-4" />}
              className="w-[300px]"
            />
          </div>
        </div>
      </div>
      <Table aria-label="Treatment data table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              className="text-center"
              key={column.key}
              onClick={() =>
                column.key !== "actions" &&
                column.key !== "treatmentStatus" &&
                column.key !== "paymentStatus" &&
                handleSort(column.key)
              }
              style={{
                cursor:
                  column.key !== "actions" &&
                  column.key !== "treatmentStatus" &&
                  column.key !== "paymentStatus"
                    ? "pointer"
                    : "default",
              }}
            >
              {column.label}
              {renderSortIcon(column.key)}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {filteredTreatments.map((treatment) => (
            <TableRow key={treatment.treatmentID}>
              <TableCell className="text-center">
                {treatment.treatmentID}
              </TableCell>
              <TableCell className="text-center">
                {`${treatment.patient.firstName} ${treatment.patient.lastName}`}
              </TableCell>
              <TableCell className="text-center">
                {treatment.treatmentType}
              </TableCell>
              <TableCell className="text-center">
                {treatment.startDate || "Not started"}
              </TableCell>
              <TableCell className="text-center">
                {treatment.endDate || "In progress"}
              </TableCell>
              <TableCell className="text-center">
                ${treatment.totalPaid?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell className="text-center">
                ${treatment.dueAmount?.toFixed(2) || "0.00"}
              </TableCell>
              <TableCell className="text-center">
                {treatment.paymentStatus}
              </TableCell>
              <TableCell className="text-center">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      size="sm"
                      radius="full"
                      variant="light"
                      className="bg-default-100"
                      endContent={<ChevronDown className="h-4 w-4" />}
                    >
                      {treatment.treatmentStatus}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status options"
                    onAction={(key) =>
                      handleStatusChange(treatment.treatmentID, key as string)
                    }
                    selectedKeys={new Set([treatment.treatmentStatus])}
                    selectionMode="single"
                  >
                    {statusOptions.map((status) => (
                      <DropdownItem key={status}>{status}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Button
                    isIconOnly
                    color="warning"
                    variant="flat"
                    aria-label="Edit"
                    onClick={() => handleEdit(treatment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    aria-label="Delete"
                    onClick={() => handleDelete(treatment.treatmentID)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setCurrentTreatment(null);
        }}
        size="lg"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdateTreatment}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                Edit Treatment
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Treatment Type"
                  name="treatmentType"
                  value={currentTreatment?.treatmentType || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={currentTreatment?.startDate || ""}
                  onChange={handleInputChange}
                />
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={currentTreatment?.endDate || ""}
                  onChange={handleInputChange}
                />
                <Input
                  label="Total Paid"
                  name="totalPaid"
                  type="number"
                  value={currentTreatment?.totalPaid?.toString() || ""}
                  onChange={handleInputChange}
                />
                <Input
                  label="Due Amount"
                  name="dueAmount"
                  type="number"
                  value={currentTreatment?.dueAmount?.toString() || ""}
                  onChange={handleInputChange}
                />
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="light"
                      className="bg-default-100"
                      radius="full"
                      endContent={<ChevronDown className="h-4 w-4" />}
                    >
                      {currentTreatment?.treatmentStatus || "Select Status"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status options"
                    onAction={(key) =>
                      setCurrentTreatment((prev) =>
                        prev
                          ? {
                              ...prev,
                              treatmentStatus: key as string,
                            }
                          : null
                      )
                    }
                    selectedKeys={
                      currentTreatment
                        ? new Set([currentTreatment.treatmentStatus])
                        : new Set()
                    }
                    selectionMode="single"
                  >
                    {statusOptions.map((status) => (
                      <DropdownItem key={status}>{status}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button variant="flat" type="submit" color="success">
                  Update
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TreatmentManager;
