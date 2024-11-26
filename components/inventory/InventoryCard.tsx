"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Button,
  Spinner,
  Chip,
} from "@nextui-org/react";
import { AlertTriangle, Package, RefreshCw, Minus } from "lucide-react";
import { toast } from "react-hot-toast";
import NewInventoryItemButton from "./NewInventoryButton";

type InventoryItem = {
  inventoryId: number;
  itemName: string;
  quantity: number;
  currentQuantity: number;
  statusLevel: string;
  restockLevel: number;
  purchaseDate: string;
  expiryDate: string;
  unitCost: number;
  totalCost: number;
  lastUpdated: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const StockLevelCard: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [decreasingItems, setDecreasingItems] = useState<Set<number>>(
    new Set()
  );

  const fetchInventory = async () => {
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
      console.error("An error occurred while fetching inventory data:", err);
      toast.error("Failed to fetch inventory data");
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const decreaseQuantity = async (itemId: number) => {
    try {
      setDecreasingItems((prev) => new Set(prev).add(itemId));
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.inventoryId === itemId
            ? {
                ...item,
                currentQuantity: Math.max(0, item.currentQuantity - 1),
                lastUpdated: new Date().toISOString(),
              }
            : item
        )
      );

      const response = await fetch(
        `${API_BASE_URL}/api/inventory/decrease/${itemId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to decrease quantity");
      }
      const updatedItem = await response.json();
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.inventoryId === itemId ? { ...item, ...updatedItem } : item
        )
      );
      toast.success(`Quantity of ${updatedItem.itemName} decreased by 1`);
    } catch (err) {
      console.error("An error occurred while decreasing quantity:", err);
      toast.error("Failed to decrease quantity");
      await fetchInventory(); // Revert changes if API call fails
    } finally {
      setDecreasingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(
    (item) =>
      item.currentQuantity <= item.restockLevel && item.currentQuantity > 0
  ).length;
  const outOfStockItems = inventory.filter(
    (item) => item.currentQuantity === 0
  ).length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Spinner
            label="Loading inventory data..."
            color="primary"
            size="lg"
          />
        </div>
      );
    }

    if (inventory.length === 0) {
      return (
        <div className="h-full text-center flex flex-col items-center justify-center p-4">
          <Package className="w-12 h-12 mb-2 text-primary" />
          <p className="text-lg">No inventory items</p>
          <Button
            color="primary"
            variant="flat"
            onPress={fetchInventory}
            className="mt-4"
          >
            Refresh
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-default-500">Total Items</p>
            <p className="font-semibold">{totalItems}</p>
          </div>
          <div>
            <p className="text-warning-500">Low Stock</p>
            <p className="font-semibold">{lowStockItems}</p>
          </div>
          <div>
            <p className="text-danger-500">Out of Stock</p>
            <p className="font-semibold">{outOfStockItems}</p>
          </div>
        </div>
        {(lowStockItems > 0 || outOfStockItems > 0) && (
          <div className="bg-warning-50 p-2 rounded-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning-500" />
            <p className="text-sm text-warning">
              {lowStockItems + outOfStockItems} items need attention
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <Card key={item.inventoryId} className="w-full">
              <CardBody>
                <h4 className="font-semibold mb-2">{item.itemName}</h4>
                <p className="text-sm  mb-2">
                  <p>Current Quantity: {item.currentQuantity}</p>
                  <p>Max Quantity: {item.quantity}</p>
                </p>
                <Progress
                  size="sm"
                  radius="sm"
                  value={item.currentQuantity}
                  maxValue={item.quantity}
                  classNames={{
                    indicator:
                      item.currentQuantity === 0
                        ? "bg-danger"
                        : item.currentQuantity <= item.restockLevel
                          ? "bg-warning"
                          : "bg-success",
                  }}
                />
                {item.currentQuantity === 0 ? (
                  <p className="text-sm text-danger-500 mt-2">Out of Stock</p>
                ) : (
                  item.currentQuantity <= item.restockLevel && (
                    <p className="text-sm text-warning-500 mt-2">
                      Warning: Stock level low
                    </p>
                  )
                )}
                <p className="text-sm mt-2">
                  Status:{" "}
                  <Chip
                    color={item.currentQuantity === 0 ? "danger" : "success"}
                    size="sm"
                  >
                    {item.statusLevel}
                  </Chip>
                </p>
                <p className="text-sm mt-2">
                  Unit Cost: ${item.unitCost.toFixed(2)}
                </p>
                <p className="text-sm">
                  Total Cost: ${item.totalCost.toFixed(2)}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm">
                    Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    onClick={() => decreaseQuantity(item.inventoryId)}
                    isDisabled={item.currentQuantity === 0}
                    isLoading={decreasingItems.has(item.inventoryId)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Inventory Stock Levels</h3>
        <div className="flex space-x-2">
          <NewInventoryItemButton onItemAdded={fetchInventory} />
          <Button
            isIconOnly
            color="primary"
            variant="ghost"
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
      </CardHeader>
      <CardBody className="h-[390px]">{renderContent()}</CardBody>
    </Card>
  );
};

export default StockLevelCard;
