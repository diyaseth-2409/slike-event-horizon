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
  const [viewType, setViewType] = useState<"vertical" | "horizontal">("vertical");
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
  console.log("Current viewType:", viewType, "gridColumns:", gridColumns);
  

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

  // Auto-scroll effect for vertical view
  useEffect(() => {
    if (!autoScroll || viewType === "horizontal") return;

    const interval = setInterval(() => {
      window.scrollBy({ top: 100, behavior: "smooth" });
    }, scrollInterval * 1000);

    return () => clearInterval(interval);
  }, [autoScroll, scrollInterval, viewType]);

  // Auto-rotation effect for horizontal view
  useEffect(() => {
    if (!autoScroll || viewType !== "horizontal") return;

    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        // Calculate videos to show based on grid selection
        let videosToShow = 0;
        if (isFullscreen) {
          // Use fullscreen logic
          switch (gridColumns) {
            case 2:
              videosToShow = 4;
              break;
            case 3:
              videosToShow = 6;
              break;
            case 4:
              videosToShow = 8;
              break;
            case 6:
              videosToShow = 12;
              break;
            case 8:
              videosToShow = 16;
              break;
            default:
              videosToShow = 4;
          }
        } else {
          // Use normal mode logic
          switch (gridColumns) {
            case 2:
              videosToShow = 2;
              break;
            case 3:
              videosToShow = 6;
              break;
            case 4:
              videosToShow = 8;
              break;
            case 6:
              videosToShow = 18;
              break;
            case 8:
              videosToShow = 32;
              break;
            default:
              videosToShow = 8;
          }
        }
        
        const totalPages = Math.ceil(displayEvents.length / videosToShow);
        return (prevPage + 1) % totalPages;
      });
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [autoScroll, viewType, displayEvents.length, gridColumns, isFullscreen]);

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
    } else if (viewType === "horizontal") {
      gapClass = cardsExpanded ? 'gap-6' : 'gap-4';
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
            viewType={viewType}
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
            onViewTypeChange={setViewType}
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

        <main className={`flex-1 ${viewType === "horizontal" ? 'overflow-hidden' : 'overflow-y-auto'} ${isFullscreen ? 'p-1' : viewType === "horizontal" ? 'p-6 pb-8' : 'p-6 pb-20'}`}>
          <div className={`${isFullscreen ? (viewType === "vertical" ? 'w-full h-full' : 'w-full h-[95vh] flex items-center justify-center') : viewType === "horizontal" && !autoScroll ? 'w-full px-2 overflow-x-hidden' : 'max-w-[1800px] mx-auto'}`}>
            {displayEvents.length > 0 && (
              <div>
                {isFullscreen && viewType === "vertical" ? (
                  // Fullscreen vertical view - same as normal grid but fullscreen
                  <div>
                    <div className={getContainerClass()}>
                      {displayEvents.map((event) => (
                        <div key={event.id}>
                          <EventCard
                            event={event}
                            onTogglePin={handleTogglePin}
                            onPreview={handlePreview}
                            isExpanded={cardsExpanded}
                            viewType={viewType}
                            gridColumns={gridColumns}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : isFullscreen || viewType === "horizontal" ? (
                  // Horizontal layout with fixed video counts based on grid
                  <div>
                    {(() => {
                      // Calculate videos to show based on grid selection
                      let videosToShow = 0;
                      let videosPerRow = gridColumns;
                      let totalRows = 0;
                      
                      // Helper function to get height class based on total rows for 16:9 aspect ratio
                      const getRowHeightClass = () => {
                        if (isFullscreen) {
                          // In fullscreen, make videos fill most of the screen height
                          switch (totalRows) {
                            case 1:
                              return 'h-[85vh]'; // Single row takes most of the screen
                            case 2:
                              return 'h-[42vh]'; // Two rows, each taking ~42vh
                            case 3:
                              return 'h-[28vh]'; // Three rows, each taking ~28vh
                            case 4:
                              return 'h-[21vh]'; // Four rows, each taking ~21vh
                            default:
                              return 'h-[42vh]';
                          }
                        } else {
                          // Normal mode
                          switch (totalRows) {
                            case 1:
                              return 'h-[50vh]';
                            case 2:
                              return 'h-[24vh]';
                            case 3:
                              return 'h-[16vh]';
                            case 4:
                              return 'h-[12vh]';
                            default:
                              return 'h-[24vh]';
                          }
                        }
                      };
                      
                      // In fullscreen, show videos based on grid selection
                      if (isFullscreen) {
                        switch (gridColumns) {
                          case 2:
                            videosToShow = 4; // 4 cards in 2x2 grid
                            videosPerRow = 2;
                            totalRows = 2;
                            break;
                          case 3:
                            videosToShow = 6; // 6 cards total (3 per row, 2 rows)
                            videosPerRow = 3;
                            totalRows = 2;
                            break;
                          case 4:
                            videosToShow = 8; // 8 cards total (4 per row, 2 rows)
                            videosPerRow = 4;
                            totalRows = 2;
                            break;
                          case 6:
                            videosToShow = 12; // 12 cards total (6 per row, 2 rows)
                            videosPerRow = 6;
                            totalRows = 2;
                            break;
                          case 8:
                            videosToShow = 16; // 16 cards total (8 per row, 2 rows)
                            videosPerRow = 8;
                            totalRows = 2;
                            break;
                          default:
                            videosToShow = 4; // Default to 4 cards in 2x2 grid
                            videosPerRow = 2;
                            totalRows = 2;
                        }
                      } else {
                        // Normal mode
                        switch (gridColumns) {
                          case 2:
                            videosToShow = 2;
                            totalRows = 1;
                            break;
                          case 3:
                            videosToShow = 6;
                            totalRows = 2;
                            break;
                          case 4:
                            videosToShow = 8;
                            totalRows = 2;
                            break;
                          case 6:
                            videosToShow = 18;
                            totalRows = 3;
                            break;
                          case 8:
                            videosToShow = 32;
                            totalRows = 4;
                            break;
                          default:
                            videosToShow = 8;
                            totalRows = 2;
                        }
                      }
                      
                      if (autoScroll) {
                        // Auto-scroll mode: show videos that rotate every 5 seconds
                        const startIndex = currentPage * videosToShow;
                        const gridEvents = displayEvents.slice(startIndex, startIndex + videosToShow);
                        
                        console.log("Fullscreen mode - videosToShow:", videosToShow, "gridEvents:", gridEvents.length, "displayEvents:", displayEvents.length);
                        
                        // Create rows for grid display
                        const rows = [];
                        for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
                          const rowStartIndex = rowIndex * videosPerRow;
                          const rowEvents = gridEvents.slice(rowStartIndex, rowStartIndex + videosPerRow);
                          
                          rows.push(
                            <div key={rowIndex} className={`flex gap-1 w-full overflow-x-hidden ${isFullscreen ? `${getRowHeightClass()} mb-1` : 'gap-2 mb-2'}`}>
                              {rowEvents.map((event) => (
                                <div key={event.id} className={`flex-1 ${isFullscreen ? getRowHeightClass() : ''}`}>
                                  <EventCard
                                    event={event}
                                    onTogglePin={handleTogglePin}
                                    onPreview={handlePreview}
                                    isExpanded={cardsExpanded}
                                    viewType={viewType}
                                    gridColumns={gridColumns}
                                  />
                                </div>
                              ))}
                              {/* Fill remaining slots if row is not full */}
                              {Array.from({ length: videosPerRow - rowEvents.length }, (_, i) => (
                                <div key={`empty-${rowIndex}-${i}`} className={`flex-1 ${isFullscreen ? getRowHeightClass() : ''}`}></div>
                              ))}
                            </div>
                          );
                        }
                        
                        return (
                          <div className={`flex flex-col ${isFullscreen ? 'gap-0' : 'gap-3'}`}>
                            {rows}
                          </div>
                        );
                      } else {
                        // Static mode: show videos in grid format with pagination
                        const startIndex = currentPage * videosToShow;
                        const gridEvents = displayEvents.slice(startIndex, startIndex + videosToShow);
                        
                        console.log("Static mode - videosToShow:", videosToShow, "gridEvents:", gridEvents.length, "displayEvents:", displayEvents.length, "isFullscreen:", isFullscreen);
                        
                        const rows = [];
                        for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
                          const rowStartIndex = rowIndex * videosPerRow;
                          const rowEvents = gridEvents.slice(rowStartIndex, rowStartIndex + videosPerRow);
                          
                          rows.push(
                            <div key={rowIndex} className={`flex gap-1 w-full overflow-x-hidden ${isFullscreen ? `${getRowHeightClass()} mb-1` : 'gap-2 mb-2'}`}>
                              {rowEvents.map((event) => (
                                <div key={event.id} className={`flex-1 ${isFullscreen ? getRowHeightClass() : ''}`}>
                                  <EventCard
                                    event={event}
                                    onTogglePin={handleTogglePin}
                                    onPreview={handlePreview}
                                    isExpanded={cardsExpanded}
                                    viewType={viewType}
                                    gridColumns={gridColumns}
                                  />
                                </div>
                              ))}
                              {/* Fill remaining slots if row is not full */}
                              {Array.from({ length: videosPerRow - rowEvents.length }, (_, i) => (
                                <div key={`empty-${rowIndex}-${i}`} className={`flex-1 ${isFullscreen ? getRowHeightClass() : ''}`}></div>
                              ))}
                            </div>
                          );
                        }
                        
                        // Calculate total pages for pagination
                        const totalPages = Math.ceil(displayEvents.length / videosToShow);
                        
                        return (
                          <div className="flex flex-col w-full overflow-x-hidden">
                            {/* Main Content Area with Navigation Arrows in Middle */}
                            {isFullscreen && viewType === "vertical" ? (
                              // In fullscreen vertical view, just show the grid without arrows
                              <div className="flex flex-col flex-1 min-w-0 gap-0">
                                {rows}
                              </div>
                            ) : (
                              // In horizontal view or non-fullscreen, show arrows
                              <div className={`flex items-center justify-center ${isFullscreen ? 'gap-2' : 'gap-6'}`}>
                                {/* Left Pagination Button - Positioned in middle */}
                                <div className="flex-shrink-0 flex items-center justify-center">
                                  Page {currentPage + 1} of {totalPages}
                                </div>
                                
                                {/* Video Grid */}
                                <div className={`flex flex-col flex-1 min-w-0 ${isFullscreen ? 'gap-0' : 'gap-2'}`}>
                                  {rows}
                                </div>
                                
                                {/* Right Pagination Button - Positioned in middle */}
                                <div className="flex-shrink-0 flex items-center justify-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className={`${isFullscreen ? 'h-10 w-10' : 'h-14 w-14'} p-0 rounded-full shadow-xl border-2 transition-all duration-200 ${
                                      currentPage >= totalPages - 1 
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                                    }`}
                                    title="Next page"
                                  >
                                    <ChevronRight className={`${isFullscreen ? 'h-4 w-4' : 'h-6 w-6'}`} />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    })()}
                  </div>
                ) : (
                  // Normal grid layout
                  <div>
                    <div className={getContainerClass()}>
                      {displayEvents.map((event) => (
                        <div key={event.id}>
                                <EventCard
                                  event={event}
                                  onTogglePin={handleTogglePin}
                                  onPreview={handlePreview}
                                  isExpanded={cardsExpanded}
                                  viewType={viewType}
                                  gridColumns={gridColumns}
                                />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
