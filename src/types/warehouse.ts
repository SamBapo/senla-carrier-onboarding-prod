export interface TemperatureZone {
  id: string;
  name: string;
  tempMin: number;
  tempMax: number;
  totalPallets: number;
  availablePallets: number;
  price: number;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  geolocation: {
    lat: number;
    lng: number;
  };
  temperatureZones: TemperatureZone[];
  facilities: string[];
  images: string[];
  description?: string;
}

export interface Booking {
  id: string;
  warehouseId: string;
  warehouseName: string;
  userId: string;
  pallets: number;
  zoneId: string;
  zoneName: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "declined";
  totalPrice: number;
}
