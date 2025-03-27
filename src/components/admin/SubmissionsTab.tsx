
import React from 'react';

interface SubmissionsTabProps {
  searchQuery: string;
}

const SubmissionsTab = ({ searchQuery }: SubmissionsTabProps) => {
  return (
    <div className="p-6 bg-secondary/20 rounded-lg text-center">
      <h3 className="text-lg font-medium mb-2">Quote Submissions Functionality</h3>
      <p className="text-muted-foreground">
        This section is a placeholder for the quote submissions functionality that will be built from scratch.
      </p>
    </div>
  );
};

export default SubmissionsTab;
