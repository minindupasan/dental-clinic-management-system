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
  Select,
  SelectItem,
} from "@nextui-org/react";

import { toast } from "react-hot-toast";
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Filter,
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
  orderedDate: string;
};

const columns = [
  { key: "dentureId", label: "ID" },
  { key: "patientName", label: "PATIENT NAME" },
  { key: "dentureType", label: "DENTURE TYPE" },
  { key: "materialType", label: "MATERIAL" },
  { key: "trialDentureDate", label: "TRIAL DATE" },
  { key: "estimatedDeliveryDate", label: "EST. DELIVERY" },
  { key: "deliveryStatus", label: "DELIVERY STATUS" },
  { key: "cost", label: "COST" },
  { key: "paymentStatus", label: "PAYMENT" },
  { key: "orderedDate", label: "ORDERED DATE" },
  { key: "actions", label: "ACTIONS" },
];

const deliveryStatusOptions = ["In Progress", "Delivered", "Cancelled"];
const paymentStatusOptions = ["Pending", "Paid", "Partially Paid"];

const dentureTypes = [
  "Full Denture",
  "Partial Denture",
  "Implant-Supported Denture",
  "Immediate Denture",
  "Overdenture",
];

const dentureMaterials = [
  "Acrylic",
  "Porcelain",
  "Metal",
  "Flexible",
  "Hybrid",
];

