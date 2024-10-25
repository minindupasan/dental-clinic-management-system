"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { UserRound } from "lucide-react";

const pendingPayments = [
  {
    id: "P0001",
    name: "Moksha Mudalige",
    treatment: "Nerve Filling",
    amount: "LKR 8740",
  },
  {
    id: "P0002",
    name: "Minindu Pasan",
    treatment: "Orthodontic",
    amount: "LKR 12000",
  },
  {
    id: "P0003",
    name: "Anjula Dabarera",
    treatment: "Root Canal",
    amount: "LKR 15000",
  },
  {
    id: "P0004",
    name: "Christine Samandi",
    treatment: "Cleaning",
    amount: "LKR 5000",
  },
  {
    id: "P0005",
    name: "Linali Kariyawasam",
    treatment: "Filling",
    amount: "LKR 7000",
  },
  {
    id: "P0006",
    name: "Nadil Duiran",
    treatment: "Crown",
    amount: "LKR 20000",
  },
  {
    id: "P0007",
    name: "Nayantha Nethsara",
    treatment: "Braces",
    amount: "LKR 30000",
  },
];
export default function PendingPayments() {
  return (
    <div>
      <Card className="w-full h-auto max-h-72 bg-white text-foreground-light">
        <CardHeader>
          <div className="w-full pt-3 flex justify-between items-center mx-6">
            <h2 className="text-xl font-semibold">Pending Payments</h2>
          </div>
        </CardHeader>
        <CardBody className="max-h-96 overflow-y-auto">
          {pendingPayments.map((payment, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg mb-2 last:mb-0"
            >
              <div className=" m-5">
                <UserRound size={32} />
              </div>
              <div className="flex-grow">
                <p className="font-medium">{payment.id}</p>
                <p>{payment.name}</p>
              </div>
              <div>
                <p>{payment.treatment}</p>
                <p className="font-medium">{payment.amount}</p>
              </div>
            </div>
          ))}
        </CardBody>
        <CardFooter className="p-2"></CardFooter>
      </Card>
    </div>
  );
}