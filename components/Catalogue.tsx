"use client";

import React from "react";
import { Card, CardBody, Image, CardFooter } from "@nextui-org/react";
const list = [
  {
    title: "Orthodontics",
    img: "/static/images/orthodontics.jpg",
    description: "Align and straighten teeth for a perfect smile.",
  },
  {
    title: "Dentures",
    img: "/static/images/dentures.jpg",
    description: "Restore your smile with custom-made dentures.",
  },
  {
    title: "Dental Implants",
    img: "/static/images/implants.jpg",
    description: "Replace missing teeth with natural-looking implants.",
  },
  {
    title: "Teeth Whitening",
    img: "/static/images/teeth-whitening.jpg",
    description: "Brighten your smile with professional teeth whitening.",
  },
  {
    title: "Dental Crowns",
    img: "/static/images/crowns.jpg",
    description: "Protect and restore damaged teeth with dental crowns.",
  },
  {
    title: "Root Canal Treatment",
    img: "/static/images/root-canal.jpg",
    description: "Save infected teeth with root canal treatment.",
  },
  {
    title: "Dental Bridges",
    img: "/static/images/bridges.jpg",
    description: "Fill gaps between teeth with dental bridges.",
  },
  {
    title: "Tooth Extraction",
    img: "/static/images/extractions.jpg",
    description: "Remove damaged or decayed teeth with tooth extraction.",
  },
  {
    title: "Gum Disease Treatment",
    img: "/static/images/gum-diseases.jpg",
    description: "Prevent and treat gum disease for a healthy smile.",
  },
];
export default function Catalogue() {
  return (
    <div className="gap-2 grid grid-cols-1 sm:grid-cols-3 lg:row-span-2 lg:row-start-1">
      {list.map((item, index) => (
        <Card
          className="text-foreground-light transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          shadow="sm"
          key={index}
          isPressable
          onPress={() => console.log("item pressed")}
        >
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={item.title}
              className="w-full object-cover h-[140px]"
              src={item.img}
            />
          </CardBody>
          <CardFooter className="text-small md:flex md:flex-col">
            <div className="w-full font-medium text-left">{item.title}</div>
            <div className="hidden md:flex md:text-left sm:font-light">
              {item.description}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
