import { useState, useEffect } from 'react';
import { LoadCard } from '@/components/LoadCard';
import { mockLoads } from '@/data/mockLoads';
import { Load } from '@/types/load';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatVND } from '@/utils/currency';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const LoadOpportunities = () => {
  const [loads, setLoads] = useState<Load[]>(mockLoads);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [carrierId, setCarrierId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    pickupDate: '',
    dropoffDate: '',
    temperature: '',
    maxWeight: 15000
  });

  useEffect(() => {
    const checkCarrierStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsLoading(false);
        return;
      }

      const { data: carrier } = await supabase
        .from("carriers")
        .select("id, status")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (carrier) {
        setCarrierId(carrier.id);
        // User is approved if they've completed onboarding (pending or approved status)
        setIsApproved(carrier.status === "pending" || carrier.status === "approved");
      }
      
      setIsLoading(false);
    };

    checkCarrierStatus();
  }, []);

  const handleViewDetails = (load: Load) => {
    setSelectedLoad(load);
    setDetailsModalOpen(true);
  };

  const handleAcceptClick = (load: Load) => {
    setSelectedLoad(load);
    setAcceptModalOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (selectedLoad && carrierId) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to accept loads",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from("orders").insert({
        carrier_id: carrierId,
        user_id: session.user.id,
        load_id: selectedLoad.id,
        origin: selectedLoad.origin,
        destination: selectedLoad.destination,
        pickup_deadline: selectedLoad.pickupDeadline,
        dropoff_deadline: selectedLoad.dropoffDeadline,
        weight: selectedLoad.weight,
        pallets: selectedLoad.pallets,
        temperature: selectedLoad.temperature,
        detour_distance: selectedLoad.detourDistance,
        price_estimate: selectedLoad.priceEstimate
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to accept load. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setLoads(loads.filter(l => l.id !== selectedLoad.id));
      toast({
        title: "Load Accepted",
        description: `You have successfully accepted the load from ${selectedLoad.origin} to ${selectedLoad.destination}`,
      });
      setAcceptModalOpen(false);
      setSelectedLoad(null);
    }
  };

  const filteredLoads = loads.filter(load => {
    if (filters.origin && !removeAccents(load.origin).includes(removeAccents(filters.origin))) return false;
    if (filters.destination && !removeAccents(load.destination).includes(removeAccents(filters.destination))) return false;
    if (filters.temperature && load.temperature !== filters.temperature) return false;
    if (load.weight > filters.maxWeight) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Load Opportunities for You</h1>
          <p className="text-muted-foreground">Browse available loads and accept the ones that fit your fleet</p>
        </div>

        {!isApproved && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Complete your carrier onboarding to see full load details. Visit{" "}
              <a href="/register-carrier" className="font-semibold underline">
                Carrier Onboarding
              </a>{" "}
              to get started.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="origin" className="text-sm font-medium text-foreground">Origin</Label>
              <Input
                id="origin"
                placeholder="E.g., Hà Nội"
                value={filters.origin}
                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium text-foreground">Destination</Label>
              <Input
                id="destination"
                placeholder="E.g., Hồ Chí Minh"
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDate" className="text-sm font-medium text-foreground">Pickup Date</Label>
              <Input
                id="pickupDate"
                type="date"
                value={filters.pickupDate}
                onChange={(e) => setFilters({ ...filters, pickupDate: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffDate" className="text-sm font-medium text-foreground">Dropoff Date</Label>
              <Input
                id="dropoffDate"
                type="date"
                value={filters.dropoffDate}
                onChange={(e) => setFilters({ ...filters, dropoffDate: e.target.value })}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-sm font-medium text-foreground">Temperature Type</Label>
              <Select value={filters.temperature} onValueChange={(value) => setFilters({ ...filters, temperature: value })}>
                <SelectTrigger id="temperature" className="h-11">
                  <SelectValue placeholder="Select temperature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ambient">Ambient</SelectItem>
                  <SelectItem value="Chilled (0-4°C)">Chilled (0–4°C)</SelectItem>
                  <SelectItem value="Frozen (-18°C)">Frozen (-18°C)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxWeight" className="text-sm font-medium text-foreground">Max Weight: {filters.maxWeight.toLocaleString()} kg</Label>
              <Slider
                id="maxWeight"
                min={0}
                max={15000}
                step={500}
                value={[filters.maxWeight]}
                onValueChange={(value) => setFilters({ ...filters, maxWeight: value[0] })}
                className="mt-4"
              />
            </div>
          </div>
        </div>

        <div className={`space-y-5 ${!isApproved ? 'relative' : ''}`}>
          {!isApproved && (
            <div className="absolute inset-0 backdrop-blur-sm z-10 pointer-events-none" />
          )}
          {filteredLoads.length > 0 ? (
            filteredLoads.map((load) => (
              <div key={load.id} className={!isApproved ? 'blur-[2px]' : ''}>
                <LoadCard
                  load={load}
                  onViewDetails={isApproved ? handleViewDetails : () => {}}
                  onAccept={isApproved ? handleAcceptClick : () => {}}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No loads match your filters. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </div>

      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Load Details</DialogTitle>
            <DialogDescription>Complete information about this load opportunity</DialogDescription>
          </DialogHeader>
          {selectedLoad && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-semibold">{selectedLoad.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-semibold">{selectedLoad.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pickup Deadline</p>
                  <p className="font-semibold">{format(new Date(selectedLoad.pickupDeadline), 'dd MMM yyyy – HH:mm')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dropoff Deadline</p>
                  <p className="font-semibold">{format(new Date(selectedLoad.dropoffDeadline), 'dd MMM yyyy – HH:mm')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-semibold">{selectedLoad.weight.toLocaleString()} kg</p>
                </div>
                {selectedLoad.pallets && (
                  <div>
                    <p className="text-sm text-muted-foreground">Pallets</p>
                    <p className="font-semibold">{selectedLoad.pallets}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="font-semibold">{selectedLoad.temperature}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Detour Distance</p>
                  <p className="font-semibold">{selectedLoad.detourDistance} km</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Price Estimate</p>
                  <p className="text-2xl font-bold text-primary">{formatVND(selectedLoad.priceEstimate)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsModalOpen(false)}>Close</Button>
            <Button onClick={() => {
              setDetailsModalOpen(false);
              if (selectedLoad) handleAcceptClick(selectedLoad);
            }}>Accept Load</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={acceptModalOpen} onOpenChange={setAcceptModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Load Acceptance</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this load?
            </DialogDescription>
          </DialogHeader>
          {selectedLoad && (
            <div className="space-y-2">
              <p className="font-semibold">{selectedLoad.origin} → {selectedLoad.destination}</p>
              <p className="text-sm text-muted-foreground">
                Pickup: {format(new Date(selectedLoad.pickupDeadline), 'dd MMM yyyy – HH:mm')}
              </p>
              <p className="text-lg font-bold text-primary">{formatVND(selectedLoad.priceEstimate)}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmAccept}>Confirm Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoadOpportunities;
