"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

export interface StorageItem {
  id: string;
  name: string;
  category: "produce" | "meat" | "dairy" | "dry-goods" | "frozen" | "beverages";
  quantity: number;
  unit: "lbs" | "kg" | "pieces" | "gallons" | "liters" | "boxes" | "cases";
  location: string;
  expirationDate: string;
  addedBy: string;
  addedAt: string;
  lastUpdated: string;
}

export interface ActivityLog {
  id: string;
  action: "added" | "updated" | "removed" | "moved";
  itemName: string;
  details: string;
  employeeName: string;
  timestamp: string;
}

interface StorageContextType {
  items: StorageItem[];
  activities: ActivityLog[];
  addItem: (item: Omit<StorageItem, "id" | "addedAt" | "lastUpdated">) => void;
  updateItem: (id: string, updates: Partial<StorageItem>) => void;
  removeItem: (id: string) => void;
  addActivity: (activity: Omit<ActivityLog, "id" | "timestamp">) => void;
  increaseQuantity: (id: string, amount: number, employeeName: string) => void;
  decreaseQuantity: (id: string, amount: number, employeeName: string) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Mock storage data
const mockItems: StorageItem[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    category: "produce",
    quantity: 25,
    unit: "lbs",
    location: "Walk-in Cooler A",
    expirationDate: "2025-01-12",
    addedBy: "Jane Employee",
    addedAt: "2025-01-05T10:30:00Z",
    lastUpdated: "2025-01-05T10:30:00Z",
  },
  {
    id: "2",
    name: "Ground Beef",
    category: "meat",
    quantity: 15,
    unit: "lbs",
    location: "Freezer B",
    expirationDate: "2025-01-15",
    addedBy: "John Manager",
    addedAt: "2025-01-04T14:20:00Z",
    lastUpdated: "2025-01-04T14:20:00Z",
  },
  {
    id: "3",
    name: "Whole Milk",
    category: "dairy",
    quantity: 8,
    unit: "gallons",
    location: "Walk-in Cooler A",
    expirationDate: "2025-01-10",
    addedBy: "Jane Employee",
    addedAt: "2025-01-03T09:15:00Z",
    lastUpdated: "2025-01-03T09:15:00Z",
  },
];

const mockActivities: ActivityLog[] = [
  {
    id: "1",
    action: "added",
    itemName: "Fresh Tomatoes",
    details: "Added 25 lbs to Walk-in Cooler A",
    employeeName: "Jane Employee",
    timestamp: "2025-01-05T10:30:00Z",
  },
  {
    id: "2",
    action: "updated",
    itemName: "Ground Beef",
    details: "Updated quantity from 20 lbs to 15 lbs",
    employeeName: "John Manager",
    timestamp: "2025-01-04T16:45:00Z",
  },
];

const STORAGE_KEYS = {
  ITEMS: "restaurant-storage-items",
  ACTIVITIES: "restaurant-storage-activities",
};

const loadFromLocalStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return fallback;
  }
};

const saveToLocalStorage = <T,>(key: string, data: T): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeData = () => {
      const storedItems = loadFromLocalStorage(STORAGE_KEYS.ITEMS, []);
      const storedActivities = loadFromLocalStorage(
        STORAGE_KEYS.ACTIVITIES,
        []
      );

      // If no stored data exists, use mock data as initial data
      if (storedItems.length === 0) {
        setItems(mockItems);
        saveToLocalStorage(STORAGE_KEYS.ITEMS, mockItems);
      } else {
        setItems(storedItems);
      }

      if (storedActivities.length === 0) {
        setActivities(mockActivities);
        saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, mockActivities);
      } else {
        setActivities(storedActivities);
      }

      setIsInitialized(true);
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (isInitialized && items.length > 0) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(STORAGE_KEYS.ITEMS, items);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [items, isInitialized]);

  useEffect(() => {
    if (isInitialized && activities.length > 0) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, activities);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [activities, isInitialized]);

  const addItem = useCallback(
    (newItem: Omit<StorageItem, "id" | "addedAt" | "lastUpdated">) => {
      const item: StorageItem = {
        ...newItem,
        id: Date.now().toString(),
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      setItems((prev) => [...prev, item]);

      const activity: ActivityLog = {
        id: (Date.now() + 1).toString(),
        action: "added",
        itemName: item.name,
        details: `Added ${item.quantity} ${item.unit} to ${item.location}`,
        employeeName: newItem.addedBy,
        timestamp: new Date().toISOString(),
      };
      setActivities((prev) => [activity, ...prev]);
    },
    []
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<StorageItem>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, ...updates, lastUpdated: new Date().toISOString() }
            : item
        )
      );

      setItems((currentItems) => {
        const item = currentItems.find((i) => i.id === id);
        if (item) {
          const activity: ActivityLog = {
            id: Date.now().toString(),
            action: "updated",
            itemName: item.name,
            details: `Updated item details`,
            employeeName: updates.addedBy || "Unknown",
            timestamp: new Date().toISOString(),
          };
          setActivities((prev) => [activity, ...prev]);
        }
        return currentItems;
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        const activity: ActivityLog = {
          id: Date.now().toString(),
          action: "removed",
          itemName: item.name,
          details: `Removed ${item.quantity} ${item.unit} from ${item.location}`,
          employeeName: "Current User",
          timestamp: new Date().toISOString(),
        };
        setActivities((prevActivities) => [activity, ...prevActivities]);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const addActivity = useCallback(
    (newActivity: Omit<ActivityLog, "id" | "timestamp">) => {
      const activity: ActivityLog = {
        ...newActivity,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      setActivities((prev) => [activity, ...prev]);
    },
    []
  );

  const increaseQuantity = useCallback(
    (id: string, amount: number, employeeName: string) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item) {
          const newQuantity = item.quantity + amount;
          const activity: ActivityLog = {
            id: Date.now().toString(),
            action: "updated",
            itemName: item.name,
            details: `Added ${amount} ${item.unit} (${item.quantity} → ${newQuantity})`,
            employeeName,
            timestamp: new Date().toISOString(),
          };
          setActivities((prevActivities) => [activity, ...prevActivities]);

          return prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: newQuantity,
                  lastUpdated: new Date().toISOString(),
                }
              : i
          );
        }
        return prev;
      });
    },
    []
  );

  const decreaseQuantity = useCallback(
    (id: string, amount: number, employeeName: string) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item) {
          const newQuantity = Math.max(0, item.quantity - amount);
          const activity: ActivityLog = {
            id: Date.now().toString(),
            action: "updated",
            itemName: item.name,
            details: `Took ${amount} ${item.unit} (${item.quantity} → ${newQuantity})`,
            employeeName,
            timestamp: new Date().toISOString(),
          };
          setActivities((prevActivities) => [activity, ...prevActivities]);

          return prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: newQuantity,
                  lastUpdated: new Date().toISOString(),
                }
              : i
          );
        }
        return prev;
      });
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      items,
      activities,
      addItem,
      updateItem,
      removeItem,
      addActivity,
      increaseQuantity,
      decreaseQuantity,
    }),
    [
      items,
      activities,
      addItem,
      updateItem,
      removeItem,
      addActivity,
      increaseQuantity,
      decreaseQuantity,
    ]
  );

  return (
    <StorageContext.Provider value={contextValue}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
}
