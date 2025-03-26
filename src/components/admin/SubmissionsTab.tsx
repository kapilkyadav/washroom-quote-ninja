
import { useState } from 'react';
import { format } from 'date-fns';
import { DownloadCloud, User, ChevronDown, ChevronUp, MoreHorizontal, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { CalculatorFormData } from '@/types';

interface SubmissionsTabProps {
  searchQuery: string;
}

interface Submission {
  id: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  estimateAmount: number;
  status: 'new' | 'contacted' | 'qualified' | 'not-interested';
  submittedAt: string;
  formData: CalculatorFormData;
}

const sampleSubmissions: Submission[] = [
  {
    id: 'SUB001',
    customerDetails: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
    },
    estimateAmount: 135000,
    status: 'new',
    submittedAt: '2023-08-15T10:30:00Z',
    formData: {
      projectType: 'new',
      dimensions: {
        length: 8,
        width: 6,
        height: 9,
      },
      electricalFixtures: {
        ledMirror: true,
        exhaustFan: true,
        waterHeater: false,
      },
      plumbingRequirements: 'complete',
      additionalFixtures: {
        showerPartition: true,
        vanity: true,
        bathtub: false,
        jacuzzi: false,
      },
      projectTimeline: 'standard',
      brandSelection: 'Premium Collection',
      customerDetails: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
      },
    },
  },
  {
    id: 'SUB002',
    customerDetails: {
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 87654 32109',
      location: 'Ahmedabad, Gujarat',
    },
    estimateAmount: 95000,
    status: 'contacted',
    submittedAt: '2023-08-14T15:45:00Z',
    formData: {
      projectType: 'renovation',
      dimensions: {
        length: 7,
        width: 5,
        height: 9,
      },
      electricalFixtures: {
        ledMirror: true,
        exhaustFan: true,
        waterHeater: true,
      },
      plumbingRequirements: 'fixtureOnly',
      additionalFixtures: {
        showerPartition: true,
        vanity: false,
        bathtub: false,
        jacuzzi: false,
      },
      projectTimeline: 'flexible',
      brandSelection: 'Standard Series',
      customerDetails: {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '+91 87654 32109',
        location: 'Ahmedabad, Gujarat',
      },
    },
  },
  {
    id: 'SUB003',
    customerDetails: {
      name: 'Amit Singh',
      email: 'amit.singh@example.com',
      phone: '+91 76543 21098',
      location: 'Delhi, NCR',
    },
    estimateAmount: 215000,
    status: 'qualified',
    submittedAt: '2023-08-13T09:15:00Z',
    formData: {
      projectType: 'new',
      dimensions: {
        length: 10,
        width: 8,
        height: 9,
      },
      electricalFixtures: {
        ledMirror: true,
        exhaustFan: true,
        waterHeater: true,
      },
      plumbingRequirements: 'complete',
      additionalFixtures: {
        showerPartition: true,
        vanity: true,
        bathtub: true,
        jacuzzi: false,
      },
      projectTimeline: 'standard',
      brandSelection: 'Luxury Line',
      customerDetails: {
        name: 'Amit Singh',
        email: 'amit.singh@example.com',
        phone: '+91 76543 21098',
        location: 'Delhi, NCR',
      },
    },
  },
  {
    id: 'SUB004',
    customerDetails: {
      name: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      phone: '+91 65432 10987',
      location: 'Bangalore, Karnataka',
    },
    estimateAmount: 75000,
    status: 'not-interested',
    submittedAt: '2023-08-12T14:20:00Z',
    formData: {
      projectType: 'renovation',
      dimensions: {
        length: 6,
        width: 4,
        height: 9,
      },
      electricalFixtures: {
        ledMirror: false,
        exhaustFan: true,
        waterHeater: false,
      },
      plumbingRequirements: 'fixtureOnly',
      additionalFixtures: {
        showerPartition: false,
        vanity: true,
        bathtub: false,
        jacuzzi: false,
      },
      projectTimeline: 'flexible',
      brandSelection: 'Budget Range',
      customerDetails: {
        name: 'Neha Gupta',
        email: 'neha.gupta@example.com',
        phone: '+91 65432 10987',
        location: 'Bangalore, Karnataka',
      },
    },
  },
];

