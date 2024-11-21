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
  RefreshCw,
} from "lucide-react";
import NewDentureButton from "./NewDentureButton";

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

type Denture = {
  dentureId: number;
  patient: Patient;
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

const columns = [
  { key: "dentureId", label: "ID" },
  { key: "patientName", label: "PATIENT NAME" },
  { key: "dentureType", label: "DENTURE TYPE" },
  { key: "materialType", label: "MATERIAL" },
  { key: "trialDentureDate", label: "TRIAL DATE" },
  { key: "estimatedDeliveryDate", label: "EST. DELIVERY" },
  { key: "deliveryStatus", label: "STATUS" },
  { key: "cost", label: "COST" },
  { key: "paymentStatus", label: "PAYMENT" },
  { key: "actions", label: "ACTIONS" },
];

const deliveryStatusOptions = ["In Progress", "Completed", "Delayed"];

export default function DentureManager() {
  const [dentures, setDentures] = useState<Denture[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDenture, setCurrentDenture] = useState<Denture | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | "none";
    clickCount: number;
  }>({ key: "", direction: "none", clickCount: 0 });
  const [filterValue, setFilterValue] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDentures = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/dentures`);
      if (!response.ok) {
        throw new Error("Failed to fetch dentures");
      }
      const data = await response.json();
      setDentures(data);
      setLoading(false);
    } catch (err) {
      toast.error("An error occurred while fetching denture data.");
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDentures();
  }, [fetchDentures]);

  const filteredDentures = useMemo(() => {
    let filtered = [...dentures];

    if (filterValue) {
      filtered = filtered.filter(
        (denture) =>
          Object.values(denture).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(filterValue.toLowerCase())
          ) ||
          denture.patient.firstName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          denture.patient.lastName
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
          aValue = a[sortConfig.key as keyof Denture];
          bValue = b[sortConfig.key as keyof Denture];
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
  }, [dentures, filterValue, sortConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDenture((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEdit = (denture: Denture) => {
    setCurrentDenture(denture);
    onOpen();
  };

  const handleDelete = (dentureId: number) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this denture?</p>
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
              onPress={() => confirmDelete(dentureId, t.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const confirmDelete = async (dentureId: number, toastId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dentures/delete/${dentureId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete denture");
      }
      toast.success("Denture deleted successfully");
      fetchDentures();
    } catch (err) {
      toast.error("An error occurred while deleting the denture");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUpdateDenture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentDenture) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dentures/update/${currentDenture.dentureId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentDenture),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update denture");
      }

      toast.success("Denture updated successfully");
      fetchDentures();
      onClose();
      setCurrentDenture(null);
    } catch (err) {
      toast.error("An error occurred while updating the denture");
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

  const handleStatusChange = async (dentureId: number, newStatus: string) => {
    try {
      const dentureToUpdate = dentures.find(
        (denture) => denture.dentureId === dentureId
      );
      if (!dentureToUpdate) {
        throw new Error("Denture not found");
      }

      const updatedDenture = { ...dentureToUpdate, deliveryStatus: newStatus };

      const response = await fetch(
        `${API_BASE_URL}/api/dentures/update/${dentureId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedDenture),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update denture status");
      }

      toast.success(`Denture status updated to ${newStatus}`);
      fetchDentures();
    } catch (error) {
      console.error("Error updating denture status:", error);
      toast.error("An error occurred while updating the denture status");
    }
  };

  const handleDentureAdded = useCallback(() => {
    fetchDentures();
  }, [fetchDentures]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-foreground-light">
        <Spinner label="Loading denture data..." />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-0 pt-6 px-6">
          <div className="flex items-center space-x-4">
            <NewDentureButton onDentureAdded={handleDentureAdded} />
            <Input
              placeholder="Search dentures..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              radius="full"
              startContent={<Search className="h-4 w-4" />}
              className="w-[300px]"
            />
          </div>
          <Button
            isIconOnly
            className="bg-primary-200 text-primary-600"
            aria-label="Refresh"
            onClick={fetchDentures}
            isLoading={isRefreshing}
          >
            {isRefreshing ? (
              <Spinner size="sm" color="current" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Table aria-label="Denture data table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              className="text-center"
              key={column.key}
              onClick={() =>
                column.key !== "actions" &&
                column.key !== "deliveryStatus" &&
                handleSort(column.key)
              }
              style={{
                cursor:
                  column.key !== "actions" && column.key !== "deliveryStatus"
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
          {filteredDentures.map((denture) => (
            <TableRow key={denture.dentureId}>
              <TableCell className="text-center">{denture.dentureId}</TableCell>
              <TableCell className="text-center">
                {`${denture.patient.firstName} ${denture.patient.lastName}`}
              </TableCell>
              <TableCell className="text-center">
                {denture.dentureType}
              </TableCell>
              <TableCell className="text-center">
                {denture.materialType}
              </TableCell>
              <TableCell className="text-center">
                {denture.trialDentureDate}
              </TableCell>
              <TableCell className="text-center">
                {denture.estimatedDeliveryDate}
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
                      {denture.deliveryStatus}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status options"
                    onAction={(key) =>
                      handleStatusChange(denture.dentureId, key as string)
                    }
                    selectedKeys={new Set([denture.deliveryStatus])}
                    selectionMode="single"
                  >
                    {deliveryStatusOptions.map((status) => (
                      <DropdownItem key={status}>{status}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
              <TableCell className="text-center">
                ${denture.cost.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {denture.paymentStatus}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Button
                    isIconOnly
                    color="warning"
                    variant="flat"
                    aria-label="Edit"
                    onClick={() => handleEdit(denture)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    aria-label="Delete"
                    onClick={() => handleDelete(denture.dentureId)}
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
          setCurrentDenture(null);
        }}
        size="lg"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdateDenture}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                Edit Denture
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Denture Type"
                  name="dentureType"
                  value={currentDenture?.dentureType || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Material Type"
                  name="materialType"
                  value={currentDenture?.materialType || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Trial Date"
                  name="trialDentureDate"
                  type="date"
                  value={currentDenture?.trialDentureDate || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Estimated Delivery Date"
                  name="estimatedDeliveryDate"
                  type="date"
                  value={currentDenture?.estimatedDeliveryDate || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Cost"
                  name="cost"
                  type="number"
                  value={currentDenture?.cost.toString() || ""}
                  onChange={handleInputChange}
                  required
                />
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="light"
                      className="bg-default-100"
                      radius="full"
                      endContent={<ChevronDown className="h-4 w-4" />}
                    >
                      {currentDenture?.deliveryStatus || "Select Status"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status options"
                    onAction={(key) =>
                      setCurrentDenture((prev) =>
                        prev ? { ...prev, deliveryStatus: key as string } : null
                      )
                    }
                    selectedKeys={
                      currentDenture
                        ? new Set([currentDenture.deliveryStatus])
                        : new Set()
                    }
                    selectionMode="single"
                  >
                    {deliveryStatusOptions.map((status) => (
                      <DropdownItem key={status}>{status}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
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
                  Update Denture
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
