"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
} from "@nextui-org/react";

const dentures = [
  {
    patientId: "P0004",
    orderId: "D0034",
    trialDate: "11/11/2024",
    arrivalDate: "15/11/2024",
    status: "Completed",
  },
  {
    patientId: "P0004",
    orderId: "D0034",
    trialDate: "11/11/2024",
    arrivalDate: "15/11/2024",
    status: "Pending",
  },
  {
    patientId: "P0005",
    orderId: "D0035",
    trialDate: "12/11/2024",
    arrivalDate: "16/11/2024",
    status: "Completed",
  },
  {
    patientId: "P0006",
    orderId: "D0036",
    trialDate: "13/11/2024",
    arrivalDate: "17/11/2024",
    status: "Pending",
  },
  {
    patientId: "P0007",
    orderId: "D0037",
    trialDate: "14/11/2024",
    arrivalDate: "18/11/2024",
    status: "Completed",
  },
  {
    patientId: "P0008",
    orderId: "D0038",
    trialDate: "15/11/2024",
    arrivalDate: "19/11/2024",
    status: "Pending",
  },
  {
    patientId: "P0009",
    orderId: "D0039",
    trialDate: "16/11/2024",
    arrivalDate: "20/11/2024",
    status: "Completed",
  },
];

export default function DentureCard() {
  return (
    <div>
      <Card className="bg-white">
        <CardHeader className="mb-3 py-0 pt-5 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dentures</h2>
        </CardHeader>
        <CardBody className=" max-h-[335px] md:max-h-[420px] overflow-y-auto">
          {dentures.map((denture, index) => (
            <div
              key={index}
              className="bg-default-100 p-4 rounded-lg mb-2 last:mb-0"
            >
              <p>
                <span className="font-bold pr-4">Patient ID:</span>{" "}
                {denture.patientId}
              </p>
              <p>
                <span className="font-bold pr-4">Order ID:</span>{" "}
                {denture.orderId}
              </p>
              <p>
                <span className="font-bold pr-4">Estimated trial date:</span>{" "}
                {denture.trialDate}
              </p>
              <p>
                <span className="font-bold pr-4">Estimated arrival date:</span>{" "}
                {denture.arrivalDate}
              </p>
              <span className="font-bold pr-4">Status:</span>
              <Chip
                className={`ml-2 px-2 py-1  ${denture.status === "Completed" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}
              >
                {denture.status === "Completed" ? "Completed" : "Pending"}
              </Chip>
            </div>
          ))}
        </CardBody>
        <CardFooter className="p-2"></CardFooter>
      </Card>
    </div>
  );
}
