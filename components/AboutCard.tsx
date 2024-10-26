"use client";

import React from "react";
import { Button, Card, CardBody, Divider, Avatar } from "@nextui-org/react";
import { MessageSquare, Phone } from "lucide-react";

export default function AboutCard() {
  return (
    <Card className="mx-auto w-full max-w-[600px]">
      <CardBody className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <Avatar
            radius="md"
            alt="Dr. P.Gunasekara"
            className="w-24 h-24 sm:w-32 sm:h-32"
            src="/static/images/profile.jpeg"
          />
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full">
            <h3 className="text-lg sm:text-xl font-semibold">Dr. P. Gunasekara</h3>
            <p className="text-default-500 text-sm sm:text-base">Dental Surgeon</p>
            <Divider className="my-2 w-full" />
            <p className="text-xs sm:text-sm">
              B.D.S.
              <br />
              D.H.D.P (Colombo)
              <br />
              S.L.M.C Reg No.1198
            </p>
            <Divider className="my-2 w-full" />
            <p className="font-semibold text-sm sm:text-base">24 years of experience</p>
          </div>
        </div>

        <p className="mt-4 text-center sm:text-left text-sm sm:text-base">
          Dr. Preethi Gunasekara, an experienced Dental Surgeon, provides
          personalized dental care. Whether it's dentures, general dental care,
          or routine checkups, you're in trusted hands.
        </p>
        <div className="flex justify-center sm:justify-start gap-2 sm:gap-4 mt-4">
          <Button
            as="a"
            href="tel:+94718169613"
            radius="full"
            color="primary"
            size="sm"
            startContent={<Phone size={16} />}
          >
            Call
          </Button>
          <Button
            as="a"
            href="sms:+94718169613"
            radius="full"
            color="primary"
            variant="bordered"
            size="sm"
            startContent={<MessageSquare size={16} />}
          >
            Message
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}