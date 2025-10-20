import { Calendar, Filter, ChevronDown, ChevronUp, Search, X, User, Users, Maximize, Minimize, LayoutGrid, List, Play, Eye, AlertTriangle, Volume2, Video, FileVideo, Columns, Rows, Square, FileText } from "lucide-react";
import { useState } from "react";
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
  autoScroll: boolean;
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
  onFullscreenToggle: () => void;
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
  autoScroll,
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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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
    <div className={`sticky top-0 z-10 bg-card shadow-sm ${isFullscreen ? 'shadow-none border-b-2' : ''}`}>
      {/* Event Status Overview - Above Filters */}
      <div className={`px-4 border-b border-border/50 ${isFullscreen ? 'py-1' : 'py-3'}`}>
        {/* Single Row with Title and Status Boxes */}
        <div className="flex items-center gap-4">
          {/* Category Badges - Full Width */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
          {statusOptions.map((option) => {
            const categoryEvents = option.status === "all" ? totalEvents : (statusCounts[option.status] || 0);
            const isSelected = option.status === "all" ? selectedStatuses.size === 0 : selectedStatuses.has(option.status);
            
            const getCategoryIcon = (status: EventStatus, isSelected: boolean) => {
              if (status === "error") {
                const iconClass = isSelected ? "h-4 w-4 text-white" : "h-4 w-4 text-red-600";
                return <AlertTriangle className={iconClass} />;
              }
              return null;
            };

            const getCategoryColor = (status: EventStatus, isSelected: boolean) => {
              if (status === "all") {
                // Special styling for "All Events"
                if (isSelected) {
                  return "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-lg";
                }
                return "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200";
              }
              
              if (status === "error") {
                // Special styling for "Error"
                if (isSelected) {
                  return "bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-lg";
                }
                return "bg-red-50 text-red-800 hover:bg-red-100 border border-red-200";
              }
              
              if (isSelected) {
                return "bg-gray-800 text-white hover:bg-gray-900 border border-gray-800 shadow-lg";
              }
              return "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300";
            };

            const getCategoryLabel = (status: EventStatus) => {
              switch (status) {
                case "low-interaction": return "Low Int.";
                case "stream-freeze": return "Freeze";
                default: return option.label;
              }
            };
            
            return (
              <button
                key={option.status}
                onClick={() => onStatusToggle(option.status)}
                className="flex items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-105 min-w-0 flex-1"
              >
                <Badge 
                  className={`${getCategoryColor(option.status, isSelected)} text-sm font-semibold rounded-lg min-w-0 flex-1 flex items-center justify-between ${isFullscreen ? 'h-10 px-3' : 'h-12 px-4'}`}
                >
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(option.status, isSelected)}
                    <span className="whitespace-nowrap">{getCategoryLabel(option.status)}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm font-bold flex-shrink-0 ${
                    option.status === "all"
                      ? (isSelected 
                          ? "bg-white/30 text-white" 
                          : "bg-blue-200 text-blue-800")
                      : option.status === "error"
                      ? (isSelected 
                          ? "bg-white/30 text-white" 
                          : "bg-red-200 text-red-800")
                      : (isSelected 
                          ? "bg-white/30 text-white" 
                          : "bg-gray-200 text-gray-700")
                  }`}>
                    {categoryEvents}
                  </span>
                </Badge>
              </button>
            );
          })}
          </div>
        </div>
      </div>
      
      {/* Filters Section - Below Event Status Overview */}
      <div className={`flex items-center gap-3 px-3 w-full overflow-hidden ${isFullscreen ? 'py-1' : 'py-2'}`}>
        {/* Search - Left Side, Bigger */}
        <div className="relative flex-shrink-0">
          {!isSearchExpanded ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSearchExpanded(true)}
              className="gap-2 h-9 px-4 border-dashed hover:border-solid transition-all"
            >
              <Search className="h-4 w-4" />
              <span className="font-medium text-sm">Search events...</span>
            </Button>
          ) : (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-9 h-9 text-sm border-primary focus:border-primary"
                autoFocus
                onBlur={() => {
                  if (!searchQuery) {
                    setIsSearchExpanded(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsSearchExpanded(false);
                    onSearchChange("");
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    onSearchChange("");
                    setIsSearchExpanded(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* All Other Filters - Right Side */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
        
        {/* Reset Filters Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="gap-2 text-[10px] flex-shrink-0"
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">Reset Filter</span>
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
            className="h-8 w-8 p-0"
            title={cardsExpanded ? "Compact view" : "Detailed view"}
          >
            {cardsExpanded ? <Square className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewTypeChange(viewType === "vertical" ? "horizontal" : "vertical")}
            className="h-8 w-8 p-0 text-[10px]"
            title={viewType === "vertical" ? "Switch to Horizontal View" : "Switch to Vertical View"}
          >
            {viewType === "vertical" ? <Rows className="h-4 w-4" /> : <Columns className="h-4 w-4" />}
          </Button>
          <ViewControls gridColumns={gridColumns} onGridColumnsChange={onGridColumnsChange} />
          <Button 
            variant="outline" 
            size="sm"
            onClick={onFullscreenToggle}
            className="h-8 w-8 p-0 text-[10px]"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
