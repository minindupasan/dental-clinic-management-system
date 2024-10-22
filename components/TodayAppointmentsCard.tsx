"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import MedicalHistoryModal from "./MedicalHistoryModal";
import todaysAppointment from "../app/data/TodaysAppointmentsData";
export default function TodayAppointmentsCard() {
  return (
    <div>
      <Card className="lg:h-60 max-h-96 w-full bg-background-light">
        <CardHeader>
          <div className="w-full pt-3 flex justify-between items-center mx-6">
            <h2 className="text-xl font-semibold ">Today's Appointments</h2>
            <Button
              className="bg-secondary-200 text-foreground-light"
              radius="full"
              startContent={<CirclePlus />}
            >
              New Patient
            </Button>
          </div>
        </CardHeader>
        <CardBody className="max-h-96 overflow-y-auto">
          {todaysAppointment.map((appointment, index) => (
            <div
              key={index}
              className="bg-default-100 p-4 rounded-lg flex items-center gap-4 mb-2 last:mb-0"
            >
              <div className="flex flex-col justify-center items-center min-w-[80px]">
                <div className="rounded-xl p-5 bg-white text-center">
                  <div className="font-semibold text-lg md:text-xl lg:text-3xl">
                    {appointment.time}
                  </div>
                  <div className="font-semibold text-md md:text-lg lg:text-xl">
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}
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
                {/* <MedicalHistoryModal /> */}
              </div>
            </div>
          ))}
        </CardBody>
        <CardFooter className="p-2"></CardFooter>
      </Card>
    </div>
  );
}
