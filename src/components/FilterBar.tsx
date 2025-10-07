import { Calendar, Filter, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ViewControls } from "./ViewControls";

interface FilterBarProps {
  timeFilter: string;
  destinationFilter: string;
  adminFilter: string;
  productFilter: string;
  eventTypeFilter: string;
  searchQuery: string;
  gridColumns: number;
  cardsExpanded: boolean;
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
  timeFilter,
  destinationFilter,
  adminFilter,
  productFilter,
  eventTypeFilter,
  searchQuery,
  gridColumns,
  cardsExpanded,
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
  return (
    <div className="sticky top-0 z-10 flex flex-col gap-4 p-4 bg-card border-b border-border shadow-sm">
      {/* Top Row: Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Event ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Bottom Row: Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </div>

      <Select value={timeFilter} onValueChange={onTimeFilterChange}>
        <SelectTrigger className="w-40">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="24h">Last 24 Hours</SelectItem>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      <Select value={destinationFilter} onValueChange={onDestinationFilterChange}>
        <SelectTrigger className="w-40">
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

      <Select value={adminFilter} onValueChange={onAdminFilterChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Admin/User" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="john">John Doe</SelectItem>
          <SelectItem value="sarah">Sarah Smith</SelectItem>
          <SelectItem value="mike">Mike Johnson</SelectItem>
          <SelectItem value="emily">Emily Brown</SelectItem>
        </SelectContent>
      </Select>

      <Select value={productFilter} onValueChange={onProductFilterChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Product" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Products</SelectItem>
          <SelectItem value="TOI">TOI</SelectItem>
          <SelectItem value="ET">ET</SelectItem>
          <SelectItem value="Navbharat Times">Navbharat Times</SelectItem>
        </SelectContent>
      </Select>

      <Select value={eventTypeFilter} onValueChange={onEventTypeFilterChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="RTMP Studio">RTMP Studio</SelectItem>
          <SelectItem value="Web Studio">Web Studio</SelectItem>
        </SelectContent>
      </Select>

        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onCardsExpandedChange(!cardsExpanded)}
          >
            {cardsExpanded ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            {cardsExpanded ? "Collapse All" : "Expand All"}
          </Button>
          <ViewControls gridColumns={gridColumns} onGridColumnsChange={onGridColumnsChange} />
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
