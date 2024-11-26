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
  RefreshCw,
} from "lucide-react";
import NewDentureButton from "./NewDentureButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type Denture = {
  dentureID: number;
  dentureType: string;
  materialType: string;
  trialDentureDate: string;
  estimatedDeliveryDate: string;
  receivedDate: string;
  remarks: string;
  cost: number;
  paymentStatus: string;
  deliveryStatus: string;
  labName: string;
  orderedDate: string;
  patient: {
    patientID: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    gender: string;
    dob: string;
    createdDate: string;
  };
};

const columns = [
  { key: "dentureID", label: "ID" },
  { key: "patientID", label: "PATIENT ID" },
  { key: "patientName", label: "NAME" },
  { key: "dentureType", label: "TYPE" },
  { key: "materialType", label: "MATERIAL" },
  { key: "trialDentureDate", label: "TRIAL DATE" },
  { key: "estimatedDeliveryDate", label: "EST. DELIVERY" },
  { key: "receivedDate", label: "RECEIVED DATE" },
  { key: "cost", label: "COST" },
  { key: "paymentStatus", label: "PAYMENT" },
  { key: "deliveryStatus", label: "DELIVERY" },
  { key: "labName", label: "LAB" },
  { key: "orderedDate", label: "ORDERED DATE" },
  { key: "actions", label: "ACTIONS" },
];

const paymentStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Partially Paid", value: "Partially Paid" },
];

const deliveryStatusOptions = [
  { label: "In Progress", value: "In Progress" },
  { label: "Ready for Delivery", value: "Ready for Delivery" },
  { label: "Delivered", value: "Delivered" },
];

const initialDentureState: Omit<Denture, "patient"> = {
  dentureID: 0,
  dentureType: "",
  materialType: "",
  trialDentureDate: "",
  estimatedDeliveryDate: "",
  receivedDate: "",
  remarks: "",
  cost: 0,
  paymentStatus: "",
  deliveryStatus: "",
  labName: "",
  orderedDate: "",
};

