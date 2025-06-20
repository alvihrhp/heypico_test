"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.config = {
    port: process.env.PORT || 3002,
    nodeEnv: process.env.NODE_ENV || 'development',
    openWebUI: {
        baseUrl: process.env.OPENWEBUI_BASE_URL || 'http://localhost:3000',
        apiKey: process.env.OPENWEBUI_API_KEY || '',
        model: process.env.LLM_MODEL || 'mistral',
    },
    googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    }
};
// Validate required environment variables
const requiredEnvVars = ['OPENWEBUI_API_KEY', 'GOOGLE_MAPS_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}
