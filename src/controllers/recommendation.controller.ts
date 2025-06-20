import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { PlaceRecommendationRequest } from '../types/place';

export class RecommendationController {
  private static instance: RecommendationController;
  private recommendationService: RecommendationService;

  private constructor() {
    this.recommendationService = RecommendationService.getInstance();
  }

  public static getInstance(): RecommendationController {
    if (!RecommendationController.instance) {
      RecommendationController.instance = new RecommendationController();
    }
    return RecommendationController.instance;
  }

  public async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, location, radius } = req.body as PlaceRecommendationRequest;

      if (!prompt) {
        res.status(400).json({
          error: 'Prompt is required'
        });
        return;
      }

      const recommendations = await this.recommendationService.getRecommendations(
        prompt,
        location,
        radius
      );

      res.status(200).json(recommendations);
    } catch (error) {
      console.error('Error in recommendation controller:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
} 