#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { RecommendationService } from './services/recommendation.service';

console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? 'Terisi' : 'Kosong');

const program = new Command();

program
  .name('heypico')
  .description('CLI untuk mendapatkan rekomendasi tempat dengan AI')
  .version('1.0.0');

program
  .command('recommend')
  .description('Dapatkan rekomendasi tempat')
  .argument('<prompt>', 'Apa yang kamu cari? (contoh: "Restoran dimsum di Jakarta")')
  .option('-l, --location <location>', 'Lokasi spesifik (opsional)')
  .option('-r, --radius <number>', 'Radius pencarian dalam meter (default: 5000)', '5000')
  .action(async (prompt, options: { location?: string; radius?: string }) => {
    try {
      const recommendationService = RecommendationService.getInstance();
      const radius = parseInt(options.radius!);
      
      console.log('\nMencari rekomendasi untuk:', prompt);
      if (options.location) console.log('Di sekitar:', options.location);
      console.log('Radius:', radius, 'meter\n');
      console.log('Mohon tunggu...\n');

      const result = await recommendationService.getRecommendations(
        prompt,
        options.location,
        radius
      );

      // Tampilkan hasil rekomendasi
      console.log('🤖 Analisis AI:');
      console.log(result.llmResponse);
      console.log('\n📍 Tempat yang direkomendasikan:');
      
      result.recommendations.forEach((place, index) => {
        console.log(`\n${index + 1}. ${place.name}`);
        console.log(`   Alamat: ${place.address}`);
        console.log(`   Rating: ${place.rating}⭐`);
        if (place.priceLevel) console.log(`   Harga: ${place.priceLevel}`);
        console.log(`   Buka: ${place.openNow ? '✅' : '❌'}`);
        console.log(`   Maps: ${place.mapsUrl}`);
      });
    } catch (error: any) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse(); 