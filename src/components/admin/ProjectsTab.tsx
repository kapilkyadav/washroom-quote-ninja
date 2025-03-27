
import React from 'react';

interface ProjectsTabProps {
  searchQuery: string;
}

const ProjectsTab = ({ searchQuery }: ProjectsTabProps) => {
  return (
    <div className="p-6 bg-secondary/20 rounded-lg text-center">
      <h3 className="text-lg font-medium mb-2">Projects Functionality</h3>
      <p className="text-muted-foreground">
        This section is a placeholder for the projects functionality that will be built from scratch.
      </p>
    </div>
  );
};

export default ProjectsTab;
