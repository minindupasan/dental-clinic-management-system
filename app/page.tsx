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
import LoginCard from "@/components/LoginCard";
import Catalogue from "@/components/Catalogue";
import AboutCard from "@/components/AboutCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground-dark">
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-5">
          {/* First column: Login card */}
          <LoginCard />

          {/* Second column: Service Cards*/}
          <Catalogue />

          {/* Third column: Doctor profile */}
          <AboutCard />
        </div>
      </div>
    </div>
  );
}
