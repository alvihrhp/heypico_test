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
exports.GoogleMapsService = void 0;
const axios_1 = __importDefault(require("axios"));
class GoogleMapsService {
    constructor() {
        this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    }
    static getInstance() {
        if (!GoogleMapsService.instance) {
            GoogleMapsService.instance = new GoogleMapsService();
        }
        return GoogleMapsService.instance;
    }
    searchPlaces(query_1, location_1) {
        return __awaiter(this, arguments, void 0, function* (query, location, radius = 5000) {
            try {
                // First, if location is provided, geocode it to get coordinates
                let coordinates;
                if (location) {
                    coordinates = yield this.geocodeLocation(location);
                }

                console.log(this.apiKey);
                // Search for places
                const response = yield axios_1.default.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                    params: Object.assign(Object.assign({ query, key: this.apiKey }, (coordinates && { location: `${coordinates.lat},${coordinates.lng}` })), { radius })
                });

                console.log(response.data);
                if (response.data.status !== 'OK') {
                    throw new Error(`Google Places API Error: ${response.data.status}`);
                }
                return response.data.results.map((place) => {
                    var _a;
                    return ({
                        name: place.name,
                        address: place.formatted_address,
                        rating: place.rating,
                        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                        reasonForRecommendation: '', // This will be filled by the LLM
                        priceLevel: place.price_level ? this.getPriceLevel(place.price_level) : undefined,
                        openNow: (_a = place.opening_hours) === null || _a === void 0 ? void 0 : _a.open_now
                    });
                });
            }
            catch (error) {
                console.error('Error searching places:', error);
                throw new Error('Failed to search places');
            }
        });
    }
    geocodeLocation(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get('https://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address,
                        key: this.apiKey
                    }
                });
                if (response.data.status !== 'OK') {
                    throw new Error(`Geocoding API Error: ${response.data.status}`);
                }
                const { lat, lng } = response.data.results[0].geometry.location;
                return { lat, lng };
            }
            catch (error) {
                console.error('Error geocoding location:', error);
                throw new Error('Failed to geocode location');
            }
        });
    }
    getPriceLevel(level) {
        const levels = ['Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
        return levels[level - 1] || 'Unknown';
    }
}
exports.GoogleMapsService = GoogleMapsService;
