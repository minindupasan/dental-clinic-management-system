"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  Plus,
  ChevronDown,
  Package,
  Calendar,
  DollarSign,
  Package2,
  PackagePlus,
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type InventoryItem = {
  itemName: string;
  quantity: number;
  statusLevel: string;
  restockLevel: number;
  purchaseDate: string;
  expiryDate: string;
  unitCost: number;
};

const statusOptions = ["In Stock", "Low Stock", "Out of Stock"];

export default function NewInventoryItemButton({
  onItemAdded,
}: {
  onItemAdded: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newItem, setNewItem] = useState<InventoryItem>({
    itemName: "",
    quantity: 0,
    statusLevel: "In Stock",
    restockLevel: 0,
    purchaseDate: "",
    expiryDate: "",
    unitCost: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "restockLevel" || name === "unitCost"
          ? Math.max(0, parseFloat(value) || 0)
          : value,
    }));
  };

  const handleStatusChange = (status: string) => {
    setNewItem((prev) => ({
      ...prev,
      statusLevel: status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading("Adding new inventory item...");
    try {
      const response = await fetch(`${API_BASE_URL}/api/inventory/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to add new inventory item"
        );
      }

      const result = await response.json();
      toast.success(`New inventory item added successfully!`, {
        id: toastId,
      });
      setNewItem({
        itemName: "",
        quantity: 0,
        statusLevel: "In Stock",
        restockLevel: 0,
        purchaseDate: "",
        expiryDate: "",
        unitCost: 0,
      });
      onClose();
      onItemAdded();
    } catch (error) {
      console.error("Error adding new inventory item:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add new inventory item. Please try again.",
        { id: toastId }
      );
    }
  };

  return (
    <>
      <Button
        color="primary"
        variant="solid"
        onClick={onOpen}
        radius="full"
        startContent={<PackagePlus className="w-4 h-4" />}
      >
        New Item
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="md" hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1 text-foreground-light">
                New Inventory Item
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Item Name"
                  name="itemName"
                  value={newItem.itemName}
                  onChange={handleInputChange}
                  required
                  startContent={
                    <Package className="w-4 h-4 text-default-400 pointer-events-none flex-shrink-0" />
                  }
                />
                <Input
                  label="Quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={newItem.quantity.toString()}
                  onChange={handleInputChange}
                  required
                />
                {/* <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      className="capitalize"
                      endContent={<ChevronDown className="w-4 h-4" />}
                    >
                      {newItem.statusLevel}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Status Level"
                    onAction={(key) => handleStatusChange(key as string)}
                  >
                    {statusOptions.map((status) => (
                      <DropdownItem key={status}>{status}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown> */}
                <Input
                  label="Restock Level"
                  name="restockLevel"
                  type="number"
                  min="0"
                  value={newItem.restockLevel.toString()}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Purchase Date"
                  name="purchaseDate"
                  type="date"
                  value={newItem.purchaseDate}
                  onChange={handleInputChange}
                  required
                  startContent={
                    <Calendar className="w-4 h-4 text-default-400 pointer-events-none flex-shrink-0" />
                  }
                />
                <Input
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={newItem.expiryDate}
                  onChange={handleInputChange}
                  required
                  startContent={
                    <Calendar className="w-4 h-4 text-default-400 pointer-events-none flex-shrink-0" />
                  }
                />
                <Input
                  label="Unit Cost (LKR)"
                  name="unitCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.unitCost.toString()}
                  onChange={handleInputChange}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="danger" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="flat" color="success" type="submit">
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
