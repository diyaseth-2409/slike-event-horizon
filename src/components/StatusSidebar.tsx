import { CheckCircle, AlertTriangle, AlertCircle, PauseCircle, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { EventStatus } from "@/types/event";
import { cn } from "@/lib/utils";

interface StatusItem {
  status: EventStatus;
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface StatusSidebarProps {
  statusCounts: Record<EventStatus, number>;
  selectedStatuses: Set<EventStatus>;
  onStatusToggle: (status: EventStatus) => void;
  onSelectAll: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const StatusSidebar = ({ statusCounts, selectedStatuses, onStatusToggle, onSelectAll, isCollapsed, onToggleCollapse }: StatusSidebarProps) => {
  const statusItems: StatusItem[] = [
    { 
      status: "healthy", 
      label: "Healthy", 
      count: statusCounts.healthy,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-success"
    },
    { 
      status: "low-views", 
      label: "Low Views", 
      count: statusCounts["low-views"],
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-warning"
    },
    { 
      status: "low-interaction", 
      label: "Low Interaction", 
      count: statusCounts["low-interaction"],
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-warning"
    },
    { 
      status: "stream-freeze", 
      label: "Stream Freeze", 
      count: statusCounts["stream-freeze"],
      icon: <PauseCircle className="h-5 w-5" />,
      color: "text-destructive"
    },
    { 
      status: "error", 
      label: "Error", 
      count: statusCounts.error,
      icon: <XCircle className="h-5 w-5" />,
      color: "text-destructive"
    },
    { 
      status: "not-live", 
      label: "Not Live", 
      count: statusCounts["not-live"],
      icon: <Clock className="h-5 w-5" />,
      color: "text-inactive"
    },
  ];

  const totalEvents = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const isAllSelected = selectedStatuses.size === 0;

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "p-4 border-b border-sidebar-border flex items-center justify-between",
        isCollapsed && "flex-col gap-2"
      )}>
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Slike CMS</h1>
            <p className="text-xs text-muted-foreground mt-1">Event Monitoring</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <Button
          variant={isAllSelected ? "default" : "ghost"}
          className={cn("w-full justify-start text-left", isCollapsed && "px-2")}
          onClick={onSelectAll}
        >
          {isCollapsed ? (
            <span className="text-sm font-bold">{totalEvents}</span>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">All Events</span>
              <span className="text-sm opacity-70">{totalEvents}</span>
            </div>
          )}
        </Button>

        {!isCollapsed && (
          <div className="pt-3 pb-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">
              Status
            </p>
          </div>
        )}

        {statusItems.map((item) => (
          <div
            key={item.status}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors",
              selectedStatuses.has(item.status) && "bg-accent",
              isCollapsed && "justify-center"
            )}
            onClick={() => onStatusToggle(item.status)}
          >
            {!isCollapsed && (
              <Checkbox
                checked={selectedStatuses.has(item.status)}
                onCheckedChange={() => onStatusToggle(item.status)}
              />
            )}
            <div className={cn(
              "flex items-center flex-1",
              isCollapsed ? "flex-col gap-1" : "justify-between"
            )}>
              <div className={cn("flex items-center gap-2", isCollapsed && "flex-col")}>
                <span className={item.color}>{item.icon}</span>
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </div>
              <span className={cn("text-xs opacity-70", isCollapsed && "text-[10px]")}>
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
