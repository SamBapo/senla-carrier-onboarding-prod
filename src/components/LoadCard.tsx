import { Load } from '@/types/load';
import { Button } from '@/components/ui/button';
import { formatVND } from '@/utils/currency';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface LoadCardProps {
  load: Load;
  onViewDetails: (load: Load) => void;
  onAccept: (load: Load) => void;
}

export const LoadCard = ({ load, onViewDetails, onAccept }: LoadCardProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-foreground">
            {load.origin} <ArrowRight className="h-5 w-5" /> {load.destination}
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Pickup: </span>
              <span className="text-foreground">{format(new Date(load.pickupDeadline), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Weight: </span>
              <span className="text-foreground">{load.weight.toLocaleString()} kg</span>
            </div>
            <div>
              <span className="text-muted-foreground">Dropoff: </span>
              <span className="text-foreground">{format(new Date(load.dropoffDeadline), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Temp: </span>
              <span className="text-foreground">{load.temperature}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 min-w-[200px]">
          <div className="text-2xl font-bold text-primary">{formatVND(load.priceEstimate)}</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onViewDetails(load)} className="h-9 px-4">
              VIEW DETAILS
            </Button>
            <Button onClick={() => onAccept(load)} className="h-9 px-6">
              ACCEPT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
