"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  medicalRecords: string;
  dob: string;
  isRegistered: boolean;
};

const columns = [
  { key: "id", label: "ID" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "gender", label: "Gender" },
  { key: "medicalRecords", label: "Medical Records" },
  { key: "dob", label: "Date of Birth" },
  { key: "isRegistered", label: "Registered" },
];

export default function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
      setLoading(false);
    } catch (err) {
      setError("An error occurred while fetching patient data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label="Loading patient data..." color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <Table aria-label="Patient data table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              {columns.map((column) => (
                <TableCell key={`${patient.id}-${column.key}`}>
                  {column.key === "isRegistered"
                    ? patient[column.key]
                      ? "Yes"
                      : "No"
                    : patient[column.key as keyof Patient]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
