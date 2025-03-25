
import { useState } from 'react';
import { MoreHorizontal, ClipboardCheck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sampleProjects = [
  {
    id: 'P001',
    title: 'Modern Bathroom Renovation',
    customer: 'Arjun Mehta',
    location: 'Mumbai, Maharashtra',
    startDate: '2023-09-05',
    endDate: '2023-10-10',
    status: 'in-progress',
    value: 65000,
    completion: 40,
  },
  {
    id: 'P002',
    title: 'Luxury Master Bathroom',
    customer: 'Neha Gupta',
    location: 'Delhi, NCR',
    startDate: '2023-08-15',
    endDate: '2023-09-30',
    status: 'in-progress',
    value: 120000,
    completion: 75,
  },
  {
    id: 'P003',
    title: 'Small Bathroom Upgrade',
    customer: 'Rahul Singh',
    location: 'Bangalore, Karnataka',
    startDate: '2023-07-20',
    endDate: '2023-08-25',
    status: 'completed',
    value: 48000,
    completion: 100,
  },
  {
    id: 'P004',
    title: 'Hotel Suite Washrooms',
    customer: 'Royal Suites Ltd',
    location: 'Goa',
    startDate: '2023-10-01',
    endDate: '2023-12-15',
    status: 'pending',
    value: 350000,
    completion: 0,
  },
  {
    id: 'P005',
    title: 'Eco-Friendly Bathroom Installation',
    customer: 'Green Home Solutions',
    location: 'Hyderabad, Telangana',
    startDate: '2023-09-15',
    endDate: '2023-10-30',
    status: 'in-progress',
    value: 85000,
    completion: 25,
  },
];

interface ProjectsTabProps {
  searchQuery: string;
}

const ProjectsTab = ({ searchQuery }: ProjectsTabProps) => {
  const [projects, setProjects] = useState(sampleProjects);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
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
          <h3 className="text-lg font-semibold">Project Management</h3>
          <p className="text-sm text-muted-foreground">Track ongoing projects and completions</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{project.title}</CardTitle>
                      <CardDescription>{project.customer}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Project</DropdownMenuItem>
                        <DropdownMenuItem>Generate Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="text-sm text-muted-foreground mb-3">{project.location}</div>
                  <div className="flex justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Start: {formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>End: {formatDate(project.endDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Progress:</span>
                    <span className="text-sm font-medium">{project.completion}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2">
                  <div className="font-medium">₹{project.value.toLocaleString()}</div>
                  {getStatusBadge(project.status)}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No projects found matching your search criteria.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead className="text-right">Value (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.customer}</TableCell>
                    <TableCell>{project.location}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span>{formatDate(project.startDate)}</span>
                        <span className="text-muted-foreground">to</span>
                        <span>{formatDate(project.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{project.value.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${project.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">{project.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Project</DropdownMenuItem>
                          <DropdownMenuItem>Generate Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No projects found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default ProjectsTab;
