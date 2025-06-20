import axios from 'axios';

export class LLMService {
  private static instance: LLMService;
  private baseUrl: string;
  private model: string;

  private constructor() {
    this.baseUrl = 'http://localhost:11434'; // Ollama default port
    this.model = 'mistral';
  }

  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  public async generatePlaceRecommendation(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      });

      return response.data.response;
    } catch (error) {
      console.error('Error generating place recommendation:', error);
      throw new Error('Failed to generate place recommendation');
    }
  }
} 