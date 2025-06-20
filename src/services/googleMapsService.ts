import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { GoogleMapsPlace, PlaceRecommendation } from '../types';

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private apiKey: string;

  private constructor() {
    this.apiKey = config.googleMaps.apiKey;
    console.log('GoogleMapsService initialized with API key length:', this.apiKey?.length || 0);
  }

  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  public async searchPlaces(query: string): Promise<GoogleMapsPlace[]> {
    try {
      console.log('Searching places with query:', query);
      
      const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
      console.log('Request URL:', url);
      
      const params = {
        query,
        key: this.apiKey,
        language: 'id', // Set language to Indonesian
        region: 'id'    // Set region to Indonesia
      };
      console.log('Request params:', { ...params, key: '***' });

      const response = await axios.get(url, { params });
      
      console.log('Google Maps API Response:', {
        status: response.data.status,
        resultsCount: response.data.results?.length,
        firstResult: response.data.results?.[0]
      });

      if (response.data.status === 'REQUEST_DENIED') {
        throw new Error(`Google Maps API request denied: ${response.data.error_message}`);
      }

      return response.data.results || [];
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error searching places:', axiosError.response?.data || axiosError.message);
      throw new Error('Failed to search places on Google Maps');
    }
  }

  public generateMapsUrl(place: GoogleMapsPlace): string {
    const { location } = place.geometry;
    const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}&query_place_id=${place.place_id}`;
    console.log('Generated Maps URL:', url);
    return url;
  }

  public async getTopRecommendations(query: string, limit: number = 3): Promise<PlaceRecommendation[]> {
    console.log('Getting top recommendations for query:', query);
    const places = await this.searchPlaces(query);
    
    const recommendations = places
      .slice(0, limit)
      .map(place => {
        const recommendation = {
          name: place.name,
          address: place.formatted_address,
          rating: place.rating,
          googleMapsUrl: this.generateMapsUrl(place),
          reasonForRecommendation: `${place.name} memiliki rating ${place.rating}/5 di Google Maps dan berlokasi di ${place.formatted_address}.`
        };
        console.log('Created recommendation:', recommendation);
        return recommendation;
      });

    return recommendations;
  }
} 