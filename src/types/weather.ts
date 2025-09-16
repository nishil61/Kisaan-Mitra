export interface WeatherData {
  temperature: {
    current: number;
    feels_like: number;
    min: number;
    max: number;
  };
  humidity: number;
  precipitation: {
    probability: number;
    amount: number;
  };
  wind: {
    speed: number;
    direction: number;
    degree: string;
  };
  soil: {
    moisture: number;
    temperature: number;
    recommendation: string;
  };
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  condition: {
    main: string;
    description: string;
    icon: string;
  };
  timestamp: number;
}

export interface ForecastData {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  precipitation: number;
  soil_moisture: number;
  condition: string;
}

export interface CropSuggestion {
  name: string;
  type: 'kharif' | 'rabi' | 'zaid' | 'perennial';
  suitability: 'excellent' | 'good' | 'moderate' | 'poor';
  confidence: number;
  season: string;
  sowingTime: string;
  harvestTime: string;
  waterRequirement: 'low' | 'medium' | 'high';
  expectedYield: string;
  marketPrice: string;
  soilRequirement: string;
  climateRequirement: string;
  spacing: string;
  seeds: string;
  fertilizer: string;
  pestManagement: string;
  challenges: string[];
  benefits: string[];
  tips: string[];
}

export interface ConsolidatedData {
  current: WeatherData;
  forecast: ForecastData[];
  reliability_score: number;
  cropSuggestions?: CropSuggestion[];
}