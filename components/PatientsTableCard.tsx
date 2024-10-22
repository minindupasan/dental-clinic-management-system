import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import { CirclePlus, GalleryVerticalEnd } from "lucide-react";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Patient = {
  patientID: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: number;
  gender: string;
  medicalRecords: string;
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

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        "https://dent-care-plus-springboot.onrender.com/api/patients"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      console.log("Fetched patient data:", data);
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
    <div className="flex justify-center items-center h-64">
      <Spinner label="Loading Patient Data..." color="primary" />
    </div>;
  }

  return (
    <Card className="bg-background-light text-foreground-light rounded-xl w-full">
      <CardHeader>
        <div className="w-full pt-3 flex justify-between items-center mx-6">
          <h1 className="font-semibold text-xl">Patient Records</h1>

          <div className="space-x-5">
            <Button
              className="bg-secondary-200"
              radius="full"
              startContent={<GalleryVerticalEnd />}
            >
              View All
            </Button>
            <Button
              className="bg-secondary-200"
              radius="full"
              startContent={<CirclePlus />}
            >
              New Patient
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {/* Scrollable Table Container */}
        <div
          className="px-10"
          style={{ maxHeight: "300px", overflowY: "auto" }}
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
      </CardBody>
      <CardFooter className="p-2"></CardFooter>
    </Card>
  );
}
