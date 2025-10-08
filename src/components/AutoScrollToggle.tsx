import { Play, Pause, ChevronDown, Clock } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AutoScrollToggleProps {
  enabled: boolean;
  interval: number;
  onToggle: () => void;
  onIntervalChange: (interval: number) => void;
}

export const AutoScrollToggle = ({ enabled, interval, onToggle, onIntervalChange }: AutoScrollToggleProps) => {
  const intervals = [2, 5, 10, 15, 20, 30];

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening
    onToggle();
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <DropdownMenu>
        <div className="flex items-center">
          {/* Play/Pause Button */}
          <Button
            onClick={handleIconClick}
            size="lg"
            className={cn(
              "rounded-l-full rounded-r-none shadow-lg transition-all hover:scale-105 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 border-r-0",
              "flex items-center gap-2 px-4"
            )}
          >
            {enabled ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            {enabled ? (
              <>Auto-Scroll On ({interval}s)</>
            ) : (
              <>Auto-Scroll Off</>
            )}
          </Button>

          {/* Dropdown Button */}
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="rounded-r-full rounded-l-none shadow-lg transition-all hover:scale-105 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 border-l-0 px-3"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-600 text-white">
          <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Timer Settings
          </div>
          
          {intervals.map((int) => (
            <DropdownMenuItem
              key={int}
              onClick={() => onIntervalChange(int)}
              className={cn(
                "hover:bg-gray-700 focus:bg-gray-700",
                interval === int && "bg-gray-600"
              )}
            >
              {int} seconds
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