const SubmissionsTab = ({ searchQuery }: SubmissionsTabProps) => {
  const [submissions, setSubmissions] = useState<Submission[]>(sampleSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP p');
  };

  // Open submission details dialog
  const openSubmissionDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsViewDialogOpen(true);
  };

  // Update submission status
  const updateStatus = (id: string, status: 'new' | 'contacted' | 'qualified' | 'not-interested') => {
    setSubmissions(prev =>
      prev.map(submission => (submission.id === id ? { ...submission, status } : submission))
    );

    toast({
      title: "Status Updated",
      description: `Submission status has been updated to ${status}.`,
    });
  };

  // Filter submissions based on search query and status filter
  let filteredSubmissions = submissions.filter(submission => {
    const matchesSearch =
      submission.customerDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.customerDetails.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.customerDetails.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.customerDetails.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || submission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort submissions based on selected field and direction
  filteredSubmissions = [...filteredSubmissions].sort((a, b) => {
    let valueA, valueB;

    switch (sortField) {
      case 'name':
        valueA = a.customerDetails.name.toLowerCase();
        valueB = b.customerDetails.name.toLowerCase();
        break;
      case 'estimateAmount':
        valueA = a.estimateAmount;
        valueB = b.estimateAmount;
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'submittedAt':
      default:
        valueA = new Date(a.submittedAt).getTime();
        valueB = new Date(b.submittedAt).getTime();
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Qualified</Badge>;
      case 'not-interested':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not Interested</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Export submissions
  const exportSubmissions = () => {
    try {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Location', 'Estimate Amount', 'Status', 'Submitted Date'];
      
      const csvData = [
        headers,
        ...filteredSubmissions.map(submission => [
          submission.id,
          submission.customerDetails.name,
          submission.customerDetails.email,
          submission.customerDetails.phone,
          submission.customerDetails.location,
          `₹${submission.estimateAmount.toLocaleString()}`,
          submission.status,
          formatDate(submission.submittedAt)
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `calculator-submissions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Submissions data has been exported to CSV.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Calculator Submissions</h3>
          <p className="text-sm text-muted-foreground">View and manage customer calculator submissions</p>
        </div>
        
        <Button 
          className="flex items-center gap-2"
          variant="outline"
          onClick={exportSubmissions}
        >
          <DownloadCloud size={16} />
          Export CSV
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter Status:</span>
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="not-interested">Not Interested</option>
          </select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <User size={14} />
                  Customer
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer text-right"
                onClick={() => handleSort('estimateAmount')}
              >
                <div className="flex items-center justify-end gap-1">
                  Estimate Amount
                  {sortField === 'estimateAmount' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('submittedAt')}
              >
                <div className="flex items-center gap-1">
                  Submitted
                  {sortField === 'submittedAt' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <>
                  <TableRow key={submission.id} className={expandedRows[submission.id] ? 'border-b-0' : ''}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleRowExpansion(submission.id)}
                      >
                        {expandedRows[submission.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{submission.customerDetails.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {submission.id}</div>
                    </TableCell>
                    <TableCell className="text-right">₹{submission.estimateAmount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openSubmissionDetails(submission)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(submission.id, 'new')}>
                            Mark as New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(submission.id, 'contacted')}>
                            Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(submission.id, 'qualified')}>
                            Mark as Qualified
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(submission.id, 'not-interested')}>
                            Mark as Not Interested
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedRows[submission.id] && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={6} className="p-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail size={12} />
                              Email:
                            </div>
                            <div>{submission.customerDetails.email}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone size={12} />
                              Phone:
                            </div>
                            <div>{submission.customerDetails.phone}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin size={12} />
                              Location:
                            </div>
                            <div>{submission.customerDetails.location}</div>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Project Details</h4>
                            <ul className="space-y-1 text-sm">
                              <li>Type: {submission.formData.projectType === 'new' ? 'New Construction' : 'Renovation'}</li>
                              <li>Dimensions: {submission.formData.dimensions.length}' x {submission.formData.dimensions.width}' x {submission.formData.dimensions.height}'</li>
                              <li>Timeline: {submission.formData.projectTimeline === 'standard' ? 'Standard' : 'Flexible'}</li>
                              <li>Brand: {submission.formData.brandSelection}</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Selected Features</h4>
                            <ul className="space-y-1 text-sm">
                              <li>Plumbing: {submission.formData.plumbingRequirements === 'complete' ? 'Complete Installation' : 'Fixture Only'}</li>
                              <li>
                                Electrical: {Object.entries(submission.formData.electricalFixtures)
                                  .filter(([_, selected]) => selected)
                                  .map(([fixture]) => fixture.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
                                  .join(', ') || 'None'}
                              </li>
                              <li>
                                Fixtures: {Object.entries(submission.formData.additionalFixtures)
                                  .filter(([_, selected]) => selected)
                                  .map(([fixture]) => fixture.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
                                  .join(', ') || 'None'}
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openSubmissionDetails(submission)}
                          >
                            View Full Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No submissions found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Submission Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Complete information for submission {selectedSubmission?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="mt-4 space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-lg border">
                <div>
                  <h3 className="text-lg font-semibold">{selectedSubmission.customerDetails.name}</h3>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-muted-foreground" />
                      <span>{selectedSubmission.customerDetails.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-muted-foreground" />
                      <span>{selectedSubmission.customerDetails.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span>{selectedSubmission.customerDetails.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Submission ID</div>
                  <div className="font-mono">{selectedSubmission.id}</div>
                  <div className="text-sm text-muted-foreground mt-2">Submitted on</div>
                  <div>{formatDate(selectedSubmission.submittedAt)}</div>
                  <div className="mt-2">
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Project Information</h4>
                  <div className="rounded-lg border p-4 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Project Type</p>
                      <p className="font-medium">
                        {selectedSubmission.formData.projectType === 'new' ? 'New Construction' : 'Renovation'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Dimensions</p>
                      <p className="font-medium">
                        {selectedSubmission.formData.dimensions.length}' x {selectedSubmission.formData.dimensions.width}' x {selectedSubmission.formData.dimensions.height}'
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Project Timeline</p>
                      <p className="font-medium">
                        {selectedSubmission.formData.projectTimeline === 'standard' ? 'Standard Timeline' : 'Flexible Timeline'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Plumbing Requirements</p>
                      <p className="font-medium">
                        {selectedSubmission.formData.plumbingRequirements === 'complete' ? 'Complete Installation' : 'Fixture Only'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Brand</p>
                      <p className="font-medium">{selectedSubmission.formData.brandSelection}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Selected Fixtures</h4>
                  <div className="rounded-lg border p-4 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Electrical Fixtures</p>
                      <ul className="mt-1 space-y-1">
                        {Object.entries(selectedSubmission.formData.electricalFixtures).map(([fixture, selected], index) => (
                          <li key={index} className={`flex items-center gap-2 ${!selected && 'text-muted-foreground line-through'}`}>
                            <span className={`h-2 w-2 rounded-full ${selected ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            {fixture.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Additional Fixtures</p>
                      <ul className="mt-1 space-y-1">
                        {Object.entries(selectedSubmission.formData.additionalFixtures).map(([fixture, selected], index) => (
                          <li key={index} className={`flex items-center gap-2 ${!selected && 'text-muted-foreground line-through'}`}>
                            <span className={`h-2 w-2 rounded-full ${selected ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            {fixture.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground">Estimate Amount</p>
                    <p className="text-3xl font-bold mt-1">₹{selectedSubmission.estimateAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => updateStatus(selectedSubmission.id, 'contacted')}
                  >
                    Mark as Contacted
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => updateStatus(selectedSubmission.id, 'qualified')}
                  >
                    Mark as Qualified
                  </Button>
                </div>
                
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionsTab;
