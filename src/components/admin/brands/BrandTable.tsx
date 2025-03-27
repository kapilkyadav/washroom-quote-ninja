
import { useState } from 'react';
import { useBrands } from '@/hooks/use-brands';
import { BrandData } from '@/types';
import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import BrandDialog from './BrandDialog';

interface BrandTableProps {
  searchQuery: string;
}

const BrandTable = ({ searchQuery }: BrandTableProps) => {
  const { brands, isLoading, deleteBrand } = useBrands(searchQuery);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<BrandData | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const openEditDialog = (brand: BrandData) => {
    setEditingBrand(brand);
    setIsAddDialogOpen(true);
  };
  
  const openDeleteDialog = (brand: BrandData) => {
    setBrandToDelete(brand);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;
    
    await deleteBrand.mutateAsync(brandToDelete.id);
    setIsDeleteDialogOpen(false);
    setBrandToDelete(null);
  };
  
  // Calculate pagination
  const totalPages = brands ? Math.ceil(brands.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBrands = brands ? brands.slice(startIndex, startIndex + itemsPerPage) : [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Manage Brands</h3>
          <p className="text-sm text-muted-foreground">Add, edit, and manage brands</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus size={16} />
          Add Brand
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Brand Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading brands...
                </TableCell>
              </TableRow>
            ) : paginatedBrands.length > 0 ? (
              paginatedBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.id}</TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>{brand.description || '-'}</TableCell>
                  <TableCell>{new Date(brand.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(brand)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(brand)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No brands found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Brand Dialog for Add/Edit */}
      <BrandDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editingBrand={editingBrand}
        onClose={() => setEditingBrand(null)}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the brand "{brandToDelete?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBrand}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BrandTable;
