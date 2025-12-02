import { useState, useEffect } from "react";
import { TruckIcon, Save, Trash2, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddTruckDialog } from "@/components/AddTruckDialog";

interface Truck {
  id: string;
  truck_type: string;
  load_capacity: number;
  license_plate: string;
}

const MyTruckOverview = () => {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedPlates, setEditedPlates] = useState<Record<string, string>>({});
  const [numberOfTrucks, setNumberOfTrucks] = useState(0);
  const [carrierId, setCarrierId] = useState<string | null>(null);
  
  // Filter states
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCapacity, setFilterCapacity] = useState<string>("all");
  const [filterMissingPlate, setFilterMissingPlate] = useState(false);

  useEffect(() => {
    loadTrucks();
  }, []);

  const loadTrucks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: carrier } = await supabase
        .from("carriers")
        .select("id, number_of_trucks")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!carrier) {
        toast.error("No carrier profile found. Please complete registration.");
        navigate("/register-carrier");
        return;
      }

      setCarrierId(carrier.id);
      setNumberOfTrucks(carrier.number_of_trucks);

      const { data: trucksData, error } = await supabase
        .from("trucks")
        .select("*")
        .eq("carrier_id", carrier.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      console.log("🚚 === MY TRUCK OVERVIEW LOADED ===");
      console.log(`🚚 Total trucks loaded: ${trucksData?.length || 0}`);
      console.log("🚚 Trucks by capacity:");
      const capacityGroups = (trucksData || []).reduce((acc: any, truck: Truck) => {
        const display = getCapacityDisplay(truck.load_capacity);
        acc[display] = (acc[display] || 0) + 1;
        return acc;
      }, {});
      console.log(capacityGroups);

      setTrucks(trucksData || []);
    } catch (error: any) {
      console.error("Error loading trucks:", error);
      toast.error("Failed to load trucks");
    } finally {
      setLoading(false);
    }
  };

  const getTruckTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      ambient: "Ambient",
      refrigerated: "Refrigerated",
      frozen: "Frozen",
    };
    return typeMap[type] || type;
  };

  // Map numeric capacity to capacity range labels matching Step 2
  // Storage: <3.5t→3.5, 3.5-5t→5, 5-8t→8, 8-10t→10, 10-15t→15, >15t→16
  const getCapacityDisplay = (capacity: number): string => {
    if (capacity === 3.5) return "<3.5t";
    if (capacity === 5) return "3.5–5t";
    if (capacity === 8) return "5–8t";
    if (capacity === 10) return "8–10t";
    if (capacity === 15) return "10–15t";
    if (capacity === 16 || capacity > 15) return ">15t";
    return `${capacity}t`;
  };

  const handleLicensePlateChange = (truckId: string, value: string) => {
    setEditedPlates({ ...editedPlates, [truckId]: value });
  };

  const handleSaveLicensePlate = async (truckId: string) => {
    const newPlate = editedPlates[truckId];
    if (!newPlate) return;

    try {
      const { error } = await supabase
        .from("trucks")
        .update({ license_plate: newPlate })
        .eq("id", truckId);

      if (error) throw error;

      setTrucks(trucks.map(t => 
        t.id === truckId ? { ...t, license_plate: newPlate } : t
      ));
      
      // Remove from edited state
      const { [truckId]: _, ...rest } = editedPlates;
      setEditedPlates(rest);

      toast.success("License plate updated successfully");
    } catch (error: any) {
      console.error("Error updating license plate:", error);
      toast.error("Failed to update license plate");
    }
  };

  const handleDeleteTruck = async (truckId: string) => {
    if (!confirm("Are you sure you want to delete this truck?")) return;

    try {
      const { error } = await supabase
        .from("trucks")
        .delete()
        .eq("id", truckId);

      if (error) throw error;

      setTrucks(trucks.filter(t => t.id !== truckId));
      toast.success("Truck deleted successfully");
    } catch (error: any) {
      console.error("Error deleting truck:", error);
      toast.error("Failed to delete truck");
    }
  };

  // Standard capacity options matching Step 2 labels (with en-dashes)
  const STANDARD_CAPACITY_OPTIONS = [
    "<3.5t",
    "3.5–5t",   // en-dash
    "5–8t",     // en-dash
    "8–10t",    // en-dash
    "10–15t",   // en-dash
    ">15t"
  ];

  // Filter trucks
  const filteredTrucks = trucks.filter(truck => {
    if (filterType !== "all" && truck.truck_type !== filterType) return false;
    if (filterCapacity !== "all") {
      const truckCapacityRange = getCapacityDisplay(truck.load_capacity);
      if (truckCapacityRange !== filterCapacity) return false;
    }
    if (filterMissingPlate && truck.license_plate) return false;
    return true;
  });


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Loading trucks...</p>
        </div>
      </div>
    );
  }

  if (trucks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Truck Overview</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your fleet performance and availability
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <TruckIcon className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No Trucks Registered
          </h2>
          <p className="text-muted-foreground max-w-md">
            Complete your carrier onboarding to add your trucks and start tracking their performance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Truck Overview</h1>
            <p className="text-muted-foreground mt-2">
              Manage your fleet and update truck information
            </p>
          </div>
          {carrierId && <AddTruckDialog carrierId={carrierId} onTruckAdded={loadTrucks} />}
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Filter className="h-5 w-5 text-muted-foreground" />
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Truck Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ambient">Ambient</SelectItem>
              <SelectItem value="refrigerated">Refrigerated</SelectItem>
              <SelectItem value="frozen">Frozen</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCapacity} onValueChange={setFilterCapacity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Capacity" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">All Capacities</SelectItem>
              {STANDARD_CAPACITY_OPTIONS.map(cap => (
                <SelectItem key={cap} value={cap}>{cap}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="missing-plate" 
              checked={filterMissingPlate}
              onCheckedChange={(checked) => setFilterMissingPlate(checked as boolean)}
            />
            <label htmlFor="missing-plate" className="text-sm font-medium cursor-pointer">
              Missing license plate
            </label>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>License Plate</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrucks.map((truck, index) => {
              const currentPlate = editedPlates[truck.id] ?? truck.license_plate;
              const hasChanges = editedPlates[truck.id] !== undefined;
              
              return (
                <TableRow key={truck.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{getTruckTypeDisplay(truck.truck_type)}</TableCell>
                  <TableCell>{getCapacityDisplay(truck.load_capacity)}</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={currentPlate}
                      onChange={(e) => handleLicensePlateChange(truck.id, e.target.value)}
                      placeholder="51H-123.45"
                      className="max-w-[200px]"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={hasChanges ? "default" : "outline"}
                        onClick={() => handleSaveLicensePlate(truck.id)}
                        disabled={!hasChanges}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTruck(truck.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Registered capacity: {numberOfTrucks} trucks | Current trucks: {trucks.length} | Showing: {filteredTrucks.length}
          {trucks.length < numberOfTrucks && (
            <span className="ml-2 text-amber-600">
              (Add {numberOfTrucks - trucks.length} more trucks)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTruckOverview;
