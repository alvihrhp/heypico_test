import { Request, Response } from 'express';
import { OpenWebUIService } from '../services/openWebUIService';
import { GoogleMapsService } from '../services/googleMapsService';
import { AIRecommendationResponse } from '../types';

export class RecommendationController {
  private openWebUIService: OpenWebUIService;
  private googleMapsService: GoogleMapsService;

  constructor() {
    this.openWebUIService = OpenWebUIService.getInstance();
    this.googleMapsService = GoogleMapsService.getInstance();
  }

  public testGoogleMaps = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.body;
      
      if (!query) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const places = await this.googleMapsService.getTopRecommendations(query);
      res.json({ places });
    } catch (error) {
      console.error('Error testing Google Maps:', error);
      res.status(500).json({ error: 'Failed to test Google Maps integration' });
    }
  };

  public getRecommendation = async (req: Request, res: Response): Promise<void> => {
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
      const aiResponse = await this.openWebUIService.generateRecommendation(enhancedPrompt);

      // Use the original prompt to search for places
      const recommendations = await this.googleMapsService.getTopRecommendations(prompt);

      const response: AIRecommendationResponse = {
        recommendations,
        aiExplanation: aiResponse
      };

      res.json(response);
    } catch (error) {
      console.error('Error in recommendation controller:', error);
      res.status(500).json({ error: 'Failed to generate recommendation' });
    }
  };
} 