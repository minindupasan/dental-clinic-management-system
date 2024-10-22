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
} from "@nextui-org/react";
import { ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
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
];

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
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      console.log("Fetched appointment data:", data);
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

    // Apply view mode filter
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

    // Apply search filter
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

    // Apply sorting
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
        if (aValue === null || bValue === null) {
          return 0;
        }
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
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

  return (
    <div className="bg-background-light rounded-xl h-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="font-semibold text-2xl">Appointments</div>
        <div className="flex items-center space-x-4 w-[520px]">
          <Dropdown>
            <DropdownTrigger className="w-[200px]">
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
      </div>
      <Table aria-label="Appointments table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              onClick={() => handleSort(column.key)}
              style={{ cursor: "pointer" }}
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
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
