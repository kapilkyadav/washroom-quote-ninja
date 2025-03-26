
import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculatorSettings } from '@/types';

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Luxury Bathroom Solutions',
    contactEmail: 'info@luxurybathrooms.com',
    contactPhone: '+91 98765 43210',
    address: 'Corporate Park, Mumbai, Maharashtra 400001',
    websiteUrl: 'https://luxurybathrooms.com',
  });
  
  const [emailSettings, setEmailSettings] = useState({
    sendEstimateEmails: true,
    sendLeadNotifications: true,
    adminEmailRecipient: 'admin@luxurybathrooms.com',
    emailSignature: 'Thanks & Regards,\nLuxury Bathroom Solutions Team',
    reminderEmails: false,
  });
  
  const [calculatorSettings, setCalculatorSettings] = useState<CalculatorSettings>({
    plumbingRatePerSqFt: 50,
    tileCostPerUnit: 80,
    tilingLaborRate: 85,
  });
  
  const saveGeneralSettings = () => {
    // Here you would save the settings to a database
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };
  
  const saveEmailSettings = () => {
    toast({
      title: "Email Settings Saved",
      description: "Notification settings have been updated successfully.",
    });
  };
  
  const saveCalculatorSettings = () => {
    toast({
      title: "Calculator Settings Saved",
      description: "Price calculations have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-6">General Settings</h3>
            
            <div className="space-y-6 max-w-2xl">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel>Company Name</FormLabel>
                  <Input 
                    value={generalSettings.companyName} 
                    onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Contact Email</FormLabel>
                  <Input 
                    type="email"
                    value={generalSettings.contactEmail} 
                    onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel>Contact Phone</FormLabel>
                  <Input 
                    value={generalSettings.contactPhone} 
                    onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Website URL</FormLabel>
                  <Input 
                    type="url"
                    value={generalSettings.websiteUrl} 
                    onChange={(e) => setGeneralSettings({...generalSettings, websiteUrl: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Office Address</FormLabel>
                <Textarea 
                  value={generalSettings.address} 
                  onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="pt-4">
                <Button onClick={saveGeneralSettings} className="gap-2">
                  <Save size={16} />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-6">Email & Notification Settings</h3>
            
            <div className="space-y-6 max-w-2xl">
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Send Estimate Emails</FormLabel>
                  <FormDescription>
                    Automatically email estimates to customers after they complete the calculator
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={emailSettings.sendEstimateEmails}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendEstimateEmails: checked})}
                  />
                </FormControl>
              </FormItem>
              
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Lead Notifications</FormLabel>
                  <FormDescription>
                    Receive email notifications when new leads are created
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={emailSettings.sendLeadNotifications}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendLeadNotifications: checked})}
                  />
                </FormControl>
              </FormItem>
              
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Reminder Emails</FormLabel>
                  <FormDescription>
                    Send follow-up emails to leads who haven't responded
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={emailSettings.reminderEmails}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, reminderEmails: checked})}
                  />
                </FormControl>
              </FormItem>
              
              <div className="space-y-2">
                <FormLabel>Admin Email Recipient</FormLabel>
                <Input 
                  type="email"
                  value={emailSettings.adminEmailRecipient} 
                  onChange={(e) => setEmailSettings({...emailSettings, adminEmailRecipient: e.target.value})}
                />
                <FormDescription>
                  Email address that will receive all admin notifications
                </FormDescription>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Email Signature</FormLabel>
                <Textarea 
                  value={emailSettings.emailSignature} 
                  onChange={(e) => setEmailSettings({...emailSettings, emailSignature: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="pt-4">
                <Button onClick={saveEmailSettings} className="gap-2">
                  <Save size={16} />
                  Save Notification Settings
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="calculator" className="mt-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-6">Calculator Settings</h3>
            
            <div className="space-y-6 max-w-2xl">
              <p className="text-sm text-muted-foreground">
                Configure the parameters used to calculate washroom estimates. These settings will affect all price calculations.
              </p>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormLabel>Plumbing Rate (₹ per sq ft)</FormLabel>
                  <Input 
                    type="number"
                    value={calculatorSettings.plumbingRatePerSqFt} 
                    onChange={(e) => setCalculatorSettings({...calculatorSettings, plumbingRatePerSqFt: Number(e.target.value)})}
                  />
                  <FormDescription>
                    The rate used for plumbing based on floor area
                  </FormDescription>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Tile Cost (₹ per unit)</FormLabel>
                  <Input 
                    type="number"
                    value={calculatorSettings.tileCostPerUnit} 
                    onChange={(e) => setCalculatorSettings({...calculatorSettings, tileCostPerUnit: Number(e.target.value)})}
                  />
                  <FormDescription>
                    Cost of each 2x2 tile (covering 4 sq ft)
                  </FormDescription>
                </div>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Tiling Labor Rate (₹ per sq ft)</FormLabel>
                <Input 
                  type="number"
                  value={calculatorSettings.tilingLaborRate} 
                  onChange={(e) => setCalculatorSettings({...calculatorSettings, tilingLaborRate: Number(e.target.value)})}
                />
                <FormDescription>
                  The labor cost for tiling per square foot
                </FormDescription>
              </div>
              
              <div className="pt-4">
                <Button onClick={saveCalculatorSettings} className="gap-2">
                  <Save size={16} />
                  Save Calculator Settings
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
