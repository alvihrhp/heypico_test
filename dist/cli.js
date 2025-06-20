#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const recommendation_service_1 = require("./services/recommendation.service");
console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? 'Terisi' : 'Kosong');
const program = new commander_1.Command();
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
    .action((prompt, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recommendationService = recommendation_service_1.RecommendationService.getInstance();
        const radius = parseInt(options.radius);
        console.log('\nMencari rekomendasi untuk:', prompt);
        if (options.location)
            console.log('Di sekitar:', options.location);
        console.log('Radius:', radius, 'meter\n');
        console.log('Mohon tunggu...\n');
        const result = yield recommendationService.getRecommendations(prompt, options.location, radius);
        // Tampilkan hasil rekomendasi
        console.log('🤖 Analisis AI:');
        console.log(result.llmResponse);
        console.log('\n📍 Tempat yang direkomendasikan:');
        result.recommendations.forEach((place, index) => {
            console.log(`\n${index + 1}. ${place.name}`);
            console.log(`   Alamat: ${place.address}`);
            console.log(`   Rating: ${place.rating}⭐`);
            if (place.priceLevel)
                console.log(`   Harga: ${place.priceLevel}`);
            console.log(`   Buka: ${place.openNow ? '✅' : '❌'}`);
            console.log(`   Maps: ${place.mapsUrl}`);
        });
    }
    catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}));
program.parse();
