
import { useState } from 'react';
import { useProducts } from '@/hooks/use-products';
import { ProductData } from '@/types';
import { Edit, MoreHorizontal, Plus, Trash, Upload } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import ProductDialog from './ProductDialog';
import ImportDialog from './ImportDialog';

interface ProductTableProps {
  searchQuery: string;
  brandId?: number;
}

const ProductTable = ({ searchQuery, brandId }: ProductTableProps) => {
  const { products, isLoading, deleteProduct } = useProducts(searchQuery, brandId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductData | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const openEditDialog = (product: ProductData) => {
    setEditingProduct(product);
    setIsAddDialogOpen(true);
  };
  
  const openDeleteDialog = (product: ProductData) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    await deleteProduct.mutateAsync(productToDelete.id);
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };
  
  // Calculate pagination
  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products ? products.slice(startIndex, startIndex + itemsPerPage) : [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Manage Products</h3>
          <p className="text-sm text-muted-foreground">Add, edit, and manage products</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2" 
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload size={16} />
            Import from Google Sheets
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} />
            Add Product
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead className="text-right">Client Price</TableHead>
              <TableHead className="text-right">Quotation Price</TableHead>
              <TableHead className="text-right">Margin (%)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku || '-'}</TableCell>
                  <TableCell>{product.brands?.name || '-'}</TableCell>
                  <TableCell className="text-right">₹{product.client_price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{product.quotation_price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{product.margin.toFixed(2)}%</TableCell>
                  <TableCell>
                    <Badge variant={product.active ? "success" : "secondary"}>
                      {product.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(product)}
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
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  No products found matching your search.
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
      
      {/* Product Dialog for Add/Edit */}
      <ProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editingProduct={editingProduct}
        onClose={() => setEditingProduct(null)}
      />
      
      {/* Import Dialog for Google Sheets */}
      <ImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productToDelete?.name}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProduct}
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

export default ProductTable;
