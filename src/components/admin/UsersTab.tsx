
import { useState, useEffect } from 'react';
import { MoreHorizontal, User, Shield, UserPlus, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import UserForm from './UserForm';
import ChangeRoleDialog from './ChangeRoleDialog';

interface UserData {
  id: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  createdAt: string;
  name: string;
  avatar: string;
}

interface UsersTabProps {
  searchQuery: string;
}

const UsersTab = ({ searchQuery }: UsersTabProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [processingAction, setProcessingAction] = useState(false);
  
  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      const formattedUsers: UserData[] = data.users.map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
        role: user.user_metadata?.role || 'user',
        status: user.banned ? 'inactive' : 'active',
        lastActive: user.last_sign_in_at || user.updated_at || user.created_at,
        createdAt: user.created_at,
        avatar: user.user_metadata?.avatar_url || '',
      }));
      
      setUsers(formattedUsers);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users");
      
      // Fallback to sample data for development/demo purposes
      setUsers(sampleUsers.map(user => ({
        ...user,
        createdAt: new Date().toISOString(),
      })));
      
      toast({
        title: "Error loading users",
        description: "Using sample data. " + (err.message || "Something went wrong"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Toggle user status (active/inactive)
  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    setProcessingAction(true);
    
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { banned: newStatus === 'inactive' }
      );
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast({
        title: `User ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
        description: `User has been ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (err: any) {
      console.error(`Error ${currentStatus === 'active' ? 'deactivating' : 'activating'} user:`, err);
      toast({
        title: `Error ${currentStatus === 'active' ? 'deactivating' : 'activating'} user`,
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };
  
  // Delete user
  const deleteUser = async () => {
    if (!selectedUser) return;
    
    setProcessingAction(true);
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);
      
      if (error) throw error;
      
      // Remove from local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      toast({
        title: "User deleted",
        description: "User has been permanently deleted",
      });
      
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast({
        title: "Error deleting user",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };
  
  // Open change role dialog
  const openChangeRoleDialog = (user: UserData) => {
    setSelectedUser(user);
    setIsChangeRoleOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
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
        
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddUserOpen(true)}
        >
          <UserPlus size={16} />
          Add User
        </Button>
      </div>
      
      {error && !loading && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive flex items-center gap-3">
          <AlertTriangle size={18} />
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading users...</span>
        </div>
      ) : (
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
                          <div className="text-xs text-muted-foreground truncate max-w-[120px]">ID: {user.id}</div>
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
                          <DropdownMenuItem onClick={() => console.log('View profile', user.id)}>
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openChangeRoleDialog(user)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className={user.status === 'active' ? 'text-destructive' : 'text-green-600'}
                            onClick={() => toggleUserStatus(user.id, user.status)}
                            disabled={processingAction}
                          >
                            {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => openDeleteDialog(user)}
                            disabled={processingAction}
                          >
                            Delete User
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
      )}
      
      {/* Add User Dialog */}
      <UserForm 
        open={isAddUserOpen} 
        onOpenChange={setIsAddUserOpen} 
        onSuccess={fetchUsers} 
      />
      
      {/* Change Role Dialog */}
      {selectedUser && (
        <ChangeRoleDialog
          open={isChangeRoleOpen}
          onOpenChange={setIsChangeRoleOpen}
          userId={selectedUser.id}
          currentRole={selectedUser.role}
          onSuccess={fetchUsers}
        />
      )}
      
      {/* Delete User Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user "{selectedUser?.name}" 
              ({selectedUser?.email}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingAction}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteUser}
              disabled={processingAction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processingAction ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Sample user data as fallback
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

export default UsersTab;
