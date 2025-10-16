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
  // Custom grid icons for 4, 6, 8 columns
  const CustomGrid4 = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
    </svg>
  );

  const CustomGrid6 = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="5" height="5"/>
      <rect x="10" y="3" width="5" height="5"/>
      <rect x="17" y="3" width="4" height="5"/>
      <rect x="3" y="10" width="5" height="5"/>
      <rect x="10" y="10" width="5" height="5"/>
      <rect x="17" y="10" width="4" height="5"/>
      <rect x="3" y="17" width="5" height="4"/>
      <rect x="10" y="17" width="5" height="4"/>
      <rect x="17" y="17" width="4" height="4"/>
    </svg>
  );

  const CustomGrid8 = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="2.5" height="2.5"/>
      <rect x="5.5" y="2" width="2.5" height="2.5"/>
      <rect x="9" y="2" width="2.5" height="2.5"/>
      <rect x="12.5" y="2" width="2.5" height="2.5"/>
      <rect x="16" y="2" width="2.5" height="2.5"/>
      <rect x="19.5" y="2" width="2.5" height="2.5"/>
      <rect x="2" y="5.5" width="2.5" height="2.5"/>
      <rect x="5.5" y="5.5" width="2.5" height="2.5"/>
      <rect x="9" y="5.5" width="2.5" height="2.5"/>
      <rect x="12.5" y="5.5" width="2.5" height="2.5"/>
      <rect x="16" y="5.5" width="2.5" height="2.5"/>
      <rect x="19.5" y="5.5" width="2.5" height="2.5"/>
      <rect x="2" y="9" width="2.5" height="2.5"/>
      <rect x="5.5" y="9" width="2.5" height="2.5"/>
      <rect x="9" y="9" width="2.5" height="2.5"/>
      <rect x="12.5" y="9" width="2.5" height="2.5"/>
      <rect x="16" y="9" width="2.5" height="2.5"/>
      <rect x="19.5" y="9" width="2.5" height="2.5"/>
      <rect x="2" y="12.5" width="2.5" height="2.5"/>
      <rect x="5.5" y="12.5" width="2.5" height="2.5"/>
      <rect x="9" y="12.5" width="2.5" height="2.5"/>
      <rect x="12.5" y="12.5" width="2.5" height="2.5"/>
      <rect x="16" y="12.5" width="2.5" height="2.5"/>
      <rect x="19.5" y="12.5" width="2.5" height="2.5"/>
      <rect x="2" y="16" width="2.5" height="2.5"/>
      <rect x="5.5" y="16" width="2.5" height="2.5"/>
      <rect x="9" y="16" width="2.5" height="2.5"/>
      <rect x="12.5" y="16" width="2.5" height="2.5"/>
      <rect x="16" y="16" width="2.5" height="2.5"/>
      <rect x="19.5" y="16" width="2.5" height="2.5"/>
      <rect x="2" y="19.5" width="2.5" height="2.5"/>
      <rect x="5.5" y="19.5" width="2.5" height="2.5"/>
      <rect x="9" y="19.5" width="2.5" height="2.5"/>
      <rect x="12.5" y="19.5" width="2.5" height="2.5"/>
      <rect x="16" y="19.5" width="2.5" height="2.5"/>
      <rect x="19.5" y="19.5" width="2.5" height="2.5"/>
    </svg>
  );

  const getGridIcon = (columns: number) => {
    switch (columns) {
      case 2:
        return <Grid2x2 className="h-4 w-4" />;
      case 3:
        return <Grid3x3 className="h-4 w-4" />;
      case 4:
        return <CustomGrid4 className="h-4 w-4" />;
      case 6:
        return <CustomGrid6 className="h-4 w-4" />;
      case 8:
        return <CustomGrid8 className="h-4 w-4" />;
      default:
        return <LayoutGrid className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-[10px]">
          {getGridIcon(gridColumns)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        <DropdownMenuItem onClick={() => onGridColumnsChange(2)} className="text-[10px]">
          <Grid2x2 className="h-4 w-4 mr-2" />
          2 videos per row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGridColumnsChange(3)} className="text-[10px]">
          <Grid3x3 className="h-4 w-4 mr-2" />
          3 videos per row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGridColumnsChange(4)} className="text-[10px]">
          <CustomGrid4 className="h-4 w-4 mr-2" />
          4 videos per row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGridColumnsChange(6)} className="text-[10px]">
          <CustomGrid6 className="h-4 w-4 mr-2" />
          6 videos per row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGridColumnsChange(8)} className="text-[10px]">
          <CustomGrid8 className="h-4 w-4 mr-2" />
          8 videos per row
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
