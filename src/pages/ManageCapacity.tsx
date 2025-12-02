import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import { Package, Thermometer, DollarSign, Calendar, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { formatVND } from "@/utils/currency";

export default function ManageCapacity() {
  const { warehouses, bookings, updateBookingStatus, updateWarehouse } = useData();
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [newAvailability, setNewAvailability] = useState<number>(0);

  const myWarehouses = warehouses.slice(0, 2); // Mock: show first 2 as "my warehouses"
  const incomingBookings = bookings.filter(b => b.status === "pending");

  const handleUpdateAvailability = (warehouseId: string, zoneId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    if (!warehouse) return;

    const updatedZones = warehouse.temperatureZones.map(zone =>
      zone.id === zoneId ? { ...zone, availablePallets: newAvailability } : zone
    );

    updateWarehouse(warehouseId, { temperatureZones: updatedZones });
    toast.success("Availability updated");
    setEditingZone(null);
  };

  const handleBookingAction = (bookingId: string, action: "approved" | "declined") => {
    updateBookingStatus(bookingId, action);
    toast.success(`Booking ${action}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Capacity</h1>
        <p className="text-muted-foreground">Update availability and manage booking requests</p>
      </div>

      {incomingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Incoming Booking Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {incomingBookings.map((booking) => (
              <div key={booking.id} className="p-4 border border-border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{booking.warehouseName}</h4>
                    <p className="text-sm text-muted-foreground">{booking.zoneName}</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.pallets} pallets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{format(new Date(booking.startDate), "PP")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>{formatVND(booking.totalPrice)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBookingAction(booking.id, "approved")}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBookingAction(booking.id, "declined")}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {myWarehouses.map((warehouse) => (
          <Card key={warehouse.id}>
            <CardHeader>
              <CardTitle>{warehouse.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {warehouse.temperatureZones.map((zone) => (
                  <div key={zone.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{zone.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Thermometer className="w-4 h-4" />
                          <span>{zone.tempMin}°C to {zone.tempMax}°C</span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {formatVND(zone.price)}/pallet/day
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Capacity</p>
                        <p className="font-semibold">{zone.totalPallets} pallets</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available</p>
                        <p className="font-semibold text-success">{zone.availablePallets} pallets</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Booked</p>
                        <p className="font-semibold">{zone.totalPallets - zone.availablePallets} pallets</p>
                      </div>
                    </div>
                    {editingZone === zone.id ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={newAvailability}
                          onChange={(e) => setNewAvailability(parseInt(e.target.value) || 0)}
                          placeholder="New availability"
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateAvailability(warehouse.id, zone.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingZone(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingZone(zone.id);
                          setNewAvailability(zone.availablePallets);
                        }}
                      >
                        Update Availability
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
