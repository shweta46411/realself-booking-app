export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  imageUrl?: string;
  details?: {
    whatToExpect?: string[];
    benefits?: string[];
    preparation?: string[];
  };
}

export interface Timeslot {
  id: string;
  time: string;
  available: boolean;
}

