"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  RefreshCw,
  Plus,
} from "lucide-react";
import NewInventoryButton from "./NewInventoryButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type InventoryItem = {
  inventoryId: number;
  itemName: string;
  quantity: number;
  statusLevel: string;
  restockLevel: number;
  purchaseDate: string;
  expiryDate: string;
  unitCost: number;
  totalCost: number | null;
  lastUpdated: string | null;
};

const columns = [
  { key: "inventoryId", label: "ID" },
  { key: "itemName", label: "ITEM NAME" },
  { key: "quantity", label: "QUANTITY" },
  { key: "statusLevel", label: "STATUS" },
  { key: "restockLevel", label: "RESTOCK LEVEL" },
  { key: "purchaseDate", label: "PURCHASE DATE" },
  { key: "expiryDate", label: "EXPIRY DATE" },
  { key: "unitCost", label: "UNIT COST" },
  { key: "totalCost", label: "TOTAL COST" },
  { key: "lastUpdated", label: "LAST UPDATED" },
  { key: "actions", label: "ACTIONS" },
];

export default function InventoryTable({
  onInventoryUpdated,
}: {
  onInventoryUpdated: () => void;
}) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | "none";
    clickCount: number;
  }>({ key: "", direction: "none", clickCount: 0 });
  const [filterValue, setFilterValue] = useState("");
  const [viewMode, setViewMode] = useState<
    "all" | "low-stock" | "out-of-stock"
  >("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInventory = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventory`);
      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }
      const data = await response.json();
      setInventory(data);
      setLoading(false);
    } catch (err) {
      toast.error("An error occurred while fetching inventory data.");
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const filteredInventory = useMemo(() => {
    let filtered = [...inventory];

    switch (viewMode) {
      case "low-stock":
        filtered = filtered.filter(
          (item) => item.quantity <= item.restockLevel && item.quantity > 0
        );
        break;
      case "out-of-stock":
        filtered = filtered.filter((item) => item.quantity === 0);
        break;
    }

    if (filterValue) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    if (sortConfig.direction !== "none") {
      filtered.sort((a, b) => {
        if (
          (a[sortConfig.key as keyof InventoryItem] ?? "") <
          (b[sortConfig.key as keyof InventoryItem] ?? "")
        )
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (
          (a[sortConfig.key as keyof InventoryItem] ?? "") >
          (b[sortConfig.key as keyof InventoryItem] ?? "")
        )
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [inventory, filterValue, viewMode, sortConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleEdit = (item: InventoryItem) => {
    setCurrentItem(item);
    onOpen();
  };

  const handleDelete = (id: number) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to delete this item?</p>
          <div className="mt-2 flex justify-end space-x-2">
            <Button
              size="sm"
              variant="light"
              color="warning"
              onPress={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={() => confirmDelete(id, t.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const confirmDelete = async (id: number, toastId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/inventory/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      toast.success("Item deleted successfully");
      fetchInventory();
      onInventoryUpdated();
    } catch (err) {
      toast.error("An error occurred while deleting the item");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentItem) return;

    try {
      // Add the current date and time to the item being updated
      const updatedItem = {
        ...currentItem,
        lastUpdated: new Date().toISOString(),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/inventory/update/${updatedItem.inventoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      toast.success("Item updated successfully");
      fetchInventory();
      onClose();
      setCurrentItem(null);
      onInventoryUpdated();
    } catch (err) {
      toast.error("An error occurred while updating the item");
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        const clickCount = prevConfig.clickCount + 1;
        if (clickCount === 3) {
          return { key: "", direction: "none", clickCount: 0 };
        }
        return {
          key,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
          clickCount,
        };
      }
      return { key, direction: "ascending", clickCount: 1 };
    });
  };

  const renderSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="inline-block ml-1" />
    ) : (
      <ChevronDown className="inline-block ml-1" />
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-foreground-light">
        <Spinner label="Loading inventory data..." />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-0 pt-6 px-6">
          <div className="flex items-center space-x-4">
            <NewInventoryButton onItemAdded={fetchInventory} />
            <Dropdown>
              <DropdownTrigger className="w-[200px]">
                <Button
                  radius="full"
                  color="primary"
                  variant="ghost"
                  startContent={<Filter className="h-4 w-4" />}
                  endContent={<ChevronDown className="h-4 w-4" />}
                  className="px-5 py-1 w-[200px] flex justify-between items-center"
                  aria-label="Filter inventory"
                >
                  {viewMode === "all"
                    ? "All Items"
                    : viewMode === "low-stock"
                      ? "Low Stock"
                      : "Out of Stock"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="View options"
                onAction={(key) => setViewMode(key as any)}
                className="w-[200px] text-foreground-light"
              >
                <DropdownItem key="all">All Items</DropdownItem>
                <DropdownItem key="low-stock">Low Stock</DropdownItem>
                <DropdownItem key="out-of-stock">Out of Stock</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Input
              placeholder="Search inventory..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              radius="full"
              startContent={<Search className="h-4 w-4" />}
              className="w-[300px]"
            />
          </div>
          <Button
            isIconOnly
            className="bg-primary-200 text-primary-600"
            aria-label="Refresh"
            onClick={fetchInventory}
            isLoading={isRefreshing}
          >
            {isRefreshing ? (
              <Spinner size="sm" color="current" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Table aria-label="Inventory data table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              className="text-center"
              key={column.key}
              onClick={() => column.key !== "actions" && handleSort(column.key)}
              style={{
                cursor: column.key !== "actions" ? "pointer" : "default",
              }}
            >
              {column.label}
              {renderSortIcon(column.key)}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => (
            <TableRow key={item.inventoryId}>
              <TableCell className="text-center">{item.inventoryId}</TableCell>
              <TableCell className="text-center">{item.itemName}</TableCell>
              <TableCell className="text-center">{item.quantity}</TableCell>
              <TableCell className="text-center">{item.statusLevel}</TableCell>
              <TableCell className="text-center">{item.restockLevel}</TableCell>
              <TableCell className="text-center">{item.purchaseDate}</TableCell>
              <TableCell className="text-center">{item.expiryDate}</TableCell>
              <TableCell className="text-center">
                ${item.unitCost.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {item.totalCost !== null
                  ? `$${item.totalCost.toFixed(2)}`
                  : "N/A"}
              </TableCell>
              <TableCell className="text-center">
                {item.lastUpdated || "N/A"}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Button
                    isIconOnly
                    color="warning"
                    variant="flat"
                    aria-label="Edit"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    aria-label="Delete"
                    onClick={() => handleDelete(item.inventoryId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setCurrentItem(null);
        }}
        size="lg"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleUpdateItem}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                Edit Item
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Item Name"
                  name="itemName"
                  value={currentItem?.itemName || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={currentItem?.quantity?.toString() || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Restock Level"
                  name="restockLevel"
                  type="number"
                  value={currentItem?.restockLevel?.toString() || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Purchase Date"
                  name="purchaseDate"
                  type="date"
                  value={currentItem?.purchaseDate || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={currentItem?.expiryDate || ""}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Unit Cost"
                  name="unitCost"
                  type="number"
                  step="0.01"
                  value={currentItem?.unitCost?.toString() || ""}
                  onChange={handleInputChange}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button variant="flat" type="submit" color="success">
                  Update
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
