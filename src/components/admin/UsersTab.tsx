
import React from 'react';

interface UsersTabProps {
  searchQuery: string;
}

const UsersTab = ({ searchQuery }: UsersTabProps) => {
  return (
    <div className="p-6 bg-secondary/20 rounded-lg text-center">
      <h3 className="text-lg font-medium mb-2">Users Functionality</h3>
      <p className="text-muted-foreground">
        This section is a placeholder for the users functionality that will be built from scratch.
      </p>
    </div>
  );
};

export default UsersTab;
