"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import MedicalHistoryPopover from "./MedicalHistoryModal";
import { patients, Patient } from "../app/data/PatientData";

export default function UpcomingAppointmentsCard() {
  const [appointments, setAppointments] = useState<Patient[]>(() =>
    [...patients].sort((a, b) => {
      const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
      const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
      return dateA.getTime() - dateB.getTime();
    })
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newAppointment, setNewAppointment] = useState<Partial<Patient>>({});

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewAppointment((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  return (
    <div>
      <Card className="lg:h-60 max-h-96 w-full bg-background-light">
        <CardHeader>
          <div className="w-full pt-3 flex justify-between items-center mx-6">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <Button
              className="bg-secondary-200 text-foreground-light"
              radius="full"
              startContent={<CirclePlus />}
              onPress={onOpen}
            >
              New Patient
            </Button>
          </div>
        </CardHeader>
        <CardBody className="max-h-96 overflow-y-auto">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-default-100 p-4 rounded-lg flex items-center gap-4 mb-2 last:mb-0"
            >
              <div className="flex flex-col justify-center items-center min-w-[80px]">
                <div className="rounded-xl p-5 bg-white text-center">
                  <div className="font-semibold text-lg md:text-xl lg:text-3xl">
                    {appointment.appointmentTime}
                  </div>
                  <div className="font-semibold text-md md:text-lg lg:text-xl">
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p>
                  <span className="font-medium">Name:</span> {appointment.name}
                </p>
                <p>
                  <span className="font-medium">Age:</span> {appointment.age}
                </p>
                <p>
                  <span className="font-medium">Treatment:</span>{" "}
                  {appointment.treatment}
                </p>
                <MedicalHistoryPopover patient={appointment} />
              </div>
            </div>
          ))}
        </CardBody>
        <CardFooter className="p-2"></CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add New Appointment
          </ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              name="name"
              value={newAppointment.name || ""}
              onChange={handleInputChange}
            />
            <Input
              label="Age"
              name="age"
              value={newAppointment.age || ""}
              onChange={handleInputChange}
            />
            <Input
              label="Treatment"
              name="treatment"
              value={newAppointment.treatment || ""}
              onChange={handleInputChange}
            />
            <Input
              label="Date"
              name="appointmentDate"
              type="date"
              value={newAppointment.appointmentDate || ""}
              onChange={handleInputChange}
            />
            <Input
              label="Time"
              name="appointmentTime"
              type="time"
              value={newAppointment.appointmentTime || ""}
              onChange={handleInputChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary">Add Appointment</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
