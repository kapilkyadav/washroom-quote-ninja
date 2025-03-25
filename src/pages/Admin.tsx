
import { useState } from 'react';
import { ChevronDown, Database, Home, Mail, Package, Settings, ShoppingCart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  onClick={() => handleTabChange('dashboard')}
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'projects' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  onClick={() => handleTabChange('projects')}
                >
                  <Package size={18} />
                  <span>Projects</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'brands' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  onClick={() => handleTabChange('brands')}
                >
                  <ShoppingCart size={18} />
                  <span>Brands & Products</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'leads' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  onClick={() => handleTabChange('leads')}
                >
                  <Mail size={18} />
                  <span>Leads</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'users' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  onClick={() => handleTabChange('users')}
                >
                  <Users size={18} />
                  <span>Users</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'data' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  onClick={() => handleTabChange('data')}
                >
                  <Database size={18} />
                  <span>Data Import</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  onClick={() => handleTabChange('settings')}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Mobile dropdown menu */}
        <div className="md:hidden w-full px-4 py-3 border-b border-border">
          <div className="relative">
            <button className="w-full flex items-center justify-between py-2 px-4 border border-border rounded-lg">
              <span className="font-medium">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'projects' ? 'Projects' : 
                 activeTab === 'brands' ? 'Brands & Products' : 
                 activeTab === 'leads' ? 'Leads' : 
                 activeTab === 'users' ? 'Users' : 
                 activeTab === 'data' ? 'Data Import' : 'Settings'}
              </span>
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold">
              {activeTab === 'dashboard' ? 'Dashboard' : 
               activeTab === 'projects' ? 'Projects' : 
               activeTab === 'brands' ? 'Brands & Products' : 
               activeTab === 'leads' ? 'Leads' : 
               activeTab === 'users' ? 'Users' : 
               activeTab === 'data' ? 'Data Import' : 'Settings'}
            </h1>
            
            <div className="flex items-center gap-3">
              <Input placeholder="Search..." className="max-w-[240px]" />
              <Button>New</Button>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Admin functionality will be implemented in the next phase</p>
                <Button variant="outline">View Documentation</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
