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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Index = () => {
  const [events, setEvents] = useState<StreamEvent[]>(mockEvents);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<EventStatus>>(new Set());
  const [timeFilter, setTimeFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewEvent, setPreviewEvent] = useState<StreamEvent | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollInterval, setScrollInterval] = useState(5);
  const [gridColumns, setGridColumns] = useState(3);
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewType, setViewType] = useState<"vertical" | "horizontal">("vertical");

  // Calculate status counts
  const statusCounts = events.reduce(
    (acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    },
    {} as Record<EventStatus, number>
  );

  // Calculate total events first
  const totalEvents = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  // Ensure all statuses have a count
  const allStatusCounts: Record<EventStatus, number> = {
    all: totalEvents,
    healthy: 0,
    "low-views": 0,
    "low-interaction": 0,
    "stream-freeze": 0,
    error: 0,
    "not-live": 0,
    ...statusCounts,
  };

  const handleStatusToggle = (status: EventStatus) => {
    setSelectedStatuses((prev) => {
      if (status === "all") {
        // If "all" is clicked, clear all selections to show all events
        return new Set();
      } else {
        // If a specific status is clicked, clear "all" and toggle the specific status
        const newSet = new Set(prev);
        if (newSet.has(status)) {
          newSet.delete(status);
        } else {
          newSet.add(status);
        }
        return newSet;
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedStatuses(new Set());
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    // My Events filter (show only events created by current user)
    if (showMyEvents) {
      // For demo purposes, assume current user is "John Doe"
      // In a real app, this would be the actual current user
      const currentUser = "John Doe";
      if (event.createdBy !== currentUser && event.admin !== currentUser) {
        return false;
      }
    }

    // Search by Event ID or Event Title
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesEventId = event.eventId.toLowerCase().includes(searchLower);
      const matchesTitle = event.title.toLowerCase().includes(searchLower);
      
      if (!matchesEventId && !matchesTitle) {
        return false;
      }
    }

    // Status filter
    if (selectedStatuses.size > 0 && !selectedStatuses.has(event.status)) return false;

    // Product filter
    if (productFilter !== "all" && event.product !== productFilter) return false;

    // Event Type filter
    if (eventTypeFilter !== "all" && event.sourceType !== eventTypeFilter) return false;

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
    setEvents((prev) => {
      const currentPinnedCount = prev.filter(e => e.isPinned).length;
      const eventToToggle = prev.find(e => e.id === id);
      
      // If trying to pin and already at limit (4), show warning
      if (eventToToggle && !eventToToggle.isPinned && currentPinnedCount >= 4) {
        toast.error("Maximum of 4 events can be pinned");
        return prev;
      }
      
      return prev.map((event) => {
        if (event.id === id) {
          const newPinnedState = !event.isPinned;
          toast.success(
            newPinnedState ? "Event pinned to top" : "Event unpinned"
          );
          return { ...event, isPinned: newPinnedState };
        }
        return event;
      });
    });
  };

  const handleResetFilters = () => {
    setTimeFilter("all");
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

  const handleCategoryClick = (status: EventStatus) => {
    // Toggle the status filter
    setSelectedStatuses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        // If already selected, remove it (show all events)
        newSet.delete(status);
        toast.success(`Showing all events`);
      } else {
        // If not selected, select only this status (show only this status)
        newSet.clear(); // Clear other selections
        newSet.add(status); // Add this status
        
        // Create a more readable status name
        const statusLabels: Record<EventStatus, string> = {
          'all': 'All Events',
          'healthy': 'Healthy',
          'low-views': 'Low Views',
          'low-interaction': 'Low Interaction',
          'stream-freeze': 'Stream Freeze',
          'error': 'Error',
          'not-live': 'Not Live'
        };
        
        toast.success(`Showing only ${statusLabels[status]} events`);
      }
      return newSet;
    });
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

  const getContainerClass = () => {
    if (viewType === "horizontal") {
      return "flex overflow-x-auto gap-6 pb-4 scrollbar-hide";
    }
    return `grid ${getGridClass()} gap-6`;
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="flex-1 flex flex-col min-h-0">
        {!isFullscreen && (
          <FilterBar
            selectedStatuses={selectedStatuses}
            statusCounts={allStatusCounts}
            timeFilter={timeFilter}
            adminFilter={adminFilter}
            productFilter={productFilter}
            eventTypeFilter={eventTypeFilter}
            searchQuery={searchQuery}
            gridColumns={gridColumns}
            cardsExpanded={cardsExpanded}
            showMyEvents={showMyEvents}
            isFullscreen={isFullscreen}
            viewType={viewType}
            onStatusToggle={handleStatusToggle}
            onTimeFilterChange={setTimeFilter}
            onAdminFilterChange={setAdminFilter}
            onProductFilterChange={setProductFilter}
            onEventTypeFilterChange={setEventTypeFilter}
            onSearchChange={setSearchQuery}
            onGridColumnsChange={setGridColumns}
            onCardsExpandedChange={setCardsExpanded}
            onShowMyEventsChange={setShowMyEvents}
            onResetFilters={handleResetFilters}
            onFullscreenToggle={setIsFullscreen}
            onViewTypeChange={setViewType}
          />
        )}


        {/* Fullscreen Exit Button */}
        {isFullscreen && (
          <div className="fixed top-4 right-4 z-50">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border shadow-lg"
              title="Exit Fullscreen"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto ${isFullscreen ? 'p-2' : 'p-6 pb-20'}`}>
          <div className="max-w-[1800px] mx-auto">
            {pinnedEvents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  📌 Pinned Events
                  <span className="text-sm text-muted-foreground font-normal">
                    ({pinnedEvents.length})
                  </span>
                </h2>
                <div className={getContainerClass()}>
                  {pinnedEvents.map((event) => (
                    <div key={event.id} className={viewType === "horizontal" ? "flex-shrink-0 w-80" : ""}>
                      <EventCard
                        event={event}
                        onTogglePin={handleTogglePin}
                        onPreview={handlePreview}
                        isExpanded={cardsExpanded}
                      />
                    </div>
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
                <div className={getContainerClass()}>
                  {unpinnedEvents.map((event) => (
                    <div key={event.id} className={viewType === "horizontal" ? "flex-shrink-0 w-80" : ""}>
                      <EventCard
                        event={event}
                        onTogglePin={handleTogglePin}
                        onPreview={handlePreview}
                        isExpanded={cardsExpanded}
                      />
                    </div>
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
