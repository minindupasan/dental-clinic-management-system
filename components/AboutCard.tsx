"use client";

import React from "react";
import {
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  CardFooter,
} from "@nextui-org/react";
import { MessageSquare, Phone } from "lucide-react";

export default function AboutCard() {
  return (
    <div className="lg:col-span-1 mt-6 lg:mt-0 lg:col-start-2 lg:row-start-2">
      <Card className="bg-default-900">
        <CardBody>
          <div className="mx-6 my-3 grid grid-cols-3 gap-4 items-center">
            <Image
              alt="Dr. P. Gunasekara"
              className="rounded-md col-span-1"
              height={100}
              src="/static/images/profile.jpeg"
              width={100}
            />
            <div className="col-span-2">
              <h3 className="text-xl font-semibold">Dr. P. Gunasekara</h3>
              <p className="text-default-500">Dental Surgeon</p>
              <p className="text-sm">
                B.D.S.
                <br />
                D.H.D.P (Colombo)
                <br />
                S.L.M.C Reg No.1198
              </p>
              <p className="font-semibold mt-2">24 years of experience</p>
            </div>
          </div>
          <p className="mx-6 my-5 text-justify">
            Dr. Preethi Gunasekara, an experienced Dental Surgeon, provides
            personalized dental care. Whether it's dentures, general dental
            care, or routine checkups, you're in trusted hands.
          </p>
          <div className="w-full flex justify-between px-32 mb-6">
            <Button
              radius="full"
              className=" bg-secondary-200"
              onClick={() => (window.location.href = "tel:+123456789")}
              startContent={<Phone />}
            >
              Call
            </Button>
            <Button
              radius="full"
              className=" bg-secondary-200"
              onClick={() => (window.location.href = "tel:+123456789")}
              startContent={<MessageSquare />}
            >
              Message
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
