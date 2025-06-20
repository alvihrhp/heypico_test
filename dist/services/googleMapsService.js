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
const config_1 = require("../config");
class GoogleMapsService {
    constructor() {
        var _a;
        this.apiKey = config_1.config.googleMaps.apiKey;
        console.log('GoogleMapsService initialized with API key length:', ((_a = this.apiKey) === null || _a === void 0 ? void 0 : _a.length) || 0);
    }
    static getInstance() {
        if (!GoogleMapsService.instance) {
            GoogleMapsService.instance = new GoogleMapsService();
        }
        return GoogleMapsService.instance;
    }
    searchPlaces(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                console.log('Searching places with query:', query);
                const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
                console.log('Request URL:', url);
                const params = {
                    query,
                    key: this.apiKey,
                    language: 'id', // Set language to Indonesian
                    region: 'id' // Set region to Indonesia
                };
                console.log('Request params:', Object.assign(Object.assign({}, params), { key: '***' }));
                const response = yield axios_1.default.get(url, { params });
                console.log('Google Maps API Response:', {
                    status: response.data.status,
                    resultsCount: (_a = response.data.results) === null || _a === void 0 ? void 0 : _a.length,
                    firstResult: (_b = response.data.results) === null || _b === void 0 ? void 0 : _b[0]
                });
                if (response.data.status === 'REQUEST_DENIED') {
                    throw new Error(`Google Maps API request denied: ${response.data.error_message}`);
                }
                return response.data.results || [];
            }
            catch (error) {
                const axiosError = error;
                console.error('Error searching places:', ((_c = axiosError.response) === null || _c === void 0 ? void 0 : _c.data) || axiosError.message);
                throw new Error('Failed to search places on Google Maps');
            }
        });
    }
    generateMapsUrl(place) {
        const { location } = place.geometry;
        const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}&query_place_id=${place.place_id}`;
        console.log('Generated Maps URL:', url);
        return url;
    }
    getTopRecommendations(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, limit = 3) {
            console.log('Getting top recommendations for query:', query);
            const places = yield this.searchPlaces(query);
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
        });
    }
}
exports.GoogleMapsService = GoogleMapsService;
