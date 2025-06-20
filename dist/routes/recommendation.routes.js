"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recommendation_controller_1 = require("../controllers/recommendation.controller");
const router = (0, express_1.Router)();
const recommendationController = recommendation_controller_1.RecommendationController.getInstance();
router.post('/recommendations', (req, res) => recommendationController.getRecommendations(req, res));
exports.default = router;
