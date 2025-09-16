import { motion } from 'framer-motion';
import { Wheat, Droplets, Sun, TrendingUp, AlertTriangle, Lightbulb, Leaf } from 'lucide-react';
import { CropSuggestion as CropSuggestionType, ConsolidatedData } from '../types/weather';

interface CropSuggestionProps {
  weatherData: ConsolidatedData;
}

// Comprehensive crop database with detailed information
const getCropSuggestions = (weatherData: ConsolidatedData): CropSuggestionType[] => {
  const { temperature, humidity, precipitation, soil } = weatherData.current;
  const currentTemp = temperature.current;
  const avgHumidity = humidity;
  const rainExpected = precipitation.probability > 50;
  const soilMoisture = soil.moisture;
  
  // Determine season based on current month
  const currentMonth = new Date().getMonth() + 1;
  const isKharifSeason = currentMonth >= 6 && currentMonth <= 10; // June-Oct
  const isRabiSeason = currentMonth >= 11 || currentMonth <= 3; // Nov-Mar
  const isZaidSeason = currentMonth >= 4 && currentMonth <= 6; // Apr-June

  const crops: CropSuggestionType[] = [];
  const CONFIDENCE_THRESHOLD = 50; // Only show crops with 50%+ confidence

  // Helper function to calculate crop suitability and confidence
  const evaluateCrop = (
    tempRange: [number, number],
    humidityRange: [number, number],
    moistureRange: [number, number],
    rainPreference: boolean | null = null
  ) => {
    let confidence = 0;
    let suitability: 'excellent' | 'good' | 'moderate' | 'poor' = 'poor';

    // Temperature scoring
    if (currentTemp >= tempRange[0] && currentTemp <= tempRange[1]) {
      const tempOptimal = (tempRange[0] + tempRange[1]) / 2;
      const tempScore = 100 - Math.abs(currentTemp - tempOptimal) / (tempRange[1] - tempRange[0]) * 50;
      confidence += tempScore * 0.4;
    } else {
      confidence += Math.max(0, 20 - Math.abs(currentTemp - tempRange[0]) * 2) * 0.4;
    }

    // Humidity scoring
    if (avgHumidity >= humidityRange[0] && avgHumidity <= humidityRange[1]) {
      confidence += 100 * 0.25;
    } else {
      confidence += Math.max(0, 50 - Math.abs(avgHumidity - humidityRange[0]) * 1) * 0.25;
    }

    // Soil moisture scoring
    if (soilMoisture >= moistureRange[0] && soilMoisture <= moistureRange[1]) {
      confidence += 100 * 0.25;
    } else {
      confidence += Math.max(0, 50 - Math.abs(soilMoisture - moistureRange[0]) * 1) * 0.25;
    }

    // Rain preference scoring
    if (rainPreference !== null) {
      if ((rainPreference && rainExpected) || (!rainPreference && !rainExpected)) {
        confidence += 100 * 0.1;
      } else {
        confidence += 50 * 0.1;
      }
    } else {
      confidence += 75 * 0.1;
    }

    // Determine suitability based on confidence
    if (confidence >= 85) suitability = 'excellent';
    else if (confidence >= 70) suitability = 'good';
    else if (confidence >= 55) suitability = 'moderate';
    else suitability = 'poor';

    return { confidence: Math.round(confidence), suitability };
  };

  // CEREALS

  // Rice - Kharif season
  if (isKharifSeason) {
    const evaluation = evaluateCrop([20, 37], [50, 85], [60, 90], true);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Rice (Paddy)',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'June-July',
        harvestTime: 'November-December',
        waterRequirement: 'high',
        expectedYield: '4-6 tons/hectare',
        marketPrice: '₹2,000-2,500/quintal',
        soilRequirement: 'Clay loam, high water retention capacity',
        climateRequirement: '20-37°C, 50-75% humidity, 1000-2000mm rainfall',
        spacing: '20cm x 15cm',
        seeds: '25-30 kg/hectare',
        fertilizer: 'NPK 120:60:40 kg/hectare',
        pestManagement: 'Stem borer, leaf folder control',
        challenges: ['Water management', 'Pest control', 'Weather dependency'],
        benefits: ['High yield potential', 'Staple food crop', 'Government support'],
        tips: ['Maintain 2-5cm water level', 'Use certified seeds', 'Apply organic matter']
      });
    }
  }

  // Wheat - Rabi season
  if (isRabiSeason) {
    const evaluation = evaluateCrop([10, 25], [30, 70], [30, 70], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Wheat',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'November-December',
        harvestTime: 'March-April',
        waterRequirement: 'medium',
        expectedYield: '3-5 tons/hectare',
        marketPrice: '₹2,100-2,400/quintal',
        soilRequirement: 'Well-drained loam soil, pH 6.0-7.5',
        climateRequirement: '10-25°C, moderate humidity, 400-600mm water',
        spacing: '20-23cm row spacing',
        seeds: '100-125 kg/hectare',
        fertilizer: 'NPK 120:60:40 kg/hectare',
        pestManagement: 'Aphid, termite, rust disease control',
        challenges: ['Late sowing risks', 'Heat stress', 'Disease management'],
        benefits: ['Stable market', 'Good storage life', 'High protein content'],
        tips: ['Sow by December 15', 'Use disease-resistant varieties', 'Apply zinc fertilizer']
      });
    }
  }

  // Maize - Multiple seasons
  const maizeEvaluation = evaluateCrop([15, 35], [40, 80], [40, 80], null);
  if (maizeEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : isRabiSeason ? 'Rabi' : 'Zaid';
    crops.push({
      name: 'Maize (Corn)',
      type: isKharifSeason ? 'kharif' : isRabiSeason ? 'rabi' : 'zaid',
      suitability: maizeEvaluation.suitability,
      confidence: maizeEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : isRabiSeason ? 'October-November' : 'February-March',
      harvestTime: isKharifSeason ? 'September-October' : isRabiSeason ? 'February-March' : 'May-June',
      waterRequirement: 'medium',
      expectedYield: '4-7 tons/hectare',
      marketPrice: '₹1,800-2,200/quintal',
      soilRequirement: 'Well-drained fertile soil, pH 5.8-8.0',
      climateRequirement: '15-35°C, 500-750mm rainfall',
      spacing: '60cm x 20cm',
      seeds: '20-25 kg/hectare',
      fertilizer: 'NPK 120:60:40 kg/hectare',
      pestManagement: 'Fall armyworm, stem borer control',
      challenges: ['Pest management', 'Storage issues', 'Price fluctuation'],
      benefits: ['Versatile crop', 'Good feed value', 'Industrial demand'],
      tips: ['Use hybrid varieties', 'Proper spacing important', 'Harvest at right moisture']
    });
  }

  // Barley - Rabi season
  if (isRabiSeason) {
    const evaluation = evaluateCrop([12, 22], [40, 70], [30, 60], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Barley',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'November-December',
        harvestTime: 'March-April',
        waterRequirement: 'low',
        expectedYield: '2.5-4 tons/hectare',
        marketPrice: '₹1,500-1,800/quintal',
        soilRequirement: 'Well-drained loam, saline tolerant',
        climateRequirement: '12-22°C, 300-400mm rainfall',
        spacing: '22-25cm row spacing',
        seeds: '75-100 kg/hectare',
        fertilizer: 'NPK 60:30:30 kg/hectare',
        pestManagement: 'Aphid and rust control',
        challenges: ['Limited market demand', 'Low profitability'],
        benefits: ['Drought tolerant', 'Saline soil adaptable', 'Animal feed'],
        tips: ['Early sowing better', 'Avoid waterlogging', 'Harvest when mature']
      });
    }
  }

  // Pearl Millet (Bajra) - Kharif
  if (isKharifSeason) {
    const evaluation = evaluateCrop([20, 35], [40, 80], [20, 60], null);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Pearl Millet (Bajra)',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'June-July',
        harvestTime: 'September-October',
        waterRequirement: 'low',
        expectedYield: '1.5-3 tons/hectare',
        marketPrice: '₹1,800-2,200/quintal',
        soilRequirement: 'Sandy loam, drought tolerant',
        climateRequirement: '20-35°C, 300-600mm rainfall',
        spacing: '45cm x 15cm',
        seeds: '4-5 kg/hectare',
        fertilizer: 'NPK 40:20:20 kg/hectare',
        pestManagement: 'Downy mildew, shoot fly control',
        challenges: ['Bird damage', 'Processing difficulties'],
        benefits: ['Drought resistant', 'Nutritious grain', 'Climate resilient'],
        tips: ['Bird protection needed', 'Intercropping beneficial', 'Timely harvesting']
      });
    }
  }

  // Sorghum (Jowar) - Kharif/Rabi
  const sorghumEvaluation = evaluateCrop([20, 35], [30, 70], [20, 70], null);
  if (sorghumEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Rabi';
    crops.push({
      name: 'Sorghum (Jowar)',
      type: isKharifSeason ? 'kharif' : 'rabi',
      suitability: sorghumEvaluation.suitability,
      confidence: sorghumEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'October-November',
      harvestTime: isKharifSeason ? 'October-November' : 'February-March',
      waterRequirement: 'low',
      expectedYield: '2-4 tons/hectare',
      marketPrice: '₹1,600-2,000/quintal',
      soilRequirement: 'Well-drained, drought tolerant',
      climateRequirement: '20-35°C, 400-800mm rainfall',
      spacing: '45cm x 15cm',
      seeds: '10-12 kg/hectare',
      fertilizer: 'NPK 80:40:40 kg/hectare',
      pestManagement: 'Shoot fly, stem borer control',
      challenges: ['Bird damage', 'Market limitations'],
      benefits: ['Drought tolerance', 'Multi-purpose crop', 'Nutritious'],
      tips: ['Bird protection essential', 'Good for dry lands', 'Value addition important']
    });
  }

  // CASH CROPS

  // Cotton - Kharif season
  if (isKharifSeason) {
    const evaluation = evaluateCrop([20, 35], [50, 80], [50, 85], true);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Cotton',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'May-June',
        harvestTime: 'October-December',
        waterRequirement: 'medium',
        expectedYield: '15-20 quintals/hectare',
        marketPrice: '₹6,000-8,000/quintal',
        soilRequirement: 'Deep black cotton soil, good drainage',
        climateRequirement: '20-35°C, 500-1000mm rainfall',
        spacing: '45-60cm x 10-15cm',
        seeds: '1.5-2.5 kg/hectare',
        fertilizer: 'NPK 80:40:40 kg/hectare',
        pestManagement: 'Bollworm, whitefly, thrips control',
        challenges: ['Pest resistance', 'Water management', 'Market volatility'],
        benefits: ['High value crop', 'Industrial importance', 'Export potential'],
        tips: ['Use Bt cotton varieties', 'IPM practices essential', 'Monitor pest levels']
      });
    }
  }

  // Sugarcane - Perennial
  const sugarcaneEvaluation = evaluateCrop([20, 40], [60, 90], [70, 95], true);
  if (sugarcaneEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Sugarcane',
      type: 'perennial',
      suitability: sugarcaneEvaluation.suitability,
      confidence: sugarcaneEvaluation.confidence,
      season: 'Year-round crop',
      sowingTime: 'February-March or October-November',
      harvestTime: '12-18 months after planting',
      waterRequirement: 'high',
      expectedYield: '80-120 tons/hectare',
      marketPrice: '₹350-400/quintal',
      soilRequirement: 'Deep fertile soil, good drainage, pH 6.5-7.5',
      climateRequirement: '20-40°C, 1000-1500mm rainfall',
      spacing: '90-120cm x 60cm',
      seeds: '40,000-50,000 setts/hectare',
      fertilizer: 'NPK 280:90:90 kg/hectare',
      pestManagement: 'Early shoot borer, top borer control',
      challenges: ['High water requirement', 'Long duration', 'Heavy machinery needed'],
      benefits: ['High income potential', 'Multiple products', 'Industrial demand'],
      tips: ['Use disease-free setts', 'Proper irrigation critical', 'Timely harvesting important']
    });
  }

  // Jute - Kharif season
  if (isKharifSeason) {
    const evaluation = evaluateCrop([24, 35], [70, 90], [60, 90], true);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Jute',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'March-May',
        harvestTime: 'August-September',
        waterRequirement: 'high',
        expectedYield: '20-25 quintals/hectare',
        marketPrice: '₹4,000-5,000/quintal',
        soilRequirement: 'Alluvial soil, good water retention',
        climateRequirement: '24-35°C, 1000-1500mm rainfall, high humidity',
        spacing: 'Broadcasting or 25cm rows',
        seeds: '20-25 kg/hectare',
        fertilizer: 'NPK 40:20:20 kg/hectare',
        pestManagement: 'Stem weevil, semilooper control',
        challenges: ['Market fluctuations', 'Processing facilities', 'Competition from synthetics'],
        benefits: ['Eco-friendly fiber', 'Export potential', 'Industrial uses'],
        tips: ['Adequate moisture critical', 'Timely harvesting', 'Retting process important']
      });
    }
  }

  // OILSEEDS

  // Mustard - Rabi season
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [40, 70], [30, 60], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Mustard',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'February-March',
        waterRequirement: 'low',
        expectedYield: '1.5-2.5 tons/hectare',
        marketPrice: '₹4,500-5,500/quintal',
        soilRequirement: 'Well-drained loam, pH 6.0-7.5',
        climateRequirement: '15-25°C, 300-400mm rainfall',
        spacing: '30cm x 10cm',
        seeds: '4-5 kg/hectare',
        fertilizer: 'NPK 60:40:40 kg/hectare',
        pestManagement: 'Aphid, painted bug control',
        challenges: ['Aphid infestation', 'Shattering losses'],
        benefits: ['Oil extraction', 'Good rotation crop', 'Cold tolerant'],
        tips: ['Timely sowing crucial', 'Aphid monitoring', 'Harvest at maturity']
      });
    }
  }

  // Groundnut - Kharif/Rabi
  const groundnutEvaluation = evaluateCrop([20, 30], [50, 80], [40, 70], null);
  if (groundnutEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Rabi';
    crops.push({
      name: 'Groundnut (Peanut)',
      type: isKharifSeason ? 'kharif' : 'rabi',
      suitability: groundnutEvaluation.suitability,
      confidence: groundnutEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'November-December',
      harvestTime: isKharifSeason ? 'October-November' : 'March-April',
      waterRequirement: 'medium',
      expectedYield: '2-3.5 tons/hectare',
      marketPrice: '₹5,000-6,000/quintal',
      soilRequirement: 'Sandy loam, well-drained, pH 6.0-7.0',
      climateRequirement: '20-30°C, 500-750mm rainfall',
      spacing: '30cm x 10cm',
      seeds: '100-120 kg/hectare',
      fertilizer: 'NPK 25:50:75 kg/hectare',
      pestManagement: 'Leaf miner, thrips control',
      challenges: ['Soil compaction', 'Harvesting difficulties', 'Aflatoxin risk'],
      benefits: ['High protein oil', 'Nitrogen fixation', 'Good cash crop'],
      tips: ['Calcium application important', 'Proper curing needed', 'Avoid waterlogging']
    });
  }

  // Sunflower - Rabi/Kharif
  const sunflowerEvaluation = evaluateCrop([20, 28], [40, 70], [30, 70], false);
  if (sunflowerEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isRabiSeason ? 'Rabi' : 'Kharif';
    crops.push({
      name: 'Sunflower',
      type: isRabiSeason ? 'rabi' : 'kharif',
      suitability: sunflowerEvaluation.suitability,
      confidence: sunflowerEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isRabiSeason ? 'October-November' : 'June-July',
      harvestTime: isRabiSeason ? 'February-March' : 'September-October',
      waterRequirement: 'medium',
      expectedYield: '1.5-2.5 tons/hectare',
      marketPrice: '₹5,500-6,500/quintal',
      soilRequirement: 'Well-drained soil, pH 6.0-8.0',
      climateRequirement: '20-28°C, 400-600mm rainfall',
      spacing: '45cm x 30cm',
      seeds: '8-10 kg/hectare',
      fertilizer: 'NPK 60:60:40 kg/hectare',
      pestManagement: 'Head borer, necrosis control',
      challenges: ['Bird damage', 'Head rot disease'],
      benefits: ['High quality oil', 'Short duration', 'Drought tolerant'],
      tips: ['Bird protection needed', 'Avoid excess nitrogen', 'Proper head support']
    });
  }

  // Sesame (Til) - Kharif/Rabi
  const sesameEvaluation = evaluateCrop([25, 35], [50, 80], [30, 70], null);
  if (sesameEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Rabi';
    crops.push({
      name: 'Sesame (Til)',
      type: isKharifSeason ? 'kharif' : 'rabi',
      suitability: sesameEvaluation.suitability,
      confidence: sesameEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'October-November',
      harvestTime: isKharifSeason ? 'September-October' : 'January-February',
      waterRequirement: 'low',
      expectedYield: '0.8-1.5 tons/hectare',
      marketPrice: '₹8,000-10,000/quintal',
      soilRequirement: 'Well-drained sandy loam, pH 5.5-8.0',
      climateRequirement: '25-35°C, 300-500mm rainfall',
      spacing: '30cm x 10cm',
      seeds: '3-4 kg/hectare',
      fertilizer: 'NPK 40:20:20 kg/hectare',
      pestManagement: 'Leaf webber, capsule borer control',
      challenges: ['Pod shattering', 'Low yield', 'Weather sensitivity'],
      benefits: ['High value oil', 'Medicinal properties', 'Export demand'],
      tips: ['Harvest before full maturity', 'Multiple pickings', 'Proper drying important']
    });
  }

  // PULSES

  // Bengal Gram (Chana) - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [40, 70], [30, 60], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Bengal Gram (Chana)',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'March-April',
        waterRequirement: 'low',
        expectedYield: '1.5-2.5 tons/hectare',
        marketPrice: '₹4,500-5,500/quintal',
        soilRequirement: 'Well-drained clay loam, pH 6.0-7.5',
        climateRequirement: '15-25°C, 300-400mm rainfall',
        spacing: '30cm x 10cm',
        seeds: '60-80 kg/hectare',
        fertilizer: 'NPK 20:40:20 kg/hectare',
        pestManagement: 'Pod borer, aphid control',
        challenges: ['Wilt disease', 'Pod borer attack'],
        benefits: ['High protein', 'Nitrogen fixation', 'Good market demand'],
        tips: ['Use wilt-resistant varieties', 'Rhizobium treatment', 'Avoid waterlogging']
      });
    }
  }

  // Black Gram (Urad) - Kharif/Rabi
  const blackgramEvaluation = evaluateCrop([20, 35], [50, 80], [40, 70], null);
  if (blackgramEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Rabi';
    crops.push({
      name: 'Black Gram (Urad)',
      type: isKharifSeason ? 'kharif' : 'rabi',
      suitability: blackgramEvaluation.suitability,
      confidence: blackgramEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'October-November',
      harvestTime: isKharifSeason ? 'September-October' : 'January-February',
      waterRequirement: 'medium',
      expectedYield: '1-1.8 tons/hectare',
      marketPrice: '₹6,000-8,000/quintal',
      soilRequirement: 'Well-drained loam, pH 6.5-7.5',
      climateRequirement: '20-35°C, 400-600mm rainfall',
      spacing: '30cm x 10cm',
      seeds: '15-20 kg/hectare',
      fertilizer: 'NPK 20:40:20 kg/hectare',
      pestManagement: 'Pod fly, aphid control',
      challenges: ['Yellow mosaic virus', 'Pod shattering'],
      benefits: ['High protein', 'Short duration', 'Good market price'],
      tips: ['Use virus-resistant varieties', 'Timely harvesting', 'Proper storage important']
    });
  }

  // Green Gram (Moong) - Kharif/Zaid
  const moongEvaluation = evaluateCrop([25, 35], [50, 80], [40, 70], null);
  if (moongEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : isZaidSeason ? 'Zaid' : 'Summer';
    crops.push({
      name: 'Green Gram (Moong)',
      type: isKharifSeason ? 'kharif' : 'zaid',
      suitability: moongEvaluation.suitability,
      confidence: moongEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'March-April',
      harvestTime: isKharifSeason ? 'September-October' : 'May-June',
      waterRequirement: 'low',
      expectedYield: '0.8-1.5 tons/hectare',
      marketPrice: '₹6,500-8,500/quintal',
      soilRequirement: 'Well-drained sandy loam, pH 6.0-7.5',
      climateRequirement: '25-35°C, 300-500mm rainfall',
      spacing: '30cm x 10cm',
      seeds: '15-20 kg/hectare',
      fertilizer: 'NPK 20:40:20 kg/hectare',
      pestManagement: 'Pod borer, thrips control',
      challenges: ['Yellow mosaic virus', 'Low yield'],
      benefits: ['Short duration', 'High protein', 'Drought tolerant'],
      tips: ['Use certified seeds', 'Avoid excess moisture', 'Multiple harvests possible']
    });
  }

  // Pigeon Pea (Arhar/Tur) - Kharif
  if (isKharifSeason) {
    const evaluation = evaluateCrop([20, 35], [50, 80], [40, 80], true);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Pigeon Pea (Arhar)',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'June-July',
        harvestTime: 'December-January',
        waterRequirement: 'medium',
        expectedYield: '1.5-2.5 tons/hectare',
        marketPrice: '₹5,500-7,000/quintal',
        soilRequirement: 'Well-drained black cotton soil, pH 6.0-7.5',
        climateRequirement: '20-35°C, 600-1000mm rainfall',
        spacing: '45cm x 15cm',
        seeds: '15-20 kg/hectare',
        fertilizer: 'NPK 25:50:25 kg/hectare',
        pestManagement: 'Pod fly, pod borer control',
        challenges: ['Long duration', 'Pod fly damage'],
        benefits: ['Perennial nature', 'Intercropping suitable', 'Good protein source'],
        tips: ['Intercrop with cereals', 'Support required', 'Proper drainage essential']
      });
    }
  }

  // Lentil (Masur) - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [40, 70], [30, 60], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Lentil (Masur)',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'February-March',
        waterRequirement: 'low',
        expectedYield: '1.2-2 tons/hectare',
        marketPrice: '₹5,000-6,500/quintal',
        soilRequirement: 'Well-drained loam, pH 6.0-7.5',
        climateRequirement: '15-25°C, 300-400mm rainfall',
        spacing: '25cm x 5cm',
        seeds: '30-40 kg/hectare',
        fertilizer: 'NPK 20:40:20 kg/hectare',
        pestManagement: 'Aphid, pod borer control',
        challenges: ['Rust disease', 'Aphid infestation'],
        benefits: ['High protein', 'Short duration', 'Export quality'],
        tips: ['Use rust-resistant varieties', 'Avoid late sowing', 'Proper field preparation']
      });
    }
  }

  // VEGETABLES

  // Tomato - Multiple seasons
  const tomatoEvaluation = evaluateCrop([15, 30], [50, 80], [50, 80], null);
  if (tomatoEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Tomato',
      type: isRabiSeason ? 'rabi' : 'kharif',
      suitability: tomatoEvaluation.suitability,
      confidence: tomatoEvaluation.confidence,
      season: 'Year-round with protection',
      sowingTime: 'Nursery: 30-45 days before transplanting',
      harvestTime: '75-90 days after transplanting',
      waterRequirement: 'medium',
      expectedYield: '25-40 tons/hectare',
      marketPrice: '₹800-2,500/quintal',
      soilRequirement: 'Well-drained fertile soil, pH 6.0-7.0',
      climateRequirement: '15-30°C, moderate humidity',
      spacing: '60cm x 45cm',
      seeds: '300-400g/hectare',
      fertilizer: 'NPK 120:100:100 kg/hectare',
      pestManagement: 'Early blight, fruit borer control',
      challenges: ['Disease susceptibility', 'Market price volatility', 'Perishable nature'],
      benefits: ['High returns', 'Continuous harvest', 'Processing opportunities'],
      tips: ['Use resistant varieties', 'Proper staking needed', 'Regular spraying schedule']
    });
  }

  // Onion - Rabi mainly
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [40, 70], [40, 70], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Onion',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'November-December',
        harvestTime: 'March-May',
        waterRequirement: 'medium',
        expectedYield: '20-35 tons/hectare',
        marketPrice: '₹800-3,000/quintal',
        soilRequirement: 'Well-drained fertile soil, pH 6.0-7.5',
        climateRequirement: '15-25°C, 300-400mm water',
        spacing: '15cm x 10cm',
        seeds: '8-10 kg/hectare',
        fertilizer: 'NPK 100:50:50 kg/hectare',
        pestManagement: 'Thrips, purple blotch control',
        challenges: ['Storage losses', 'Price fluctuations', 'Bolting problem'],
        benefits: ['Good export potential', 'Long storage life', 'High demand'],
        tips: ['Proper curing important', 'Avoid excess nitrogen', 'Harvest at maturity']
      });
    }
  }

  // Potato - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [50, 80], [60, 80], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Potato',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'February-March',
        waterRequirement: 'medium',
        expectedYield: '25-35 tons/hectare',
        marketPrice: '₹800-1,500/quintal',
        soilRequirement: 'Well-drained sandy loam, pH 5.0-6.5',
        climateRequirement: '15-25°C, 500-700mm water',
        spacing: '60cm x 20cm',
        seeds: '2.5-3 tons/hectare',
        fertilizer: 'NPK 120:80:100 kg/hectare',
        pestManagement: 'Late blight, aphid control',
        challenges: ['Disease management', 'Storage facilities', 'Price volatility'],
        benefits: ['High yield', 'Good market demand', 'Processing opportunities'],
        tips: ['Use certified seed tubers', 'Proper earthing up', 'Disease-free storage']
      });
    }
  }

  // Cabbage - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [60, 80], [60, 80], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Cabbage',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'September-October',
        harvestTime: 'December-February',
        waterRequirement: 'medium',
        expectedYield: '30-50 tons/hectare',
        marketPrice: '₹400-1,200/quintal',
        soilRequirement: 'Rich organic matter, pH 6.0-6.5',
        climateRequirement: '15-25°C, cool weather preferred',
        spacing: '45cm x 45cm',
        seeds: '375-400g/hectare',
        fertilizer: 'NPK 120:60:60 kg/hectare',
        pestManagement: 'Diamond back moth, aphid control',
        challenges: ['Pest management', 'Head cracking', 'Short shelf life'],
        benefits: ['High yield potential', 'Nutritious vegetable', 'Good market'],
        tips: ['Transplant at right time', 'Adequate water needed', 'Harvest when firm']
      });
    }
  }

  // SPICES

  // Turmeric - Kharif
  if (isKharifSeason) {
    const evaluation = evaluateCrop([20, 35], [70, 90], [70, 90], true);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Turmeric',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'April-June',
        harvestTime: 'January-March (next year)',
        waterRequirement: 'high',
        expectedYield: '20-25 tons/hectare',
        marketPrice: '₹8,000-12,000/quintal',
        soilRequirement: 'Well-drained loamy soil, rich in organic matter',
        climateRequirement: '20-35°C, 1000-1500mm rainfall, high humidity',
        spacing: '25cm x 25cm',
        seeds: '2.5 tons rhizomes/hectare',
        fertilizer: 'NPK 60:40:120 kg/hectare + FYM',
        pestManagement: 'Rhizome rot, shoot borer control',
        challenges: ['Long duration', 'Processing required', 'Storage difficulties'],
        benefits: ['High value spice', 'Medicinal properties', 'Export demand'],
        tips: ['Use disease-free rhizomes', 'Proper curing essential', 'Organic cultivation beneficial']
      });
    }
  }

  // Ginger - Kharif
  if (isKharifSeason) {
    const evaluation = evaluateCrop([18, 30], [75, 95], [80, 95], true);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Ginger',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'April-May',
        harvestTime: 'December-January',
        waterRequirement: 'high',
        expectedYield: '15-20 tons/hectare',
        marketPrice: '₹15,000-25,000/quintal',
        soilRequirement: 'Well-drained sandy loam, rich in organic matter',
        climateRequirement: '18-30°C, 1500-3000mm rainfall, high humidity',
        spacing: '20cm x 25cm',
        seeds: '1.5-2 tons rhizomes/hectare',
        fertilizer: 'NPK 75:50:50 kg/hectare + FYM',
        pestManagement: 'Rhizome rot, shoot borer control',
        challenges: ['High initial investment', 'Disease management', 'Proper curing needed'],
        benefits: ['Very high returns', 'Medicinal value', 'Export opportunities'],
        tips: ['Shade cultivation beneficial', 'Disease-free seed important', 'Proper post-harvest handling']
      });
    }
  }

  // Coriander - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [40, 70], [40, 70], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Coriander',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'February-March',
        waterRequirement: 'low',
        expectedYield: '1.2-1.8 tons/hectare',
        marketPrice: '₹8,000-15,000/quintal',
        soilRequirement: 'Well-drained loamy soil, pH 6.5-7.5',
        climateRequirement: '15-25°C, 300-400mm water',
        spacing: '30cm x 10cm',
        seeds: '15-20 kg/hectare',
        fertilizer: 'NPK 40:30:30 kg/hectare',
        pestManagement: 'Aphid, powdery mildew control',
        challenges: ['Price fluctuations', 'Aphid infestation'],
        benefits: ['High value spice', 'Short duration', 'Good export demand'],
        tips: ['Use quality seeds', 'Avoid excess moisture', 'Harvest when mature']
      });
    }
  }

  // FRUITS (Perennial - but season specific planting)

  // Mango (Planting season)
  if (isKharifSeason) {
    const evaluation = evaluateCrop([24, 35], [50, 80], [50, 80], null);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD && currentTemp >= 26) {
      crops.push({
        name: 'Mango (Planting)',
        type: 'perennial',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Plant during monsoon',
        sowingTime: 'June-August (for planting)',
        harvestTime: '3-5 years for first harvest',
        waterRequirement: 'medium',
        expectedYield: '10-15 tons/hectare (mature trees)',
        marketPrice: '₹2,000-8,000/quintal',
        soilRequirement: 'Well-drained deep soil, pH 5.5-7.5',
        climateRequirement: '24-35°C, 750-2500mm rainfall',
        spacing: '10m x 10m',
        seeds: '100 plants/hectare',
        fertilizer: 'NPK 500:250:750g per tree',
        pestManagement: 'Fruit fly, hopper control',
        challenges: ['Long gestation period', 'High initial investment', 'Pest management'],
        benefits: ['High returns after establishment', 'Perennial income', 'Export potential'],
        tips: ['Choose suitable variety', 'Regular pruning needed', 'Proper irrigation system']
      });
    }
  }

  // FODDER CROPS

  // Berseem - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([10, 25], [50, 80], [50, 80], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Berseem (Egyptian Clover)',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'Multiple cuts till April',
        waterRequirement: 'medium',
        expectedYield: '60-80 tons green fodder/hectare',
        marketPrice: '₹200-400/quintal',
        soilRequirement: 'Heavy clay soil, good water retention',
        climateRequirement: '10-25°C, 400-600mm water',
        spacing: 'Broadcasting',
        seeds: '25-30 kg/hectare',
        fertilizer: 'NPK 20:60:40 kg/hectare',
        pestManagement: 'Generally pest-free',
        challenges: ['Requires good irrigation', 'Bloat in animals'],
        benefits: ['Excellent fodder quality', 'Multiple cuts', 'Soil improvement'],
        tips: ['Inoculate seeds with rhizobium', 'Multiple cuts possible', 'Good for dairy farming']
      });
    }
  }

  // ADDITIONAL CEREALS

  // Finger Millet (Ragi) - Kharif
  if (isKharifSeason) {
    const evaluation = evaluateCrop([20, 30], [50, 80], [40, 70], null);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Finger Millet (Ragi)',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'June-July',
        harvestTime: 'October-November',
        waterRequirement: 'low',
        expectedYield: '1.5-2.5 tons/hectare',
        marketPrice: '₹3,000-4,500/quintal',
        soilRequirement: 'Red loamy soil, drought tolerant',
        climateRequirement: '20-30°C, 500-750mm rainfall',
        spacing: '22cm x 10cm',
        seeds: '8-10 kg/hectare',
        fertilizer: 'NPK 50:40:25 kg/hectare',
        pestManagement: 'Blast, leaf spot control',
        challenges: ['Bird damage', 'Processing difficulties'],
        benefits: ['Highly nutritious', 'Drought resistant', 'Long storage life'],
        tips: ['Bird protection essential', 'Rich in calcium', 'Good for health']
      });
    }
  }

  // ADDITIONAL OILSEEDS

  // Castor - Kharif/Rabi
  const castorEvaluation = evaluateCrop([20, 35], [40, 70], [30, 70], null);
  if (castorEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Rabi';
    crops.push({
      name: 'Castor',
      type: isKharifSeason ? 'kharif' : 'rabi',
      suitability: castorEvaluation.suitability,
      confidence: castorEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'October-November',
      harvestTime: isKharifSeason ? 'December-January' : 'March-April',
      waterRequirement: 'low',
      expectedYield: '1.5-2.5 tons/hectare',
      marketPrice: '₹4,500-6,000/quintal',
      soilRequirement: 'Well-drained soil, pH 6.0-7.5',
      climateRequirement: '20-35°C, 400-750mm rainfall',
      spacing: '90cm x 60cm',
      seeds: '10-12 kg/hectare',
      fertilizer: 'NPK 60:30:30 kg/hectare',
      pestManagement: 'Semilooper, capsule borer control',
      challenges: ['Pest management', 'Market fluctuations'],
      benefits: ['Industrial oil', 'Drought tolerant', 'Multi-purpose'],
      tips: ['Wide spacing required', 'Good for dry areas', 'Industrial demand high']
    });
  }

  // Safflower - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [40, 70], [30, 60], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Safflower',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'February-March',
        waterRequirement: 'low',
        expectedYield: '1.2-2 tons/hectare',
        marketPrice: '₹4,000-5,500/quintal',
        soilRequirement: 'Well-drained black soil, pH 6.0-7.5',
        climateRequirement: '15-25°C, 300-600mm rainfall',
        spacing: '30cm x 15cm',
        seeds: '12-15 kg/hectare',
        fertilizer: 'NPK 40:20:20 kg/hectare',
        pestManagement: 'Aphid, caterpillar control',
        challenges: ['Thorny nature', 'Bird damage'],
        benefits: ['Edible oil', 'Drought tolerant', 'Good rotation crop'],
        tips: ['Avoid excess irrigation', 'Harvest when mature', 'Good for dryland']
      });
    }
  }

  // Coconut - Perennial
  const coconutEvaluation = evaluateCrop([22, 32], [70, 90], [70, 90], true);
  if (coconutEvaluation.confidence >= CONFIDENCE_THRESHOLD && avgHumidity >= 75) {
    crops.push({
      name: 'Coconut',
      type: 'perennial',
      suitability: coconutEvaluation.suitability,
      confidence: coconutEvaluation.confidence,
      season: 'Year-round crop',
      sowingTime: 'May-June (Monsoon planting)',
      harvestTime: '6-8 years for first harvest',
      waterRequirement: 'high',
      expectedYield: '8,000-12,000 nuts/hectare/year',
      marketPrice: '₹8-20/nut',
      soilRequirement: 'Well-drained sandy loam, coastal areas',
      climateRequirement: '22-32°C, 1200-2000mm rainfall, high humidity',
      spacing: '7.5m x 7.5m',
      seeds: '175 plants/hectare',
      fertilizer: 'NPK 500:320:1200g per palm',
      pestManagement: 'Rhinoceros beetle, red palm weevil',
      challenges: ['Long gestation', 'Cyclone damage', 'High investment'],
      benefits: ['Multiple products', 'High returns', 'Export potential'],
      tips: ['Coastal regions ideal', 'Intercropping possible', 'Value addition important']
    });
  }

  // ADDITIONAL PULSES

  // Field Pea (Matar) - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([10, 20], [50, 80], [50, 80], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Field Pea (Matar)',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'February-March',
        waterRequirement: 'medium',
        expectedYield: '1.5-2.5 tons/hectare',
        marketPrice: '₹4,000-6,000/quintal',
        soilRequirement: 'Well-drained loamy soil, pH 6.0-7.0',
        climateRequirement: '10-20°C, cool weather preferred',
        spacing: '30cm x 5cm',
        seeds: '75-100 kg/hectare',
        fertilizer: 'NPK 20:40:20 kg/hectare',
        pestManagement: 'Pod borer, aphid control',
        challenges: ['Frost damage', 'Pod shattering'],
        benefits: ['High protein', 'Cool season crop', 'Good market'],
        tips: ['Early sowing beneficial', 'Protect from frost', 'Harvest when tender']
      });
    }
  }

  // Cowpea (Lobia) - Kharif/Zaid
  const cowpeaEvaluation = evaluateCrop([25, 35], [50, 80], [40, 70], null);
  if (cowpeaEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Zaid';
    crops.push({
      name: 'Cowpea (Lobia)',
      type: isKharifSeason ? 'kharif' : 'zaid',
      suitability: cowpeaEvaluation.suitability,
      confidence: cowpeaEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'March-April',
      harvestTime: isKharifSeason ? 'September-October' : 'May-June',
      waterRequirement: 'low',
      expectedYield: '1.2-2 tons/hectare',
      marketPrice: '₹5,000-7,000/quintal',
      soilRequirement: 'Sandy loam, drought tolerant',
      climateRequirement: '25-35°C, 400-750mm rainfall',
      spacing: '30cm x 15cm',
      seeds: '20-25 kg/hectare',
      fertilizer: 'NPK 20:40:20 kg/hectare',
      pestManagement: 'Pod fly, aphid control',
      challenges: ['Heat stress', 'Pod shattering'],
      benefits: ['Drought resistant', 'Quick maturing', 'Dual purpose'],
      tips: ['Heat tolerant variety', 'Good for fodder too', 'Intercropping suitable']
    });
  }

  // ADDITIONAL VEGETABLES

  // Brinjal (Eggplant) - Multiple seasons
  const brinjalEvaluation = evaluateCrop([18, 30], [60, 80], [50, 80], null);
  if (brinjalEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Brinjal (Eggplant)',
      type: isRabiSeason ? 'rabi' : 'kharif',
      suitability: brinjalEvaluation.suitability,
      confidence: brinjalEvaluation.confidence,
      season: 'Year-round cultivation',
      sowingTime: 'Multiple seasons possible',
      harvestTime: '150-180 days from sowing',
      waterRequirement: 'medium',
      expectedYield: '25-35 tons/hectare',
      marketPrice: '₹800-2,000/quintal',
      soilRequirement: 'Well-drained fertile soil, pH 6.5-7.5',
      climateRequirement: '18-30°C, warm humid conditions',
      spacing: '75cm x 60cm',
      seeds: '300-400g/hectare',
      fertilizer: 'NPK 100:60:60 kg/hectare',
      pestManagement: 'Fruit and shoot borer control',
      challenges: ['Pest management', 'Fruit borer damage'],
      benefits: ['Popular vegetable', 'Good returns', 'Long harvesting period'],
      tips: ['Use resistant varieties', 'Regular harvesting', 'Proper staking needed']
    });
  }

  // Cauliflower - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 20], [70, 85], [60, 80], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Cauliflower',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'September-October',
        harvestTime: 'December-February',
        waterRequirement: 'medium',
        expectedYield: '20-30 tons/hectare',
        marketPrice: '₹600-1,500/quintal',
        soilRequirement: 'Rich loamy soil, pH 6.0-6.8',
        climateRequirement: '15-20°C, cool humid weather',
        spacing: '45cm x 45cm',
        seeds: '400-500g/hectare',
        fertilizer: 'NPK 120:60:60 kg/hectare',
        pestManagement: 'Diamond back moth, aphid control',
        challenges: ['Temperature sensitivity', 'Pest problems'],
        benefits: ['High nutritional value', 'Good market demand', 'Export potential'],
        tips: ['Cool weather essential', 'Blanching for white heads', 'Timely harvesting']
      });
    }
  }

  // Okra (Bhindi) - Kharif/Zaid
  const okraEvaluation = evaluateCrop([25, 35], [60, 85], [50, 80], null);
  if (okraEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Zaid';
    crops.push({
      name: 'Okra (Bhindi)',
      type: isKharifSeason ? 'kharif' : 'zaid',
      suitability: okraEvaluation.suitability,
      confidence: okraEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'February-March',
      harvestTime: '45-60 days from sowing',
      waterRequirement: 'medium',
      expectedYield: '10-15 tons/hectare',
      marketPrice: '₹1,000-3,000/quintal',
      soilRequirement: 'Well-drained loamy soil, pH 6.0-7.0',
      climateRequirement: '25-35°C, warm humid weather',
      spacing: '45cm x 30cm',
      seeds: '12-15 kg/hectare',
      fertilizer: 'NPK 60:40:40 kg/hectare',
      pestManagement: 'Fruit and shoot borer control',
      challenges: ['Fruit fly damage', 'Yellow vein mosaic'],
      benefits: ['Quick returns', 'Multiple harvests', 'High demand'],
      tips: ['Regular harvesting needed', 'Tender fruits preferred', 'Disease resistant varieties']
    });
  }

  // SPICES

  // Chili - Kharif/Rabi
  const chiliEvaluation = evaluateCrop([20, 30], [60, 80], [50, 80], null);
  if (chiliEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Rabi';
    crops.push({
      name: 'Chili (Red Pepper)',
      type: isKharifSeason ? 'kharif' : 'rabi',
      suitability: chiliEvaluation.suitability,
      confidence: chiliEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'October-November',
      harvestTime: '90-120 days from transplanting',
      waterRequirement: 'medium',
      expectedYield: '12-18 tons/hectare',
      marketPrice: '₹8,000-15,000/quintal',
      soilRequirement: 'Well-drained fertile soil, pH 6.0-7.0',
      climateRequirement: '20-30°C, warm humid conditions',
      spacing: '45cm x 30cm',
      seeds: '1-1.5 kg/hectare',
      fertilizer: 'NPK 120:60:60 kg/hectare',
      pestManagement: 'Thrips, fruit borer control',
      challenges: ['Pest and disease management', 'Price volatility'],
      benefits: ['High value spice', 'Good export demand', 'Multiple harvests'],
      tips: ['Transplanting preferred', 'Regular irrigation', 'Proper drying important']
    });
  }

  // Cumin - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [40, 70], [30, 60], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Cumin (Jeera)',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'November-December',
        harvestTime: 'February-March',
        waterRequirement: 'low',
        expectedYield: '0.8-1.2 tons/hectare',
        marketPrice: '₹20,000-35,000/quintal',
        soilRequirement: 'Sandy loam, well-drained, pH 6.8-8.2',
        climateRequirement: '15-25°C, dry weather during maturity',
        spacing: '30cm x 10cm',
        seeds: '12-15 kg/hectare',
        fertilizer: 'NPK 40:20:20 kg/hectare',
        pestManagement: 'Aphid, powdery mildew control',
        challenges: ['Weather sensitivity', 'High input costs'],
        benefits: ['Very high value spice', 'Export quality', 'Medicinal properties'],
        tips: ['Dry weather essential', 'Quality seeds important', 'Proper curing needed']
      });
    }
  }

  // Fenugreek (Methi) - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [50, 70], [40, 70], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Fenugreek (Methi)',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'February-March',
        waterRequirement: 'low',
        expectedYield: '1.5-2.5 tons/hectare',
        marketPrice: '₹8,000-12,000/quintal',
        soilRequirement: 'Well-drained loamy soil, pH 6.0-7.0',
        climateRequirement: '15-25°C, cool dry weather',
        spacing: '30cm x 10cm',
        seeds: '20-25 kg/hectare',
        fertilizer: 'NPK 25:25:25 kg/hectare',
        pestManagement: 'Aphid, powdery mildew control',
        challenges: ['Market fluctuations', 'Processing needs'],
        benefits: ['Medicinal value', 'Dual purpose', 'Export demand'],
        tips: ['Can be grown for leaves or seeds', 'Good companion crop', 'Nitrogen fixing']
      });
    }
  }

  // FRUITS

  // Banana - Perennial
  const bananaEvaluation = evaluateCrop([26, 30], [75, 85], [70, 85], true);
  if (bananaEvaluation.confidence >= CONFIDENCE_THRESHOLD && avgHumidity >= 75) {
    crops.push({
      name: 'Banana',
      type: 'perennial',
      suitability: bananaEvaluation.suitability,
      confidence: bananaEvaluation.confidence,
      season: 'Year-round planting',
      sowingTime: 'June-July or February-March',
      harvestTime: '12-15 months from planting',
      waterRequirement: 'high',
      expectedYield: '40-60 tons/hectare',
      marketPrice: '₹800-2,000/quintal',
      soilRequirement: 'Deep fertile soil, good drainage, pH 6.0-7.5',
      climateRequirement: '26-30°C, high humidity, 1000-1500mm rainfall',
      spacing: '2m x 2m',
      seeds: '1,600 plants/hectare',
      fertilizer: 'NPK 200:60:200g per plant',
      pestManagement: 'Nematode, weevil control',
      challenges: ['Wind damage', 'Pest management', 'Post-harvest losses'],
      benefits: ['Year-round income', 'High nutrition', 'Quick returns'],
      tips: ['Wind protection needed', 'Regular irrigation', 'Proper spacing important']
    });
  }

  // Grapes - Perennial
  const grapeEvaluation = evaluateCrop([15, 35], [50, 70], [50, 80], false);
  if (grapeEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Grapes',
      type: 'perennial',
      suitability: grapeEvaluation.suitability,
      confidence: grapeEvaluation.confidence,
      season: 'Perennial with seasonal pruning',
      sowingTime: 'December-January (planting)',
      harvestTime: '2-3 years for first harvest',
      waterRequirement: 'medium',
      expectedYield: '20-40 tons/hectare',
      marketPrice: '₹2,000-6,000/quintal',
      soilRequirement: 'Well-drained sandy loam, pH 6.5-7.5',
      climateRequirement: '15-35°C, dry summers, moderate winters',
      spacing: '3m x 1.5m',
      seeds: '2,200 plants/hectare',
      fertilizer: 'NPK 400:200:400g per vine',
      pestManagement: 'Downy mildew, thrips control',
      challenges: ['High initial investment', 'Skilled labor needed', 'Market access'],
      benefits: ['Very high returns', 'Export potential', 'Wine making'],
      tips: ['Proper training system', 'Pruning essential', 'Quality fruit important']
    });
  }

  // Pomegranate - Perennial
  const pomegranateEvaluation = evaluateCrop([15, 35], [40, 70], [50, 80], false);
  if (pomegranateEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Pomegranate',
      type: 'perennial',
      suitability: pomegranateEvaluation.suitability,
      confidence: pomegranateEvaluation.confidence,
      season: 'Perennial fruit crop',
      sowingTime: 'June-July or February-March',
      harvestTime: '2-3 years for first harvest',
      waterRequirement: 'medium',
      expectedYield: '15-25 tons/hectare',
      marketPrice: '₹3,000-8,000/quintal',
      soilRequirement: 'Well-drained soil, pH 6.5-7.5',
      climateRequirement: '15-35°C, dry climate preferred',
      spacing: '4m x 4m',
      seeds: '625 plants/hectare',
      fertilizer: 'NPK 500:250:500g per plant',
      pestManagement: 'Fruit fly, aphid control',
      challenges: ['Fruit cracking', 'Pest management', 'Storage issues'],
      benefits: ['High value fruit', 'Export demand', 'Health benefits'],
      tips: ['Drip irrigation beneficial', 'Proper pruning needed', 'Harvest at right maturity']
    });
  }

  // ADDITIONAL CASH CROPS

  // Tea - Perennial
  const teaEvaluation = evaluateCrop([18, 25], [75, 90], [80, 95], true);
  if (teaEvaluation.confidence >= CONFIDENCE_THRESHOLD && avgHumidity >= 80) {
    crops.push({
      name: 'Tea',
      type: 'perennial',
      suitability: teaEvaluation.suitability,
      confidence: teaEvaluation.confidence,
      season: 'Perennial plantation crop',
      sowingTime: 'Monsoon season planting',
      harvestTime: '3-4 years for first harvest',
      waterRequirement: 'high',
      expectedYield: '2,000-3,000 kg made tea/hectare',
      marketPrice: '₹200-800/kg',
      soilRequirement: 'Well-drained acidic soil, pH 4.5-6.0',
      climateRequirement: '18-25°C, 1500-3000mm rainfall, high humidity',
      spacing: '1.2m x 0.6m',
      seeds: '12,000-15,000 plants/hectare',
      fertilizer: 'NPK 150:60:60 kg/hectare',
      pestManagement: 'Tea mosquito bug, red spider mite',
      challenges: ['Climate specific', 'Processing required', 'Labor intensive'],
      benefits: ['Export commodity', 'Continuous income', 'Employment generation'],
      tips: ['Hill areas suitable', 'Regular plucking', 'Quality processing important']
    });
  }

  // Coffee - Perennial
  const coffeeEvaluation = evaluateCrop([15, 25], [70, 85], [70, 90], true);
  if (coffeeEvaluation.confidence >= CONFIDENCE_THRESHOLD && avgHumidity >= 75) {
    crops.push({
      name: 'Coffee',
      type: 'perennial',
      suitability: coffeeEvaluation.suitability,
      confidence: coffeeEvaluation.confidence,
      season: 'Perennial plantation crop',
      sowingTime: 'June-July (monsoon planting)',
      harvestTime: '3-4 years for first harvest',
      waterRequirement: 'high',
      expectedYield: '1,500-2,500 kg/hectare',
      marketPrice: '₹150-400/kg',
      soilRequirement: 'Well-drained loamy soil, pH 6.0-6.5',
      climateRequirement: '15-25°C, 1500-2500mm rainfall, high humidity',
      spacing: '2m x 2m',
      seeds: '2,500 plants/hectare',
      fertilizer: 'NPK 100:50:100 kg/hectare',
      pestManagement: 'White stem borer, berry borer',
      challenges: ['Climate specific', 'Processing needs', 'Market fluctuations'],
      benefits: ['Export crop', 'High value', 'Sustainable income'],
      tips: ['Shade cultivation preferred', 'Hill areas ideal', 'Quality processing crucial']
    });
  }

  // FODDER CROPS

  // Lucerne (Alfalfa) - Perennial
  const lucerneEvaluation = evaluateCrop([15, 30], [50, 80], [50, 80], false);
  if (lucerneEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Lucerne (Alfalfa)',
      type: 'perennial',
      suitability: lucerneEvaluation.suitability,
      confidence: lucerneEvaluation.confidence,
      season: 'Perennial fodder crop',
      sowingTime: 'October-November or February-March',
      harvestTime: 'Multiple cuts per year',
      waterRequirement: 'medium',
      expectedYield: '80-120 tons green fodder/hectare/year',
      marketPrice: '₹300-500/quintal',
      soilRequirement: 'Well-drained deep soil, pH 6.5-7.5',
      climateRequirement: '15-30°C, 400-800mm rainfall',
      spacing: 'Broadcasting',
      seeds: '20-25 kg/hectare',
      fertilizer: 'NPK 25:50:25 kg/hectare',
      pestManagement: 'Generally pest free',
      challenges: ['Initial establishment', 'Quality maintenance'],
      benefits: ['High protein fodder', 'Multiple cuts', 'Soil improvement'],
      tips: ['Inoculation beneficial', 'Good for dairy', 'Long-term crop']
    });
  }

  // Oats (Fodder) - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([10, 25], [50, 80], [50, 80], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Oats (Fodder)',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'January-February',
        waterRequirement: 'medium',
        expectedYield: '40-60 tons green fodder/hectare',
        marketPrice: '₹200-400/quintal',
        soilRequirement: 'Well-drained fertile soil, pH 6.0-7.5',
        climateRequirement: '10-25°C, cool weather preferred',
        spacing: 'Broadcasting',
        seeds: '80-100 kg/hectare',
        fertilizer: 'NPK 60:30:30 kg/hectare',
        pestManagement: 'Generally pest free',
        challenges: ['Weather dependency', 'Short growing season'],
        benefits: ['Nutritious fodder', 'Quick growing', 'Good for dairy'],
        tips: ['Cool weather crop', 'Multiple cuts possible', 'Good companion with berseem']
      });
    }
  }

  // ADDITIONAL MINOR MILLETS

  // Foxtail Millet - Kharif
  if (isKharifSeason) {
    const evaluation = evaluateCrop([20, 35], [50, 80], [30, 70], null);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Foxtail Millet',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'June-July',
        harvestTime: 'September-October',
        waterRequirement: 'low',
        expectedYield: '1.5-2.5 tons/hectare',
        marketPrice: '₹3,500-5,000/quintal',
        soilRequirement: 'Sandy loam, drought tolerant',
        climateRequirement: '20-35°C, 400-750mm rainfall',
        spacing: '22cm x 10cm',
        seeds: '8-10 kg/hectare',
        fertilizer: 'NPK 40:20:20 kg/hectare',
        pestManagement: 'Generally pest resistant',
        challenges: ['Market awareness', 'Processing facilities'],
        benefits: ['Highly nutritious', 'Gluten-free', 'Drought resistant'],
        tips: ['Good for health conscious', 'Organic cultivation beneficial', 'Value addition important']
      });
    }
  }

  // Kodo Millet - Kharif
  if (isKharifSeason) {
    const evaluation = evaluateCrop([25, 35], [50, 80], [30, 70], null);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Kodo Millet',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'June-July',
        harvestTime: 'October-November',
        waterRequirement: 'low',
        expectedYield: '1.2-2 tons/hectare',
        marketPrice: '₹4,000-6,000/quintal',
        soilRequirement: 'Poor soils, marginal lands',
        climateRequirement: '25-35°C, 400-600mm rainfall',
        spacing: '22cm x 10cm',
        seeds: '15-20 kg/hectare',
        fertilizer: 'NPK 30:15:15 kg/hectare',
        pestManagement: 'Resistant to most pests',
        challenges: ['Limited market', 'Processing knowledge'],
        benefits: ['Grows on poor soils', 'Nutritious', 'Climate resilient'],
        tips: ['Suitable for tribal areas', 'Organic by nature', 'Good for marginal farmers']
      });
    }
  }

  // ADDITIONAL OILSEEDS

  // Linseed (Flax) - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [50, 70], [40, 70], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Linseed (Flax)',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'February-March',
        waterRequirement: 'low',
        expectedYield: '1-1.8 tons/hectare',
        marketPrice: '₹4,500-6,500/quintal',
        soilRequirement: 'Well-drained loamy soil, pH 6.0-7.0',
        climateRequirement: '15-25°C, 400-500mm rainfall',
        spacing: '30cm x 5cm',
        seeds: '25-30 kg/hectare',
        fertilizer: 'NPK 60:30:30 kg/hectare',
        pestManagement: 'Aphid, caterpillar control',
        challenges: ['Fiber and seed dual purpose', 'Processing needs'],
        benefits: ['Dual purpose crop', 'Industrial uses', 'Health benefits'],
        tips: ['Cool weather needed', 'Avoid waterlogging', 'Both fiber and oil valuable']
      });
    }
  }

  // Niger Seed - Kharif
  if (isKharifSeason) {
    const evaluation = evaluateCrop([20, 30], [60, 80], [50, 80], true);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Niger Seed',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'June-July',
        harvestTime: 'November-December',
        waterRequirement: 'medium',
        expectedYield: '0.6-1.2 tons/hectare',
        marketPrice: '₹6,000-9,000/quintal',
        soilRequirement: 'Well-drained sandy loam, pH 6.0-7.0',
        climateRequirement: '20-30°C, 1000-1500mm rainfall',
        spacing: '30cm x 15cm',
        seeds: '6-8 kg/hectare',
        fertilizer: 'NPK 40:20:20 kg/hectare',
        pestManagement: 'Pod fly, caterpillar control',
        challenges: ['Small seed size', 'Processing difficulties'],
        benefits: ['High oil content', 'Good for birds', 'Medicinal properties'],
        tips: ['Hill areas suitable', 'Bird feed market', 'Organic cultivation preferred']
      });
    }
  }

  // Oil Palm - Perennial
  const oilPalmEvaluation = evaluateCrop([24, 32], [80, 95], [80, 95], true);
  if (oilPalmEvaluation.confidence >= CONFIDENCE_THRESHOLD && avgHumidity >= 85) {
    crops.push({
      name: 'Oil Palm',
      type: 'perennial',
      suitability: oilPalmEvaluation.suitability,
      confidence: oilPalmEvaluation.confidence,
      season: 'Perennial plantation crop',
      sowingTime: 'Monsoon season planting',
      harvestTime: '3-4 years for first harvest',
      waterRequirement: 'high',
      expectedYield: '15-25 tons FFB/hectare',
      marketPrice: '₹8,000-12,000/ton FFB',
      soilRequirement: 'Deep well-drained soil, pH 4.5-6.5',
      climateRequirement: '24-32°C, 2000-4000mm rainfall, high humidity',
      spacing: '9m x 9m triangular',
      seeds: '143 palms/hectare',
      fertilizer: 'NPK 1.5:0.4:2.2 kg per palm',
      pestManagement: 'Rhinoceros beetle, bunch moth',
      challenges: ['Very high rainfall needed', 'Long gestation', 'Processing mills required'],
      benefits: ['Highest oil yield per hectare', 'Continuous income', 'Industrial demand'],
      tips: ['Coastal areas ideal', 'High humidity essential', 'Contract farming beneficial']
    });
  }

  // ADDITIONAL PULSES

  // Horse Gram (Kulthi) - Kharif/Rabi
  const horseGramEvaluation = evaluateCrop([20, 35], [40, 70], [20, 60], null);
  if (horseGramEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Rabi';
    crops.push({
      name: 'Horse Gram (Kulthi)',
      type: isKharifSeason ? 'kharif' : 'rabi',
      suitability: horseGramEvaluation.suitability,
      confidence: horseGramEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'October-November',
      harvestTime: isKharifSeason ? 'September-October' : 'January-February',
      waterRequirement: 'low',
      expectedYield: '0.8-1.5 tons/hectare',
      marketPrice: '₹3,500-5,500/quintal',
      soilRequirement: 'Poor rocky soils, highly adaptable',
      climateRequirement: '20-35°C, 400-750mm rainfall',
      spacing: '30cm x 10cm',
      seeds: '25-30 kg/hectare',
      fertilizer: 'NPK 25:25:25 kg/hectare',
      pestManagement: 'Generally pest resistant',
      challenges: ['Limited market awareness', 'Processing facilities'],
      benefits: ['Highly drought tolerant', 'Medicinal properties', 'Nutritious'],
      tips: ['Grows on poorest soils', 'Good for dry farming', 'Health food market']
    });
  }

  // Kidney Bean (Rajma) - Rabi/Kharif
  const rajmaEvaluation = evaluateCrop([15, 25], [60, 80], [60, 80], false);
  if (rajmaEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isRabiSeason ? 'Rabi' : 'Kharif';
    crops.push({
      name: 'Kidney Bean (Rajma)',
      type: isRabiSeason ? 'rabi' : 'kharif',
      suitability: rajmaEvaluation.suitability,
      confidence: rajmaEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isRabiSeason ? 'October-November' : 'June-July',
      harvestTime: isRabiSeason ? 'February-March' : 'September-October',
      waterRequirement: 'medium',
      expectedYield: '1.5-2.5 tons/hectare',
      marketPrice: '₹8,000-15,000/quintal',
      soilRequirement: 'Well-drained loamy soil, pH 6.0-7.0',
      climateRequirement: '15-25°C, cool humid weather',
      spacing: '30cm x 10cm',
      seeds: '80-100 kg/hectare',
      fertilizer: 'NPK 25:50:25 kg/hectare',
      pestManagement: 'Pod borer, aphid control',
      challenges: ['Temperature sensitivity', 'Disease management'],
      benefits: ['High market value', 'Popular pulse', 'Good protein source'],
      tips: ['Hill areas preferred', 'Cool weather essential', 'Premium market available']
    });
  }

  // ADDITIONAL VEGETABLES

  // Carrot - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 20], [60, 80], [60, 80], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Carrot',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'January-February',
        waterRequirement: 'medium',
        expectedYield: '25-35 tons/hectare',
        marketPrice: '₹800-2,000/quintal',
        soilRequirement: 'Deep sandy loam, well-drained, pH 6.0-6.8',
        climateRequirement: '15-20°C, cool weather preferred',
        spacing: '30cm x 5cm',
        seeds: '4-6 kg/hectare',
        fertilizer: 'NPK 75:50:50 kg/hectare',
        pestManagement: 'Carrot fly, aphid control',
        challenges: ['Root quality maintenance', 'Storage issues'],
        benefits: ['High nutrition', 'Good market demand', 'Processing potential'],
        tips: ['Deep soil preparation', 'Uniform irrigation', 'Harvest when tender']
      });
    }
  }

  // Radish - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [60, 80], [60, 80], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Radish',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'September-October',
        harvestTime: 'November-December',
        waterRequirement: 'medium',
        expectedYield: '20-30 tons/hectare',
        marketPrice: '₹600-1,500/quintal',
        soilRequirement: 'Sandy loam, well-drained, pH 6.0-7.0',
        climateRequirement: '15-25°C, cool weather',
        spacing: '30cm x 10cm',
        seeds: '8-12 kg/hectare',
        fertilizer: 'NPK 60:40:40 kg/hectare',
        pestManagement: 'Flea beetle, aphid control',
        challenges: ['Quick maturity needed', 'Perishable nature'],
        benefits: ['Quick growing', 'Good returns', 'Popular vegetable'],
        tips: ['Quick harvest needed', 'Cool weather essential', 'Regular irrigation important']
      });
    }
  }

  // Spinach - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [60, 80], [60, 80], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Spinach',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'September-October',
        harvestTime: 'November-January',
        waterRequirement: 'medium',
        expectedYield: '15-25 tons/hectare',
        marketPrice: '₹800-2,000/quintal',
        soilRequirement: 'Rich organic matter, pH 6.0-7.0',
        climateRequirement: '15-25°C, cool humid weather',
        spacing: '20cm x 10cm',
        seeds: '20-25 kg/hectare',
        fertilizer: 'NPK 80:40:40 kg/hectare',
        pestManagement: 'Leaf miner, aphid control',
        challenges: ['Perishable nature', 'Disease susceptibility'],
        benefits: ['High nutrition', 'Multiple cuttings', 'Health food'],
        tips: ['Rich soil needed', 'Multiple harvests', 'Cool weather essential']
      });
    }
  }

  // Cucumber - Kharif/Zaid
  const cucumberEvaluation = evaluateCrop([20, 30], [60, 80], [60, 80], null);
  if (cucumberEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Zaid';
    crops.push({
      name: 'Cucumber',
      type: isKharifSeason ? 'kharif' : 'zaid',
      suitability: cucumberEvaluation.suitability,
      confidence: cucumberEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'February-March',
      harvestTime: '50-70 days from sowing',
      waterRequirement: 'medium',
      expectedYield: '15-25 tons/hectare',
      marketPrice: '₹800-2,500/quintal',
      soilRequirement: 'Well-drained sandy loam, pH 6.0-7.0',
      climateRequirement: '20-30°C, warm humid weather',
      spacing: '1.5m x 1m',
      seeds: '2-3 kg/hectare',
      fertilizer: 'NPK 100:50:50 kg/hectare',
      pestManagement: 'Fruit fly, downy mildew control',
      challenges: ['Disease management', 'Fruit quality'],
      benefits: ['Quick returns', 'High demand', 'Processing potential'],
      tips: ['Proper spacing important', 'Regular harvesting', 'Trellising beneficial']
    });
  }

  // Bottle Gourd - Kharif/Zaid
  const bottleGourdEvaluation = evaluateCrop([25, 35], [70, 85], [60, 80], null);
  if (bottleGourdEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    const season = isKharifSeason ? 'Kharif' : 'Zaid';
    crops.push({
      name: 'Bottle Gourd',
      type: isKharifSeason ? 'kharif' : 'zaid',
      suitability: bottleGourdEvaluation.suitability,
      confidence: bottleGourdEvaluation.confidence,
      season: `${season} season`,
      sowingTime: isKharifSeason ? 'June-July' : 'February-March',
      harvestTime: '90-120 days from sowing',
      waterRequirement: 'medium',
      expectedYield: '20-30 tons/hectare',
      marketPrice: '₹600-1,500/quintal',
      soilRequirement: 'Well-drained fertile soil, pH 6.0-7.0',
      climateRequirement: '25-35°C, warm humid weather',
      spacing: '2m x 1.5m',
      seeds: '3-4 kg/hectare',
      fertilizer: 'NPK 80:40:40 kg/hectare',
      pestManagement: 'Fruit fly, red pumpkin beetle',
      challenges: ['Fruit borer damage', 'Transportation'],
      benefits: ['High yield', 'Nutritious vegetable', 'Good market'],
      tips: ['Trailing crop', 'Support needed', 'Regular irrigation important']
    });
  }

  // Sweet Potato - Kharif
  if (isKharifSeason) {
    const evaluation = evaluateCrop([20, 30], [60, 80], [60, 80], true);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Sweet Potato',
        type: 'kharif',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Kharif (Monsoon)',
        sowingTime: 'June-July',
        harvestTime: 'October-November',
        waterRequirement: 'medium',
        expectedYield: '25-40 tons/hectare',
        marketPrice: '₹800-2,000/quintal',
        soilRequirement: 'Well-drained sandy loam, pH 5.8-6.2',
        climateRequirement: '20-30°C, warm humid weather',
        spacing: '30cm x 30cm',
        seeds: '40,000-50,000 slips/hectare',
        fertilizer: 'NPK 50:25:75 kg/hectare',
        pestManagement: 'Weevil, sweet potato moth',
        challenges: ['Storage issues', 'Pest management'],
        benefits: ['High nutrition', 'Drought tolerant', 'Multiple uses'],
        tips: ['Ridge planting beneficial', 'Proper curing important', 'Value addition potential']
      });
    }
  }

  // ADDITIONAL SPICES

  // Garlic - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [50, 70], [50, 70], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Garlic',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'March-April',
        waterRequirement: 'medium',
        expectedYield: '8-12 tons/hectare',
        marketPrice: '₹8,000-20,000/quintal',
        soilRequirement: 'Well-drained loamy soil, pH 6.0-7.0',
        climateRequirement: '15-25°C, cool dry weather',
        spacing: '15cm x 10cm',
        seeds: '200-250 kg/hectare',
        fertilizer: 'NPK 60:30:30 kg/hectare',
        pestManagement: 'Thrips, purple blotch control',
        challenges: ['Quality seed material', 'Storage losses'],
        benefits: ['High value spice', 'Medicinal properties', 'Export demand'],
        tips: ['Quality cloves important', 'Proper curing essential', 'Cool storage needed']
      });
    }
  }

  // Fennel (Saunf) - Rabi
  if (isRabiSeason) {
    const evaluation = evaluateCrop([15, 25], [50, 70], [40, 70], false);
    if (evaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Fennel (Saunf)',
        type: 'rabi',
        suitability: evaluation.suitability,
        confidence: evaluation.confidence,
        season: 'Rabi (Winter)',
        sowingTime: 'October-November',
        harvestTime: 'March-April',
        waterRequirement: 'medium',
        expectedYield: '1.5-2.5 tons/hectare',
        marketPrice: '₹15,000-30,000/quintal',
        soilRequirement: 'Well-drained fertile soil, pH 6.5-8.0',
        climateRequirement: '15-25°C, cool weather',
        spacing: '30cm x 15cm',
        seeds: '8-10 kg/hectare',
        fertilizer: 'NPK 60:30:30 kg/hectare',
        pestManagement: 'Aphid, thrips control',
        challenges: ['High input costs', 'Weather sensitivity'],
        benefits: ['Very high value', 'Export potential', 'Medicinal uses'],
        tips: ['Cool weather essential', 'Quality seeds important', 'Proper drying crucial']
      });
    }
  }

  // Black Pepper - Perennial
  const blackPepperEvaluation = evaluateCrop([20, 30], [75, 95], [80, 95], true);
  if (blackPepperEvaluation.confidence >= CONFIDENCE_THRESHOLD && avgHumidity >= 80) {
    crops.push({
      name: 'Black Pepper',
      type: 'perennial',
      suitability: blackPepperEvaluation.suitability,
      confidence: blackPepperEvaluation.confidence,
      season: 'Perennial spice crop',
      sowingTime: 'May-June (monsoon planting)',
      harvestTime: '3-4 years for first harvest',
      waterRequirement: 'high',
      expectedYield: '2-4 kg/vine',
      marketPrice: '₹400-800/kg',
      soilRequirement: 'Well-drained red laterite soil, pH 4.5-6.0',
      climateRequirement: '20-30°C, 1500-3000mm rainfall, high humidity',
      spacing: '2m x 2m',
      seeds: '1,111 plants/hectare',
      fertilizer: 'NPK 50:50:150g per vine',
      pestManagement: 'Pollu beetle, foot rot disease',
      challenges: ['High humidity requirement', 'Disease management', 'Climbing support'],
      benefits: ['King of spices', 'Very high value', 'Export crop'],
      tips: ['Support trees needed', 'Shade cultivation', 'High humidity areas only']
    });
  }

  // ADDITIONAL FRUITS

  // Guava - Perennial
  const guavaEvaluation = evaluateCrop([20, 35], [60, 80], [60, 80], null);
  if (guavaEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Guava',
      type: 'perennial',
      suitability: guavaEvaluation.suitability,
      confidence: guavaEvaluation.confidence,
      season: 'Perennial fruit crop',
      sowingTime: 'June-July or February-March',
      harvestTime: '2-3 years for first harvest',
      waterRequirement: 'medium',
      expectedYield: '20-35 tons/hectare',
      marketPrice: '₹1,500-4,000/quintal',
      soilRequirement: 'Well-drained soil, pH 6.0-7.5',
      climateRequirement: '20-35°C, adaptable to various climates',
      spacing: '6m x 6m',
      seeds: '278 plants/hectare',
      fertilizer: 'NPK 400:200:400g per plant',
      pestManagement: 'Fruit fly, scale insects',
      challenges: ['Fruit fly damage', 'Post-harvest handling'],
      benefits: ['Hardy fruit', 'Nutritious', 'Processing potential'],
      tips: ['Adaptable crop', 'Regular pruning needed', 'Fruit bagging beneficial']
    });
  }

  // Apple - Perennial (Temperate)
  const appleEvaluation = evaluateCrop([15, 24], [60, 80], [60, 80], false);
  if (appleEvaluation.confidence >= CONFIDENCE_THRESHOLD && currentTemp <= 24) {
    crops.push({
      name: 'Apple',
      type: 'perennial',
      suitability: appleEvaluation.suitability,
      confidence: appleEvaluation.confidence,
      season: 'Temperate fruit crop',
      sowingTime: 'December-January (planting)',
      harvestTime: '4-5 years for first harvest',
      waterRequirement: 'medium',
      expectedYield: '15-25 tons/hectare',
      marketPrice: '₹3,000-8,000/quintal',
      soilRequirement: 'Well-drained hill soil, pH 5.5-6.5',
      climateRequirement: '15-24°C, chilling hours required, 1000-1200mm rainfall',
      spacing: '4m x 4m',
      seeds: '625 plants/hectare',
      fertilizer: 'NPK 600:300:600g per tree',
      pestManagement: 'Codling moth, aphid control',
      challenges: ['Chilling requirement', 'Hill areas only', 'High investment'],
      benefits: ['Premium fruit', 'Export potential', 'High returns'],
      tips: ['Hill areas only', 'Chilling hours essential', 'Quality varieties important']
    });
  }

  // Papaya - Perennial
  const papayaEvaluation = evaluateCrop([22, 32], [60, 85], [60, 85], null);
  if (papayaEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Papaya',
      type: 'perennial',
      suitability: papayaEvaluation.suitability,
      confidence: papayaEvaluation.confidence,
      season: 'Year-round fruit crop',
      sowingTime: 'June-July or February-March',
      harvestTime: '10-12 months from planting',
      waterRequirement: 'medium',
      expectedYield: '50-80 tons/hectare',
      marketPrice: '₹800-2,500/quintal',
      soilRequirement: 'Well-drained fertile soil, pH 6.0-7.0',
      climateRequirement: '22-32°C, warm humid weather',
      spacing: '2.5m x 2.5m',
      seeds: '1,600 plants/hectare',
      fertilizer: 'NPK 200:200:400g per plant',
      pestManagement: 'Papaya ring spot virus, fruit fly',
      challenges: ['Virus diseases', 'Short plant life'],
      benefits: ['Quick returns', 'High yield', 'Nutritious fruit'],
      tips: ['Disease-free plants', 'Good drainage essential', 'Regular fertilization']
    });
  }

  // ADDITIONAL CASH CROPS

  // Rubber - Perennial
  const rubberEvaluation = evaluateCrop([24, 30], [75, 90], [80, 95], true);
  if (rubberEvaluation.confidence >= CONFIDENCE_THRESHOLD && avgHumidity >= 80) {
    crops.push({
      name: 'Rubber',
      type: 'perennial',
      suitability: rubberEvaluation.suitability,
      confidence: rubberEvaluation.confidence,
      season: 'Perennial plantation crop',
      sowingTime: 'May-June (monsoon planting)',
      harvestTime: '6-7 years for first tapping',
      waterRequirement: 'high',
      expectedYield: '1,500-2,500 kg rubber/hectare',
      marketPrice: '₹150-250/kg rubber',
      soilRequirement: 'Well-drained laterite soil, pH 4.5-6.5',
      climateRequirement: '24-30°C, 2000-4000mm rainfall, high humidity',
      spacing: '7m x 3m',
      seeds: '476 plants/hectare',
      fertilizer: 'NPK 75:35:140g per tree',
      pestManagement: 'Pink disease, tapping panel dryness',
      challenges: ['Very long gestation', 'High rainfall areas only', 'Technical expertise'],
      benefits: ['Long-term income', 'Industrial importance', 'Carbon sequestration'],
      tips: ['High rainfall areas only', 'Technical training needed', 'Sustainable income source']
    });
  }

  // ADDITIONAL VEGETABLE CROPS

  // Bitter Gourd (Karela) - Kharif/Summer
  if (isKharifSeason || isZaidSeason) {
    const bitterGourdEvaluation = evaluateCrop([24, 35], [60, 80], [40, 70], isKharifSeason);
    if (bitterGourdEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Bitter Gourd (Karela)',
        type: isKharifSeason ? 'kharif' : 'zaid',
        suitability: bitterGourdEvaluation.suitability,
        confidence: bitterGourdEvaluation.confidence,
        season: isKharifSeason ? 'Kharif vegetable' : 'Summer vegetable',
        sowingTime: 'June-July (Kharif) or February-March (Summer)',
        harvestTime: '60-80 days from sowing',
        waterRequirement: 'medium',
        expectedYield: '80-120 quintals/hectare',
        marketPrice: '₹1,500-2,500/quintal',
        soilRequirement: 'Well-drained loamy soil, pH 6.0-7.0',
        climateRequirement: '24-35°C, moderate humidity, good drainage',
        spacing: '2m x 1m',
        seeds: '2-3 kg/hectare',
        fertilizer: 'NPK 100:50:50 kg/hectare',
        pestManagement: 'Fruit fly, aphids, red spider mites',
        challenges: ['Pest management', 'Market price fluctuations'],
        benefits: ['Medicinal properties', 'Good market demand', 'High nutritional value'],
        tips: ['Strong support system needed', 'Regular harvesting increases yield', 'Use pheromone traps']
      });
    }
  }

  // Ridge Gourd (Turai) - Kharif/Summer
  if (isKharifSeason || isZaidSeason) {
    const ridgeGourdEvaluation = evaluateCrop([22, 35], [60, 80], [40, 65], isKharifSeason);
    if (ridgeGourdEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Ridge Gourd (Turai)',
        type: isKharifSeason ? 'kharif' : 'zaid',
        suitability: ridgeGourdEvaluation.suitability,
        confidence: ridgeGourdEvaluation.confidence,
        season: isKharifSeason ? 'Kharif vegetable' : 'Summer vegetable',
        sowingTime: 'June-July (Kharif) or March-April (Summer)',
        harvestTime: '50-60 days from sowing',
        waterRequirement: 'medium',
        expectedYield: '100-150 quintals/hectare',
        marketPrice: '₹800-1,500/quintal',
        soilRequirement: 'Well-drained fertile soil, pH 6.0-7.5',
        climateRequirement: '22-35°C, warm humid weather',
        spacing: '2m x 1m',
        seeds: '2-3 kg/hectare',
        fertilizer: 'NPK 80:40:40 kg/hectare',
        pestManagement: 'Red pumpkin beetle, fruit fly',
        challenges: ['Proper support structure needed', 'Pest control'],
        benefits: ['Good market demand', 'Fiber production from mature fruits'],
        tips: ['Train vines on pandals', 'Harvest young fruits', 'Use crop rotation']
      });
    }
  }

  // Snake Gourd (Chichinda) - Kharif/Summer
  if (isKharifSeason || isZaidSeason) {
    const snakeGourdEvaluation = evaluateCrop([22, 35], [65, 80], [40, 65], isKharifSeason);
    if (snakeGourdEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Snake Gourd (Chichinda)',
        type: isKharifSeason ? 'kharif' : 'zaid',
        suitability: snakeGourdEvaluation.suitability,
        confidence: snakeGourdEvaluation.confidence,
        season: isKharifSeason ? 'Kharif vegetable' : 'Summer vegetable',
        sowingTime: 'June-July (Kharif) or March-April (Summer)',
        harvestTime: '60-75 days from sowing',
        waterRequirement: 'medium',
        expectedYield: '80-120 quintals/hectare',
        marketPrice: '₹1,000-1,800/quintal',
        soilRequirement: 'Well-drained loamy soil, pH 6.0-7.0',
        climateRequirement: '22-35°C, moderate to high humidity',
        spacing: '2m x 1m',
        seeds: '2-2.5 kg/hectare',
        fertilizer: 'NPK 100:50:50 kg/hectare',
        pestManagement: 'Cucumber beetles, downy mildew',
        challenges: ['Disease management in humid conditions'],
        benefits: ['Good local market demand', 'Medicinal properties'],
        tips: ['Use bamboo or wire support', 'Maintain proper spacing', 'Good air circulation']
      });
    }
  }

  // Drumstick (Moringa) - Perennial
  const drumstickEvaluation = evaluateCrop([20, 40], [40, 70], [25, 75], true);
  if (drumstickEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Drumstick (Moringa)',
      type: 'perennial',
      suitability: drumstickEvaluation.suitability,
      confidence: drumstickEvaluation.confidence,
      season: 'Perennial tree crop',
      sowingTime: 'June-July (monsoon planting)',
      harvestTime: '8-10 months for pods, continuous for leaves',
      waterRequirement: 'low',
      expectedYield: '60-100 quintals pods/hectare',
      marketPrice: '₹2,000-4,000/quintal pods, ₹10,000-15,000/quintal leaves',
      soilRequirement: 'Well-drained soil, pH 6.3-7.0, drought tolerant',
      climateRequirement: '20-40°C, drought tolerant, various rainfall zones',
      spacing: '2.5m x 2.5m',
      seeds: '2,500-3,000 plants/hectare',
      fertilizer: 'NPK 200:100:150 kg/hectare',
      pestManagement: 'Caterpillars, aphids, pod borers',
      challenges: ['Initial slow growth', 'Regular pruning needed'],
      benefits: ['High nutritional value', 'Multiple uses', 'Export potential', 'Drought tolerant'],
      tips: ['Regular pruning for bushy growth', 'Harvest pods when tender', 'Leaves also marketable']
    });
  }

  // ADDITIONAL GOURD CROPS

  // Ash Gourd (Petha) - Kharif/Rabi
  if (isKharifSeason || isRabiSeason) {
    const ashGourdEvaluation = evaluateCrop([20, 35], [60, 80], [40, 65], true);
    if (ashGourdEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Ash Gourd (Petha)',
        type: isRabiSeason ? 'rabi' : 'kharif',
        suitability: ashGourdEvaluation.suitability,
        confidence: ashGourdEvaluation.confidence,
        season: isRabiSeason ? 'Rabi vegetable' : 'Kharif vegetable',
        sowingTime: 'June-July (Kharif) or October-November (Rabi)',
        harvestTime: '120-150 days from sowing',
        waterRequirement: 'medium',
        expectedYield: '200-400 quintals/hectare',
        marketPrice: '₹500-1,000/quintal',
        soilRequirement: 'Well-drained fertile soil, pH 6.0-7.0',
        climateRequirement: '20-35°C, moderate humidity',
        spacing: '3m x 2m',
        seeds: '2-3 kg/hectare',
        fertilizer: 'NPK 100:50:50 kg/hectare',
        pestManagement: 'Fruit fly, red pumpkin beetle',
        challenges: ['Storage and transportation due to large size'],
        benefits: ['Long storage life', 'Good export market', 'Processing industry demand'],
        tips: ['Harvest at full maturity', 'Store in cool dry place', 'Handle carefully']
      });
    }
  }

  // Pumpkin - Kharif/Rabi
  if (isKharifSeason || isRabiSeason) {
    const pumpkinEvaluation = evaluateCrop([18, 35], [60, 80], [40, 65], true);
    if (pumpkinEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Pumpkin',
        type: isRabiSeason ? 'rabi' : 'kharif',
        suitability: pumpkinEvaluation.suitability,
        confidence: pumpkinEvaluation.confidence,
        season: isRabiSeason ? 'Rabi vegetable' : 'Kharif vegetable',
        sowingTime: 'June-July (Kharif) or October-November (Rabi)',
        harvestTime: '100-120 days from sowing',
        waterRequirement: 'medium',
        expectedYield: '150-250 quintals/hectare',
        marketPrice: '₹600-1,200/quintal',
        soilRequirement: 'Well-drained fertile soil, pH 6.0-7.0',
        climateRequirement: '18-35°C, moderate humidity',
        spacing: '3m x 2m',
        seeds: '2-3 kg/hectare',
        fertilizer: 'NPK 120:60:60 kg/hectare',
        pestManagement: 'Squash bug, powdery mildew',
        challenges: ['Storage issues', 'Market glut during peak season'],
        benefits: ['Good nutritional value', 'Seeds have market value', 'Processing potential'],
        tips: ['Harvest when stem starts drying', 'Cure in sun before storage', 'Use resistant varieties']
      });
    }
  }

  // MELONS AND SUMMER FRUITS

  // Watermelon - Summer/Kharif
  if (currentTemp >= 20 && (isKharifSeason || isZaidSeason)) {
    const watermelonEvaluation = evaluateCrop([20, 35], [50, 70], [25, 50], isKharifSeason || isZaidSeason);
    if (watermelonEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Watermelon',
        type: isZaidSeason ? 'zaid' : 'kharif',
        suitability: watermelonEvaluation.suitability,
        confidence: watermelonEvaluation.confidence,
        season: isZaidSeason ? 'Summer fruit' : 'Kharif fruit',
        sowingTime: 'February-March (Summer) or June-July (Kharif)',
        harvestTime: '90-110 days from sowing',
        waterRequirement: 'medium',
        expectedYield: '200-400 quintals/hectare',
        marketPrice: '₹800-1,500/quintal',
        soilRequirement: 'Well-drained sandy loam, pH 6.0-7.0',
        climateRequirement: '20-35°C, low to moderate humidity',
        spacing: '3m x 2m',
        seeds: '2-3 kg/hectare',
        fertilizer: 'NPK 150:75:75 kg/hectare',
        pestManagement: 'Aphids, anthracnose, fruit fly',
        challenges: ['Water management', 'Fruit cracking', 'Transportation'],
        benefits: ['High summer demand', 'Good profit margins', 'Export potential'],
        tips: ['Test maturity by thumping sound', 'Harvest early morning', 'Use mulching']
      });
    }
  }

  // Muskmelon (Kharbuja) - Summer/Zaid
  if (currentTemp >= 18 && isZaidSeason) {
    const muskmelonEvaluation = evaluateCrop([18, 35], [50, 70], [20, 40], isZaidSeason);
    if (muskmelonEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Muskmelon (Kharbuja)',
        type: 'zaid',
        suitability: muskmelonEvaluation.suitability,
        confidence: muskmelonEvaluation.confidence,
        season: 'Summer/Zaid fruit',
        sowingTime: 'February-March (Summer) or April-May (Zaid)',
        harvestTime: '90-100 days from sowing',
        waterRequirement: 'medium',
        expectedYield: '150-250 quintals/hectare',
        marketPrice: '₹1,500-2,500/quintal',
        soilRequirement: 'Well-drained sandy loam, pH 6.0-7.0',
        climateRequirement: '18-35°C, low to moderate humidity',
        spacing: '2m x 1.5m',
        seeds: '1.5-2 kg/hectare',
        fertilizer: 'NPK 120:60:60 kg/hectare',
        pestManagement: 'Fruit fly, downy mildew, aphids',
        challenges: ['Disease management', 'Fruit quality maintenance'],
        benefits: ['Premium market price', 'Export potential', 'High consumer preference'],
        tips: ['Harvest at three-quarter slip stage', 'Handle carefully', 'Use mulching and drip irrigation']
      });
    }
  }

  // ADDITIONAL CEREALS AND MILLETS

  // Little Millet (Kutki) - Kharif
  if (isKharifSeason) {
    const littleMilletEvaluation = evaluateCrop([20, 35], [40, 70], [30, 60], isKharifSeason);
    if (littleMilletEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Little Millet (Kutki)',
        type: 'kharif',
        suitability: littleMilletEvaluation.suitability,
        confidence: littleMilletEvaluation.confidence,
        season: 'Kharif cereal',
        sowingTime: 'June-July',
        harvestTime: '90-120 days from sowing',
        waterRequirement: 'low',
        expectedYield: '8-12 quintals/hectare',
        marketPrice: '₹4,000-6,000/quintal',
        soilRequirement: 'Well-drained poor soils, pH 5.0-8.0',
        climateRequirement: '20-35°C, drought tolerant, 400-750mm rainfall',
        spacing: '20cm x 10cm',
        seeds: '10-12 kg/hectare',
        fertilizer: 'NPK 40:20:20 kg/hectare',
        pestManagement: 'Shoot fly, stem borer',
        challenges: ['Limited market awareness', 'Processing facilities'],
        benefits: ['Highly nutritious', 'Gluten-free', 'Climate resilient', 'Premium market'],
        tips: ['Drought tolerant crop', 'Suitable for marginal lands', 'Growing health food market']
      });
    }
  }

  // Proso Millet (Cheena) - Kharif
  if (isKharifSeason) {
    const prosoMilletEvaluation = evaluateCrop([18, 32], [40, 70], [25, 50], isKharifSeason);
    if (prosoMilletEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Proso Millet (Cheena)',
        type: 'kharif',
        suitability: prosoMilletEvaluation.suitability,
        confidence: prosoMilletEvaluation.confidence,
        season: 'Kharif cereal',
        sowingTime: 'June-July',
        harvestTime: '70-90 days from sowing',
        waterRequirement: 'low',
        expectedYield: '10-15 quintals/hectare',
        marketPrice: '₹3,500-5,000/quintal',
        soilRequirement: 'Well-drained sandy loam, pH 6.0-8.0',
        climateRequirement: '18-32°C, drought tolerant, 300-600mm rainfall',
        spacing: '20cm x 10cm',
        seeds: '8-10 kg/hectare',
        fertilizer: 'NPK 40:20:20 kg/hectare',
        pestManagement: 'Shoot fly, birds',
        challenges: ['Bird damage', 'Limited processing'],
        benefits: ['Shortest growing season', 'Drought tolerant', 'Nutritious'],
        tips: ['Fastest growing millet', 'Good for catch crop', 'Bird protection needed']
      });
    }
  }

  // ADDITIONAL PULSES

  // Moth Bean (Moth) - Kharif
  if (isKharifSeason && currentTemp >= 25) {
    const mothBeanEvaluation = evaluateCrop([25, 40], [30, 60], [20, 40], isKharifSeason);
    if (mothBeanEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Moth Bean (Moth)',
        type: 'kharif',
        suitability: mothBeanEvaluation.suitability,
        confidence: mothBeanEvaluation.confidence,
        season: 'Kharif pulse',
        sowingTime: 'July-August',
        harvestTime: '75-90 days from sowing',
        waterRequirement: 'low',
        expectedYield: '8-12 quintals/hectare',
        marketPrice: '₹5,000-7,000/quintal',
        soilRequirement: 'Sandy loam, salt tolerant, pH 7.0-8.5',
        climateRequirement: '25-40°C, drought and heat tolerant, 300-500mm rainfall',
        spacing: '30cm x 10cm',
        seeds: '15-20 kg/hectare',
        fertilizer: 'NPK 20:40:20 kg/hectare',
        pestManagement: 'Pod borer, aphids',
        challenges: ['Extreme heat tolerance needed', 'Limited market'],
        benefits: ['Extremely drought tolerant', 'Salt tolerant', 'Nutritious'],
        tips: ['Ideal for arid regions', 'Can grow in saline soils', 'Excellent drought crop']
      });
    }
  }

  // Cluster Bean (Guar) - Kharif
  if (isKharifSeason) {
    const clusterBeanEvaluation = evaluateCrop([25, 40], [40, 70], [30, 60], isKharifSeason);
    if (clusterBeanEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Cluster Bean (Guar)',
        type: 'kharif',
        suitability: clusterBeanEvaluation.suitability,
        confidence: clusterBeanEvaluation.confidence,
        season: 'Kharif pulse/vegetable',
        sowingTime: 'July-August',
        harvestTime: '90-120 days from sowing',
        waterRequirement: 'low',
        expectedYield: '10-15 quintals/hectare (grain), 80-120 quintals/hectare (vegetable)',
        marketPrice: '₹4,000-6,000/quintal (grain), ₹1,000-2,000/quintal (vegetable)',
        soilRequirement: 'Sandy loam, well-drained, pH 7.0-8.5',
        climateRequirement: '25-40°C, semi-arid regions, 300-600mm rainfall',
        spacing: '30cm x 10cm',
        seeds: '20-25 kg/hectare',
        fertilizer: 'NPK 20:40:20 kg/hectare',
        pestManagement: 'Aphids, jassids, pod borer',
        challenges: ['Market price fluctuations', 'Processing demand dependent'],
        benefits: ['Industrial gum extraction', 'Dual purpose crop', 'Drought tolerant'],
        tips: ['High demand for gum processing', 'Can be used as vegetable', 'Suitable for dryland farming']
      });
    }
  }

  // ADDITIONAL OILSEEDS

  // Sunflower (Dwarf varieties) - Rabi
  if (isRabiSeason) {
    const rabiSunflowerEvaluation = evaluateCrop([15, 25], [50, 70], [30, 60], isRabiSeason);
    if (rabiSunflowerEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Sunflower (Rabi)',
        type: 'rabi',
        suitability: rabiSunflowerEvaluation.suitability,
        confidence: rabiSunflowerEvaluation.confidence,
        season: 'Rabi oilseed',
        sowingTime: 'October-November',
        harvestTime: '90-110 days from sowing',
        waterRequirement: 'medium',
        expectedYield: '15-20 quintals/hectare',
        marketPrice: '₹5,500-7,000/quintal',
        soilRequirement: 'Well-drained black soil, pH 6.0-7.5',
        climateRequirement: '15-25°C, cool weather, 400-600mm water requirement',
        spacing: '45cm x 30cm',
        seeds: '8-10 kg/hectare',
        fertilizer: 'NPK 60:30:30 kg/hectare',
        pestManagement: 'Head borer, aphids, jassids',
        challenges: ['Bird damage at maturity', 'Weather dependency'],
        benefits: ['Good oil quality', 'High market demand', 'Short duration'],
        tips: ['Rabi crop for better quality', 'Bird protection at maturity', 'Timely harvesting important']
      });
    }
  }

  // SPECIALTY AND COMMERCIAL CROPS

  // Stevia - Perennial
  const steviaEvaluation = evaluateCrop([20, 30], [70, 85], [60, 80], true);
  if (steviaEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Stevia (Natural Sweetener)',
      type: 'perennial',
      suitability: steviaEvaluation.suitability,
      confidence: steviaEvaluation.confidence,
      season: 'Perennial herb crop',
      sowingTime: 'June-July or February-March',
      harvestTime: '90-120 days from planting (leaves)',
      waterRequirement: 'medium',
      expectedYield: '3-5 tons dry leaves/hectare',
      marketPrice: '₹100-200/kg dry leaves',
      soilRequirement: 'Well-drained sandy loam, pH 6.5-7.5',
      climateRequirement: '20-30°C, high humidity, partial shade',
      spacing: '30cm x 30cm',
      seeds: '25,000-30,000 plants/hectare',
      fertilizer: 'NPK 40:20:40 kg/hectare',
      pestManagement: 'Aphids, caterpillars - organic methods preferred',
      challenges: ['Specific processing requirements', 'Limited buyers'],
      benefits: ['High value crop', 'Natural sweetener demand', 'Diabetic-friendly'],
      tips: ['Contract farming advisable', 'Requires processing setup', 'Growing health market']
    });
  }

  // Aloe Vera - Perennial
  const aloeVeraEvaluation = evaluateCrop([15, 40], [40, 70], [10, 40], true);
  if (aloeVeraEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Aloe Vera',
      type: 'perennial',
      suitability: aloeVeraEvaluation.suitability,
      confidence: aloeVeraEvaluation.confidence,
      season: 'Perennial medicinal plant',
      sowingTime: 'June-July or February-March',
      harvestTime: '8-10 months for first harvest, then 3-4 times/year',
      waterRequirement: 'low',
      expectedYield: '40-50 tons fresh leaves/hectare',
      marketPrice: '₹8-15/kg fresh leaves',
      soilRequirement: 'Well-drained sandy soil, pH 6.0-8.0',
      climateRequirement: '15-40°C, drought tolerant, low water requirement',
      spacing: '60cm x 60cm',
      seeds: '3,000-4,000 plants/hectare',
      fertilizer: 'NPK 100:50:50 kg/hectare',
      pestManagement: 'Scale insects, mealybugs - neem oil application',
      challenges: ['Processing setup needed', 'Market linkages required'],
      benefits: ['Low water requirement', 'Multiple harvests', 'Cosmetic industry demand'],
      tips: ['Drought tolerant crop', 'Suitable for arid regions', 'Value addition important']
    });
  }

  // Lemongrass - Perennial
  const lemongrassEvaluation = evaluateCrop([20, 35], [60, 80], [50, 80], true);
  if (lemongrassEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
    crops.push({
      name: 'Lemongrass',
      type: 'perennial',
      suitability: lemongrassEvaluation.suitability,
      confidence: lemongrassEvaluation.confidence,
      season: 'Perennial aromatic crop',
      sowingTime: 'June-July or February-March',
      harvestTime: '4-5 months from planting, then every 3-4 months',
      waterRequirement: 'medium',
      expectedYield: '200-300 kg oil/hectare/year',
      marketPrice: '₹1,500-3,000/kg oil',
      soilRequirement: 'Well-drained fertile soil, pH 6.0-7.5',
      climateRequirement: '20-35°C, moderate to high humidity',
      spacing: '45cm x 45cm',
      seeds: '25,000 slips/hectare',
      fertilizer: 'NPK 60:40:40 kg/hectare',
      pestManagement: 'Shoot borer, root rot - proper drainage, crop rotation',
      challenges: ['Distillation setup needed', 'Oil quality maintenance'],
      benefits: ['Essential oil extraction', 'Cosmetic industry demand', 'Multiple harvests'],
      tips: ['Oil extraction requires equipment', 'Regular harvesting important', 'Growing aromatherapy market']
    });
  }

  // Vanilla - Perennial
  if (avgHumidity >= 80) {
    const vanillaEvaluation = evaluateCrop([20, 30], [80, 90], [85, 95], true);
    if (vanillaEvaluation.confidence >= CONFIDENCE_THRESHOLD) {
      crops.push({
        name: 'Vanilla',
        type: 'perennial',
        suitability: vanillaEvaluation.suitability,
        confidence: vanillaEvaluation.confidence,
        season: 'Perennial spice crop',
        sowingTime: 'June-July (monsoon planting)',
        harvestTime: '3-4 years for first harvest',
        waterRequirement: 'high',
        expectedYield: '500-1,000 kg cured beans/hectare',
        marketPrice: '₹40,000-80,000/kg cured beans',
        soilRequirement: 'Well-drained organic rich soil, pH 6.0-7.0',
        climateRequirement: '20-30°C, very high humidity (80-90%), 2000-2500mm rainfall',
        spacing: '2m x 2m with support trees',
        seeds: '1,100-1,200 cuttings/hectare',
        fertilizer: 'NPK 50:50:100 kg/hectare + organic matter',
        pestManagement: 'Root rot, vanilla mosaic virus - proper drainage, disease-free planting material',
        challenges: ['Very specific climate needs', 'Hand pollination required', 'Long gestation'],
        benefits: ['Extremely high value', 'Premium spice market', 'Export potential'],
        tips: ['Requires support trees', 'Hand pollination essential', 'Specialized curing process needed']
      });
    }
  }

  // Sort by suitability and confidence
  return crops.sort((a, b) => {
    const suitabilityOrder = { excellent: 4, good: 3, moderate: 2, poor: 1 };
    const suitabilityDiff = suitabilityOrder[b.suitability] - suitabilityOrder[a.suitability];
    return suitabilityDiff !== 0 ? suitabilityDiff : b.confidence - a.confidence;
  }).slice(0, 8); // Return top 8 suggestions
};

