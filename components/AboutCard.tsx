"use client";

import React from "react";
import { Button, Card, CardBody, Divider, Avatar } from "@nextui-org/react";
import { MessageSquare, Phone } from "lucide-react";

export default function AboutCard() {
  return (
    <Card className="max-w-md mx-auto h-[380px]">
      <CardBody className="p-3">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 ">
          <Avatar
            radius="md"
            alt="Dr. P.Gunasekara"
            className="w-32 h-32"
            src="/static/images/profile.jpeg"
          />
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-xl font-semibold">Dr. P. Gunasekara</h3>
            <p className="text-default-500">Dental Surgeon</p>
            <Divider className="my-2 w-full" />
            <p className="text-sm">
              B.D.S.
              <br />
              D.H.D.P (Colombo)
              <br />
              S.L.M.C Reg No.1198
            </p>
            <Divider className="my-2 w-full" />
            <p className="font-semibold">24 years of experience</p>
          </div>
        </div>

        <p className="mt-4 text-center sm:text-left">
          Dr. Preethi Gunasekara, an experienced Dental Surgeon, provides
          personalized dental care. Whether it's dentures, general dental care,
          or routine checkups, you're in trusted hands.
        </p>
        <div className="flex justify-center sm:justify-start gap-4 mt-4">
          <Button
            radius="full"
            color="primary"
            onClick={() => (window.location.href = "tel:+123456789")}
            startContent={<Phone size={16} />}
          >
            Call
          </Button>
          <Button
            radius="full"
            color="primary"
            variant="bordered"
            onClick={() => (window.location.href = "sms:+123456789")}
            startContent={<MessageSquare size={16} />}
          >
            Message
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
