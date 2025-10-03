import { Calendar, Filter } from "lucide-react";
import { Button } from "./ui/button";
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
  gridColumns: number;
  onTimeFilterChange: (value: string) => void;
  onDestinationFilterChange: (value: string) => void;
  onAdminFilterChange: (value: string) => void;
  onGridColumnsChange: (columns: number) => void;
}

export const FilterBar = ({
  timeFilter,
  destinationFilter,
  adminFilter,
  gridColumns,
  onTimeFilterChange,
  onDestinationFilterChange,
  onAdminFilterChange,
  onGridColumnsChange,
}: FilterBarProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-card border-b border-border">
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

      <div className="ml-auto flex items-center gap-2">
        <ViewControls gridColumns={gridColumns} onGridColumnsChange={onGridColumnsChange} />
        <Button variant="outline" size="sm">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
