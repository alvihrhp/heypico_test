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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const axios_1 = __importDefault(require("axios"));
class LLMService {
    constructor() {
        this.baseUrl = process.env.OPENWEBUI_BASE_URL || 'http://localhost:3000';
        this.apiKey = process.env.OPENWEBUI_API_KEY || '';
        this.model = process.env.LLM_MODEL || 'mistral';
    }
    static getInstance() {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService();
        }
        return LLMService.instance;
    }
    generatePlaceRecommendation(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${this.baseUrl}/api/chat`, {
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful AI assistant that provides detailed recommendations for places to visit, eat, or explore. Focus on providing specific details about why you recommend certain places, considering factors like ratings, ambiance, service quality, and unique features.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                }, {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                });
                return response.data.choices[0].message.content;
            }
            catch (error) {
                console.error('Error generating place recommendation:', error);
                throw new Error('Failed to generate place recommendation');
            }
        });
    }
}
exports.LLMService = LLMService;
