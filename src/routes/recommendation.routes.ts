import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';

const router = Router();
const recommendationController = RecommendationController.getInstance();

router.post('/recommendations', (req, res) => 
  recommendationController.getRecommendations(req, res)
);

export default router; 