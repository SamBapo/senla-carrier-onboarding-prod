-- Create orders table for accepted loads
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  carrier_id UUID NOT NULL,
  user_id UUID NOT NULL,
  load_id TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  dropoff_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  weight NUMERIC NOT NULL,
  pallets INTEGER,
  temperature TEXT NOT NULL,
  detour_distance NUMERIC NOT NULL,
  price_estimate NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending confirmation',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();