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
      return <Youtube className="h-5 w-5" />;
    case "facebook":
      return <Facebook className="h-5 w-5" />;
    case "twitch":
      return <Twitch className="h-5 w-5" />;
    case "linkedin":
      return <Linkedin className="h-5 w-5" />;
    case "instagram":
      return <Instagram className="h-5 w-5" />;
    default:
      return <div className="h-5 w-5 rounded-full bg-primary" />;
  }
};

export const PreviewModal = ({ event, open, onClose }: PreviewModalProps) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{event.title}</span>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Preview */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Social Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Social Destinations</h3>
            <div className="grid grid-cols-2 gap-4">
              {event.destinations.map((dest) => (
                <div
                  key={dest.name}
                  className="flex items-center gap-3 p-4 border rounded-lg bg-card"
                >
                  <div className={dest.connected ? "text-success" : "text-destructive"}>
                    {getDestinationIcon(dest.name)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{dest.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {dest.connected ? "Connected" : dest.error || "Disconnected"}
                    </p>
                  </div>
                  <Badge variant={dest.connected ? "default" : "destructive"}>
                    {dest.connected ? "Active" : "Error"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Viewers</p>
              <p className="text-2xl font-bold">{event.viewers.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admin</p>
              <p className="text-lg font-medium">{event.admin}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
