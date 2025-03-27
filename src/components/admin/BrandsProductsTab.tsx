
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import BrandTable from '@/components/admin/brands/BrandTable';
import ProductTable from '@/components/admin/products/ProductTable';

const BrandsProductsTab = ({ searchQuery }: { searchQuery: string }) => {
  const [activeTab, setActiveTab] = useState<string>('brands');
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="brands" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="brands" className="mt-6">
          <BrandTable searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="products" className="mt-6">
          <ProductTable searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandsProductsTab;
