import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import Link from "next/link";

interface NavBarTabsProps {
  onTabClick: (path: string) => void;
  currentPath: string;
}

const NavBarTabs: React.FC<NavBarTabsProps> = ({ onTabClick, currentPath }) => {
  return (
    <div>
      <Tabs radius={"full"}>
        <Tab
          key="dashboard"
          title={<Link href="/Dentist/Dashboard">Dashboard</Link>}
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
          key="Dentures"
          title={<Link href="/Dentures">Dentures</Link>}
          value="/Dentures"
        />
        <Tab
          key="profile"
          title={<Link href="/Dentist/Profile">Profile</Link>}
          value="/Profile"
        />
      </Tabs>
    </div>
  );
};

export default NavBarTabs;
