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
  viewType?: "vertical" | "horizontal";
  gridColumns?: number;
}

export const EventCard = ({ event, onTogglePin, onPreview, isExpanded, viewType = "vertical", gridColumns = 4 }: EventCardProps) => {
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
        "overflow-hidden transition-all hover:shadow-lg flex flex-col cursor-pointer",
        event.status === "not-live" && "opacity-60",
        hasError && "ring-2 ring-destructive/50"
      )}
    >
      {/* Thumbnail - Clickable */}
      <div 
        className={cn(
          "relative w-full group aspect-video"
        )}
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

        {/* Pin Button - Only visible on hover */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(event.id);
          }}
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Pin className={cn("h-4 w-4 text-white", event.isPinned && "fill-current")} />
        </Button>
      </div>

      {/* Content Below Video */}
      <div className={cn(
        "space-y-2 flex-shrink-0",
        viewType === "horizontal" ? "p-1 space-y-0.5" : 
        (gridColumns >= 8) ? "p-1 space-y-0.5" : 
        (gridColumns >= 6) ? "p-1.5 space-y-0.5" : "p-2 sm:p-3 space-y-2 sm:space-y-3"
      )}>
        {/* Event Title */}
        <h3 className={cn(
          "font-semibold text-card-foreground",
          viewType === "horizontal" ? "text-sm line-clamp-1" : 
          (gridColumns >= 8) ? "text-xs line-clamp-1" :
          (gridColumns >= 6) ? "text-xs line-clamp-1" : "text-xs sm:text-sm line-clamp-2"
        )}>
          {event.title}
        </h3>

        {/* Event Details Row - Only show when expanded */}
        {isExpanded && (
          <div className={cn(
            "flex flex-col",
            (gridColumns >= 6) ? "gap-0.5" : "gap-1 sm:gap-2"
          )}>
            {gridColumns >= 6 ? (
              // Ultra compact layout for narrow grids
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground truncate">
                  {gridColumns >= 8 ? event.admin.split(' ')[0] : event.admin}
                </span>
                <span className="text-xs text-muted-foreground">
                  •
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {event.eventId}
                </span>
              </div>
            ) : (
              // Normal layout for wider grids
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs text-muted-foreground truncate">
                    {event.admin}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    •
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {event.eventId}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Volume2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">
                    {event.viewers > 0 ? `${event.viewers} viewers` : 'Offline'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Destinations and Source Type - Only show when expanded */}
        {isExpanded && (
          <div className={cn(
            "flex flex-col sm:flex-row sm:items-center sm:justify-between",
            (gridColumns >= 6) ? "gap-0.5" : "gap-2"
          )}>
            {gridColumns >= 6 ? (
              // Ultra compact layout for narrow grids
              <div className="flex items-center gap-1 flex-wrap">
                {event.destinations.slice(0, 1).map((dest) => (
                  <Badge
                    key={dest.name}
                    variant={dest.connected ? "secondary" : "destructive"}
                    className={cn(
                      "text-xs flex-shrink-0",
                      gridColumns >= 8 ? "h-2.5 px-0.5" : "h-3 px-1"
                    )}
                  >
                    {gridColumns >= 8 ? dest.name.slice(0, 3) : dest.name}
                  </Badge>
                ))}
                {event.destinations.length > 1 && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs flex-shrink-0",
                      gridColumns >= 8 ? "h-2.5 px-0.5" : "h-3 px-1"
                    )}
                  >
                    +{event.destinations.length - 1}
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs flex-shrink-0",
                    gridColumns >= 8 ? "h-2.5 px-0.5" : "h-3 px-1"
                  )}
                >
                  {gridColumns >= 8 ? event.sourceType.slice(0, 3) : event.sourceType}
                </Badge>
              </div>
            ) : (
              // Normal layout for wider grids
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                {/* Social Destinations */}
                <div className="flex items-center gap-1 flex-wrap">
                  {event.destinations.slice(0, 3).map((dest) => (
                    <Badge
                      key={dest.name}
                      variant={dest.connected ? "secondary" : "destructive"}
                      className="text-xs h-5 px-1.5 flex-shrink-0"
                    >
                      {dest.name}
                    </Badge>
                  ))}
                  {event.destinations.length > 3 && (
                    <Badge variant="outline" className="text-xs h-5 px-1.5 flex-shrink-0">
                      +{event.destinations.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Source Type */}
                <Badge variant="outline" className="text-xs h-5 px-1.5 flex-shrink-0">
                  {event.sourceType}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

