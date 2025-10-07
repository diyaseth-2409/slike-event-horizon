import { Calendar, Filter, ChevronDown, ChevronUp, Search, X } from "lucide-react";
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
import { ViewControls } from "./ViewControls";
import { EventStatus } from "@/types/event";

interface FilterBarProps {
  selectedStatuses: Set<EventStatus>;
  statusCounts: Record<EventStatus, number>;
  timeFilter: string;
  destinationFilter: string;
  adminFilter: string;
  productFilter: string;
  eventTypeFilter: string;
  searchQuery: string;
  gridColumns: number;
  cardsExpanded: boolean;
  onStatusToggle: (status: EventStatus) => void;
  onTimeFilterChange: (value: string) => void;
  onDestinationFilterChange: (value: string) => void;
  onAdminFilterChange: (value: string) => void;
  onProductFilterChange: (value: string) => void;
  onEventTypeFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onGridColumnsChange: (columns: number) => void;
  onCardsExpandedChange: (expanded: boolean) => void;
  onResetFilters: () => void;
}

export const FilterBar = ({
  selectedStatuses,
  statusCounts,
  timeFilter,
  destinationFilter,
  adminFilter,
  productFilter,
  eventTypeFilter,
  searchQuery,
  gridColumns,
  cardsExpanded,
  onStatusToggle,
  onTimeFilterChange,
  onDestinationFilterChange,
  onAdminFilterChange,
  onProductFilterChange,
  onEventTypeFilterChange,
  onSearchChange,
  onGridColumnsChange,
  onCardsExpandedChange,
  onResetFilters,
}: FilterBarProps) => {
  const totalEvents = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  
  const statusOptions = [
    { status: "healthy" as EventStatus, label: "Healthy", color: "bg-success" },
    { status: "low-views" as EventStatus, label: "Low Views", color: "bg-warning" },
    { status: "low-interaction" as EventStatus, label: "Low Interaction", color: "bg-warning" },
    { status: "stream-freeze" as EventStatus, label: "Stream Freeze", color: "bg-destructive" },
    { status: "error" as EventStatus, label: "Error", color: "bg-destructive" },
    { status: "not-live" as EventStatus, label: "Not Live", color: "bg-muted-foreground" },
  ];

  return (
    <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
      <div className="flex items-center gap-2 p-3 flex-wrap">
        {/* Reset Filters Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </Button>

        {/* All Events Status Multi-Select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              All Events
              {selectedStatuses.size > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {selectedStatuses.size}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-2">
              <div className="font-medium text-sm mb-3">Filter by Status ({totalEvents} total)</div>
              {statusOptions.map((option) => (
                <label
                  key={option.status}
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded"
                >
                  <Checkbox
                    checked={selectedStatuses.has(option.status)}
                    onCheckedChange={() => onStatusToggle(option.status)}
                  />
                  <span className={`w-2 h-2 rounded-full ${option.color}`} />
                  <span className="flex-1 text-sm">{option.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {statusCounts[option.status] || 0}
                  </span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Search */}
        <div className="relative w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Event ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 text-sm"
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
          <SelectTrigger className="w-36 h-9">
            <Calendar className="h-3.5 w-3.5 mr-2" />
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
          </SelectContent>
        </Select>

        {/* Product Filter */}
        <Select value={productFilter} onValueChange={onProductFilterChange}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="TOI">TOI</SelectItem>
            <SelectItem value="ET">ET</SelectItem>
            <SelectItem value="Navbharat Times">Navbharat Times</SelectItem>
          </SelectContent>
        </Select>

        {/* Event Type Filter */}
        <Select value={eventTypeFilter} onValueChange={onEventTypeFilterChange}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="RTMP Studio">RTMP Studio</SelectItem>
            <SelectItem value="Web Studio">Web Studio</SelectItem>
          </SelectContent>
        </Select>

        {/* Destination Filter */}
        <Select value={destinationFilter} onValueChange={onDestinationFilterChange}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Destinations</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="twitch">Twitch</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
          </SelectContent>
        </Select>

        {/* Admin Filter */}
        <Select value={adminFilter} onValueChange={onAdminFilterChange}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Admin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="john">John Doe</SelectItem>
            <SelectItem value="sarah">Sarah Smith</SelectItem>
            <SelectItem value="mike">Mike Johnson</SelectItem>
            <SelectItem value="emily">Emily Brown</SelectItem>
          </SelectContent>
        </Select>

        {/* Right Side Controls */}
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onCardsExpandedChange(!cardsExpanded)}
            className="h-9"
          >
            {cardsExpanded ? <ChevronUp className="h-3.5 w-3.5 mr-1.5" /> : <ChevronDown className="h-3.5 w-3.5 mr-1.5" />}
            {cardsExpanded ? "Collapse" : "Expand"}
          </Button>
          <ViewControls gridColumns={gridColumns} onGridColumnsChange={onGridColumnsChange} />
        </div>
      </div>
    </div>
  );
};
