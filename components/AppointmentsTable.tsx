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

const columns = [
  { key: "appointmentID", label: "ID" },
  { key: "patientName", label: "PATIENT NAME" },
  { key: "appointmentDate", label: "DATE" },
  { key: "appointmentTime", label: "TIME" },
  { key: "reason", label: "REASON" },
  { key: "status", label: "STATUS" },
  { key: "actions", label: "ACTIONS" },
];

const statusOptions = ["Scheduled", "Treated"];

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

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/appointments");
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      toast.error("An error occurred while fetching appointment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
        `http://localhost:8080/api/appointments/delete/${appointmentID}`,
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
        `http://localhost:8080/api/appointments/update/${currentAppointment.appointmentID}`,
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
        `http://localhost:8080/api/appointments/${appointmentID}/status`,
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

      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app.appointmentID === appointmentID
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("An error occurred while updating the appointment status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label="Loading appointment data..." color="primary" />
      </div>
    );
  }

  return (
    <div className=" text-foreground rounded-xl w-full">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-0 pt-6 px-6">
        <Dropdown>
          <DropdownTrigger className="w-full sm:w-[200px]">
            <Button
              radius="full"
              startContent={<Filter className="h-4 w-4" />}
              endContent={<ChevronDown className="h-4 w-4" />}
              className="px-5 py-1 text-sm bg-white border w-full flex justify-between items-center"
            >
              {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}{" "}
              Appointments
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="View options"
            onAction={(key) => setViewMode(key as any)}
            className="w-[200px]"
          >
            <DropdownItem key="all">All Appointments</DropdownItem>
            <DropdownItem key="today">Today's Appointments</DropdownItem>
            <DropdownItem key="upcoming">Upcoming Appointments</DropdownItem>
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
      </div>
      <div className="py-4 px-6">
        <div
          className="border border-gray-200 rounded-lg overflow-hidden"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          <Table aria-label="Appointment Records">
            <TableHeader>
              {columns.map((column) => (
                <TableColumn
                  key={column.key}
                  onClick={() =>
                    column.key !== "actions" && handleSort(column.key)
                  }
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
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.appointmentID}>
                  <TableCell>
                    {appointment.formattedAppointmentID ||
                      appointment.appointmentID}
                  </TableCell>
                  <TableCell>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</TableCell>
                  <TableCell>{appointment.appointmentDate}</TableCell>
                  <TableCell>{appointment.appointmentTime}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="capitalize"
                          color={
                            appointment.status === "Treated"
                              ? "success"
                              : "primary"
                          }
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        isIconOnly
                        className="text-warning-500 bg-warning-100"
                        variant="light"
                        aria-label="Edit"
                        onClick={() => handleEdit(appointment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        isIconOnly
                        className="text-danger-500 bg-danger-100"
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
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setCurrentAppointment(null);
        }}
        size="2xl"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdateAppointment}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
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
                      variant="bordered"
                      className="capitalize"
                      color={
                        currentAppointment?.status === "Treated"
                          ? "success"
                          : "primary"
                      }
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="light"
                  type="submit"
                  className="text-success-600"
                >
                  Update Appointment
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
