import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Palette, Contact, Share2 } from "lucide-react";
import { WebsiteSettings as WebsiteSettingsType } from "@/hooks/useAdminData";

interface WebsiteSettingsProps {
  settings: WebsiteSettingsType | null;
  onUpdateSettings: (settings: Partial<WebsiteSettingsType>) => void;
}

export function WebsiteSettings({ settings, onUpdateSettings }: WebsiteSettingsProps) {
  const [formData, setFormData] = useState<Partial<WebsiteSettingsType>>({
    site_name: '',
    site_description: '',
    logo_url: '',
    primary_color: '#3B82F6',
    secondary_color: '#1F2937',
    contact_email: '',
    contact_phone: '',
    address: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    maintenance_mode: false
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onUpdateSettings(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          ওয়েবসাইট সেটিংস
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">সাধারণ</TabsTrigger>
            <TabsTrigger value="design">ডিজাইন</TabsTrigger>
            <TabsTrigger value="contact">যোগাযোগ</TabsTrigger>
            <TabsTrigger value="social">সোশ্যাল</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="site_name">সাইট নাম</Label>
              <Input
                id="site_name"
                value={formData.site_name || ''}
                onChange={(e) => handleInputChange('site_name', e.target.value)}
                placeholder="আপনার ওয়েবসাইটের নাম"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">সাইট বিবরণ</Label>
              <Textarea
                id="site_description"
                value={formData.site_description || ''}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                placeholder="আপনার ওয়েবসাইটের বিবরণ"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_url">লোগো URL</Label>
              <Input
                id="logo_url"
                type="url"
                value={formData.logo_url || ''}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance_mode"
                checked={formData.maintenance_mode || false}
                onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
              />
              <Label htmlFor="maintenance_mode">মেইনটেনেন্স মোড</Label>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">প্রাইমারি রঙ</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color || '#3B82F6'}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.primary_color || '#3B82F6'}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">সেকেন্ডারি রঙ</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color || '#1F2937'}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.secondary_color || '#1F2937'}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    placeholder="#1F2937"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="contact_email">যোগাযোগের ইমেইল</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="contact@yoursite.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">যোগাযোগের ফোন</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">ঠিকানা</Label>
              <Textarea
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="আপনার ব্যবসার ঠিকানা"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">ফেসবুক URL</Label>
              <Input
                id="facebook_url"
                type="url"
                value={formData.facebook_url || ''}
                onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">ইনস্টাগ্রাম URL</Label>
              <Input
                id="instagram_url"
                type="url"
                value={formData.instagram_url || ''}
                onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url">টুইটার URL</Label>
              <Input
                id="twitter_url"
                type="url"
                value={formData.twitter_url || ''}
                onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                placeholder="https://twitter.com/yourpage"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <Button onClick={handleSubmit} className="w-full">
            সেটিংস সংরক্ষণ করুন
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}