import { CheckCircle, AlertTriangle, AlertCircle, PauseCircle, XCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { EventStatus } from "@/types/event";

interface StatusItem {
  status: EventStatus;
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface StatusSidebarProps {
  statusCounts: Record<EventStatus, number>;
  selectedStatus: EventStatus | "all";
  onStatusSelect: (status: EventStatus | "all") => void;
}

export const StatusSidebar = ({ statusCounts, selectedStatus, onStatusSelect }: StatusSidebarProps) => {
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

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Slike CMS</h1>
        <p className="text-sm text-muted-foreground mt-1">Event Monitoring</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <Button
          variant={selectedStatus === "all" ? "default" : "ghost"}
          className="w-full justify-start text-left"
          onClick={() => onStatusSelect("all")}
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-medium">All Events</span>
            <span className="text-sm opacity-70">{totalEvents}</span>
          </div>
        </Button>

        <div className="pt-4 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-3">
            Status
          </p>
        </div>

        {statusItems.map((item) => (
          <Button
            key={item.status}
            variant={selectedStatus === item.status ? "default" : "ghost"}
            className="w-full justify-start text-left"
            onClick={() => onStatusSelect(item.status)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className={item.color}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className="text-sm opacity-70">{item.count}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
