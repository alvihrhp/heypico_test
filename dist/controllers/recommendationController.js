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
exports.RecommendationController = void 0;
const openWebUIService_1 = require("../services/openWebUIService");
const googleMapsService_1 = require("../services/googleMapsService");
class RecommendationController {
    constructor() {
        this.testGoogleMaps = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.body;
                if (!query) {
                    res.status(400).json({ error: 'Search query is required' });
                    return;
                }
                const places = yield this.googleMapsService.getTopRecommendations(query);
                res.json({ places });
            }
            catch (error) {
                console.error('Error testing Google Maps:', error);
                res.status(500).json({ error: 'Failed to test Google Maps integration' });
            }
        });
        this.getRecommendation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { prompt } = req.body;
                if (!prompt) {
                    res.status(400).json({ error: 'Prompt is required' });
                    return;
                }
                // Create a more specific prompt for the LLM
                const enhancedPrompt = `Kamu adalah asisten AI yang membantu memberikan rekomendasi tempat makan di Indonesia. 
Tolong berikan rekomendasi untuk query berikut dengan detail dan dalam Bahasa Indonesia yang santai:
"${prompt}"

Berikan jawaban yang detail termasuk:
- Alasan kenapa tempat ini direkomendasikan
- Kualitas makanan
- Suasana tempat
- Kisaran harga
- Tips tambahan (jika ada)

Gunakan bahasa yang santai dan natural seperti berbicara dengan teman.`;
                // Get AI recommendation first
                const aiResponse = yield this.openWebUIService.generateRecommendation(enhancedPrompt);
                // Use the original prompt to search for places
                const recommendations = yield this.googleMapsService.getTopRecommendations(prompt);
                const response = {
                    recommendations,
                    aiExplanation: aiResponse
                };
                res.json(response);
            }
            catch (error) {
                console.error('Error in recommendation controller:', error);
                res.status(500).json({ error: 'Failed to generate recommendation' });
            }
        });
        this.openWebUIService = openWebUIService_1.OpenWebUIService.getInstance();
        this.googleMapsService = googleMapsService_1.GoogleMapsService.getInstance();
    }
}
exports.RecommendationController = RecommendationController;
