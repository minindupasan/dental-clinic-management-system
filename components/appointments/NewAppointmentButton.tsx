import React, { useState, useEffect, Key } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
  Tooltip,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { CalendarPlus } from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Appointment = {
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
  treatment: {
    treatmentType: string;
  };
};

type Patient = {
  patientID: string;
  firstName: string;
  lastName: string;
};

export default function NewAppointmentButton({
  onAppointmentAdded,
}: {
  onAppointmentAdded: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "Scheduled",
    treatment: {
      treatmentType: "",
    },
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients`);
      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "treatmentType") {
      setNewAppointment((prev) => ({
        ...prev,
        treatment: { ...prev.treatment, treatmentType: value },
      }));
    } else {
      setNewAppointment((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePatientChange = (key: Key | null) => {
    setSelectedPatientId(key as string);
  };

  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewAppointment((prev) => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        treatmentType: e.target.value,
      },
    }));
  };

  const validateAppointmentDateTime = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to midnight for date comparison
    const appointmentDate = new Date(newAppointment.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0); // Set time to midnight for date comparison
    return appointmentDate >= now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedPatientId ||
      !newAppointment.appointmentDate ||
      !newAppointment.appointmentTime ||
      !newAppointment.reason ||
      !newAppointment.treatment.treatmentType
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!validateAppointmentDateTime()) {
      toast.error("Appointment date must be today or in the future.");
      return;
    }

    const toastId = toast.loading("Adding new appointment...");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/appointments/create/${selectedPatientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAppointment),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add new appointment");
      }

      const result = await response.json();
      toast.success(`New appointment added successfully!`, {
        id: toastId,
      });
      setNewAppointment({
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        status: "Scheduled",
        treatment: {
          treatmentType: "",
        },
      });
      setSelectedPatientId("");
      onClose();
      onAppointmentAdded();
    } catch (error) {
      console.error("Error adding new appointment:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add new appointment. Please try again.",
        { id: toastId }
      );
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <>
      <Tooltip content="Add New Appointment" color="primary">
        <Button
          color="primary"
          variant="solid"
          onClick={onOpen}
          startContent={<CalendarPlus className="w-4 h-4" />}
          isIconOnly
        ></Button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} size="md" hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                New Appointment
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  label="Patient"
                  placeholder="Select patient"
                  onSelectionChange={(key) => handlePatientChange(key)}
                  required
                >
                  {patients.map((patient) => (
                    <AutocompleteItem
                      key={patient.patientID}
                      value={patient.patientID}
                    >
                      {`${patient.firstName} ${patient.lastName}`}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Input
                  label="Appointment Date"
                  name="appointmentDate"
                  type="date"
                  value={newAppointment.appointmentDate}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  required
                />
                <Input
                  label="Appointment Time"
                  name="appointmentTime"
                  type="time"
                  value={newAppointment.appointmentTime}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Reason"
                  name="reason"
                  value={newAppointment.reason}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Treatment Type"
                  placeholder="Select treatment type"
                  value={newAppointment.treatment.treatmentType}
                  onChange={handleTreatmentChange}
                  required
                >
                  <SelectItem key="Teeth Cleaning" value="Teeth Cleaning">
                    Teeth Cleaning
                  </SelectItem>
                  <SelectItem key="Dental Checkup" value="Dental Checkup">
                    Dental Checkup
                  </SelectItem>
                  <SelectItem key="Cavity Filling" value="Cavity Filling">
                    Cavity Filling
                  </SelectItem>
                  <SelectItem key="Root Canal" value="Root Canal">
                    Root Canal
                  </SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="danger" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="flat" color="success" type="submit">
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
