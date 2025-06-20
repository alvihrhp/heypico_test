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
const recommendation_service_1 = require("../services/recommendation.service");
class RecommendationController {
    constructor() {
        this.recommendationService = recommendation_service_1.RecommendationService.getInstance();
    }
    static getInstance() {
        if (!RecommendationController.instance) {
            RecommendationController.instance = new RecommendationController();
        }
        return RecommendationController.instance;
    }
    getRecommendations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { prompt, location, radius } = req.body;
                if (!prompt) {
                    res.status(400).json({
                        error: 'Prompt is required'
                    });
                    return;
                }
                const recommendations = yield this.recommendationService.getRecommendations(prompt, location, radius);
                res.status(200).json(recommendations);
            }
            catch (error) {
                console.error('Error in recommendation controller:', error);
                res.status(500).json({
                    error: 'Internal server error'
                });
            }
        });
    }
}
exports.RecommendationController = RecommendationController;
