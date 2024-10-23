"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

type Patient = {
  patientID: number;
  formattedPatientID: string | null;
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
  formattedAppointmentID: string | null;
  patient: Patient;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
};

const columns = [
  { key: "appointmentID", label: "ID" },
  { key: "patientName", label: "Patient Name" },
  { key: "appointmentDate", label: "Date" },
  { key: "appointmentTime", label: "Time" },
  { key: "reason", label: "Reason" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const statusOptions = ["Scheduled", "Treated"];

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | "none";
  }>({ key: "", direction: "none" });
  const [sortClickCount, setSortClickCount] = useState<{
    [key: string]: number;
  }>({});
  const [filterValue, setFilterValue] = useState("");
  const [viewMode, setViewMode] = useState<
    "all" | "today" | "upcoming" | "past"
  >("all");
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAndSortAppointments();
  }, [appointments, filterValue, viewMode, sortConfig]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");

      const data = await response.json();
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("An error occurred while fetching appointment data.");
      setLoading(false);
    }
  };

  const filterAndSortAppointments = () => {
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

    setFilteredAppointments(filtered);
  };

  const handleSort = (key: string) => {
    const clickCount = (sortClickCount[key] || 0) + 1;
    setSortClickCount({ ...sortClickCount, [key]: clickCount });

    if (clickCount === 3) {
      setSortConfig({ key, direction: "none" });
      setSortClickCount({ ...sortClickCount, [key]: 0 });
    } else if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction:
          sortConfig.direction === "ascending" ? "descending" : "ascending",
      });
    } else {
      setSortConfig({ key, direction: "ascending" });
    }
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey || sortConfig.direction === "none")
      return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="inline-block ml-1" />
    ) : (
      <ChevronDown className="inline-block ml-1" />
    );
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    onOpen();
  };

  const handleDelete = async (appointmentID: number) => {
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
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("An error occurred while deleting the appointment");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAppointment) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/update/${editingAppointment.appointmentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingAppointment),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }
      toast.success("Appointment updated successfully");
      onClose();
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("An error occurred while updating the appointment");
    }
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center space-x-4">
        <Dropdown>
          <DropdownTrigger>
            <Button
              radius="full"
              startContent={<Filter className="h-4 w-4" />}
              endContent={<ChevronDown className="h-4 w-4" />}
              className="px-5 py-1 text-sm bg-white border w-[200px] flex justify-between items-center"
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
          className="w-[300px]"
        />
      </div>
      <Table aria-label="Appointments table">
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
          {filteredAppointments.map((item) => (
            <TableRow key={item.appointmentID}>
              <TableCell>
                {item.formattedAppointmentID || item.appointmentID}
              </TableCell>
              <TableCell>{`${item.patient.firstName} ${item.patient.lastName}`}</TableCell>
              <TableCell>{item.appointmentDate}</TableCell>
              <TableCell>{item.appointmentTime}</TableCell>
              <TableCell>{item.reason}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      className="capitalize"
                      color={item.status === "Treated" ? "success" : "primary"}
                    >
                      {item.status}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status options"
                    onAction={(key) =>
                      handleStatusChange(item.appointmentID, key as string)
                    }
                    selectedKeys={new Set([item.status])}
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
                    size="sm"
                    variant="light"
                    onPress={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleDelete(item.appointmentID)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdate}>
              <ModalHeader className="flex flex-col gap-1">
                Edit Appointment
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Date"
                  type="date"
                  value={editingAppointment?.appointmentDate || ""}
                  onChange={(e) =>
                    setEditingAppointment((prev) =>
                      prev ? { ...prev, appointmentDate: e.target.value } : null
                    )
                  }
                />
                <Input
                  label="Time"
                  type="time"
                  value={editingAppointment?.appointmentTime || ""}
                  onChange={(e) =>
                    setEditingAppointment((prev) =>
                      prev ? { ...prev, appointmentTime: e.target.value } : null
                    )
                  }
                />
                <Input
                  label="Reason"
                  value={editingAppointment?.reason || ""}
                  onChange={(e) =>
                    setEditingAppointment((prev) =>
                      prev ? { ...prev, reason: e.target.value } : null
                    )
                  }
                />
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="bordered"
                      className="capitalize"
                      color={
                        editingAppointment?.status === "Treated"
                          ? "success"
                          : "primary"
                      }
                    >
                      {editingAppointment?.status || "Select Status"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status options"
                    onAction={(key) =>
                      setEditingAppointment((prev) =>
                        prev ? { ...prev, status: key as string } : null
                      )
                    }
                    selectedKeys={
                      editingAppointment
                        ? new Set([editingAppointment.status])
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
                <Button color="primary" type="submit">
                  Save
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
