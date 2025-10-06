import { Pin, AlertTriangle, Volume2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { StreamEvent } from "@/types/event";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: StreamEvent;
  onTogglePin: (id: string) => void;
  onPreview: (event: StreamEvent) => void;
  isExpanded: boolean;
}

export const EventCard = ({ event, onTogglePin, onPreview, isExpanded }: EventCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-success text-success-foreground";
      case "low-views":
      case "low-interaction":
        return "bg-warning text-warning-foreground";
      case "stream-freeze":
      case "error":
        return "bg-destructive text-destructive-foreground";
      case "not-live":
        return "bg-inactive text-inactive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasError = event.destinations.some((d) => !d.connected || d.error);

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg flex flex-col h-full cursor-pointer",
        event.status === "not-live" && "opacity-60",
        hasError && "ring-2 ring-destructive/50"
      )}
    >
      {/* Thumbnail - Clickable */}
      <div 
        className="relative w-full aspect-video group"
        onClick={() => onPreview(event)}
      >
        <img
          src={event.thumbnail}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {event.status === "stream-freeze" && (
          <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-destructive animate-pulse" />
          </div>
        )}
        
        {/* Status Badge - Top Left */}
        <div className="absolute top-2 left-2">
          <Badge className={cn(getStatusColor(event.status), "text-xs")}>
            {getStatusLabel(event.status)}
          </Badge>
        </div>

        {/* Pin Button - Top Right */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(event.id);
          }}
          className={cn(
            "absolute top-2 right-2 bg-black/40 hover:bg-black/60",
            event.isPinned && "text-primary"
          )}
        >
          <Pin className={cn("h-4 w-4 text-white", event.isPinned && "fill-current")} />
        </Button>

        {/* Destination Badges - Top Right (below pin) */}
        <div className="absolute top-12 right-2 flex flex-col gap-1">
          {event.destinations.slice(0, 2).map((dest) => (
            <Badge
              key={dest.name}
              variant={dest.connected ? "secondary" : "destructive"}
              className="text-xs py-0 h-5"
            >
              {dest.name}
            </Badge>
          ))}
        </div>

        {/* Bottom Overlay with Product and Author */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs mb-1">
                {event.destinations[0]?.name || "Product"}
              </p>
              <p className="text-white font-semibold text-sm truncate">
                {event.admin}
              </p>
            </div>
            
            {/* Sound Indicator */}
            <div className="flex items-center gap-1 bg-success/20 px-2 py-1 rounded">
              <Volume2 className="h-3 w-3 text-success" />
              <div className="flex items-center gap-0.5">
                <div className="w-0.5 h-2 bg-success rounded animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-0.5 h-3 bg-success rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-0.5 h-4 bg-success rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="w-0.5 h-3 bg-success rounded animate-pulse" style={{ animationDelay: '450ms' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Only Title when collapsed */}
      {isExpanded && (
        <div className="p-2">
          <h3 className="font-semibold text-sm text-card-foreground line-clamp-2">
            {event.title}
          </h3>
        </div>
      )}
    </Card>
  );
};

