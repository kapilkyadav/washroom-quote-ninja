
import { useState } from 'react';
import { ChevronDown, Home, Mail, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DashboardTab from '@/components/admin/DashboardTab';
import ProjectsTab from '@/components/admin/ProjectsTab';
import LeadsTab from '@/components/admin/LeadsTab';
import UsersTab from '@/components/admin/UsersTab';
import SettingsTab from '@/components/admin/SettingsTab';
import SubmissionsTab from '@/components/admin/SubmissionsTab';
import BrandsTab from '@/components/admin/BrandsTab';
import FixturePricingTab from '@/components/admin/FixturePricingTab';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  // Tab options for the sidebar
  const tabOptions = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'submissions', label: 'Quote Submissions', icon: Home },
    { id: 'projects', label: 'Projects', icon: Home },
    { id: 'leads', label: 'Leads', icon: Mail },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'brands', label: 'Brands', icon: Home },
    { id: 'fixtures', label: 'Fixture Pricing', icon: Home },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'submissions':
        return <SubmissionsTab searchQuery={searchQuery} />;
      case 'projects':
        return <ProjectsTab searchQuery={searchQuery} />;
      case 'leads':
        return <LeadsTab searchQuery={searchQuery} />;
      case 'users':
        return <UsersTab searchQuery={searchQuery} />;
      case 'brands':
        return <BrandsTab searchQuery={searchQuery} />;
      case 'fixtures':
        return <FixturePricingTab searchQuery={searchQuery} />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-secondary/30 shadow-sm hidden md:block">
          <div className="h-16 border-b border-border flex items-center px-6">
            <h2 className="font-semibold">Admin Portal</h2>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-1">
              {tabOptions.map((tab) => (
                <li key={tab.id}>
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                    }`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        {/* Mobile dropdown menu */}
        <div className="md:hidden w-full px-4 py-3 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span className="font-medium">
                  {tabOptions.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                </span>
                <ChevronDown size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full bg-background" align="start">
              {tabOptions.map((tab) => (
                <DropdownMenuItem 
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="cursor-pointer"
                >
                  <tab.icon className="mr-2" size={16} />
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Main content area */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold">
              {tabOptions.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
            </h1>
            
            {['projects', 'leads', 'users', 'submissions', 'brands', 'fixtures'].includes(activeTab) && (
              <div className="flex items-center gap-3">
                <Input 
                  placeholder="Search..." 
                  className="max-w-[240px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>
          
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
