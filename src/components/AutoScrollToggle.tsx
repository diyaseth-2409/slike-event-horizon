import { Play, Pause } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface AutoScrollToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const AutoScrollToggle = ({ enabled, onToggle }: AutoScrollToggleProps) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
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
            Auto-Scroll On
          </>
        ) : (
          <>
            <Play className="h-5 w-5 mr-2" />
            Auto-Scroll Off
          </>
        )}
      </Button>
    </div>
  );
};
