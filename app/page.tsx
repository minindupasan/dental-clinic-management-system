"use client";

import React from "react";
import LoginCard from "@/components/LoginCard";
import Catalogue from "@/components/Catalogue";
import AboutCard from "@/components/AboutCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground-dark">
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 lg:row-span-2">
            <Catalogue />
          </div>
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-grow mb-6">
              <LoginCard />
            </div>
            <div className="flex-grow">
              <AboutCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
