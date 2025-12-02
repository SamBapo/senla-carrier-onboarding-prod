import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import { MapPin, Thermometer, Package, Calendar as CalendarIcon, Check } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatVND } from "@/utils/currency";

export default function WarehouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { warehouses, addBooking } = useData();
  const warehouse = warehouses.find(w => w.id === id);

  const [selectedZone, setSelectedZone] = useState("");
  const [pallets, setPallets] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  if (!warehouse) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Warehouse not found</p>
      </div>
    );
  }

  const handleBooking = () => {
    if (!selectedZone || !pallets || !startDate || !endDate) {
      toast.error("Please fill in all booking details");
      return;
    }

    const zone = warehouse.temperatureZones.find(z => z.id === selectedZone);
    if (!zone) return;

    const palletsNum = parseInt(pallets);
    if (palletsNum > zone.availablePallets) {
      toast.error("Not enough pallets available");
      return;
    }

    const days = differenceInDays(endDate, startDate);
    const totalPrice = days * palletsNum * zone.price;

    addBooking({
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      userId: "user-1",
      pallets: palletsNum,
      zoneId: zone.id,
      zoneName: zone.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: "pending",
      totalPrice
    });

    toast.success("Booking request submitted!");
    navigate("/my-bookings");
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back to Search
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{warehouse.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4" />
                {warehouse.address}, {warehouse.city}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{warehouse.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Temperature Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {warehouse.temperatureZones.map((zone) => (
                  <div key={zone.id} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{zone.name}</h4>
                      <Badge variant={zone.availablePallets > 0 ? "default" : "secondary"}>
                        {zone.availablePallets} available
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-muted-foreground" />
                        <span>{zone.tempMin}°C to {zone.tempMax}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{zone.totalPallets} total pallets</span>
                      </div>
                      <div className="col-span-2 text-primary font-medium">
                        {formatVND(zone.price)} per pallet/day
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {warehouse.facilities.map((facility) => (
                  <div key={facility} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Request Booking</CardTitle>
              <CardDescription>Minimum 1 pallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="zone">Temperature Zone</Label>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger id="zone">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouse.temperatureZones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name} ({zone.availablePallets} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pallets">Number of Pallets</Label>
                <Input
                  id="pallets"
                  type="number"
                  min="1"
                  placeholder="Minimum 1"
                  value={pallets}
                  onChange={(e) => setPallets(e.target.value)}
                />
              </div>

              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {selectedZone && pallets && startDate && endDate && (
                <div className="p-4 bg-accent rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Estimated Total</div>
                  <div className="text-2xl font-bold text-primary">
                    {formatVND(
                      differenceInDays(endDate, startDate) *
                      parseInt(pallets) *
                      (warehouse.temperatureZones.find(z => z.id === selectedZone)?.price || 0)
                    )}
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={handleBooking}>
                Request Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
