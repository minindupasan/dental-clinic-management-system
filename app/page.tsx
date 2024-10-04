"use client";

import React from "react";
import { NewItemIcon } from "@/components/icons/NewItemIcon";
import NewItemButton from "@/components/NewItemButton";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Link,
  Image,
  CardFooter,
} from "@nextui-org/react";

export default function AppointmentsList() {
  const patients = [
    {
      name: "Minindu Pasan",
      age: "21",
      treatment: "Nerve filling",
      image: "./images/patient1.jpeg",
    },
    {
      name: "Moksha Mudalige",
      age: "21",
      treatment: "Extraction",
      image: "/images/Vector.png",
    },
    {
      name: "Anjula Dabarera",
      age: "21",
      treatment: "Orthodontics",
      image: "/images/patient3.jpg",
    },
    {
      name: "Christine Samandhi",
      age: "21",
      treatment: "Temporary filling",
      image: "/images/patient4.jpg",
    },
    {
      name: "Linali Kariyawasam",
      age: "21",
      treatment: "Permanent filling",
      image: "/images/patient5.jpg",
    },
    {
      name: "Nadil Dulran",
      age: "21",
      treatment: "Nerve filling",
      image: "/images/patient6.jpg",
    },
  ];

  return (
    <div className="mx-10 my-10 grid">
      <Card className="h-[340px] lg:max-w-[450px] text-foreground-light bg-background-light">
        {/* Card Header */}
        <CardHeader className="flex gap-3 justify-between h-[70px]">
          <div className="flex flex-col">
            <div className="text-xl font-semibold">Today's Appointments</div>
          </div>
          <div className="flex items-center">
            <Link href="/NewPatient">
              <NewItemButton
                className="bg-default-200 text-foreground-light"
                radius="full"
              >
                <span className="hidden lg:flex">New Patient</span>
              </NewItemButton>
            </Link>
          </div>
        </CardHeader>

        <Divider />

        {/* Scrollable Card Body */}
        <CardBody className="overflow-y-auto">
          {patients.map((patient, index) => (
            <React.Fragment key={index}>
              <div className="my-2 mx-3">
                <Card className="shadow-none bg-default-200">
                  <CardBody>
                    <div className="flex items-center gap-3">
                      {/* Patient Avatar */}
                      <div className="relative w-[80px] h-[80px]">
                        <Image
                          src={patient.image}
                          alt={`Patient ${patient.name}`}
                          className="rounded-full object-cover"
                          width={80}
                          height={80}
                        />
                      </div>

                      {/* Patient Info */}
                      <div className="flex flex-col">
                        <div className="text-sm font-normal">
                          <span className="font-medium">Name: </span>
                          {patient.name}
                        </div>
                        <div className="text-sm font-normal">
                          <span className="font-medium">Age: </span>
                          {patient.age}
                        </div>
                        <div className="text-sm font-normal">
                          <span className="font-medium">Treatment: </span>
                          {patient.treatment}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </React.Fragment>
          ))}
        </CardBody>
        <CardFooter />
      </Card>
    </div>
  );
}
