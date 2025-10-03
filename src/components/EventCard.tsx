import { Pin, Eye, User, Play, RefreshCw, AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { StreamEvent } from "@/types/event";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: StreamEvent;
  onTogglePin: (id: string) => void;
  onPreview: (event: StreamEvent) => void;
}

export const EventCard = ({ event, onTogglePin, onPreview }: EventCardProps) => {
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
        "overflow-hidden transition-all hover:shadow-lg",
        event.status === "not-live" && "opacity-60",
        hasError && "ring-2 ring-destructive/50"
      )}
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail - Larger */}
        <div className="relative flex-shrink-0">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-80 h-45 object-cover rounded-lg"
          />
          {event.status === "stream-freeze" && (
            <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center rounded-lg">
              <AlertTriangle className="h-10 w-10 text-destructive animate-pulse" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-card-foreground truncate">
                {event.title}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {event.viewers.toLocaleString()} viewers
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {event.admin}
                </span>
                <span>{formatDateTime(event.dateTime)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTogglePin(event.id)}
              className={cn(event.isPinned && "text-primary")}
            >
              <Pin className={cn("h-4 w-4", event.isPinned && "fill-current")} />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Badge className={getStatusColor(event.status)}>
              {getStatusLabel(event.status)}
            </Badge>

            {event.destinations.map((dest) => (
              <Badge
                key={dest.name}
                variant={dest.connected ? "secondary" : "destructive"}
                className="text-xs"
              >
                {dest.name}
                {dest.error && ` - ${dest.error}`}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" onClick={() => onPreview(event)}>
              Preview
            </Button>

            {event.status === "not-live" && (
              <Button size="sm" variant="secondary">
                <Play className="h-4 w-4 mr-2" />
                Start Stream
              </Button>
            )}

            {event.status === "stream-freeze" && (
              <Button size="sm" variant="secondary">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Stream
              </Button>
            )}

            {hasError && (
              <Button size="sm" variant="destructive">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
            )}

            {(event.status === "low-views" || event.status === "low-interaction") && (
              <Button size="sm" variant="outline">
                Boost Engagement
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
