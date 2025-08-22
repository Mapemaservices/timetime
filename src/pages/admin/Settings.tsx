// ...existing code...

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Save } from "lucide-react";

interface WebsiteSetting {
  id: string;
  key: string;
  value: string;
  description: string;
}

// Helper for counties/shipping JSON
function parseCounties(val: string): { county: string; price: number }[] {
  try {
    const arr = JSON.parse(val);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

function stringifyCounties(arr: { county: string; price: number }[]): string {
  return JSON.stringify(arr);
}

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [counties, setCounties] = useState<{ county: string; price: number }[]>([]);
  const [newCounty, setNewCounty] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("website_settings")
        .select("*")
        .order("key");
      
      if (error) throw error;
      
      // Initialize form data with current values
      const initialData: Record<string, string> = {};
      let foundCounties = false;
      data.forEach((setting: WebsiteSetting) => {
        initialData[setting.key] = setting.value || '';
        if (setting.key === 'shipping_counties') {
          setCounties(parseCounties(setting.value || '[]'));
          foundCounties = true;
        }
      });
      if (!foundCounties) setCounties([]);
      setFormData(initialData);
      
      return data as WebsiteSetting[];
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      const { error } = await supabase
        .from("website_settings")
        .update({ value: data.value, updated_at: new Date().toISOString() })
        .eq("key", data.key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Website settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["website-settings"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating settings:", error);
    },
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (key === 'shipping_counties') {
      setCounties(parseCounties(value));
    }
  };

  // Counties/shipping handlers
  const handleAddCounty = () => {
    if (!newCounty.trim() || isNaN(Number(newPrice))) return;
    const updated = [...counties, { county: newCounty.trim(), price: Number(newPrice) }];
    setCounties(updated);
    setFormData(prev => ({ ...prev, shipping_counties: stringifyCounties(updated) }));
    setNewCounty('');
    setNewPrice('');
  };
  const handleRemoveCounty = (idx: number) => {
    const updated = counties.filter((_, i) => i !== idx);
    setCounties(updated);
    setFormData(prev => ({ ...prev, shipping_counties: stringifyCounties(updated) }));
  };
  const handleCountyChange = (idx: number, field: 'county' | 'price', value: string) => {
    const updated = counties.map((c, i) =>
      i === idx ? { ...c, [field]: field === 'price' ? Number(value) : value } : c
    );
    setCounties(updated);
    setFormData(prev => ({ ...prev, shipping_counties: stringifyCounties(updated) }));
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      for (const setting of settings) {
        if (formData[setting.key] !== setting.value) {
          await updateSettingMutation.mutateAsync({
            key: setting.key,
            value: formData[setting.key] || ''
          });
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  // Prepare settings arrays before rendering
  // ...existing code...


  // Prepare contactSettings array for contact info fields
  const contactSettings = settings?.filter(s =>
    s.key === 'contact_phone' ||
    s.key === 'contact_email' ||
    s.key === 'contact_address'
  ) || [];

  // Prepare mpesaSettings array for mpesa info fields
  const mpesaSettings = settings?.filter(s =>
    s.key === 'mpesa_paybill' ||
    s.key === 'mpesa_account'
  ) || [];

  // Prepare otherSettings for any other settings
  const otherSettings = settings?.filter(s =>
    s.key !== 'shipping_counties' &&
    s.key !== 'contact_phone' &&
    s.key !== 'contact_email' &&
    s.key !== 'contact_address' &&
    s.key !== 'mpesa_paybill' &&
    s.key !== 'mpesa_account'
  ) || [];

  let content: JSX.Element;
  if (isLoading) {
    content = (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure website settings and business information
            </p>
          </div>
          <Button onClick={handleSave} disabled={updateSettingMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateSettingMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        <div className="grid gap-6">
          {/* Shipping Counties & Prices */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Counties & Prices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="County name"
                  value={newCounty}
                  onChange={e => setNewCounty(e.target.value)}
                  className="w-1/2"
                />
                <Input
                  placeholder="Shipping price"
                  type="number"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  className="w-1/3"
                />
                <Button type="button" onClick={handleAddCounty}>
                  Add
                </Button>
              </div>
              <div>
                {counties.length === 0 && <div className="text-muted-foreground text-sm">No counties added yet.</div>}
                {counties.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-1">
                    <Input
                      value={c.county}
                      onChange={e => handleCountyChange(idx, 'county', e.target.value)}
                      className="w-1/2"
                    />
                    <Input
                      type="number"
                      value={c.price}
                      onChange={e => handleCountyChange(idx, 'price', e.target.value)}
                      className="w-1/3"
                    />
                    <Button type="button" variant="destructive" onClick={() => handleRemoveCounty(idx)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <Label htmlFor={setting.key}>{setting.description}</Label>
                  <Input
                    id={setting.key}
                    value={formData[setting.key] || ''}
                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                    placeholder={setting.description}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          {/* MPESA Settings */}
          <Card>
            <CardHeader>
              <CardTitle>MPESA Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mpesaSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <Label htmlFor={setting.key}>{setting.description}</Label>
                  <Input
                    id={setting.key}
                    value={formData[setting.key] || ''}
                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                    placeholder={setting.description}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Other Settings */}
          {otherSettings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {otherSettings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.description}</Label>
                    {setting.key === 'about_text' ? (
                      <Textarea
                        id={setting.key}
                        value={formData[setting.key] || ''}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        placeholder={setting.description}
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={setting.key}
                        value={formData[setting.key] || ''}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        placeholder={setting.description}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }
  return content;

  // Removed duplicate declarations

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure website settings and business information
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateSettingMutation.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateSettingMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Shipping Counties & Prices */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Counties & Prices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="County name"
                value={newCounty}
                onChange={e => setNewCounty(e.target.value)}
                className="w-1/2"
              />
              <Input
                placeholder="Shipping price"
                type="number"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                className="w-1/3"
              />
              <Button type="button" onClick={handleAddCounty}>
                Add
              </Button>
            </div>
            <div>
              {counties.length === 0 && <div className="text-muted-foreground text-sm">No counties added yet.</div>}
              {counties.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  <Input
                    value={c.county}
                    onChange={e => handleCountyChange(idx, 'county', e.target.value)}
                    className="w-1/2"
                  />
                  <Input
                    type="number"
                    value={c.price}
                    onChange={e => handleCountyChange(idx, 'price', e.target.value)}
                    className="w-1/3"
                  />
                  <Button type="button" variant="destructive" onClick={() => handleRemoveCounty(idx)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactSettings.map((setting) => (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.key}>{setting.description}</Label>
                <Input
                  id={setting.key}
                  value={formData[setting.key] || ''}
                  onChange={(e) => handleInputChange(setting.key, e.target.value)}
                  placeholder={setting.description}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* MPESA Settings */}
        <Card>
          <CardHeader>
            <CardTitle>MPESA Payment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mpesaSettings.map((setting) => (
              <div key={setting.id} className="space-y-2">
                <Label htmlFor={setting.key}>{setting.description}</Label>
                <Input
                  id={setting.key}
                  value={formData[setting.key] || ''}
                  onChange={(e) => handleInputChange(setting.key, e.target.value)}
                  placeholder={setting.description}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Other Settings */}
        {otherSettings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {otherSettings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <Label htmlFor={setting.key}>{setting.description}</Label>
                  {setting.key === 'about_text' ? (
                    <Textarea
                      id={setting.key}
                      value={formData[setting.key] || ''}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                      placeholder={setting.description}
                      rows={4}
                    />
                  ) : (
                    <Input
                      id={setting.key}
                      value={formData[setting.key] || ''}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                      placeholder={setting.description}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
