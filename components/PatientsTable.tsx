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
import { toast } from "react-hot-toast";

type Patient = {
  patientID: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  medicalRecords: string;
  dob: string;
  createdDate: string;
};

const columns = [
  { key: "patientID", label: "PATIENT ID" },
  { key: "fullName", label: "FULL NAME" },
  { key: "email", label: "EMAIL" },
  { key: "gender", label: "GENDER" },
  { key: "medicalRecords", label: "MEDICAL RECORDS" },
  { key: "dob", label: "DATE OF BIRTH" },
  { key: "createdDate", label: "CREATED DATE" },
];

export default function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/patients");
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      console.log("Fetched patient data:", data); // Log the fetched data
      setPatients(data);
      setLoading(false);
    } catch (err) {
      toast.error("An error occurred while fetching patient data.");
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
            <TableRow key={patient.patientID}>
              {columns.map((column) => (
                <TableCell key={`${patient.patientID}-${column.key}`}>
                  {column.key === "fullName"
                    ? `${patient.firstName} ${patient.lastName}`
                    : column.key === "dob" || column.key === "createdDate"
                      ? new Date(
                          patient[column.key as keyof Patient]
                        ).toLocaleDateString()
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
