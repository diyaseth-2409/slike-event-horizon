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
  // Custom grid icons showing exact number of squares with better design
  const CustomGrid2 = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="6" width="6" height="6" rx="1"/>
      <rect x="14" y="6" width="6" height="6" rx="1"/>
    </svg>
  );

  const CustomGrid3 = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="5" height="6" rx="1"/>
      <rect x="9.5" y="6" width="5" height="6" rx="1"/>
      <rect x="17" y="6" width="5" height="6" rx="1"/>
    </svg>
  );

  const CustomGrid4 = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="6" height="6" rx="1"/>
      <rect x="14" y="4" width="6" height="6" rx="1"/>
      <rect x="4" y="14" width="6" height="6" rx="1"/>
      <rect x="14" y="14" width="6" height="6" rx="1"/>
    </svg>
  );

  const CustomGrid6 = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="5" height="6" rx="1"/>
      <rect x="9.5" y="4" width="5" height="6" rx="1"/>
      <rect x="17" y="4" width="5" height="6" rx="1"/>
      <rect x="2" y="14" width="5" height="6" rx="1"/>
      <rect x="9.5" y="14" width="5" height="6" rx="1"/>
      <rect x="17" y="14" width="5" height="6" rx="1"/>
    </svg>
  );

  const CustomGrid8 = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="2" width="4" height="4" rx="1"/>
      <rect x="6" y="2" width="4" height="4" rx="1"/>
      <rect x="11" y="2" width="4" height="4" rx="1"/>
      <rect x="16" y="2" width="4" height="4" rx="1"/>
      <rect x="1" y="8" width="4" height="4" rx="1"/>
      <rect x="6" y="8" width="4" height="4" rx="1"/>
      <rect x="11" y="8" width="4" height="4" rx="1"/>
      <rect x="16" y="8" width="4" height="4" rx="1"/>
    </svg>
  );

  const getGridIcon = (columns: number) => {
    switch (columns) {
      case 2:
        return <CustomGrid2 className="h-4 w-4" />;
      case 3:
        return <CustomGrid3 className="h-4 w-4" />;
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
          <CustomGrid2 className="h-4 w-4 mr-2" />
          2 videos per row
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onGridColumnsChange(3)} className="text-[10px]">
          <CustomGrid3 className="h-4 w-4 mr-2" />
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
