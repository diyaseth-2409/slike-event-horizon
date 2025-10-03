import { X, Youtube, Facebook, Twitch, Linkedin, Instagram } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
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
              <div className="flex items-center gap-6 text-muted-foreground">
                <span className="text-lg">{event.viewers.toLocaleString()} viewers</span>
                <span>Admin: {event.admin}</span>
                <span>{new Date(event.dateTime).toLocaleString()}</span>
              </div>
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

