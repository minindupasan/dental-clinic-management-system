"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import NewItemButton from "@/components/NewItemButton";

export default function Dashboard() {
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

  const orders = [
    {
      id: "P0001",
      date: "2/09/2024",
      name: "Minindu Pasan",
      nic: "2003123123",
      treatment: "Orthodontic",
      total: "Text",
    },
    {
      id: "P0002",
      date: "2/09/2024",
      name: "Moksha Mudalige",
      nic: "2003123123",
      treatment: "Nerve Filling",
      total: "Text",
    },
    {
      id: "P0003",
      date: "6/09/2024",
      name: "Anjula Dabarera",
      nic: "2003123123",
      treatment: "Extraction",
      total: "Text",
    },
    {
      id: "P0004",
      date: "6/09/2024",
      name: "Christine Samandi",
      nic: "2003123123",
      treatment: "Denture",
      total: "Text",
    },
    {
      id: "P0005",
      date: "8/09/2024",
      name: "Linali Kariyawasam",
      nic: "2003123123",
      treatment: "Temp Filling",
      total: "Text",
    },
    {
      id: "P0006",
      date: "8/09/2024",
      name: "Nadil Duiran",
      nic: "2003123123",
      treatment: "Permanent Filling",
      total: "Text",
    },
    {
      id: "P0007",
      date: "11/09/2024",
      name: "Nayantha Nethsara",
      nic: "2003123123",
      treatment: "Crown",
      total: "Text",
    },
  ];

  return (
    <div className="mx-auto max-w-full px-4 sm:px-4 lg:px-4 py-8 text-foreground-light">
      <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-4">
        {/*Today's Appointments*/}
        <Card className="lg:h-60 max-h-96 w-full col-span-1 lg:col-span-2 lg:row-span-1 bg-background-light">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Today's Appointments</h2>
            <NewItemButton className="bg-default-200" radius="full">
              New Patient
            </NewItemButton>
          </CardHeader>
          <CardBody className="max-h-96 overflow-y-auto">
            {appointments.map((appointment, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg grid gap-2 mb-2 last:mb-0"
              >
                <div className="flex items-start gap-4">
                  <div>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {appointment.name}
                    </p>
                    <p>
                      <span className="font-medium">Age:</span>{" "}
                      {appointment.age}
                    </p>
                    <p>
                      <span className="font-medium">Treatment:</span>{" "}
                      {appointment.treatment}
                    </p>
                    <Button size="sm" className="mt-2 bg-gray-300">
                      Medical History
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
          <CardFooter className="p-2"></CardFooter>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="lg:h-60 max-h-96 w-full col-span-1 lg:col-span-2 lg:row-span-1 lg:row-start-2 lg:row-end-3 bg-background-light">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <NewItemButton className="bg-default-200" radius="full">
              New Patient
            </NewItemButton>
          </CardHeader>
          <CardBody className="max-h-96 overflow-y-auto">
            {appointments.map((appointment, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg mb-2 last:mb-0"
              >
                <div className="flex items-start gap-4">
                  <div>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {appointment.name}
                    </p>
                    <p>
                      <span className="font-medium">Age:</span>{" "}
                      {appointment.age}
                    </p>
                    <p>
                      <span className="font-medium">Treatment:</span>{" "}
                      {appointment.treatment}
                    </p>
                    <Button size="sm" className="mt-2 bg-gray-300">
                      Medical History
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
          <CardFooter className="p-2"></CardFooter>
        </Card>

        {/* Dentures */}
        <Card className="col-span-1 lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:col-end-5 bg-white">
          <CardHeader>
            <h2 className="text-xl font-semibold">Dentures</h2>
          </CardHeader>
          <CardBody className="max-h-96 overflow-y-auto">
            {dentures.map((denture, index) => (
              <div
                key={index}
                className="bg-default-300 p-4 rounded-lg mb-2 last:mb-0"
              >
                <p>
                  <span className="font-medium">Patient ID:</span>{" "}
                  {denture.patientId}
                </p>
                <p>
                  <span className="font-medium">Order ID:</span>{" "}
                  {denture.orderId}
                </p>
                <p>
                  <span className="font-medium">Estimated trial date:</span>{" "}
                  {denture.trialDate}
                </p>
                <p>
                  <span className="font-medium">Estimated arrival date:</span>{" "}
                  {denture.arrivalDate}
                </p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded ${denture.status === "Completed" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}
                  >
                    {denture.status}
                  </span>
                </p>
              </div>
            ))}
          </CardBody>
          <CardFooter className="p-2"></CardFooter>
        </Card>

        {/* Summary */}
        <Card className="min-h-72 h-auto col-span-1 lg:col-span-1 lg:row-span-1 lg:row-start-3 lg:row-end-4 bg-white">
          <CardHeader>
            <h2 className="text-xl font-semibold">Summary</h2>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between mb-4">
              <Button size="sm" className="bg-gray-200">
                Daily
              </Button>
              <Button size="sm" className="bg-gray-200">
                Weekly
              </Button>
              <Button size="sm" className="bg-gray-200">
                Monthly
              </Button>
            </div>
            <h3 className="text-3xl font-bold mb-1">LKR 16,350</h3>
            <p className="text-gray-600 mb-4">Earned</p>
            <h3 className="text-3xl font-bold mb-1">24</h3>
            <p className="text-gray-600">No. of Patients Treated</p>
          </CardBody>
        </Card>

        {/* Pending Payments */}
        <Card className="h-auto max-h-80 col-span-1 md:col-span-2 lg:col-span-3 row-start-3 row-end-4  bg-white">
          <CardHeader>
            <h2 className="text-xl font-semibold">Pending Payments</h2>
          </CardHeader>
          <CardBody className="max-h-96 overflow-y-auto">
            {pendingPayments.map((payment, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg mb-2 last:mb-0"
              >
                <div className="bg-gray-300 rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
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
        </Card>

        {/* Orders */}
        <Card className="col-span-1 md:col-span-4 lg:col-span-4 bg-white">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Orders</h2>
            <NewItemButton className="bg-gray-200 text-black" radius="full">
              Create New Order
            </NewItemButton>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">DATE</th>
                    <th className="p-2 text-left">NAME</th>
                    <th className="p-2 text-left">NIC</th>
                    <th className="p-2 text-left">TREATMENT</th>
                    <th className="p-2 text-left">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <td className="p-2">{order.id}</td>
                      <td className="p-2">{order.date}</td>
                      <td className="p-2">{order.name}</td>
                      <td className="p-2">{order.nic}</td>
                      <td className="p-2">{order.treatment}</td>
                      <td className="p-2">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
