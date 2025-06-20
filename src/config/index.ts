import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
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
} as const;

// Validate required environment variables
const requiredEnvVars = ['OPENWEBUI_API_KEY', 'GOOGLE_MAPS_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
} 