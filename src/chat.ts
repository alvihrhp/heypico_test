#!/usr/bin/env node
import 'dotenv/config';
import { input } from '@inquirer/prompts';
import { RecommendationService } from './services/recommendation.service';
import { LLMService } from './services/llm.service';

async function startChat() {
  console.log('\n🤖 Hi! I am an AI assistant that can help you find place recommendations.');
  console.log('   You can ask me anything about restaurants, cafes, tourist spots, etc.');
  console.log('   Example: "Find me a good dimsum restaurant in South Jakarta"\n');

  const recommendationService = RecommendationService.getInstance();
  const llmService = LLMService.getInstance();

  // Keywords yang mengindikasikan pencarian tempat
  const locationKeywords = [
    // Bahasa Indonesia
    'dimana', 'rekomendasi', 'rekomendasikan', 'cari', 'carikan',
    'restoran', 'restaurant', 'cafe', 'kafe', 'tempat', 'lokasi',
    'mall', 'toko', 'wisata', 'destinasi', 'hotel', 'penginapan',
    
    // English
    'where', 'recommend', 'recommendation', 'find', 'search', 'looking for',
    'restaurant', 'cafe', 'place', 'location', 'spot', 'area',
    'mall', 'shop', 'store', 'tourist', 'destination', 'hotel', 'lodge',
    'food', 'dining', 'eat', 'drink', 'hangout', 'visit', 'go to'
  ];

  while (true) {
    const prompt = await input({
      message: '🤔 You: '
    });

    if (prompt.toLowerCase() === 'exit' || prompt.toLowerCase() === 'quit') {
      console.log('\n👋 Goodbye! Have a great day!\n');
      process.exit(0);
    }

    console.log('\n🔍 Processing...\n');

    try {
      // Cek apakah prompt mengandung keywords pencarian tempat
      const isLocationQuery = locationKeywords.some(keyword => 
        prompt.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isLocationQuery) {
        // Gunakan RecommendationService untuk query lokasi
        const result = await recommendationService.getRecommendations(prompt);
        
        console.log('🤖 AI Analysis:');
        console.log(result.llmResponse);
        console.log('\n📍 Recommended Places:');
        
        result.recommendations.forEach((place, index) => {
          console.log(`\n${index + 1}. ${place.name}`);
          console.log(`   Address: ${place.address}`);
          console.log(`   Rating: ${place.rating}⭐`);
          if (place.priceLevel) console.log(`   Price: ${place.priceLevel}`);
          console.log(`   Open: ${place.openNow ? '✅' : '❌'}`);
          console.log(`   Maps: ${place.mapsUrl}`);
        });
      } else {
        // Gunakan LLM saja untuk chat biasa
        const response = await llmService.generatePlaceRecommendation(prompt);
        console.log('🤖 AI:', response);
      }
      console.log('\n');
    } catch (error: any) {
      console.error('\n❌ Error:', error.message);
      console.log('   Please try again!\n');
    }
  }
}

startChat(); 