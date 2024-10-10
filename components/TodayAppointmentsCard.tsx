"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import { ClipboardList } from "lucide-react";
const appointments = [
  {
    name: "Moksha Mudalige",
    age: "21",
    treatment: "Extraction",
    date: "2024-09-02",
    time: "10:00 AM",
  },
  {
    name: "Minindu Pasan",
    age: "25",
    treatment: "Orthodontic",
    date: "2024-09-02",
    time: "11:00 AM",
  },
  {
    name: "Anjula Dabarera",
    age: "30",
    treatment: "Root Canal",
    date: "2024-09-03",
    time: "09:00 AM",
  },
  {
    name: "Christine Samandi",
    age: "28",
    treatment: "Cleaning",
    date: "2024-09-03",
    time: "01:00 PM",
  },
  {
    name: "Linali Kariyawasam",
    age: "22",
    treatment: "Filling",
    date: "2024-09-04",
    time: "02:00 PM",
  },
  {
    name: "Nadil Duiran",
    age: "35",
    treatment: "Crown",
    date: "2024-09-04",
    time: "03:00 PM",
  },
  {
    name: "Nayantha Nethsara",
    age: "27",
    treatment: "Braces",
    date: "2024-09-05",
    time: "10:30 AM",
  },
];
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
          {appointments.map((appointment, index) => (
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
                <Button
                  variant="shadow"
                  size="sm"
                  radius="full"
                  className="mt-2"
                  startContent={<ClipboardList />}
                >
                  Medical History
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
        <CardFooter className="p-2"></CardFooter>
      </Card>
    </div>
  );
}
