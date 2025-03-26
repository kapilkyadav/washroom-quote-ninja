
import React from 'react';
import { Edit, Trash, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface FixtureData {
  name: string;
  price: number;
  description?: string;
}

interface EditValues {
  name: string;
  price: number;
  description: string;
}

interface FixturesTableProps {
  fixtures: [string, FixtureData][];
  isEditing: string | null;
  editValues: EditValues;
  handleEditStart: (id: string, fixture: FixtureData) => void;
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveEdit: (id: string) => void;
  handleCancelEdit: () => void;
  handleDeleteFixture: (id: string, name: string) => void;
}

const FixturesTable = ({
  fixtures,
  isEditing,
  editValues,
  handleEditStart,
  handleEditChange,
  handleSaveEdit,
  handleCancelEdit,
  handleDeleteFixture
}: FixturesTableProps) => {
  if (fixtures.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Price (₹)</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No fixtures found matching your search.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="text-right">Price (₹)</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fixtures.map(([id, fixture]) => (
            <TableRow key={id}>
              <TableCell>
                {isEditing === id ? (
                  <Input 
                    name="name"
                    value={editValues.name}
                    onChange={handleEditChange}
                  />
                ) : (
                  fixture.name
                )}
              </TableCell>
              <TableCell className="font-mono text-sm">{id}</TableCell>
              <TableCell className="text-right">
                {isEditing === id ? (
                  <Input 
                    name="price"
                    type="number"
                    value={editValues.price}
                    onChange={handleEditChange}
                    className="w-24 ml-auto"
                  />
                ) : (
                  `₹${fixture.price.toLocaleString()}`
                )}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {isEditing === id ? (
                  <Textarea 
                    name="description"
                    value={editValues.description}
                    onChange={handleEditChange}
                    rows={2}
                  />
                ) : (
                  fixture.description
                )}
              </TableCell>
              <TableCell>
                {isEditing === id ? (
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSaveEdit(id)}
                      className="h-8 w-8 p-0"
                    >
                      <Save className="h-4 w-4" />
                      <span className="sr-only">Save</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCancelEdit}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditStart(id, fixture)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteFixture(id, fixture.name)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FixturesTable;