const labNames = [
  "Smile Lab",
  "Dental Creations",
  "ProDent Lab",
  "Crown Masters",
  "Precision Dental",
];

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
  const [viewMode, setViewMode] = useState<{
    delivery: string;
    payment: string;
  }>({ delivery: "all", payment: "all" });

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

    if (viewMode.delivery !== "all") {
      filtered = filtered.filter(
        (denture) => denture.deliveryStatus === viewMode.delivery
      );
    }

    if (viewMode.payment !== "all") {
      filtered = filtered.filter(
        (denture) => denture.paymentStatus === viewMode.payment
      );
    }

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
  }, [dentures, filterValue, viewMode, sortConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDenture((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
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

  const handleStatusChange = async (
    dentureId: number,
    newStatus: string,
    statusType: "delivery" | "payment"
  ) => {
    try {
      const dentureToUpdate = dentures.find(
        (denture) => denture.dentureId === dentureId
      );
      if (!dentureToUpdate) {
        throw new Error("Denture not found");
      }

      const updatedDenture =
        statusType === "delivery"
          ? { ...dentureToUpdate, deliveryStatus: newStatus }
          : { ...dentureToUpdate, paymentStatus: newStatus };

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
        throw new Error(`Failed to update denture ${statusType} status`);
      }

      toast.success(`Denture ${statusType} status updated to ${newStatus}`);
      fetchDentures();
    } catch (error) {
      console.error(`Error updating denture ${statusType} status:`, error);
      toast.error(
        `An error occurred while updating the denture ${statusType} status`
      );
    }
  };

  const handleDentureAdded = useCallback(() => {
    fetchDentures();
  }, [fetchDentures]);

  const handleFilterChange = (
    statusType: "delivery" | "payment",
    value: string
  ) => {
    setViewMode((prev) => ({ ...prev, [statusType]: value }));
  };

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
            <Dropdown>
              <DropdownTrigger className="w-[200px]">
                <Button
                  radius="full"
                  color="primary"
                  variant="ghost"
                  startContent={<Filter className="h-4 w-4" />}
                  endContent={<ChevronDown className="h-4 w-4" />}
                  className="px-5 py-1 w-[200px] flex justify-between items-center"
                  aria-label="Filter delivery status"
                >
                  {viewMode.delivery === "all"
                    ? "All Delivery"
                    : viewMode.delivery}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Delivery status options"
                onAction={(key) =>
                  handleFilterChange("delivery", key as string)
                }
                className="w-[200px] text-foreground-light"
              >
                <DropdownItem key="all">All Delivery</DropdownItem>
                <>
                  {deliveryStatusOptions.map((status) => (
                    <DropdownItem key={status}>{status}</DropdownItem>
                  ))}
                </>
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="w-[200px]">
                <Button
                  radius="full"
                  color="primary"
                  variant="ghost"
                  startContent={<Filter className="h-4 w-4" />}
                  endContent={<ChevronDown className="h-4 w-4" />}
                  className="px-5 py-1 w-[200px] flex justify-between items-center"
                  aria-label="Filter payment status"
                >
                  {viewMode.payment === "all"
                    ? "All Payment"
                    : viewMode.payment}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Payment status options"
                onAction={(key) => handleFilterChange("payment", key as string)}
                className="w-[200px] text-foreground-light"
              >
                <DropdownItem key="all">All Payment</DropdownItem>
                <>
                  {paymentStatusOptions.map((status) => (
                    <DropdownItem key={status}>{status}</DropdownItem>
                  ))}
                </>
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
          <div className="flex items-center space-x-2">
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
                column.key !== "paymentStatus" &&
                handleSort(column.key)
              }
              style={{
                cursor:
                  column.key !== "actions" &&
                  column.key !== "deliveryStatus" &&
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
                    aria-label="Delivery Status options"
                    onAction={(key) =>
                      handleStatusChange(
                        denture.dentureId,
                        key as string,
                        "delivery"
                      )
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
                LKR {denture.cost.toFixed(2)}
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
                      {denture.paymentStatus}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Payment Status options"
                    onAction={(key) =>
                      handleStatusChange(
                        denture.dentureId,
                        key as string,
                        "payment"
                      )
                    }
                    selectedKeys={new Set([denture.paymentStatus])}
                    selectionMode="single"
                  >
                    {paymentStatusOptions.map((status) => (
                      <DropdownItem key={status}>{status}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
              <TableCell className="text-center">
                {denture.orderedDate}
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
                <Select
                  label="Denture Type"
                  placeholder="Select denture type"
                  value={currentDenture?.dentureType || ""}
                  onChange={(e) =>
                    handleSelectChange("dentureType", e.target.value)
                  }
                  required
                >
                  {dentureTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Material Type"
                  placeholder="Select material type"
                  value={currentDenture?.materialType || ""}
                  onChange={(e) =>
                    handleSelectChange("materialType", e.target.value)
                  }
                  required
                >
                  {dentureMaterials.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </Select>
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
                  label="Cost (LKR)"
                  name="cost"
                  type="number"
                  min="0"
                  step="1"
                  value={currentDenture?.cost.toString() || ""}
                  onChange={handleInputChange}
                  required
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">LKR</span>
                    </div>
                  }
                />
                <Select
                  label="Lab Name"
                  placeholder="Select lab"
                  value={currentDenture?.labName || ""}
                  onChange={(e) =>
                    handleSelectChange("labName", e.target.value)
                  }
                  required
                >
                  {labNames.map((lab) => (
                    <SelectItem key={lab} value={lab}>
                      {lab}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Received Date"
                  name="receivedDate"
                  type="date"
                  value={currentDenture?.receivedDate || ""}
                  onChange={handleInputChange}
                />
                <Select
                  label="Delivery Status"
                  placeholder="Select delivery status"
                  value={currentDenture?.deliveryStatus || ""}
                  onChange={(e) =>
                    handleSelectChange("deliveryStatus", e.target.value)
                  }
                  required
                >
                  {deliveryStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Payment Status"
                  placeholder="Select payment status"
                  value={currentDenture?.paymentStatus || ""}
                  onChange={(e) =>
                    handleSelectChange("paymentStatus", e.target.value)
                  }
                  required
                >
                  {paymentStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Remarks"
                  name="remarks"
                  value={currentDenture?.remarks || ""}
                  onChange={handleInputChange}
                />
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
}
