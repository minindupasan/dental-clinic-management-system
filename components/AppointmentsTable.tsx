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
} from "lucide-react";
import NewAppointmentButton from "./NewAppointmentButton";
import MedicalHistoryViewModal from "./MedicalHistoryViewModal";

type Patient = {
  patientID: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  gender: string;
  medicalRecords: string;
  dob: string;
  createdDate: string;
};

type Appointment = {
  appointmentID: number;
  formattedAppointmentID: string;
  patient: Patient;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const columns = [
  { key: "appointmentID", label: "ID" },
  { key: "patientName", label: "PATIENT NAME" },
  { key: "appointmentDate", label: "DATE" },
  { key: "appointmentTime", label: "TIME" },
  { key: "reason", label: "REASON" },
  { key: "status", label: "STATUS" },
  { key: "medicalRecords", label: "MEDICAL RECORDS" },
  { key: "actions", label: "ACTIONS" },
];

const statusOptions = ["Scheduled", "Treated", "Cancelled"];

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | "none";
    clickCount: number;
  }>({ key: "", direction: "none", clickCount: 0 });
  const [filterValue, setFilterValue] = useState("");
  const [viewMode, setViewMode] = useState<
    "all" | "today" | "upcoming" | "past"
  >("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const response = await fetch(`${API_URL}/api/appointments`);
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      toast.error("An error occurred while fetching appointment data.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];
    const today = new Date().toISOString().split("T")[0];

    switch (viewMode) {
      case "today":
        filtered = filtered.filter((app) => app.appointmentDate === today);
        break;
      case "upcoming":
        filtered = filtered.filter((app) => app.appointmentDate > today);
        break;
      case "past":
        filtered = filtered.filter((app) => app.appointmentDate < today);
        break;
    }

    if (filterValue) {
      filtered = filtered.filter(
        (app) =>
          Object.values(app).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(filterValue.toLowerCase())
          ) ||
          app.patient.firstName
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          app.patient.lastName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (sortConfig.direction !== "none") {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "patientName") {
          aValue = `${a.patient.firstName} ${a.patient.lastName}`;
          bValue = `${b.patient.firstName} ${b.patient.lastName}`;
        } else {
          aValue = a[sortConfig.key as keyof Appointment];
          bValue = b[sortConfig.key as keyof Appointment];
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
  }, [appointments, filterValue, viewMode, sortConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAppointment((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEdit = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    onOpen();
  };

  const handleDelete = (appointmentID: number) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this appointment?</p>
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
              onPress={() => confirmDelete(appointmentID, t.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const confirmDelete = async (appointmentID: number, toastId: string) => {
    try {
      const response = await fetch(
        `https://dent-care-plus-springboot.onrender.com/api/appointments/delete/${appointmentID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }
      toast.success("Appointment deleted successfully");
      fetchAppointments();
    } catch (err) {
      toast.error("An error occurred while deleting the appointment");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUpdateAppointment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!currentAppointment) return;

    try {
      const response = await fetch(
        `https://dent-care-plus-springboot.onrender.com/api/appointments/update/${currentAppointment.appointmentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentAppointment),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      toast.success("Appointment updated successfully");
      fetchAppointments();
      onClose();
      setCurrentAppointment(null);
    } catch (err) {
      toast.error("An error occurred while updating the appointment");
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
    appointmentID: number,
    newStatus: string
  ) => {
    try {
      const appointmentToUpdate = appointments.find(
        (app) => app.appointmentID === appointmentID
      );
      if (!appointmentToUpdate) {
        throw new Error("Appointment not found");
      }

      const updatedAppointment = { ...appointmentToUpdate, status: newStatus };

      const response = await fetch(
        `https://dent-care-plus-springboot.onrender.com/api/appointments/update/${appointmentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAppointment),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      toast.success(`Appointment status updated to ${newStatus}`);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("An error occurred while updating the appointment status");
    }
  };

  const handleAppointmentAdded = useCallback(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <Card className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner label="Loading appointment data..." color="primary" />
        </div>
      ) : (
        <>
          <Toaster position="top-right" />
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold">Appointments</h1>
              <NewAppointmentButton
                onAppointmentAdded={handleAppointmentAdded}
              />
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
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="View options"
                  onAction={(key) => setViewMode(key as any)}
                  className="w-[200px]"
                >
                  <DropdownItem key="all">All Appointments</DropdownItem>
                  <DropdownItem key="today">Today's Appointments</DropdownItem>
                  <DropdownItem key="upcoming">
                    Upcoming Appointments
                  </DropdownItem>
                  <DropdownItem key="past">Past Appointments</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Input
                placeholder="Search appointments..."
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
                onClick={fetchAppointments}
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

          <Table aria-label="Appointment Records">
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
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.appointmentID}>
                  <TableCell className="text-center">
                    {appointment.formattedAppointmentID ||
                      appointment.appointmentID}
                  </TableCell>
                  <TableCell className="text-center">
                    {`${appointment.patient.firstName} ${appointment.patient.lastName}`}
                  </TableCell>
                  <TableCell className="text-center">
                    {appointment.appointmentDate}
                  </TableCell>
                  <TableCell className="text-center">
                    {appointment.appointmentTime}
                  </TableCell>
                  <TableCell className="text-center">
                    {appointment.reason}
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
                          {appointment.status}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Status options"
                        onAction={(key) =>
                          handleStatusChange(
                            appointment.appointmentID,
                            key as string
                          )
                        }
                        selectedKeys={new Set([appointment.status])}
                        selectionMode="single"
                      >
                        {statusOptions.map((status) => (
                          <DropdownItem key={status}>{status}</DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                  <TableCell className="text-center">
                    <MedicalHistoryViewModal
                      patientId={appointment.patient.patientID}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        isIconOnly
                        color="warning"
                        variant="light"
                        aria-label="Edit"
                        onClick={() => handleEdit(appointment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        aria-label="Delete"
                        onClick={() => handleDelete(appointment.appointmentID)}
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
              setCurrentAppointment(null);
            }}
            size="sm"
            hideCloseButton
          >
            <ModalContent>
              {(onClose) => (
                <form onSubmit={handleUpdateAppointment}>
                  <ModalHeader className="flex flex-col gap-1">
                    Edit Appointment
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      label="Date"
                      name="appointmentDate"
                      type="date"
                      value={currentAppointment?.appointmentDate || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Time"
                      name="appointmentTime"
                      type="time"
                      value={currentAppointment?.appointmentTime || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Reason"
                      name="reason"
                      value={currentAppointment?.reason || ""}
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
                          {currentAppointment?.status || "Select Status"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Status options"
                        onAction={(key) =>
                          setCurrentAppointment((prev) =>
                            prev ? { ...prev, status: key as string } : null
                          )
                        }
                        selectedKeys={
                          currentAppointment
                            ? new Set([currentAppointment.status])
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
                    <Button
                      radius="full"
                      color="danger"
                      variant="ghost"
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      radius="full"
                      variant="ghost"
                      type="submit"
                      color="success"
                    >
                      Update
                    </Button>
                  </ModalFooter>
                </form>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </Card>
  );
}
