import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function QuickSearch() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [pallets, setPallets] = useState("");
  const [tempRange, setTempRange] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (pallets) params.set("pallets", pallets);
    if (tempRange) params.set("temp", tempRange);
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());
    
    navigate(`/find-storage?${params.toString()}`);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Search</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input
          placeholder="e.g., Hồ Chí Minh, Hà Nội"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Pallets needed"
          value={pallets}
          onChange={(e) => setPallets(e.target.value)}
        />
        <Input
          placeholder="Temp range (e.g., -20 to -10)"
          value={tempRange}
          onChange={(e) => setTempRange(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PP") : "Start date"}
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PP") : "End date"}
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
      <Button onClick={handleSearch} className="mt-4 w-full md:w-auto">
        <Search className="mr-2 h-4 w-4" />
        Search Storage
      </Button>
    </Card>
  );
}
