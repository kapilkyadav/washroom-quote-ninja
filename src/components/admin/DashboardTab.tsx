
import { BarChart, LineChart, PieChart } from 'lucide-react';

const DashboardTab = () => {
  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Estimates', value: '128', change: '+12%', color: 'bg-blue-100' },
          { label: 'Pending Leads', value: '36', change: '+8%', color: 'bg-yellow-100' },
          { label: 'Projects Started', value: '24', change: '+5%', color: 'bg-green-100' },
          { label: 'Project Value', value: '₹16.4L', change: '+22%', color: 'bg-violet-100' },
        ].map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl ${stat.color} border`}>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
            <p className="text-sm font-medium text-green-600 mt-1">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Monthly Estimates</h3>
            <LineChart size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
            <p className="text-muted-foreground">Monthly estimates chart will be displayed here</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Conversion Rate</h3>
            <BarChart size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed rounded-lg">
            <p className="text-muted-foreground">Conversion rate chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Activity</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="space-y-4">
          {[
            { type: 'New Estimate', name: 'Rahul Sharma', location: 'Mumbai', time: '2 hours ago' },
            { type: 'Updated Project', name: 'Priya Patel', location: 'Bangalore', time: '5 hours ago' },
            { type: 'New Lead', name: 'Amit Singh', location: 'Delhi', time: '1 day ago' },
            { type: 'Project Started', name: 'Divya Gupta', location: 'Hyderabad', time: '2 days ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{activity.type}</p>
                <p className="text-sm text-muted-foreground">{activity.name} • {activity.location}</p>
              </div>
              <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;

import { Button } from '@/components/ui/button';
