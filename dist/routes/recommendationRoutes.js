"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendationController_1 = require("../controllers/recommendationController");
const router = (0, express_1.Router)();
const recommendationController = new recommendationController_1.RecommendationController();
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
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        const methods = Object.keys(r.route.methods || {});
        console.log(`${methods} ${r.route.path}`);
    }
});
exports.default = router;
