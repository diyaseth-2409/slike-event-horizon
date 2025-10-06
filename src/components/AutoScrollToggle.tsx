import { Play, Pause, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

  return (
    <div className="fixed bottom-8 right-8 z-50 flex gap-2">
      <Button
        onClick={onToggle}
        size="lg"
        className={cn(
          "rounded-full shadow-lg transition-all hover:scale-105",
          enabled && "bg-success hover:bg-success/90"
        )}
      >
        {enabled ? (
          <>
            <Pause className="h-5 w-5 mr-2" />
            Auto-Scroll On ({interval}s)
          </>
        ) : (
          <>
            <Play className="h-5 w-5 mr-2" />
            Auto-Scroll Off
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full shadow-lg transition-all hover:scale-105"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover">
          {intervals.map((int) => (
            <DropdownMenuItem
              key={int}
              onClick={() => onIntervalChange(int)}
              className={cn(interval === int && "bg-accent")}
            >
              {int} seconds
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
