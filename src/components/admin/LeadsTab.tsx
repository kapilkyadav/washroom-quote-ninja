
import { useState } from 'react';
import { ArrowDownUp, Check, Eye, Mail, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Sample lead data
const sampleLeads = [
  { 
    id: 'L001',
    name: 'Rajesh Kumar', 
    email: 'rajesh@example.com', 
    phone: '+91 9876543210', 
    location: 'Delhi', 
    projectType: 'new',
    createdAt: '2023-08-12T09:30:00Z',
    status: 'new',
    estimateValue: 45000
  },
  { 
    id: 'L002',
    name: 'Shreya Sharma', 
    email: 'shreya@example.com', 
    phone: '+91 9876543211', 
    location: 'Mumbai', 
    projectType: 'renovation',
    createdAt: '2023-08-10T14:20:00Z',
    status: 'contacted',
    estimateValue: 38500
  },
  { 
    id: 'L003',
    name: 'Vikram Singh', 
    email: 'vikram@example.com', 
    phone: '+91 9876543212', 
    location: 'Bangalore', 
    projectType: 'new',
    createdAt: '2023-08-09T11:15:00Z',
    status: 'qualified',
    estimateValue: 62000
  },
  { 
    id: 'L004',
    name: 'Priya Patel', 
    email: 'priya@example.com', 
    phone: '+91 9876543213', 
    location: 'Hyderabad', 
    projectType: 'renovation',
    createdAt: '2023-08-08T16:45:00Z',
    status: 'converted',
    estimateValue: 51000
  },
  { 
    id: 'L005',
    name: 'Amit Joshi', 
    email: 'amit@example.com', 
    phone: '+91 9876543214', 
    location: 'Chennai', 
    projectType: 'new',
    createdAt: '2023-08-07T10:30:00Z',
    status: 'lost',
    estimateValue: 42500
  },
];

interface LeadsTabProps {
  searchQuery: string;
}

const LeadsTab = ({ searchQuery }: LeadsTabProps) => {
  const [leads, setLeads] = useState(sampleLeads);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filter leads based on search query
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone.includes(searchQuery) ||
    lead.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (!sortField) return 0;
    
    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA);
    }
    
    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    }
    
    return 0;
  });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Qualified</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Converted</Badge>;
      case 'lost':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Lost</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Lead Management</h3>
          <p className="text-sm text-muted-foreground">Track and manage incoming leads from the calculator</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowDownUp size={14} />
            Filter
          </Button>
          <Button size="sm">Export Leads</Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer hover:bg-secondary">
                Name {sortField === 'name' && (
                  <ArrowDownUp size={14} className="inline ml-1" />
                )}
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead onClick={() => handleSort('location')} className="cursor-pointer hover:bg-secondary">
                Location {sortField === 'location' && (
                  <ArrowDownUp size={14} className="inline ml-1" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort('projectType')} className="cursor-pointer hover:bg-secondary">
                Project Type {sortField === 'projectType' && (
                  <ArrowDownUp size={14} className="inline ml-1" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort('createdAt')} className="cursor-pointer hover:bg-secondary">
                Date {sortField === 'createdAt' && (
                  <ArrowDownUp size={14} className="inline ml-1" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort('estimateValue')} className="cursor-pointer hover:bg-secondary text-right">
                Estimate (₹) {sortField === 'estimateValue' && (
                  <ArrowDownUp size={14} className="inline ml-1" />
                )}
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLeads.length > 0 ? (
              sortedLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {lead.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {lead.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{lead.location}</TableCell>
                  <TableCell>
                    {lead.projectType === 'new' ? 'New Construction' : 'Renovation'}
                  </TableCell>
                  <TableCell>{formatDate(lead.createdAt)}</TableCell>
                  <TableCell className="text-right">{lead.estimateValue.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View Details">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" title="Mark as Converted">
                        <Check size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" title="Mark as Lost">
                        <X size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No leads found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeadsTab;
