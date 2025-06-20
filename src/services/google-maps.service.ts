import axios from 'axios';
import { Place } from '../types/place';

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private apiKey: string;

  private constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
  }

  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  public async searchPlaces(query: string, location?: string, radius: number = 5000): Promise<Place[]> {
    try {
      // First, if location is provided, geocode it to get coordinates
      let coordinates;
      if (location) {
        coordinates = await this.geocodeLocation(location);
      }

      // Search for places
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query,
          key: this.apiKey,
          ...(coordinates && { location: `${coordinates.lat},${coordinates.lng}` }),
          radius,
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API Error: ${response.data.status}`);
      }

      return response.data.results.map((place: any) => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        priceLevel: this.getPriceLevel(place.price_level),
        openNow: place.opening_hours?.open_now
      }));
    } catch (error) {
      console.error('Error searching places:', error);
      throw new Error('Failed to search places');
    }
  }

  private async geocodeLocation(address: string) {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: this.apiKey
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Geocoding API Error: ${response.data.status}`);
    }

    return response.data.results[0].geometry.location;
  }

  private getPriceLevel(level?: number): string {
    switch (level) {
      case 0: return 'Free';
      case 1: return 'Inexpensive';
      case 2: return 'Moderate';
      case 3: return 'Expensive';
      case 4: return 'Very Expensive';
      default: return 'Not available';
    }
  }
} 