import React, { createContext, useContext, useState, ReactNode } from "react";
import { Warehouse, Booking } from "@/types/warehouse";
import { mockWarehouses } from "@/data/mockWarehouses";

interface DataContextType {
  warehouses: Warehouse[];
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id">) => void;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
  addWarehouse: (warehouse: Omit<Warehouse, "id">) => void;
  updateWarehouse: (warehouseId: string, updates: Partial<Warehouse>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (booking: Omit<Booking, "id">) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = (bookingId: string, status: Booking["status"]) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  };

  const addWarehouse = (warehouse: Omit<Warehouse, "id">) => {
    const newWarehouse: Warehouse = {
      ...warehouse,
      id: `wh-${Date.now()}`
    };
    setWarehouses(prev => [...prev, newWarehouse]);
  };

  const updateWarehouse = (warehouseId: string, updates: Partial<Warehouse>) => {
    setWarehouses(prev =>
      prev.map(warehouse =>
        warehouse.id === warehouseId ? { ...warehouse, ...updates } : warehouse
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        warehouses,
        bookings,
        addBooking,
        updateBookingStatus,
        addWarehouse,
        updateWarehouse
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
