import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
} from "@nextui-org/react";
import { NewItemIcon } from "./icons/NewItemIcon";

const rows = [
  {
    key: "P0001",
    date: "2024-09-02",
    name: "Minindu Pasan",
    nic: "200001234567",
    treatment: "Orthodontic",
    total: "LKR 5000.00",
  },
  {
    key: "P0002",
    date: "2024-09-02",
    name: "Anjula Dabarera",
    nic: "200001234568",
    treatment: "Root Canal",
    total: "LKR 8000.00",
  },
  {
    key: "P0003",
    date: "2024-09-03",
    name: "Christine Samandi",
    nic: "200001234569",
    treatment: "Cleaning",
    total: "LKR 2000.00",
  },
  {
    key: "P0004",
    date: "2024-09-03",
    name: "Linali Kariyawasam",
    nic: "200001234570",
    treatment: "Filling",
    total: "LKR 3000.00",
  },
  {
    key: "P0005",
    date: "2024-09-04",
    name: "Nadil Duiran",
    nic: "200001234571",
    treatment: "Crown",
    total: "LKR 10000.00",
  },
  {
    key: "P0006",
    date: "2024-09-05",
    name: "Nayantha Nethsara",
    nic: "200001234572",
    treatment: "Braces",
    total: "LKR 15000.00",
  },
  {
    key: "P0007",
    date: "2024-09-06",
    name: "Moksha Mudalige",
    nic: "200001234573",
    treatment: "Nerve Filling",
    total: "LKR 7000.00",
  },
  {
    key: "P0008",
    date: "2024-09-06",
    name: "Manula Cooray",
    nic: "200001234574",
    treatment: "Implant",
    total: "LKR 25000.00",
  },
  {
    key: "P0009",
    date: "2024-09-07",
    name: "Isuru Jayaratne",
    nic: "200001234575",
    treatment: "Scaling",
    total: "LKR 4000.00",
  },
  {
    key: "P0010",
    date: "2024-09-07",
    name: "Dilina Raveen",
    nic: "200001234576",
    treatment: "Whitening",
    total: "LKR 6000.00",
  },
  {
    key: "P0011",
    date: "2024-09-08",
    name: "Nipun Tharindu",
    nic: "200001234577",
    treatment: "Extraction",
    total: "LKR 9000.00",
  },
  {
    key: "P0012",
    date: "2024-09-08",
    name: "Kavindu Jayasooriya",
    nic: "200001234578",
    treatment: "Orthodontic",
    total: "LKR 12000.00",
  },
  {
    key: "P0013",
    date: "2024-09-09",
    name: "Nimesha Perera",
    nic: "200001234579",
    treatment: "Root Canal",
    total: "LKR 8000.00",
  },
  {
    key: "P0014",
    date: "2024-09-09",
    name: "Dilini Jayawardena",
    nic: "200001234580",
    treatment: "Cleaning",
    total: "LKR 2000.00",
  },
  {
    key: "P0015",
    date: "2024-09-10",
    name: "Kusal Mendis",
    nic: "200001234581",
    treatment: "Filling",
    total: "LKR 3000.00",
  },
  {
    key: "P0016",
    date: "2024-09-10",
    name: "Chamara Silva",
    nic: "200001234582",
    treatment: "Crown",
    total: "LKR 10000.00",
  },
  {
    key: "P0017",
    date: "2024-09-11",
    name: "Lasith Malinga",
    nic: "200001234583",
    treatment: "Braces",
    total: "LKR 15000.00",
  },
  {
    key: "P0018",
    date: "2024-09-12",
    name: "Angelo Mathews",
    nic: "200001234584",
    treatment: "Nerve Filling",
    total: "LKR 7000.00",
  },
];

const columns = [
  {
    key: "key",
    label: "ID",
  },
  {
    key: "date",
    label: "DATE",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "nic",
    label: "NIC",
  },
  {
    key: "treatment",
    label: "TREATMENT",
  },
  {
    key: "total",
    label: "TOTAL",
  },
];

export default function App() {
  return (
    <Card className="bg-background-light text-foreground-light rounded-xl w-full">
      <CardHeader>
        <div className="w-full pt-3 flex justify-between items-center mx-6">
          <h1 className="font-semibold text-xl">Patient Records</h1>

          <Button
            className="bg-secondary-200"
            radius="full"
            startContent={<NewItemIcon />}
          >
            New Patient
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        {/* Scrollable Table Container */}
        <div
          className="px-10"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <Table aria-label="Patient Records">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.key}>
                  {(columnKey) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardBody>
      <CardFooter className="p-2"></CardFooter>
    </Card>
  );
}
