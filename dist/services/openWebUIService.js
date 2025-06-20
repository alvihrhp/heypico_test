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
exports.OpenWebUIService = void 0;
const axios_1 = __importDefault(require("axios"));
class OpenWebUIService {
    constructor() {
        this.baseUrl = 'http://localhost:11434'; // Ollama's default port
        this.model = 'mistral'; // Using Mistral model directly
        console.log('LLM Service initialized with:', {
            baseUrl: this.baseUrl,
            model: this.model
        });
    }
    static getInstance() {
        if (!OpenWebUIService.instance) {
            OpenWebUIService.instance = new OpenWebUIService();
        }
        return OpenWebUIService.instance;
    }
    generateRecommendation(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                console.log('Generating recommendation with prompt:', prompt);
                const payload = {
                    model: this.model,
                    prompt,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        top_p: 0.9
                    }
                };
                console.log('Request payload:', payload);
                const response = yield axios_1.default.post(`${this.baseUrl}/api/generate`, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('LLM Response:', {
                    status: response.status,
                    headers: response.headers,
                    responseLength: (_a = response.data.response) === null || _a === void 0 ? void 0 : _a.length
                });
                if (!response.data.response) {
                    throw new Error('No response from LLM');
                }
                return response.data.response;
            }
            catch (error) {
                console.error('Error generating recommendation:', {
                    message: error.message,
                    response: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    status: (_c = error.response) === null || _c === void 0 ? void 0 : _c.status
                });
                throw new Error('Failed to generate recommendation from LLM');
            }
        });
    }
}
exports.OpenWebUIService = OpenWebUIService;
