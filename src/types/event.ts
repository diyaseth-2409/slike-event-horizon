export type EventStatus = 
  | "healthy" 
  | "low-views" 
  | "low-interaction" 
  | "stream-freeze" 
  | "error" 
  | "not-live";

export type Destination = {
  name: string;
  icon: string;
  connected: boolean;
  error?: string;
};

export interface StreamEvent {
  id: string;
  title: string;
  thumbnail: string;
  dateTime: string;
  viewers: number;
  status: EventStatus;
  admin: string;
  isPinned: boolean;
  destinations: Destination[];
}
