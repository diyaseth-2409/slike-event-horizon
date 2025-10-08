import { X, Youtube, Facebook, Twitch, Linkedin, Instagram, Play, RefreshCw, RotateCcw, Eye, Edit, Square, Check, StopCircle } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
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
    case "nbt":
      return <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">N</div>;
    case "zoom":
      return <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">Z</div>;
    default:
      return <div className="h-6 w-6 rounded-full bg-primary" />;
  }
};

const getProductLogo = (product: string) => {
  switch (product.toLowerCase()) {
    case "toi":
      return (
        <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm flex items-center justify-center min-w-[50px]">
          TOI
        </div>
      );
    case "et":
      return <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">E</div>;
    case "navbharat times":
      return <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">N</div>;
    default:
      return <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">{product.charAt(0)}</div>;
  }
};

export const PreviewModal = ({ event, open, onClose }: PreviewModalProps) => {
  if (!event) return null;

  const formatStartDate = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatStartTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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

  const getGridCols = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      default:
        return count > 4 ? "grid-cols-4" : "grid-cols-1";
    }
  };

  const handleEditEvent = () => {
    console.log("Edit event:", event.id);
  };

  const handleEndEvent = () => {
    console.log("End event:", event.id);
  };

  const handleResetStream = () => {
    console.log("Reset stream:", event.id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
        <div className="flex h-[95vh]">
          {/* Left Section - Video Preview and Controls */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Video Preview */}
            <div className="relative bg-black" style={{ height: "60vh", minHeight: "400px" }}>
              <img
                src={event.thumbnail}
                alt={event.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex gap-3">
                <Button onClick={handleEditEvent} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  EDIT EVENT
                </Button>
                <Button onClick={handleEndEvent} variant="destructive">
                  <StopCircle className="h-4 w-4 mr-2" />
                  END EVENT
                </Button>
                <Button onClick={handleResetStream} className="bg-green-600 hover:bg-green-700 text-white">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  RESET STREAM
                </Button>
              </div>

              {/* Social Destinations */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Social Destinations</h3>
                <div className="space-y-4">
                  {/* RTMP Source */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-blue-900 text-white px-3 py-2 rounded">
                      <div className="h-6 w-6 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                        R
                      </div>
                      <span className="text-sm font-medium">RTMP</span>
                    </div>
                    <div className="text-sm text-gray-600 max-w-md truncate">
                      {event.title}
                    </div>
                  </div>
                  
                  {/* Platform Destinations */}
                  <div className={`grid ${getGridCols(event.destinations.length)} gap-2`}>
                    {event.destinations.map((dest) => (
                      <div
                        key={dest.name}
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          dest.connected
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className={`${dest.connected ? "text-green-600" : "text-red-600"}`}>
                          {getDestinationIcon(dest.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-xs font-medium text-gray-900">
                              {dest.name}
                            </p>
                            <div className="scale-75">
                              {getProductLogo(event.product)}
                            </div>
                          </div>
                          <p className={`text-xs ${dest.connected ? "text-green-600" : "text-red-600"}`}>
                            {dest.connected ? "✓" : "✗"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Event Details */}
          <div className="w-96 bg-white border-l overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-gray-700">EVENT PREVIEW</h2>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">Title</h3>
                <p className="text-sm text-gray-900 leading-tight">{event.title}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">Description</h3>
                <p className="text-sm text-gray-900 leading-tight">{event.description || "No description provided"}</p>
              </div>

              {/* Start Date */}
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">Start Date</h3>
                <p className="text-sm text-gray-900">{formatStartDate(event.dateTime)}</p>
              </div>

              {/* Created By */}
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">Created By</h3>
                <p className="text-sm text-gray-900">{event.createdBy || event.admin}</p>
              </div>

              {/* Total Views */}
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">Total Views</h3>
                <p className="text-sm text-gray-900">{event.viewers.toLocaleString()}</p>
              </div>

              {/* Watching */}
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">Watching</h3>
                <p className="text-sm text-gray-900">{event.watching || 0}</p>
              </div>

              {/* Product */}
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">Product</h3>
                <p className="text-sm text-gray-900">{event.product}</p>
              </div>

              {/* Event ID */}
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">Event ID</h3>
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  <p className="text-sm text-gray-900 font-mono">{event.eventId}</p>
                </div>
              </div>

              {/* Event Duration */}
              <div>
                <h3 className="text-xs font-semibold text-gray-600 mb-1">Event Duration</h3>
                <p className="text-sm text-gray-900 leading-tight">
                  The event started at <span className="font-semibold">{formatStartTime(event.dateTime)}</span> and has been live for <span className="font-semibold">{calculateDuration(event.dateTime)}</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

