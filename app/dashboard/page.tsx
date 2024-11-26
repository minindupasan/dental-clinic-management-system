"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Tabs, Tab } from "@nextui-org/tabs";
import { User, Calendar, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <Tabs aria-label="Dashboard sections">
        <Tab key="overview" title="Overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            <Card>
              <CardBody>
                <div className="flex justify-between items-center">
                  <p className="text-small font-medium">Total Patients</p>
                  <User className="w-4 h-4 text-default-400" />
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-2xl font-semibold">1,234</span>
                  <span className="text-xs text-default-400">
                    +20% from last month
                  </span>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex justify-between items-center">
                  <p className="text-small font-medium">Appointments Today</p>
                  <Calendar className="w-4 h-4 text-default-400" />
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-2xl font-semibold">24</span>
                  <span className="text-xs text-default-400">
                    6 more than yesterday
                  </span>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex justify-between items-center">
                  <p className="text-small font-medium">Average Wait Time</p>
                  <Clock className="w-4 h-4 text-default-400" />
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-2xl font-semibold">15 min</span>
                  <span className="text-xs text-default-400">
                    -2 min from last week
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card className="col-span-1 md:col-span-1">
              <CardHeader>
                <h3 className="text-lg font-semibold">Overview</h3>
              </CardHeader>
              <CardBody>
                <p>Detailed statistics will be displayed here.</p>
              </CardBody>
            </Card>
            <Card className="col-span-1 md:col-span-1">
              <CardHeader>
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2">
                  <li>New patient registered - John Doe</li>
                  <li>Appointment rescheduled - Jane Smith</li>
                  <li>Lab results uploaded - Mike Johnson</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </Tab>
        <Tab key="analytics" title="Analytics">
          <Card className="mt-4">
            <CardHeader>
              <h3 className="text-lg font-semibold">Analytics</h3>
            </CardHeader>
            <CardBody>
              <p>Detailed analytics will be displayed here.</p>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="reports" title="Reports">
          <Card className="mt-4">
            <CardHeader>
              <h3 className="text-lg font-semibold">Reports</h3>
            </CardHeader>
            <CardBody>
              <p>Various reports will be available here.</p>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
