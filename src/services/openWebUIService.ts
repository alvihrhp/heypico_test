import axios from 'axios';
import { config } from '../config';

interface OllamaResponse {
  response: string;
  done: boolean;
}

export class OpenWebUIService {
  private static instance: OpenWebUIService;
  private baseUrl: string;
  private model: string;

  private constructor() {
    this.baseUrl = 'http://localhost:11434'; // Ollama's default port
    this.model = 'mistral'; // Using Mistral model directly
    console.log('LLM Service initialized with:', {
      baseUrl: this.baseUrl,
      model: this.model
    });
  }

  public static getInstance(): OpenWebUIService {
    if (!OpenWebUIService.instance) {
      OpenWebUIService.instance = new OpenWebUIService();
    }
    return OpenWebUIService.instance;
  }

  public async generateRecommendation(prompt: string): Promise<string> {
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

      const response = await axios.post<OllamaResponse>(
        `${this.baseUrl}/api/generate`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('LLM Response:', {
        status: response.status,
        headers: response.headers,
        responseLength: response.data.response?.length
      });

      if (!response.data.response) {
        throw new Error('No response from LLM');
      }

      return response.data.response;
    } catch (error: any) {
      console.error('Error generating recommendation:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error('Failed to generate recommendation from LLM');
    }
  }
} 