export default function DentureTable() {
  const [dentures, setDentures] = useState<Denture[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDenture, setCurrentDenture] =
    useState<Omit<Denture, "patient">>(initialDentureState);
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDentures = async () => {
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
  };

  useEffect(() => {
    fetchDentures();
  }, []);

  const filteredDentures = useMemo(() => {
    let filtered = [...dentures];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    switch (viewMode) {
      case "recent":
        filtered = filtered.filter(
          (denture) => new Date(denture.orderedDate) >= thirtyDaysAgo
        );
        break;
      case "older":
        filtered = filtered.filter(
          (denture) => new Date(denture.orderedDate) < thirtyDaysAgo
        );
        break;
    }

    if (filterValue) {
      filtered = filtered.filter((denture) =>
        Object.values(denture).some((value) =>
          value?.toString().toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    if (sortConfig.direction !== "none") {
      filtered.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "patientName") {
          aValue = `${a.patient.firstName} ${a.patient.lastName}`;
          bValue = `${b.patient.firstName} ${b.patient.lastName}`;
        } else {
          aValue = a[sortConfig.key as keyof Denture] ?? "";
          bValue = b[sortConfig.key as keyof Denture] ?? "";
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
  }, [dentures, filterValue, viewMode, sortConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDenture((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentDenture((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (denture: Denture) => {
    setCurrentDenture({
      ...denture,
      trialDentureDate: denture.trialDentureDate.split("T")[0],
      estimatedDeliveryDate: denture.estimatedDeliveryDate.split("T")[0],
      receivedDate: denture.receivedDate.split("T")[0],
      orderedDate: denture.orderedDate.split("T")[0],
    });
    onEditOpen();
  };

  const handleDelete = (dentureID: number) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this denture?</p>
          <div className="mt-2 flex justify-end space-x-2">
            <Button
              size="sm"
              variant="flat"
              color="default"
              onPress={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={() => confirmDelete(dentureID, t.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const confirmDelete = async (dentureID: number, toastId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dentures/delete/${dentureID}`,
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
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dentures/update/${currentDenture.dentureID}`,
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

      const updatedDenture = await response.json();
      toast.success("Denture updated successfully");
      fetchDentures();
      onEditClose();
      setCurrentDenture(initialDentureState);
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

  const handleStatusUpdate = async (
    dentureID: number,
    field: string,
    value: string
  ) => {
    try {
      const dentureToUpdate = dentures.find(
        (denture) => denture.dentureID === dentureID
      );
      if (!dentureToUpdate) {
        throw new Error("Denture not found");
      }

      const updatedDenture = { ...dentureToUpdate, [field]: value };

      const response = await fetch(
        `${API_BASE_URL}/api/dentures/update/${dentureID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedDenture),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update ${field}`);
      }

      toast.success(`${field} updated successfully`);
      setDentures((prevDentures) =>
        prevDentures.map((denture) =>
          denture.dentureID === dentureID
            ? { ...denture, [field]: value }
            : denture
        )
      );
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(
        `An error occurred while updating ${field}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-foreground-flat">
        <Spinner label="Loading denture data..." />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-0 pt-6 px-6">
          <div className="flex items-center space-x-4">
            <NewDentureButton onDentureAdded={fetchDentures} />
            <Dropdown>
              <DropdownTrigger className="w-[200px]">
                <Button
                  radius="full"
                  color="primary"
                  variant="ghost"
                  startContent={<Filter className="h-4 w-4" />}
                  endContent={<ChevronDown className="h-4 w-4" />}
                  className="px-5 py-1 w-[200px] flex justify-between items-center"
                  aria-label="Filter dentures"
                >
                  {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}{" "}
                  Dentures
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="View options"
                onAction={(key) => setViewMode(key as any)}
                className="w-[200px] text-foreground-flat"
              >
                <DropdownItem key="all">All Dentures</DropdownItem>
                <DropdownItem key="recent">
                  Recent Dentures (30 days)
                </DropdownItem>
                <DropdownItem key="older">Older Dentures</DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
            color="primary"
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
          {filteredDentures.map((denture) => (
            <TableRow key={denture.dentureID}>
              <TableCell>{denture.dentureID}</TableCell>
              <TableCell>{`${denture.patient.firstName}`}</TableCell>
              <TableCell>{denture.patient.patientID}</TableCell>
              <TableCell>{denture.dentureType}</TableCell>
              <TableCell>{denture.materialType}</TableCell>
              <TableCell>
                {new Date(denture.trialDentureDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(denture.estimatedDeliveryDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(denture.receivedDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{denture.cost}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      size="sm"
                      radius="full"
                      variant="bordered"
                      className="capitalize"
                    >
                      {denture.paymentStatus}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Payment Status"
                    onAction={(key) =>
                      handleStatusUpdate(
                        denture.dentureID,
                        "paymentStatus",
                        key as string
                      )
                    }
                    selectedKeys={new Set([denture.paymentStatus])}
                    selectionMode="single"
                  >
                    {paymentStatusOptions.map((option) => (
                      <DropdownItem key={option.value}>
                        {option.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      size="sm"
                      radius="full"
                      variant="bordered"
                      className="capitalize"
                    >
                      {denture.deliveryStatus}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Delivery Status"
                    onAction={(key) =>
                      handleStatusUpdate(
                        denture.dentureID,
                        "deliveryStatus",
                        key as string
                      )
                    }
                    selectedKeys={new Set([denture.deliveryStatus])}
                    selectionMode="single"
                  >
                    {deliveryStatusOptions.map((option) => (
                      <DropdownItem key={option.value}>
                        {option.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
              <TableCell>{denture.labName}</TableCell>
              <TableCell>
                {new Date(denture.orderedDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
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
                    onClick={() => handleDelete(denture.dentureID)}
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
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setCurrentDenture(initialDentureState);
        }}
        size="lg"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdateDenture}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-flat">
                Edit Denture
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Denture Type"
                  name="dentureType"
                  value={currentDenture.dentureType}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Material Type"
                  name="materialType"
                  value={currentDenture.materialType}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Trial Denture Date"
                  name="trialDentureDate"
                  type="date"
                  value={currentDenture.trialDentureDate}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Estimated Delivery Date"
                  name="estimatedDeliveryDate"
                  type="date"
                  value={currentDenture.estimatedDeliveryDate}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Received Date"
                  name="receivedDate"
                  type="date"
                  value={currentDenture.receivedDate}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Remarks"
                  name="remarks"
                  value={currentDenture.remarks}
                  onChange={handleInputChange}
                />
                <Input
                  label="Cost"
                  name="cost"
                  type="number"
                  value={currentDenture.cost.toString()}
                  onChange={handleInputChange}
                  required
                />
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" className="capitalize">
                      {currentDenture.paymentStatus || "Select Payment Status"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Payment Status"
                    onAction={(key) =>
                      handleSelectChange("paymentStatus", key as string)
                    }
                  >
                    {paymentStatusOptions.map((option) => (
                      <DropdownItem key={option.value}>
                        {option.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" className="capitalize">
                      {currentDenture.deliveryStatus ||
                        "Select Delivery Status"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Delivery Status"
                    onAction={(key) =>
                      handleSelectChange("deliveryStatus", key as string)
                    }
                  >
                    {deliveryStatusOptions.map((option) => (
                      <DropdownItem key={option.value}>
                        {option.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Input
                  label="Lab Name"
                  name="labName"
                  value={currentDenture.labName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Ordered Date"
                  name="orderedDate"
                  type="date"
                  value={currentDenture.orderedDate}
                  onChange={handleInputChange}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button variant="flat" type="submit" color="success">
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
