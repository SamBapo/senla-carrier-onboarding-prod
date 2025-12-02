export interface Load {
  id: string;
  origin: string;
  destination: string;
  pickupDeadline: string;
  dropoffDeadline: string;
  weight: number;
  pallets?: number;
  temperature: 'Ambient' | 'Chilled (0-4°C)' | 'Frozen (-18°C)';
  detourDistance: number;
  priceEstimate: number;
  status: 'available' | 'accepted' | 'in-transit' | 'delivered';
}
