import { Calendar, Filter, ChevronDown, ChevronUp, Search, X, User, Users, Maximize, Minimize, LayoutGrid, List, Play, Eye, AlertTriangle, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { ViewControls } from "./ViewControls";
import { EventStatus } from "@/types/event";

interface FilterBarProps {
  selectedStatuses: Set<EventStatus>;
  statusCounts: Record<EventStatus, number>;
  timeFilter: string;
  adminFilter: string;
  productFilter: string;
  eventTypeFilter: string;
  searchQuery: string;
  gridColumns: number;
  cardsExpanded: boolean;
  showMyEvents: boolean;
  isFullscreen: boolean;
  viewType: "vertical" | "horizontal";
  onStatusToggle: (status: EventStatus) => void;
  onTimeFilterChange: (value: string) => void;
  onAdminFilterChange: (value: string) => void;
  onProductFilterChange: (value: string) => void;
  onEventTypeFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onGridColumnsChange: (columns: number) => void;
  onCardsExpandedChange: (expanded: boolean) => void;
  onShowMyEventsChange: (showMyEvents: boolean) => void;
  onResetFilters: () => void;
  onFullscreenToggle: (fullscreen: boolean) => void;
  onViewTypeChange: (viewType: "vertical" | "horizontal") => void;
}

export const FilterBar = ({
  selectedStatuses,
  statusCounts,
  timeFilter,
  adminFilter,
  productFilter,
  eventTypeFilter,
  searchQuery,
  gridColumns,
  cardsExpanded,
  showMyEvents,
  isFullscreen,
  viewType,
  onStatusToggle,
  onTimeFilterChange,
  onAdminFilterChange,
  onProductFilterChange,
  onEventTypeFilterChange,
  onSearchChange,
  onGridColumnsChange,
  onCardsExpandedChange,
  onShowMyEventsChange,
  onResetFilters,
  onFullscreenToggle,
  onViewTypeChange,
}: FilterBarProps) => {
  const totalEvents = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  
  const statusOptions = [
    { status: "all" as EventStatus, label: "All Events", color: "bg-blue-600" },
    { status: "healthy" as EventStatus, label: "Healthy", color: "bg-success" },
    { status: "low-views" as EventStatus, label: "Low Views", color: "bg-warning" },
    { status: "low-interaction" as EventStatus, label: "Low Interaction", color: "bg-warning" },
    { status: "stream-freeze" as EventStatus, label: "Stream Freeze", color: "bg-destructive" },
    { status: "error" as EventStatus, label: "Error", color: "bg-destructive" },
    { status: "not-live" as EventStatus, label: "Not Live", color: "bg-muted-foreground" },
  ];

  return (
    <div className="sticky top-0 z-10 bg-card shadow-sm w-full">
      <div className="flex items-center justify-between px-2 py-1 w-full overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
        {/* Reset Filters Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="gap-2 text-[10px] flex-shrink-0"
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </Button>

        {/* My Events / All Events Toggle */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md flex-shrink-0">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium">All Events</span>
          </div>
          <Switch
            checked={showMyEvents}
            onCheckedChange={onShowMyEventsChange}
            className="data-[state=checked]:bg-primary scale-75"
          />
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium">My Events</span>
          </div>
        </div>


        {/* Search */}
        <div className="relative w-32 flex-shrink-0">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-6 h-8 text-[10px]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Time Filter */}
        <Select value={timeFilter} onValueChange={onTimeFilterChange}>
          <SelectTrigger className="w-28 h-8 text-[10px] flex-shrink-0">
            <Calendar className="h-3 w-3 mr-1" />
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[10px]">All Time</SelectItem>
            <SelectItem value="today" className="text-[10px]">Today</SelectItem>
            <SelectItem value="24h" className="text-[10px]">Last 24 Hours</SelectItem>
            <SelectItem value="7d" className="text-[10px]">Last 7 Days</SelectItem>
          </SelectContent>
        </Select>

        {/* Product Filter */}
        <Select value={productFilter} onValueChange={onProductFilterChange}>
          <SelectTrigger className="w-32 h-8 text-[10px] flex-shrink-0">
            <SelectValue placeholder="All Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[10px]">All Products</SelectItem>
            <SelectItem value="TOI" className="text-[10px]">TOI</SelectItem>
            <SelectItem value="ET" className="text-[10px]">ET</SelectItem>
            <SelectItem value="Navbharat Times" className="text-[10px]">Navbharat Times</SelectItem>
          </SelectContent>
        </Select>

        {/* Event Type Filter */}
        <Select value={eventTypeFilter} onValueChange={onEventTypeFilterChange}>
          <SelectTrigger className="w-32 h-8 text-[10px] flex-shrink-0">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[10px]">All Types</SelectItem>
            <SelectItem value="RTMP Studio" className="text-[10px]">RTMP Studio</SelectItem>
            <SelectItem value="Web Studio" className="text-[10px]">Web Studio</SelectItem>
            <SelectItem value="Fast Channel" className="text-[10px]">Fast Channel</SelectItem>
          </SelectContent>
        </Select>

        {/* Admin Filter */}
        <Select value={adminFilter} onValueChange={onAdminFilterChange}>
          <SelectTrigger className="w-24 h-8 text-[10px] flex-shrink-0">
            <SelectValue placeholder="All Users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[10px]">All Users</SelectItem>
            <SelectItem value="john" className="text-[10px]">John Doe</SelectItem>
            <SelectItem value="sarah" className="text-[10px]">Sarah Smith</SelectItem>
            <SelectItem value="mike" className="text-[10px]">Mike Johnson</SelectItem>
            <SelectItem value="emily" className="text-[10px]">Emily Brown</SelectItem>
          </SelectContent>
        </Select>

        </div>
        
        {/* Right Side Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onCardsExpandedChange(!cardsExpanded)}
            className="h-8 px-2 text-[10px]"
          >
            {cardsExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
            {cardsExpanded ? "Collapse" : "Expand"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewTypeChange(viewType === "vertical" ? "horizontal" : "vertical")}
            className="h-8 w-8 p-0 text-[10px]"
            title={viewType === "vertical" ? "Switch to Horizontal View" : "Switch to Vertical View"}
          >
            {viewType === "vertical" ? <List className="h-3 w-3" /> : <LayoutGrid className="h-3 w-3" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onFullscreenToggle(!isFullscreen)}
            className="h-8 w-8 p-0 text-[10px]"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
          </Button>
          <ViewControls gridColumns={gridColumns} onGridColumnsChange={onGridColumnsChange} />
        </div>
      </div>
      
      {/* Event Status Overview - Integrated */}
      <div className="flex items-center px-4 py-3 gap-4 border-t border-border/50">
        {/* Header */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Play className="h-4 w-4 text-success" />
          <span className="font-semibold text-sm">Event Status Overview</span>
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
            Total: {Object.values(statusCounts).reduce((a, b) => a + b, 0)}
          </Badge>
        </div>
        
        {/* Category Badges - Scrollable */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1 pr-4 py-1">
          {statusOptions.map((option) => {
            const categoryEvents = option.status === "all" ? totalEvents : (statusCounts[option.status] || 0);
            const isSelected = option.status === "all" ? selectedStatuses.size === 0 : selectedStatuses.has(option.status);
            
            const getCategoryIcon = (status: EventStatus) => {
              switch (status) {
                case "all": return <Users className="h-3 w-3" />;
                case "healthy": return <Play className="h-3 w-3" />;
                case "low-views": return <Eye className="h-3 w-3" />;
                case "low-interaction": return <Users className="h-3 w-3" />;
                case "stream-freeze": return <AlertTriangle className="h-3 w-3" />;
                case "error": return <AlertTriangle className="h-3 w-3" />;
                case "not-live": return <Volume2 className="h-3 w-3" />;
                default: return null;
              }
            };

            const getCategoryColor = (status: EventStatus) => {
              switch (status) {
                case "all": return "bg-blue-600 text-white hover:bg-blue-700";
                case "healthy": return "bg-green-600 text-white hover:bg-green-700";
                case "low-views": return "bg-orange-500 text-white hover:bg-orange-600";
                case "low-interaction": return "bg-yellow-600 text-white hover:bg-yellow-700";
                case "stream-freeze": return "bg-red-600 text-white hover:bg-red-700";
                case "error": return "bg-red-700 text-white hover:bg-red-800";
                case "not-live": return "bg-gray-600 text-white hover:bg-gray-700";
                default: return "bg-gray-500 text-white hover:bg-gray-600";
              }
            };

            const getCategoryLabel = (status: EventStatus) => {
              switch (status) {
                case "low-interaction": return "Low Int.";
                default: return option.label;
              }
            };
            
            return (
              <button
                key={option.status}
                onClick={() => onStatusToggle(option.status)}
                className="flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-105 flex-shrink-0"
              >
                <Badge 
                  className={`${getCategoryColor(option.status)} text-sm h-7 px-3 font-semibold shadow-md border-0 ${
                    isSelected ? "ring-2 ring-blue-400 ring-offset-1" : ""
                  }`}
                >
                  {getCategoryIcon(option.status)}
                  <span className="ml-1 whitespace-nowrap">{getCategoryLabel(option.status)}</span>
                  <span className="ml-1.5 bg-white/30 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {categoryEvents}
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
