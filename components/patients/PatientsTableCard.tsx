"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Link,
  Tooltip,
} from "@nextui-org/react";
import { RefreshCw, List } from "lucide-react";
import toast from "react-hot-toast";
import NewPatientButton from "./NewPatientButton";

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

const columns = [
  { key: "patientID", label: "PATIENT ID" },
  { key: "fullName", label: "FULL NAME" },
  { key: "contactNo", label: "CONTACT NO" },
  { key: "gender", label: "GENDER" },
  { key: "medicalRecords", label: "MEDICAL RECORDS" },
  { key: "dob", label: "DATE OF BIRTH" },
];

export default function PatientTableCard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "filtered">("all");

  const fetchPatients = async (mode: "all" | "filtered" = "all") => {
    setLoading(true);
    try {
      const url =
        mode === "all"
          ? `${API_BASE_URL}/api/patients`
          : `${API_BASE_URL}/api/patients/filtered`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      console.log(`Fetched ${mode} patient data:`, data);
      setPatients(data);
      setViewMode(mode);
    } catch (err) {
      toast.error(`An error occurred while fetching ${mode} patient data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRefresh = () => {
    fetchPatients(viewMode);
  };

  return (
    <Card className="  rounded-xl w-full shadow-md">
      <CardHeader className="pb-0 pt-6 px-6">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-semibold text-xl">Patient Records</h1>

          <div className="flex items-center space-x-4">
            <NewPatientButton />
            <Tooltip content="Refresh Patient Data" color="primary">
              <Button
                color="primary"
                variant="ghost"
                startContent={<RefreshCw className="h-4 w-4" />}
                onPress={handleRefresh}
                isIconOnly
              ></Button>
            </Tooltip>
            <Tooltip content="View All Patients" color="primary">
              <Link href="/Patients">
                <Button
                  color="primary"
                  variant="ghost"
                  startContent={<List className="h-4 w-4" />}
                  isIconOnly
                ></Button>
              </Link>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardBody className="py-4 px-6">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner
              size="md"
              label="Loading Patient Data..."
              color="primary"
            />
          </div>
        ) : (
          <div
            className="overflow-hidden"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <Table aria-label="Patient Records">
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
        )}
      </CardBody>
    </Card>
  );
}
