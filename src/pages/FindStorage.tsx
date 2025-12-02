import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WarehouseCard } from "@/components/WarehouseCard";
import { useData } from "@/contexts/DataContext";
import { Warehouse } from "@/types/warehouse";

export default function FindStorage() {
  const [searchParams] = useSearchParams();
  const { warehouses } = useData();
  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>(warehouses);
  
  const [cityFilter, setCityFilter] = useState(searchParams.get("city") || "");
  const [palletsFilter, setPalletsFilter] = useState(searchParams.get("pallets") || "");
  const [tempFilter, setTempFilter] = useState(searchParams.get("temp") || "");

  useEffect(() => {
    let filtered = warehouses;

    if (cityFilter) {
      filtered = filtered.filter(w =>
        w.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    if (palletsFilter) {
      const palletsNeeded = parseInt(palletsFilter);
      filtered = filtered.filter(w =>
        w.temperatureZones.some(zone => zone.availablePallets >= palletsNeeded)
      );
    }

    if (tempFilter) {
      const tempMatch = tempFilter.match(/-?\d+/g);
      if (tempMatch && tempMatch.length >= 2) {
        const [minTemp, maxTemp] = tempMatch.map(Number);
        filtered = filtered.filter(w =>
          w.temperatureZones.some(
            zone => zone.tempMin <= maxTemp && zone.tempMax >= minTemp
          )
        );
      }
    }

    setFilteredWarehouses(filtered);
  }, [cityFilter, palletsFilter, tempFilter, warehouses]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Find Cold Storage</h1>
        <p className="text-muted-foreground">
          Search available cold storage facilities
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="e.g., Hồ Chí Minh, Hà Nội"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pallets">Minimum Pallets</Label>
            <Input
              id="pallets"
              type="number"
              placeholder="e.g., 50"
              value={palletsFilter}
              onChange={(e) => setPalletsFilter(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="temp">Temperature Range</Label>
            <Input
              id="temp"
              placeholder="e.g., -20 to -10"
              value={tempFilter}
              onChange={(e) => setTempFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div>
        <p className="text-sm text-muted-foreground mb-4">
          {filteredWarehouses.length} warehouse{filteredWarehouses.length !== 1 ? "s" : ""} found
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWarehouses.map((warehouse) => (
            <WarehouseCard key={warehouse.id} warehouse={warehouse} />
          ))}
        </div>
      </div>
    </div>
  );
}
