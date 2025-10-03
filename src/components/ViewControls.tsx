import { Grid2x2, Grid3x3, LayoutGrid } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ViewControlsProps {
  gridColumns: number;
  onGridColumnsChange: (columns: number) => void;
}

export const ViewControls = ({ gridColumns, onGridColumnsChange }: ViewControlsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutGrid className="h-4 w-4" />
          {gridColumns} per row
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuItem onClick={() => onGridColumnsChange(2)}>
          <Grid2x2 className="h-4 w-4 mr-2" />
          2 videos per row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGridColumnsChange(3)}>
          <Grid3x3 className="h-4 w-4 mr-2" />
          3 videos per row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGridColumnsChange(4)}>
          <LayoutGrid className="h-4 w-4 mr-2" />
          4 videos per row
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
