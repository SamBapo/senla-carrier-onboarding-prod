import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useData } from "@/contexts/DataContext";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TemperatureZone } from "@/types/warehouse";

export default function ListAvailability() {
  const navigate = useNavigate();
  const { addWarehouse } = useData();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [zones, setZones] = useState<Omit<TemperatureZone, "id">[]>([
    {
      name: "",
      tempMin: 0,
      tempMax: 0,
      totalPallets: 0,
      availablePallets: 0,
      price: 0
    }
  ]);
  const [facilities, setFacilities] = useState<string[]>([]);

  const facilityOptions = [
    "24/7 Operations",
    "Loading Docks",
    "Temperature Monitoring",
    "Security System",
    "Fumigation Available",
    "Pharma Certified",
    "Climate Control",
    "Backup Power",
    "Cross-Docking",
    "Quality Control"
  ];

  const addZone = () => {
    setZones([
      ...zones,
      {
        name: "",
        tempMin: 0,
        tempMax: 0,
        totalPallets: 0,
        availablePallets: 0,
        price: 0
      }
    ]);
  };

  const removeZone = (index: number) => {
    setZones(zones.filter((_, i) => i !== index));
  };

  const updateZone = (index: number, field: keyof Omit<TemperatureZone, "id">, value: any) => {
    const newZones = [...zones];
    newZones[index] = { ...newZones[index], [field]: value };
    setZones(newZones);
  };

  const toggleFacility = (facility: string) => {
    setFacilities(prev =>
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  const handleSubmit = () => {
    if (!name || !address || !city || zones.some(z => !z.name || z.totalPallets === 0)) {
      toast.error("Please fill in all required fields");
      return;
    }

    const zonesWithIds: TemperatureZone[] = zones.map((zone, index) => ({
      ...zone,
      id: `zone-${Date.now()}-${index}`
    }));

    addWarehouse({
      name,
      address,
      city,
      description,
      geolocation: { lat: 0, lng: 0 },
      temperatureZones: zonesWithIds,
      facilities,
      images: ["/placeholder.svg"]
    });

    toast.success("Warehouse listed successfully!");
    navigate("/manage-capacity");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">List Your Warehouse</h1>
        <p className="text-muted-foreground">Add your cold storage facility to the marketplace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Provide details about your warehouse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Warehouse Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Arctic Logistics Hub"
            />
          </div>
          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Hồ Chí Minh, Hà Nội"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your facility and services"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Temperature Zones</CardTitle>
              <CardDescription>Define your storage zones and capacity</CardDescription>
            </div>
            <Button onClick={addZone} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Zone
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {zones.map((zone, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Zone {index + 1}</h4>
                {zones.length > 1 && (
                  <Button
                    onClick={() => removeZone(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Zone Name *</Label>
                  <Input
                    value={zone.name}
                    onChange={(e) => updateZone(index, "name", e.target.value)}
                    placeholder="e.g., Deep Freeze"
                  />
                </div>
                <div>
                  <Label>Total Pallets *</Label>
                  <Input
                    type="number"
                    value={zone.totalPallets || ""}
                    onChange={(e) => updateZone(index, "totalPallets", parseInt(e.target.value) || 0)}
                    placeholder="Total capacity"
                  />
                </div>
                <div>
                  <Label>Min Temperature (°C) *</Label>
                  <Input
                    type="number"
                    value={zone.tempMin || ""}
                    onChange={(e) => updateZone(index, "tempMin", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Max Temperature (°C) *</Label>
                  <Input
                    type="number"
                    value={zone.tempMax || ""}
                    onChange={(e) => updateZone(index, "tempMax", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Available Pallets *</Label>
                  <Input
                    type="number"
                    value={zone.availablePallets || ""}
                    onChange={(e) => updateZone(index, "availablePallets", parseInt(e.target.value) || 0)}
                    placeholder="Currently available"
                  />
                </div>
                <div>
                  <Label>Price per Pallet/Day (VND) *</Label>
                  <Input
                    type="number"
                    step="1000"
                    value={zone.price || ""}
                    onChange={(e) => updateZone(index, "price", parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 150000"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
          <CardDescription>Select available facilities and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilityOptions.map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={facility}
                  checked={facilities.includes(facility)}
                  onCheckedChange={() => toggleFacility(facility)}
                />
                <Label htmlFor={facility} className="cursor-pointer">
                  {facility}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSubmit} className="flex-1">
          Submit Listing
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
