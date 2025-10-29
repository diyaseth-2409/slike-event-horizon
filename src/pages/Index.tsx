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
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [gridColumns, setGridColumns] = useState(4);
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  console.log("Index component - events:", events.length, "mockEvents:", mockEvents.length);
  console.log("First event:", events[0]);
  console.log("MockEvents first:", mockEvents[0]);

  // Browser fullscreen functionality
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcut for fullscreen (F11)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F11') {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Debug logging
  console.log("Current gridColumns:", gridColumns);
  

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

  // Create seamless event ordering: pinned events first, then fill remaining slots with unpinned events
  const pinnedEvents = filteredEvents.filter((e) => e.isPinned);
  const unpinnedEvents = filteredEvents.filter((e) => !e.isPinned);
  
  // Create a seamless display order
  const getDisplayEvents = () => {
    const displayEvents = [...pinnedEvents];
    
    // Fill remaining slots with unpinned events to maintain seamless grid
    // Calculate how many slots we need to fill based on grid columns
    const maxSlotsPerRow = gridColumns;
    const totalPinnedSlots = pinnedEvents.length;
    
    // If we have empty slots in the first row(s), fill them with unpinned events
    const remainingSlotsInFirstRows = Math.ceil(totalPinnedSlots / maxSlotsPerRow) * maxSlotsPerRow - totalPinnedSlots;
    
    if (remainingSlotsInFirstRows > 0 && unpinnedEvents.length > 0) {
      // Add unpinned events to fill the remaining slots in the first rows
      const eventsToFill = unpinnedEvents.slice(0, remainingSlotsInFirstRows);
      displayEvents.push(...eventsToFill);
    }
    
    // Add all remaining unpinned events after the filled slots
    const remainingUnpinnedEvents = unpinnedEvents.slice(remainingSlotsInFirstRows);
    displayEvents.push(...remainingUnpinnedEvents);
    
    return displayEvents;
  };
  
  const displayEvents = getDisplayEvents();
  
  console.log("Filtered events:", filteredEvents.length);
  console.log("Display events:", displayEvents.length);
  console.log("Selected statuses:", selectedStatuses);
  console.log("Search query:", searchQuery);
  console.log("Show my events:", showMyEvents);


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
    if (isFullscreen) {
      // In fullscreen, use fixed columns without responsive breakpoints
      switch (gridColumns) {
        case 2:
          return "grid-cols-2";
        case 3:
          return "grid-cols-3";
        case 4:
          return "grid-cols-4";
        case 6:
          return "grid-cols-6";
        case 8:
          return "grid-cols-8";
        default:
          return "grid-cols-4";
      }
    } else {
      // Normal responsive grid
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
          return "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8";
        default:
          return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      }
    }
  };

  const getContainerClass = () => {
    let gapClass;
    if (isFullscreen) {
      gapClass = 'gap-2';
    } else {
      gapClass = cardsExpanded ? 'gap-8' : 'gap-6';
    }
    return `grid ${getGridClass()} ${gapClass} min-w-0`;
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
            autoScroll={autoScroll}
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
            onFullscreenToggle={toggleFullscreen}
          />
        )}


        {/* Fullscreen Exit Button - Only visible on hover */}
        {isFullscreen && (
          <div className="fixed top-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border shadow-lg"
              title="Exit Fullscreen"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto ${isFullscreen ? 'p-1' : 'p-6 pb-20'}`}>
          <div className={`${isFullscreen ? 'w-full h-full' : 'max-w-[1800px] mx-auto'}`}>
            {displayEvents.length > 0 && (
              <div>
                {/* Simple grid layout for both fullscreen and normal view */}
                <div>
                  <div className={getContainerClass()}>
                    {displayEvents.map((event) => (
                      <div key={event.id}>
                        <EventCard
                          event={event}
                          onTogglePin={handleTogglePin}
                          onPreview={handlePreview}
                          isExpanded={cardsExpanded}
                          gridColumns={gridColumns}
                        />
                      </div>
                    ))}
                  </div>
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

      {!isFullscreen && (
        <AutoScrollToggle
          enabled={autoScroll}
          interval={scrollInterval}
          onToggle={() => setAutoScroll(!autoScroll)}
          onIntervalChange={setScrollInterval}
        />
      )}
    </div>
  );
};

export default Index;