const getSuitabilityColor = (suitability: string) => {
  switch (suitability) {
    case 'excellent': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    case 'good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    case 'moderate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'poor': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getWaterRequirementIcon = (requirement: string) => {
  switch (requirement) {
    case 'high': return <Droplets className="h-5 w-5 text-blue-600" />;
    case 'medium': return <Droplets className="h-5 w-5 text-blue-400" />;
    case 'low': return <Droplets className="h-5 w-5 text-blue-300" />;
    default: return <Droplets className="h-5 w-5 text-gray-400" />;
  }
};

export default function CropSuggestion({ weatherData }: CropSuggestionProps) {
  const cropSuggestions = getCropSuggestions(weatherData);

  if (cropSuggestions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <Wheat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Crop Suggestions Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Current weather conditions are not suitable for major crops.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <Wheat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Crop Cultivation Suggestions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on current weather and soil conditions
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cropSuggestions.map((crop, index) => (
          <motion.div
            key={crop.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg transition-all duration-300 hover:border-green-300 dark:hover:border-green-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                  {crop.name}
                </h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSuitabilityColor(crop.suitability)}`}>
                  {crop.suitability} ({crop.confidence}% confidence)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getWaterRequirementIcon(crop.waterRequirement)}
                <Sun className="h-5 w-5 text-yellow-500" />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Season:</span>
                <span className="font-medium text-gray-900 dark:text-white">{crop.season}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sowing:</span>
                <span className="font-medium text-gray-900 dark:text-white">{crop.sowingTime}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Harvest:</span>
                <span className="font-medium text-gray-900 dark:text-white">{crop.harvestTime}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expected Yield:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{crop.expectedYield}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Market Price:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{crop.marketPrice}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  <span>Detailed Information</span>
                  <TrendingUp className="h-4 w-4 group-open:rotate-180 transition-transform" />
                </summary>
                
                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Soil Requirement:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{crop.soilRequirement}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Climate Requirement:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{crop.climateRequirement}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Seeds & Spacing:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{crop.seeds}, {crop.spacing}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Fertilizer:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{crop.fertilizer}</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Challenges:</span>
                      <ul className="text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                        {crop.challenges.map((challenge, i) => (
                          <li key={i}>• {challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Tips:</span>
                      <ul className="text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                        {crop.tips.slice(0, 3).map((tip, i) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Leaf className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Agricultural Advisory
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              These suggestions are based on current weather and soil conditions. 
              Consult local agricultural experts and consider market conditions before making final decisions. 
              Climate patterns and regional variations may affect crop performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
