import { useState, useEffect } from "react";
import { StatusSidebar } from "@/components/StatusSidebar";
import { FilterBar } from "@/components/FilterBar";
import { EventCard } from "@/components/EventCard";
import { PreviewModal } from "@/components/PreviewModal";
import { AutoScrollToggle } from "@/components/AutoScrollToggle";
import { mockEvents } from "@/data/mockEvents";
import { StreamEvent, EventStatus } from "@/types/event";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Index = () => {
  const [events, setEvents] = useState<StreamEvent[]>(mockEvents);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<EventStatus>>(new Set());
  const [timeFilter, setTimeFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewEvent, setPreviewEvent] = useState<StreamEvent | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollInterval, setScrollInterval] = useState(5);
  const [gridColumns, setGridColumns] = useState(3);
  const [cardsExpanded, setCardsExpanded] = useState(false);

  // Calculate status counts
  const statusCounts = events.reduce(
    (acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    },
    {} as Record<EventStatus, number>
  );

  // Ensure all statuses have a count
  const allStatusCounts: Record<EventStatus, number> = {
    healthy: 0,
    "low-views": 0,
    "low-interaction": 0,
    "stream-freeze": 0,
    error: 0,
    "not-live": 0,
    ...statusCounts,
  };

  const totalEvents = Object.values(allStatusCounts).reduce((a, b) => a + b, 0);

  const handleStatusToggle = (status: EventStatus) => {
    setSelectedStatuses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedStatuses(new Set());
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    // Search by Event ID
    if (searchQuery && !event.eventId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (selectedStatuses.size > 0 && !selectedStatuses.has(event.status)) return false;

    // Product filter
    if (productFilter !== "all" && event.product !== productFilter) return false;

    // Event Type filter
    if (eventTypeFilter !== "all" && event.sourceType !== eventTypeFilter) return false;

    // Destination filter
    if (destinationFilter !== "all") {
      const hasDestination = event.destinations.some(
        (dest) => dest.name.toLowerCase() === destinationFilter.toLowerCase()
      );
      if (!hasDestination) return false;
    }

    // Admin filter (basic implementation)
    if (adminFilter !== "all") {
      const adminMatch = event.admin.toLowerCase().includes(adminFilter.toLowerCase());
      if (!adminMatch) return false;
    }

    return true;
  });

  // Separate pinned and unpinned events
  const pinnedEvents = filteredEvents.filter((e) => e.isPinned);
  const unpinnedEvents = filteredEvents.filter((e) => !e.isPinned);

  const handleTogglePin = (id: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === id) {
          const newPinnedState = !event.isPinned;
          toast.success(
            newPinnedState ? "Event pinned to top" : "Event unpinned"
          );
          return { ...event, isPinned: newPinnedState };
        }
        return event;
      })
    );
  };

  const handleResetFilters = () => {
    setTimeFilter("all");
    setDestinationFilter("all");
    setAdminFilter("all");
    setProductFilter("all");
    setEventTypeFilter("all");
    setSearchQuery("");
    setSelectedStatuses(new Set());
    toast.success("All filters reset");
  };

  const handlePreview = (event: StreamEvent) => {
    setPreviewEvent(event);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      window.scrollBy({ top: 100, behavior: "smooth" });
    }, scrollInterval * 1000);

    return () => clearInterval(interval);
  }, [autoScroll, scrollInterval]);

  const getGridClass = () => {
    switch (gridColumns) {
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      case 6:
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";
      case 8:
        return "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex-1 flex flex-col">
        <FilterBar
          timeFilter={timeFilter}
          destinationFilter={destinationFilter}
          adminFilter={adminFilter}
          productFilter={productFilter}
          eventTypeFilter={eventTypeFilter}
          searchQuery={searchQuery}
          gridColumns={gridColumns}
          cardsExpanded={cardsExpanded}
          onTimeFilterChange={setTimeFilter}
          onDestinationFilterChange={setDestinationFilter}
          onAdminFilterChange={setAdminFilter}
          onProductFilterChange={setProductFilter}
          onEventTypeFilterChange={setEventTypeFilter}
          onSearchChange={setSearchQuery}
          onGridColumnsChange={setGridColumns}
          onCardsExpandedChange={setCardsExpanded}
          onResetFilters={handleResetFilters}
        />

        {/* Status Filter Nav */}
        <div className="border-b border-border bg-card px-6 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSelectAll}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                selectedStatuses.size === 0 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              All Events ({totalEvents})
            </button>
            
            {[
              { status: "healthy", label: "Healthy", count: statusCounts.healthy || 0, color: "bg-success" },
              { status: "low-views", label: "Low Views", count: statusCounts["low-views"] || 0, color: "bg-warning" },
              { status: "low-interaction", label: "Low Interaction", count: statusCounts["low-interaction"] || 0, color: "bg-warning" },
              { status: "stream-freeze", label: "Stream Freeze", count: statusCounts["stream-freeze"] || 0, color: "bg-destructive" },
              { status: "error", label: "Error", count: statusCounts.error || 0, color: "bg-destructive" },
              { status: "not-live", label: "Not Live", count: statusCounts["not-live"] || 0, color: "bg-muted-foreground" },
            ].map((item) => (
              <button
                key={item.status}
                onClick={() => handleStatusToggle(item.status as EventStatus)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  selectedStatuses.has(item.status as EventStatus)
                    ? "bg-accent border-2 border-primary"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", item.color)} />
                {item.label} ({item.count})
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1800px] mx-auto">
            {pinnedEvents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  📌 Pinned Events
                  <span className="text-sm text-muted-foreground font-normal">
                    ({pinnedEvents.length})
                  </span>
                </h2>
                <div className={`grid ${getGridClass()} gap-6`}>
                  {pinnedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onTogglePin={handleTogglePin}
                      onPreview={handlePreview}
                      isExpanded={cardsExpanded}
                    />
                  ))}
                </div>
              </div>
            )}

            {unpinnedEvents.length > 0 && (
              <div>
                {pinnedEvents.length > 0 && (
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    All Events
                  </h2>
                )}
                <div className={`grid ${getGridClass()} gap-6`}>
                  {unpinnedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onTogglePin={handleTogglePin}
                      onPreview={handlePreview}
                      isExpanded={cardsExpanded}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No events found matching your filters
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <PreviewModal
        event={previewEvent}
        open={!!previewEvent}
        onClose={() => setPreviewEvent(null)}
      />

      <AutoScrollToggle
        enabled={autoScroll}
        interval={scrollInterval}
        onToggle={() => setAutoScroll(!autoScroll)}
        onIntervalChange={setScrollInterval}
      />
    </div>
  );
};

export default Index;
