export interface PlaceRecommendation {
  name: string;
  address: string;
  rating: number;
  googleMapsUrl: string;
  reasonForRecommendation: string;
}

export interface LLMResponse {
  content: string;
  role: string;
}

export interface GoogleMapsPlace {
  name: string;
  formatted_address: string;
  rating: number;
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  }
}

export interface AIRecommendationResponse {
  recommendations: PlaceRecommendation[];
  aiExplanation: string;
} 