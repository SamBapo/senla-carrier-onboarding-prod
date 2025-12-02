import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileText, Download } from "lucide-react";
import { PROVINCE_OPTIONS } from "@/data/provinces";

interface Carrier {
  id: string;
  company_name: string;
  contact_person: string;
  contact_role: string;
  zalo_number: string;
  email: string;
  company_address: string;
  base_location: string;
  number_of_trucks: number;
  tax_code: string | null;
  status: string;
  preferred_routes: string[] | null;
  preferred_load_types: string[] | null;
  additional_services: string[] | null;
  business_registration_url: string | null;
  truck_registration_urls: string[] | null;
  created_at: string;
}

interface Truck {
  id: string;
  truck_type: string;
  load_capacity: number;
  license_plate: string;
}

export default function MyProfile() {
  const navigate = useNavigate();
  const [carrier, setCarrier] = useState<Carrier | null>(null);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get province display name
  const getProvinceLabel = (value: string) => {
    const province = PROVINCE_OPTIONS.find(p => p.value === value);
    return province ? province.label : value;
  };

  useEffect(() => {
    checkAuth();
    fetchCarrierData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchCarrierData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: carrierData, error: carrierError } = await supabase
        .from("carriers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (carrierError) {
        if (carrierError.code === "PGRST116") {
          // No carrier profile found
          setLoading(false);
          return;
        }
        throw carrierError;
      }

      setCarrier(carrierData);

      if (carrierData) {
        const { data: trucksData, error: trucksError } = await supabase
          .from("trucks")
          .select("*")
          .eq("carrier_id", carrierData.id);

        if (trucksError) throw trucksError;
        setTrucks(trucksData || []);
      }
    } catch (error: any) {
      toast.error("Failed to load profile data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const downloadDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('carrier-documents')
        .download(filePath);
      
      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filePath.split('/').pop() || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error("Failed to download document");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!carrier) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>No Registration Found</CardTitle>
            <CardDescription>You haven't submitted a carrier registration yet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate("/register-carrier")}>
              Register as Carrier
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Carrier Profile</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{carrier.company_name}</CardTitle>
              <CardDescription>Registered on {new Date(carrier.created_at).toLocaleDateString()}</CardDescription>
            </div>
            <Badge variant={carrier.status === 'approved' ? 'default' : 'secondary'}>
              {carrier.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="font-medium">{carrier.contact_person}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{carrier.contact_role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{carrier.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Zalo Number</p>
                <p className="font-medium">{carrier.zalo_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company Address</p>
                <p className="font-medium">{carrier.company_address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Base Location</p>
                <p className="font-medium">{getProvinceLabel(carrier.base_location)}</p>
              </div>
              {carrier.tax_code && (
                <div>
                  <p className="text-sm text-muted-foreground">Tax Code</p>
                  <p className="font-medium">{carrier.tax_code}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Fleet Information</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Total Trucks: {carrier.number_of_trucks}
            </p>
            {trucks.length > 0 && (
              <div className="space-y-2">
                {trucks.map((truck) => (
                  <Card key={truck.id}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium">{truck.truck_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Capacity</p>
                          <p className="font-medium">{truck.load_capacity} tons</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">License Plate</p>
                          <p className="font-medium">{truck.license_plate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {carrier.preferred_routes && carrier.preferred_routes.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Load Preferences</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Routes</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {carrier.preferred_routes.map((route, index) => (
                        <Badge key={index} variant="outline">{route}</Badge>
                      ))}
                    </div>
                  </div>
                  {carrier.preferred_load_types && carrier.preferred_load_types.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mt-3">Preferred Load Types</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {carrier.preferred_load_types.map((type, index) => (
                          <Badge key={index} variant="outline">{type}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {carrier.additional_services && carrier.additional_services.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mt-3">Additional Services</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {carrier.additional_services.map((service, index) => (
                          <Badge key={index} variant="outline">{service}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {(carrier.business_registration_url || (carrier.truck_registration_urls && carrier.truck_registration_urls.length > 0)) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Uploaded Documents</h3>
                <div className="space-y-3">
                  {carrier.business_registration_url && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Business Registration</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(carrier.business_registration_url!)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Business Registration</span>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {carrier.truck_registration_urls && carrier.truck_registration_urls.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Truck Registrations ({carrier.truck_registration_urls.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {carrier.truck_registration_urls.map((url, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(url)}
                            className="flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Document {index + 1}</span>
                            <Download className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
