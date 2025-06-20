import { LLMService } from './llm.service';
import { GoogleMapsService } from './google-maps.service';
import { Place, PlaceRecommendationResponse } from '../types/place';

export class RecommendationService {
  private static instance: RecommendationService;
  private llmService: LLMService;
  private mapsService: GoogleMapsService;

  private constructor() {
    this.llmService = LLMService.getInstance();
    this.mapsService = GoogleMapsService.getInstance();
  }

  public static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  public async getRecommendations(
    prompt: string,
    location?: string,
    radius: number = 5000
  ): Promise<PlaceRecommendationResponse> {
    try {
      // Get place recommendations from Google Maps
      const places = await this.mapsService.searchPlaces(prompt, location, radius);

      // Generate prompt for LLM
      const llmPrompt = this.generateLLMPrompt(places, prompt);
      
      // Get LLM analysis
      const llmResponse = await this.llmService.generatePlaceRecommendation(llmPrompt);

      return {
        recommendations: places,
        llmResponse
      };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  private generateLLMPrompt(places: Place[], userPrompt: string): string {
    const placesList = places
      .map((place, index) => (
        `${index + 1}. ${place.name}\n` +
        `   - Address: ${place.address}\n` +
        `   - Rating: ${place.rating}\n` +
        `   - Price Level: ${place.priceLevel || 'Not available'}\n` +
        `   - Open Now: ${place.openNow ? 'Yes' : 'No'}`
      ))
      .join('\n\n');

    return `User is looking for: "${userPrompt}"\n\n` +
           `Here are some places I found:\n\n${placesList}\n\n` +
           `Please analyze these places and provide a detailed recommendation explaining why each place would be good based on their ratings, location, price level, and other characteristics. Focus on matching the user's needs and preferences. Format your response as a natural conversation, but make sure to reference each place specifically.`;
  }
} 