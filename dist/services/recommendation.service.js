"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const llm_service_1 = require("./llm.service");
const maps_service_1 = require("./maps.service");
class RecommendationService {
    constructor() {
        this.llmService = llm_service_1.LLMService.getInstance();
        this.mapsService = maps_service_1.GoogleMapsService.getInstance();
    }
    static getInstance() {
        if (!RecommendationService.instance) {
            RecommendationService.instance = new RecommendationService();
        }
        return RecommendationService.instance;
    }
    getRecommendations(prompt, location, radius) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First, get place recommendations from Google Maps
                const places = yield this.mapsService.searchPlaces(prompt, location, radius);
                // Generate LLM response for the recommendations
                const llmPrompt = this.generateLLMPrompt(places, prompt);
                const llmResponse = yield this.llmService.generatePlaceRecommendation(llmPrompt);
                // Parse LLM response to extract reasoning for each place
                const enhancedPlaces = this.enhancePlacesWithLLMResponse(places, llmResponse);
                return {
                    recommendations: enhancedPlaces,
                    llmResponse
                };
            }
            catch (error) {
                console.error('Error getting recommendations:', error);
                throw new Error('Failed to get recommendations');
            }
        });
    }
    generateLLMPrompt(places, userPrompt) {
        const placesList = places
            .map((place, index) => {
            return `${index + 1}. ${place.name}
           - Address: ${place.address}
           - Rating: ${place.rating}
           - Price Level: ${place.priceLevel || 'Not available'}
           - Open Now: ${place.openNow ? 'Yes' : 'No'}`;
        })
            .join('\n\n');
        return `User is looking for: "${userPrompt}"

Here are some places I found:

${placesList}

Please analyze these places and provide a detailed recommendation explaining why each place would be good based on their ratings, location, price level, and other characteristics. Focus on matching the user's needs and preferences. Format your response as a natural conversation, but make sure to reference each place specifically.`;
    }
    enhancePlacesWithLLMResponse(places, llmResponse) {
        // This is a simple implementation. You might want to make this more sophisticated
        // by using natural language processing to match LLM responses with specific places
        return places.map(place => {
            const placeNameIndex = llmResponse.toLowerCase().indexOf(place.name.toLowerCase());
            if (placeNameIndex !== -1) {
                // Find the next sentence or two after the place name is mentioned
                const startIndex = placeNameIndex + place.name.length;
                const endIndex = llmResponse.indexOf('.', startIndex + 50) + 1 || startIndex + 100;
                const reason = llmResponse.substring(startIndex, endIndex).trim();
                return Object.assign(Object.assign({}, place), { reasonForRecommendation: reason });
            }
            return place;
        });
    }
}
exports.RecommendationService = RecommendationService;
