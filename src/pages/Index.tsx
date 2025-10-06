import { useState, useEffect } from "react";
import { StatusSidebar } from "@/components/StatusSidebar";
import { FilterBar } from "@/components/FilterBar";
import { EventCard } from "@/components/EventCard";
import { PreviewModal } from "@/components/PreviewModal";
import { AutoScrollToggle } from "@/components/AutoScrollToggle";
import { mockEvents } from "@/data/mockEvents";
import { StreamEvent, EventStatus } from "@/types/event";
import { toast } from "sonner";

const Index = () => {
  const [events, setEvents] = useState<StreamEvent[]>(mockEvents);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<EventStatus>>(new Set());
  const [timeFilter, setTimeFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [adminFilter, setAdminFilter] = useState("all");
  const [previewEvent, setPreviewEvent] = useState<StreamEvent | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [gridColumns, setGridColumns] = useState(3);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cardsExpanded, setCardsExpanded] = useState(false);

  const maxPinnedEvents = 3;

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
    if (selectedStatuses.size > 0 && !selectedStatuses.has(event.status)) return false;
    // Add more filter logic here for time, destination, admin
    return true;
  });

  // Separate pinned and unpinned events
  const pinnedEvents = filteredEvents.filter((e) => e.isPinned);
  const unpinnedEvents = filteredEvents.filter((e) => !e.isPinned);

  const handleTogglePin = (id: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === id) {
          const currentPinnedCount = prev.filter((e) => e.isPinned).length;
          
          if (!event.isPinned && currentPinnedCount >= maxPinnedEvents) {
            toast.error(`You can only pin up to ${maxPinnedEvents} events`);
            return event;
          }

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

  const handlePreview = (event: StreamEvent) => {
    setPreviewEvent(event);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      window.scrollBy({ top: 100, behavior: "smooth" });
    }, 2000);

    return () => clearInterval(interval);
  }, [autoScroll]);

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
      <StatusSidebar
        statusCounts={allStatusCounts}
        selectedStatuses={selectedStatuses}
        onStatusToggle={handleStatusToggle}
        onSelectAll={handleSelectAll}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col">
        <FilterBar
          timeFilter={timeFilter}
          destinationFilter={destinationFilter}
          adminFilter={adminFilter}
          gridColumns={gridColumns}
          cardsExpanded={cardsExpanded}
          onTimeFilterChange={setTimeFilter}
          onDestinationFilterChange={setDestinationFilter}
          onAdminFilterChange={setAdminFilter}
          onGridColumnsChange={setGridColumns}
          onCardsExpandedChange={setCardsExpanded}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1800px] mx-auto">
            {pinnedEvents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  📌 Pinned Events
                  <span className="text-sm text-muted-foreground font-normal">
                    ({pinnedEvents.length}/{maxPinnedEvents})
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
        onToggle={() => setAutoScroll(!autoScroll)}
      />
    </div>
  );
};

export default Index;
