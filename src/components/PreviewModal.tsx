import { X, Youtube, Facebook, Twitch, Linkedin, Instagram, Play, RefreshCw, RotateCcw, Eye, Edit, Square, Check, StopCircle, Pause, Volume2, Settings, Maximize, Copy, Calendar, User, Users, Package, Hash } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { StreamEvent } from "@/types/event";
import { useState } from "react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("12:23");
  const [progress, setProgress] = useState(25); // 25% progress

  console.log("PreviewModal event:", event);
  
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
        {/* Close Button - Positioned absolutely */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 h-6 w-6 p-0 z-10 bg-white/80 hover:bg-white"
        >
          <X className="h-3 w-3" />
        </Button>

        <div className="flex h-[95vh]">
          {/* Left Section - Video Preview */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Video Preview */}
            <div className="relative bg-black aspect-video w-full group">
              <img
                src={event.thumbnail}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              
              {/* Product Logo Overlay */}
              <div className="absolute top-3 left-3">
                {getProductLogo(event.product)}
              </div>
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-600 rounded-full h-1">
                    <div 
                      className="bg-white h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                    <span className="text-sm font-medium">0:01</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="hover:bg-white/20 rounded-full p-2 transition-colors">
                      <Volume2 className="h-5 w-5" />
                    </button>
                    <button className="hover:bg-white/20 rounded-full p-2 transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>
                    <button className="hover:bg-white/20 rounded-full p-2 transition-colors">
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details Below Video - Single Line */}
            <div className="px-4 py-2 bg-white border-b">
              <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
                {/* Event Duration Info */}
                <div className="flex items-center gap-1">
                  <span>Event has been live for <span className="font-semibold">{calculateDuration(event.dateTime)}</span>.</span>
                </div>

                {/* Start Date */}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatStartDate(event.dateTime)}</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{event.createdBy || event.admin}</span>
                </div>

                {/* Views */}
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{event.viewers.toLocaleString()}</span>
                </div>

                {/* Watching */}
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{event.watching || 0}</span>
                </div>

                {/* Product */}
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span>{event.product}</span>
                </div>

                {/* Event ID */}
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  <span className="font-mono">{event.eventId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => navigator.clipboard.writeText(event.eventId)}
                  >
                    <Copy className="h-2 w-2" />
                  </Button>
                </div>
              </div>
            </div>


            {/* Social Destinations Section */}
            <div className="p-4 bg-gray-50 flex-1">
              <h3 className="text-sm font-semibold mb-2">Social Destinations</h3>
              
              {/* Main Destination */}
              <div className="flex items-center justify-between p-2 bg-white rounded border mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded">
                    <div className="h-4 w-4 bg-red-700 rounded flex items-center justify-center text-white text-xs font-bold">
                      ET
                    </div>
                    <Play className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">The Economic Times</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-6">
                  OPEN LINK
                </Button>
              </div>

              <div className="text-xs text-gray-600">
                {event.title}
              </div>
            </div>
          </div>

          {/* Right Section - Title and Description */}
          <div className="w-[400px] bg-white border-l overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">{event.title}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">{event.description || "No description provided"}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-2 pt-4">
                <Button onClick={handleEditEvent} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-7 flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  EDIT EVENT
                </Button>
                <Button onClick={handleEndEvent} variant="destructive" className="text-xs px-2 py-1 h-7 flex-1">
                  <StopCircle className="h-3 w-3 mr-1" />
                  END EVENT
                </Button>
                <Button onClick={handleResetStream} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-7 flex-1">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  RESET STREAM
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

