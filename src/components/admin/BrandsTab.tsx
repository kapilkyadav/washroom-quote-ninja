
import React from 'react';

interface BrandsTabProps {
  searchQuery: string;
}

const BrandsTab = ({ searchQuery }: BrandsTabProps) => {
  return (
    <div className="p-6 bg-secondary/20 rounded-lg text-center">
      <h3 className="text-lg font-medium mb-2">Brands Functionality Removed</h3>
      <p className="text-muted-foreground">
        The brands functionality has been removed and will be rebuilt from scratch.
      </p>
    </div>
  );
};

export default BrandsTab;
