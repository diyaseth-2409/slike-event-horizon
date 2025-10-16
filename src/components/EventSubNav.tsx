import { Play, Eye, Users, AlertTriangle, Volume2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { StreamEvent, EventStatus } from "@/types/event";
import { cn } from "@/lib/utils";

interface EventSubNavProps {
  events: StreamEvent[];
  onCategoryClick: (status: EventStatus) => void;
  selectedStatuses: Set<EventStatus>;
}

interface Category {
  status: EventStatus;
  label: string;
  color: string;
  icon: React.ReactNode;
}

export const EventSubNav = ({ events, onCategoryClick, selectedStatuses }: EventSubNavProps) => {
  const categories: Category[] = [
    {
      status: "healthy",
      label: "Healthy",
      color: "bg-green-600 text-white hover:bg-green-700",
      icon: <Play className="h-3 w-3" />
    },
    {
      status: "low-views",
      label: "Low Views",
      color: "bg-orange-500 text-white hover:bg-orange-600",
      icon: <Eye className="h-3 w-3" />
    },
    {
      status: "low-interaction",
      label: "Low Int.",
      color: "bg-yellow-600 text-white hover:bg-yellow-700",
      icon: <Users className="h-3 w-3" />
    },
    {
      status: "stream-freeze",
      label: "Freeze",
      color: "bg-red-600 text-white hover:bg-red-700",
      icon: <AlertTriangle className="h-3 w-3" />
    },
    {
      status: "error",
      label: "Error",
      color: "bg-red-700 text-white hover:bg-red-800",
      icon: <AlertTriangle className="h-3 w-3" />
    },
    {
      status: "not-live",
      label: "Offline",
      color: "bg-gray-600 text-white hover:bg-gray-700",
      icon: <Volume2 className="h-3 w-3" />
    }
  ];

  const getEventsByStatus = (status: EventStatus) => {
    return events.filter(event => event.status === status);
  };

  return (
    <div className="sticky top-[65px] -mt-px z-10 bg-card shadow-sm">
      <div className="flex items-center px-4 py-2 gap-4" style={{ paddingTop: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Play className="h-4 w-4 text-success" />
          <span className="font-semibold text-sm">Event Status Overview</span>
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
            Total: {events.length}
          </Badge>
        </div>
        
        {/* Category Badges - Scrollable */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1">
          {categories.map((category) => {
            const categoryEvents = getEventsByStatus(category.status);
            
            return (
              <button
                key={category.status}
                onClick={() => onCategoryClick(category.status)}
                className="flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-105 flex-shrink-0"
              >
                <Badge 
                  className={cn(
                    category.color,
                    "text-sm h-7 px-3 font-semibold shadow-md border-0",
                    selectedStatuses.has(category.status) && "ring-2 ring-blue-400 ring-offset-2"
                  )}
                >
                  {category.icon}
                  <span className="ml-1 whitespace-nowrap">{category.label}</span>
                  <span className="ml-1.5 bg-white/30 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {categoryEvents.length}
                  </span>
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
