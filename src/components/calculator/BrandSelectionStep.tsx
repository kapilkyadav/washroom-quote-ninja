
import { useState, useEffect } from 'react';
import { CalculatorFormData, Brand } from '@/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BrandSelectionStepProps {
  formData: CalculatorFormData;
  updateFormData: (field: keyof CalculatorFormData, value: any) => void;
}

// Mock brands data - in a real app this would come from an API or database
const brands: Brand[] = [
  { id: 'brand1', name: 'Luxe Bathware', clientPrice: 1500, quotationPrice: 1200, margin: 20 },
  { id: 'brand2', name: 'Modern Plumbing', clientPrice: 1200, quotationPrice: 950, margin: 15 },
  { id: 'brand3', name: 'Premium Fixtures', clientPrice: 2000, quotationPrice: 1600, margin: 25 },
  { id: 'brand4', name: 'Elegant Washrooms', clientPrice: 1800, quotationPrice: 1450, margin: 22 },
  { id: 'brand5', name: 'Eco Bath Solutions', clientPrice: 1350, quotationPrice: 1100, margin: 18 },
  { id: 'brand6', name: 'Designer Washrooms', clientPrice: 2200, quotationPrice: 1750, margin: 30 },
];

const BrandSelectionStep = ({ formData, updateFormData }: BrandSelectionStepProps) => {
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(
    brands.find(brand => brand.id === formData.brandSelection) || null
  );
  
  // Animation for the brand cards
  useEffect(() => {
    const brandCards = document.querySelectorAll('.brand-card');
    brandCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('opacity-100', 'translate-y-0');
      }, 100 + index * 100);
    });
  }, []);
  
  const handleBrandSelect = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    setSelectedBrand(brand || null);
    updateFormData('brandSelection', brandId);
    setOpen(false);
  };
  
  return (
    <div className="space-y-6 py-4 animate-slide-in">
      <h2 className="heading-2 text-center mb-8">Select Your Preferred Brand</h2>
      
      <div className="max-w-3xl mx-auto mb-8">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-12 text-base"
            >
              {selectedBrand ? selectedBrand.name : "Select a brand..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search brands..." className="h-10" />
              <CommandList>
                <CommandEmpty>No brand found.</CommandEmpty>
                <CommandGroup>
                  {brands.map((brand) => (
                    <CommandItem
                      key={brand.id}
                      value={brand.id}
                      onSelect={handleBrandSelect}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedBrand?.id === brand.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {brand.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {brands.map((brand, index) => (
          <div 
            key={brand.id}
            className={`brand-card glass-card rounded-xl p-5 cursor-pointer transition-all duration-500 opacity-0 translate-y-4 ${
              selectedBrand?.id === brand.id ? 'ring-2 ring-primary shadow-md' : 'hover:scale-[1.02]'
            }`}
            onClick={() => handleBrandSelect(brand.id)}
          >
            <h3 className="font-medium text-lg mb-3">{brand.name}</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Quality Range</span>
              <span className="font-semibold">
                {brand.margin > 25 ? 'Premium' : brand.margin > 18 ? 'Standard' : 'Economic'}
              </span>
            </div>
            <div className="h-1 w-full bg-secondary rounded-full mb-3">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${(brand.margin / 30) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {brand.margin > 25 ? 'Premium' : brand.margin > 18 ? 'Standard' : 'Economic'} quality range
            </p>
          </div>
        ))}
      </div>
      
      {selectedBrand && (
        <div className="mt-8 p-5 bg-secondary/50 rounded-lg max-w-xl mx-auto animate-fade-in">
          <h3 className="font-medium mb-3">Selected Brand: {selectedBrand.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {selectedBrand.margin > 25 
              ? 'Premium brand offering top-quality materials and exceptional finishes.'
              : selectedBrand.margin > 18
              ? 'Standard brand with good quality and reliable performance.'
              : 'Economic brand with good value for budget-conscious projects.'}
          </p>
          <div className="flex justify-between text-sm border-t border-border pt-3">
            <span>Brand Quality:</span>
            <span className="font-medium">{selectedBrand.margin > 25 ? 'Premium' : selectedBrand.margin > 18 ? 'Standard' : 'Economic'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelectionStep;
