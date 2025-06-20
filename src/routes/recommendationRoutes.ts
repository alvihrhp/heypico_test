import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController';

const router = Router();
const recommendationController = new RecommendationController();

// Debug: Log when routes are being registered
console.log('Registering recommendation routes...');

// GET endpoint for testing
router.get('/test', (_, res) => {
  res.json({ message: 'API is working!' });
});

router.post('/recommend', (req, res) => {
  console.log('Recommend endpoint hit with body:', req.body);
  return recommendationController.getRecommendation(req, res);
});

router.post('/test-maps', (req, res) => {
  console.log('Test maps endpoint hit with body:', req.body);
  return recommendationController.testGoogleMaps(req, res);
});

// Debug: Log registered routes
console.log('Registered routes in recommendationRoutes:');
router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    const methods = Object.keys(r.route.methods || {});
    console.log(`${methods} ${r.route.path}`);
  }
});

export default router; 