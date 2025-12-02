import { Warehouse } from "@/types/warehouse";

export const mockWarehouses: Warehouse[] = [
  {
    id: "wh-001",
    name: "Arctic Logistics Hub",
    address: "123 Đường Lạnh Lẽo, Khu Công Nghiệp Tân Bình",
    city: "Hồ Chí Minh",
    geolocation: { lat: 10.8231, lng: 106.6297 },
    description: "State-of-the-art cold storage facility with 24/7 operations and advanced temperature monitoring.",
    temperatureZones: [
      {
        id: "zone-001",
        name: "Deep Freeze",
        tempMin: -25,
        tempMax: -18,
        totalPallets: 500,
        availablePallets: 120,
        price: 450000
      },
      {
        id: "zone-002",
        name: "Frozen",
        tempMin: -18,
        tempMax: -5,
        totalPallets: 800,
        availablePallets: 250,
        price: 320000
      },
      {
        id: "zone-003",
        name: "Chilled",
        tempMin: 0,
        tempMax: 8,
        totalPallets: 600,
        availablePallets: 180,
        price: 180000
      }
    ],
    facilities: ["24/7 Operations", "Loading Docks", "Temperature Monitoring", "Security System", "Fumigation Available"],
    images: ["/placeholder.svg"]
  },
  {
    id: "wh-002",
    name: "FrostGuard Storage",
    address: "456 Đường Kho Bãi, Khu Cảng Hải Phòng",
    city: "Hải Phòng",
    geolocation: { lat: 20.8449, lng: 106.6881 },
    description: "Premium cold storage with pharmaceutical-grade temperature control and compliance certifications.",
    temperatureZones: [
      {
        id: "zone-004",
        name: "Ultra Cold",
        tempMin: -30,
        tempMax: -20,
        totalPallets: 300,
        availablePallets: 75,
        price: 580000
      },
      {
        id: "zone-005",
        name: "Pharma Grade",
        tempMin: 2,
        tempMax: 8,
        totalPallets: 400,
        availablePallets: 150,
        price: 380000
      }
    ],
    facilities: ["Pharma Certified", "Climate Control", "24/7 Security", "Backup Power", "Loading Docks"],
    images: ["/placeholder.svg"]
  },
  {
    id: "wh-003",
    name: "CoolStore Distribution Center",
    address: "789 Phố Đông Lạnh, Khu Thương Mại Long Biên",
    city: "Hà Nội",
    geolocation: { lat: 21.0285, lng: 105.8542 },
    description: "Large-scale distribution center specializing in frozen food storage with rapid dock-to-door service.",
    temperatureZones: [
      {
        id: "zone-006",
        name: "Frozen Storage",
        tempMin: -20,
        tempMax: -10,
        totalPallets: 1000,
        availablePallets: 400,
        price: 280000
      },
      {
        id: "zone-007",
        name: "Cool Storage",
        tempMin: 0,
        tempMax: 10,
        totalPallets: 750,
        availablePallets: 300,
        price: 160000
      }
    ],
    facilities: ["Cross-Docking", "Rapid Loading", "Temperature Monitoring", "Inventory Management", "24/7 Access"],
    images: ["/placeholder.svg"]
  },
  {
    id: "wh-004",
    name: "IceLink Warehouse",
    address: "321 Đường Chuỗi Lạnh, Trung Tâm Logistics",
    city: "Đà Nẵng",
    geolocation: { lat: 16.0544, lng: 108.2022 },
    description: "Strategic location near port facilities with efficient cold chain logistics and customs clearance.",
    temperatureZones: [
      {
        id: "zone-008",
        name: "Multi-Temp",
        tempMin: -15,
        tempMax: 5,
        totalPallets: 650,
        availablePallets: 200,
        price: 320000
      }
    ],
    facilities: ["Port Access", "Customs Clearance", "Fumigation", "Quality Control", "24/7 Operations"],
    images: ["/placeholder.svg"]
  },
  {
    id: "wh-005",
    name: "ChillPro Facility",
    address: "555 Đường Làm Lạnh, Khu Công Nghiệp Hưng Yên",
    city: "Cần Thơ",
    geolocation: { lat: 10.0452, lng: 105.7469 },
    description: "Modern facility with automated storage systems and advanced inventory tracking technology.",
    temperatureZones: [
      {
        id: "zone-009",
        name: "Frozen Zone A",
        tempMin: -22,
        tempMax: -15,
        totalPallets: 550,
        availablePallets: 150,
        price: 290000
      },
      {
        id: "zone-010",
        name: "Chilled Zone B",
        tempMin: 2,
        tempMax: 6,
        totalPallets: 450,
        availablePallets: 120,
        price: 170000
      }
    ],
    facilities: ["Automated Systems", "Real-time Tracking", "Quality Assurance", "Loading Docks", "Security"],
    images: ["/placeholder.svg"]
  }
];
