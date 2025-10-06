import { Pin, Eye, User, Play, RefreshCw, AlertTriangle, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { StreamEvent } from "@/types/event";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EventCardProps {
  event: StreamEvent;
  onTogglePin: (id: string) => void;
  onPreview: (event: StreamEvent) => void;
}

export const EventCard = ({ event, onTogglePin, onPreview }: EventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
        "overflow-hidden transition-all hover:shadow-lg flex flex-col h-full",
        event.status === "not-live" && "opacity-60",
        hasError && "ring-2 ring-destructive/50"
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video">
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTogglePin(event.id)}
          className={cn(
            "absolute top-2 right-2 bg-black/40 hover:bg-black/60",
            event.isPinned && "text-primary"
          )}
        >
          <Pin className={cn("h-4 w-4 text-white", event.isPinned && "fill-current")} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-2 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm text-card-foreground line-clamp-2 flex-1">
            {event.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 shrink-0"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1 mb-2">
          <Badge className={cn(getStatusColor(event.status), "text-xs py-0 h-5")}>
            {getStatusLabel(event.status)}
          </Badge>
          {event.destinations.slice(0, 2).map((dest) => (
            <Badge
              key={dest.name}
              variant={dest.connected ? "secondary" : "destructive"}
              className="text-xs py-0 h-5"
            >
              {dest.name}
            </Badge>
          ))}
          {event.destinations.length > 2 && (
            <Badge variant="outline" className="text-xs py-0 h-5">
              +{event.destinations.length - 2}
            </Badge>
          )}
        </div>

        {isExpanded && (
          <>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {event.viewers.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {event.admin}
              </span>
            </div>
            <span className="text-xs text-muted-foreground mb-2">{formatDateTime(event.dateTime)}</span>
          </>
        )}

        <div className="flex gap-1 mt-auto">
          <Button size="sm" onClick={() => onPreview(event)} className="flex-1 h-7 text-xs">
            Preview
          </Button>

          {event.status === "not-live" && (
            <Button size="sm" variant="secondary" className="h-7 w-7 p-0">
              <Play className="h-3 w-3" />
            </Button>
          )}

          {event.status === "stream-freeze" && (
            <Button size="sm" variant="secondary" className="h-7 w-7 p-0">
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}

          {hasError && (
            <Button size="sm" variant="destructive" className="h-7 w-7 p-0">
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

