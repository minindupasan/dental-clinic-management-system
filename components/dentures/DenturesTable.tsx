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
  dentureID: number;
  dentureType: string;
  materialType: string;
  trialDentureDate: string;
  estimatedDeliveryDate: string;
  receivedDate: string | null;
  remarks: string;
  cost: number;
  paymentStatus: string;
  deliveryStatus: string;
  labName: string;
  orderedDate: string;
  patient: Patient;
};

const columns = [
  { key: "dentureId", label: "ID" },
  { key: "patientName", label: "PATIENT NAME" },
  { key: "dentureType", label: "DENTURE TYPE" },
  { key: "materialType", label: "MATERIAL" },
  { key: "trialDentureDate", label: "TRIAL DATE" },
  { key: "estimatedDeliveryDate", label: "EST. DELIVERY" },
  { key: "receivedDate", label: "RECEIVED DATE" },
  { key: "deliveryStatus", label: "DELIVERY STATUS" },
  { key: "cost", label: "COST" },
  { key: "paymentStatus", label: "PAYMENT" },
  { key: "labName", label: "LAB NAME" },
  { key: "orderedDate", label: "ORDERED DATE" },
  { key: "actions", label: "ACTIONS" },
];

const deliveryStatusOptions = ["In Progress", "Delivered", "Cancelled"];
const paymentStatusOptions = ["Pending", "Paid", "Partially Paid"];

const dentureTypes = [
  "Complete Denture",
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
  "Dental Lab XYZ",
  "Smile Lab",
  "Dental Creations",
  "ProDent Lab",
  "Crown Masters",
  "Precision Dental",
];

const initialDentureState: Denture = {
  dentureID: 0,
  dentureType: "",
  materialType: "",
  trialDentureDate: "",
  estimatedDeliveryDate: "",
  receivedDate: null,
  remarks: "",
  cost: 0,
  paymentStatus: "",
  deliveryStatus: "",
  labName: "",
  orderedDate: "",
  patient: {
    patientID: 0,
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    gender: "",
    dob: "",
    createdDate: "",
  },
};

export default function DenturesTable() {
  const [dentures, setDentures] = useState<Denture[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDenture, setCurrentDenture] =
    useState<Denture>(initialDentureState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | "none";
    clickCount: number;
  }>({ key: "", direction: "none", clickCount: 0 });
  const [filterValue, setFilterValue] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "inProgress" | "delivered">(
    "all"
  );
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

    switch (viewMode) {
      case "inProgress":
        filtered = filtered.filter(
          (denture) => denture.deliveryStatus === "In Progress"
        );
        break;
      case "delivered":
        filtered = filtered.filter(
          (denture) => denture.deliveryStatus === "Delivered"
        );
        break;
    }

    if (filterValue) {
      filtered = filtered.filter(
        (denture) =>
          Object.values(denture).some((value) =>
            value?.toString().toLowerCase().includes(filterValue.toLowerCase())
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

      toast.success("Denture updated successfully");
      fetchDentures();
      onClose();
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
                  {viewMode === "all"
                    ? "All Dentures"
                    : viewMode === "inProgress"
                      ? "In Progress"
                      : "Delivered"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="View options"
                onAction={(key) => setViewMode(key as any)}
                className="w-[200px] text-foreground-light"
              >
                <DropdownItem key="all">All Dentures</DropdownItem>
                <DropdownItem key="inProgress">In Progress</DropdownItem>
                <DropdownItem key="delivered">Delivered</DropdownItem>
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
              <TableCell className="text-center">{denture.dentureID}</TableCell>
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
                {new Date(denture.trialDentureDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                {new Date(denture.estimatedDeliveryDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                {denture.receivedDate
                  ? new Date(denture.receivedDate).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell className="text-center">
                {denture.deliveryStatus}
              </TableCell>
              <TableCell className="text-center">
                LKR {denture.cost.toFixed(2)}
              </TableCell>

              <TableCell className="text-center">
                {denture.paymentStatus}
              </TableCell>
              <TableCell className="text-center">{denture.labName}</TableCell>
              <TableCell className="text-center">
                {new Date(denture.orderedDate).toLocaleDateString()}
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
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setCurrentDenture(initialDentureState);
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
                  value={currentDenture.dentureType}
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
                  value={currentDenture.materialType}
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
                  value={currentDenture.trialDentureDate.split("T")[0]}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Estimated Delivery Date"
                  name="estimatedDeliveryDate"
                  type="date"
                  value={currentDenture.estimatedDeliveryDate.split("T")[0]}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Received Date"
                  name="receivedDate"
                  type="date"
                  value={
                    currentDenture.receivedDate
                      ? currentDenture.receivedDate.split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                />
                <Input
                  label="Cost (LKR)"
                  name="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentDenture.cost.toString()}
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
                  value={currentDenture.labName}
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
                <Select
                  label="Delivery Status"
                  placeholder="Select delivery status"
                  value={currentDenture.deliveryStatus}
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
                  value={currentDenture.paymentStatus}
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
                  value={currentDenture.remarks}
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
