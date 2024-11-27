"use client";

import React from "react";
import LoginCard from "@/components/LoginCard";
import Catalogue from "@/components/Catalogue";
import AboutCard from "@/components/AboutCard";

export default function HomePage() {
  return (
    <div>
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 lg:row-span-2">
            <Catalogue />
          </div>
          <div className="lg:col-span-2 lg:col-start-4 lg:col-end-6 lg:row-start-1 lg:row-end-2">
            <LoginCard />
          </div>
          <div className="lg:col-span-2 lg:col-start-4 lg:col-end-6 lg:row-start-2 lg:row-end-3">
            <AboutCard />
          </div>
        </div>
      </div>
    </div>
  );
}
