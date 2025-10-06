import { X, Youtube, Facebook, Twitch, Linkedin, Instagram, Play, RefreshCw, RotateCcw, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { StreamEvent } from "@/types/event";

interface PreviewModalProps {
  event: StreamEvent | null;
  open: boolean;
  onClose: () => void;
}

const getDestinationIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "youtube":
      return <Youtube className="h-6 w-6" />;
    case "facebook":
      return <Facebook className="h-6 w-6" />;
    case "twitch":
      return <Twitch className="h-6 w-6" />;
    case "linkedin":
      return <Linkedin className="h-6 w-6" />;
    case "instagram":
      return <Instagram className="h-6 w-6" />;
    default:
      return <div className="h-6 w-6 rounded-full bg-primary" />;
  }
};

export const PreviewModal = ({ event, open, onClose }: PreviewModalProps) => {
  if (!event) return null;

  const calculateDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const formatStartTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const hasError = event.destinations.some((d) => !d.connected || d.error);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          {/* Large Video Preview */}
          <div className="relative bg-black" style={{ height: "70vh" }}>
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-contain"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 bg-black/60 hover:bg-black/80 transition-colors text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Info Panel Below Video */}
          <div className="bg-card p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">{event.title}</h2>
              <div className="flex items-center gap-6 text-muted-foreground mb-3">
                <span className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {event.viewers.toLocaleString()} viewers
                </span>
                <span>Admin: {event.admin}</span>
              </div>
              <p className="text-muted-foreground">
                The event started at <span className="font-semibold">{formatStartTime(event.dateTime)}</span> and has been live for <span className="font-semibold">{calculateDuration(event.dateTime)}</span>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Preview Stream
              </Button>

              {event.status === "not-live" && (
                <Button size="lg" variant="secondary">
                  <Play className="h-4 w-4 mr-2" />
                  Start Stream
                </Button>
              )}

              {event.status === "stream-freeze" && (
                <Button size="lg" variant="secondary">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Stream
                </Button>
              )}

              {hasError && (
                <Button size="lg" variant="destructive">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
              )}
            </div>

            {/* Social Destinations - Prominent Display */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-card-foreground">
                📡 Connected Destinations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.destinations.map((dest) => (
                  <div
                    key={dest.name}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${
                      dest.connected
                        ? "bg-success/10 border-success/30"
                        : "bg-destructive/10 border-destructive/30"
                    }`}
                  >
                    <div className={dest.connected ? "text-success" : "text-destructive"}>
                      {getDestinationIcon(dest.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg">{dest.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {dest.connected ? "✓ Live & Streaming" : `✗ ${dest.error || "Disconnected"}`}
                      </p>
                    </div>
                    <Badge
                      variant={dest.connected ? "default" : "destructive"}
                      className="text-xs font-semibold"
                    >
                      {dest.connected ? "ACTIVE" : "ERROR"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

