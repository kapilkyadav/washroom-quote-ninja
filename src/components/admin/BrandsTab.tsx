
import { useState } from 'react';
import { Brand } from '@/types';
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
import { toast } from '@/hooks/use-toast';

// Sample data
const sampleBrands: Brand[] = [
  { id: '1', name: 'Premium Collection', clientPrice: 8500, quotationPrice: 12000, margin: 41.18 },
  { id: '2', name: 'Standard Series', clientPrice: 5200, quotationPrice: 7500, margin: 44.23 },
  { id: '3', name: 'Budget Range', clientPrice: 3800, quotationPrice: 5000, margin: 31.58 },
  { id: '4', name: 'Luxury Line', clientPrice: 12000, quotationPrice: 18000, margin: 50.00 },
  { id: '5', name: 'Eco Friendly', clientPrice: 6200, quotationPrice: 8800, margin: 41.94 },
];

interface BrandsTabProps {
  searchQuery: string;
}

const BrandsTab = ({ searchQuery }: BrandsTabProps) => {
  const [brands, setBrands] = useState<Brand[]>(sampleBrands);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  
  // Filter brands based on search query
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    // Here you would normally open a modal or form for editing
    toast({
      title: "Edit Brand",
      description: `Editing ${brand.name}`,
    });
  };
  
  const handleDelete = (brandId: string) => {
    // Here you would normally show a confirmation dialog
    setBrands(brands.filter(brand => brand.id !== brandId));
    toast({
      title: "Brand Deleted",
      description: "The brand has been removed",
      variant: "destructive",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Brands</h3>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Add Brand
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand Name</TableHead>
              <TableHead className="text-right">Client Price (₹)</TableHead>
              <TableHead className="text-right">Quotation Price (₹)</TableHead>
              <TableHead className="text-right">Margin (%)</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="text-right">{brand.clientPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{brand.quotationPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{brand.margin.toFixed(2)}%</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(brand)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(brand.id)}
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
    </div>
  );
};

export default BrandsTab;
