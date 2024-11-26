import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import Link from "next/link";

interface NavBarTabsProps {
  onTabClick: (path: string) => void;
  currentPath: string;
}

const NavBarTabs: React.FC<NavBarTabsProps> = ({}) => {
  return (
    <div>
      <Tabs radius={"full"}>
        <Tab
          key="dashboard"
          title={<Link href="/dashboard/receptionist">Dashboard</Link>}
          value="/"
        />
        <Tab
          key="appointments"
          title={<Link href="/Appointments">Appointments</Link>}
          value="/Appointments"
        />
        <Tab
          key="patients"
          title={<Link href="/Patients">Patients</Link>}
          value="/Patients"
        />
        <Tab
          key="dentures"
          title={<Link href="/Dentures">Dentures</Link>}
          value="/Dentures"
        />
        <Tab
          key=" inventory"
          title={<Link href="/Inventory">Inventory</Link>}
          value="/Inventory"
        />
        <Tab
          key="treatments"
          title={<Link href="/Treatments">Treatments</Link>}
          value="/Treatments"
        />
      </Tabs>
    </div>
  );
};

export default NavBarTabs;
