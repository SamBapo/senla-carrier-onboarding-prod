import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Thermometer, Package } from "lucide-react";
import { Warehouse } from "@/types/warehouse";
import { formatVND } from "@/utils/currency";

interface WarehouseCardProps {
  warehouse: Warehouse;
}

export function WarehouseCard({ warehouse }: WarehouseCardProps) {
  const totalAvailable = warehouse.temperatureZones.reduce(
    (sum, zone) => sum + zone.availablePallets,
    0
  );
  
  const priceRange = {
    min: Math.min(...warehouse.temperatureZones.map(z => z.price)),
    max: Math.max(...warehouse.temperatureZones.map(z => z.price))
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{warehouse.name}</CardTitle>
          <Badge variant="secondary">{warehouse.temperatureZones.length} zones</Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {warehouse.city}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span>{totalAvailable} pallets available</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Thermometer className="w-4 h-4 text-muted-foreground" />
            <span>
              {Math.min(...warehouse.temperatureZones.map(z => z.tempMin))}°C to{" "}
              {Math.max(...warehouse.temperatureZones.map(z => z.tempMax))}°C
            </span>
          </div>
          <div className="text-sm font-medium text-primary">
            {formatVND(priceRange.min)} - {formatVND(priceRange.max)} per pallet/day
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/warehouse/${warehouse.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
