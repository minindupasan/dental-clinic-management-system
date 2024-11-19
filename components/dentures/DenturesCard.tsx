"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
} from "@nextui-org/react";
import { ClipboardCheck } from "lucide-react";
import { ClipboardCopy } from "lucide-react";

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
      <Card>
        <CardHeader className="mb-3 py-0 pt-5 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dentures</h2>
        </CardHeader>
        <CardBody className="max-h-[335px] md:max-h-[420px] overflow-y-auto">
          {dentures.map((denture, index) => (
            <div key={index} className="flex items-center mb-4">
              {/* Denture Details */}
              <div className="flex items-center bg-default-100 p-4 rounded-lg w-full">
                <div className="mx-12">
                  <div className="flex-shrink-0 mr-4 flex justify-center items-center">
                    {denture.status === "Completed" ? (
                      <ClipboardCheck size={48} />
                    ) : (
                      <ClipboardCopy size={48} />
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <span className="font-bold pr-4">Patient ID:</span>{" "}
                    {denture.patientId}
                  </div>
                  <div>
                    <span className="font-bold pr-4">Order ID:</span>{" "}
                    {denture.orderId}
                  </div>
                  <div>
                    <span className="font-bold pr-4">
                      Estimated trial date:
                    </span>{" "}
                    {denture.trialDate}
                  </div>
                  <div>
                    <span className="font-bold pr-4">
                      Estimated arrival date:
                    </span>{" "}
                    {denture.arrivalDate}
                  </div>
                  <div>
                    <span className="font-bold pr-4">Status:</span>
                    <Chip
                      className={"ml-2 px-2 py-1 "}
                      color={denture.status === "Completed" ? "success" : "warning"}
                    >
                      {denture.status === "Completed" ? "Completed" : "Pending"}
                    </Chip>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
        <CardFooter className="p-2"></CardFooter>
      </Card>
    </div>
  );
}
