export interface Place {
  name: string;
  address: string;
  rating: number;
  mapsUrl: string;
  priceLevel?: string;
  openNow?: boolean;
  reasonForRecommendation?: string;
}

export interface PlaceRecommendationRequest {
  prompt: string;
  location?: string;
  radius?: number;
}

export interface PlaceRecommendationResponse {
  recommendations: Place[];
  llmResponse: string;
} 