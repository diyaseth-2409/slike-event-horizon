export type EventStatus = 
  | "healthy" 
  | "low-views" 
  | "low-interaction" 
  | "stream-freeze" 
  | "error" 
  | "not-live";

export type VoiceModulation = 
  | "good" 
  | "needs-review" 
  | "poor-connection";

export type Destination = {
  name: string;
  icon: string;
  connected: boolean;
  error?: string;
};

export interface StreamEvent {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  thumbnail: string;
  dateTime: string;
  viewers: number;
  watching: number;
  status: EventStatus;
  voiceModulation: VoiceModulation;
  admin: string;
  createdBy?: string;
  isPinned: boolean;
  destinations: Destination[];
  product: string;
  sourceType: "RTMP Studio" | "Web Studio";
}
