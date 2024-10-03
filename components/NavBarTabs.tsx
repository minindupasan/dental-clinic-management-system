import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import Link from "next/link";

export default function NavBarTabs() {
  return (
    <Tabs radius={"full"}>
      <Tab key="dashboard" title={<Link href="/">Dashboard</Link>} value="/" />
      <Tab
        key="appointments"
        title={<Link href="/Appointments">Appointments</Link>}
        value="/Appointments"
      />
      <Tab
        key="orders"
        title={<Link href="/Orders">Orders</Link>}
        value="/Orders"
      />
      <Tab
        key="earnings"
        title={<Link href="/Earnings">Earnings</Link>}
        value="/Earnings"
      />
      <Tab
        key="profile"
        title={<Link href="/Profile">Profile</Link>}
        value="/Profile"
      />
    </Tabs>
  );
}
