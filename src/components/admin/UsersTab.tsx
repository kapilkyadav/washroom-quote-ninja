
import { useState } from 'react';
import { MoreHorizontal, User, Shield, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

// Sample user data
const sampleUsers = [
  { 
    id: 'U001',
    name: 'Amit Sharma', 
    email: 'amit@example.com', 
    role: 'admin',
    status: 'active',
    lastActive: '2023-08-14T10:30:00Z',
    avatar: '',
  },
  { 
    id: 'U002',
    name: 'Priya Patel', 
    email: 'priya@example.com', 
    role: 'manager',
    status: 'active',
    lastActive: '2023-08-13T16:45:00Z',
    avatar: '',
  },
  { 
    id: 'U003',
    name: 'Vikram Singh', 
    email: 'vikram@example.com', 
    role: 'sales',
    status: 'active',
    lastActive: '2023-08-12T14:20:00Z',
    avatar: '',
  },
  { 
    id: 'U004',
    name: 'Neha Gupta', 
    email: 'neha@example.com', 
    role: 'support',
    status: 'inactive',
    lastActive: '2023-08-01T09:15:00Z',
    avatar: '',
  },
  { 
    id: 'U005',
    name: 'Rahul Joshi', 
    email: 'rahul@example.com', 
    role: 'sales',
    status: 'active',
    lastActive: '2023-08-14T08:30:00Z',
    avatar: '',
  },
];

interface UsersTabProps {
  searchQuery: string;
}

const UsersTab = ({ searchQuery }: UsersTabProps) => {
  const [users, setUsers] = useState(sampleUsers);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>;
      case 'manager':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Manager</Badge>;
      case 'sales':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Sales</Badge>;
      case 'support':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Support</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  const getStatusIndicator = (status: string) => {
    return (
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <span>{status === 'active' ? 'Active' : 'Inactive'}</span>
      </div>
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">Add, edit, and manage user accounts</p>
        </div>
        
        <Button className="flex items-center gap-2">
          <UserPlus size={16} />
          Add User
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusIndicator(user.status)}</TableCell>
                  <TableCell>{formatDate(user.lastActive)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className={user.status === 'active' ? 'text-destructive' : 'text-green-600'}>
                          {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No users found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersTab;
