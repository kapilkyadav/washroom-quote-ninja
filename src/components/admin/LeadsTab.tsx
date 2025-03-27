
import React from 'react';

interface LeadsTabProps {
  searchQuery: string;
}

const LeadsTab = ({ searchQuery }: LeadsTabProps) => {
  return (
    <div className="p-6 bg-secondary/20 rounded-lg text-center">
      <h3 className="text-lg font-medium mb-2">Leads Functionality</h3>
      <p className="text-muted-foreground">
        This section is a placeholder for the leads functionality that will be built from scratch.
      </p>
    </div>
  );
};

export default LeadsTab;
