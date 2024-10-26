"use client";

import React from "react";
import { Card, CardBody, Image, CardFooter } from "@nextui-org/react";
import list from "../app/data/CatalogueData";

export default function Catalogue() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {list.map((item, index) => (
        <Card key={index} className="w-full h-full " shadow="sm">
          <CardBody className="p-0 ">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              height={140}
              alt={item.title}
              className="w-full object-cover"
              src={item.img}
              loading="lazy"
            />
          </CardBody>
          <CardFooter className="flex flex-col items-start">
            <h4 className="font-medium text-large">{item.title}</h4>
            <p className="text-small text-default-500 line-clamp-2">
              {item.description}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
