import { useState, useEffect } from 'react';
import { ConsolidatedData } from '../types/weather';

// Seeded random number generator for consistent data
const seededRandom = (seed: number) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Generate a seed from latitude and longitude
const createLocationSeed = (lat: number, lon: number): number => {
  return Math.floor((lat * 1000 + lon * 1000) * 1000);
};

// Transform OpenWeatherMap data to our format (currently unused - for future API integration)
/*
const transformOpenWeatherData = (data: any, lat: number, lon: number, locationName?: string): ConsolidatedData => {
  return {
    current: {
      temperature: {
        current: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max),
      },
      humidity: data.main.humidity,
      precipitation: {
        probability: data.clouds?.all || 0,
        amount: data.rain?.['1h'] || 0,
      },
      wind: {
        speed: Math.round(data.wind?.speed * 3.6), // Convert m/s to km/h
        direction: data.wind?.deg || 0,
        degree: (data.wind?.deg || 0).toString(),
      },
      soil: {
        moisture: Math.round(20 + Math.random() * 40), // Mock soil data
        temperature: Math.round(data.main.temp - 3),
        recommendation: "Real-time soil monitoring data. Current conditions appear favorable for most crops.",
      },
      location: {
        name: locationName || `${data.name}, ${data.sys.country}`,
        country: data.sys.country,
        lat,
        lon,
      },
      condition: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      timestamp: Date.now(),
    },
    forecast: generateForecastData(data.main.temp, lat, lon),
    reliability_score: 92,
  };
};
*/

// Generate location-based realistic mock data
const generateLocationBasedMockData = (lat: number, lon: number, locationName?: string): ConsolidatedData => {
  // Create a seed based on coordinates for consistent data
  const seed = createLocationSeed(lat, lon);
  let seedCounter = 0;
  
  // Helper function to get next seeded random value
  const getSeededRandom = () => seededRandom(seed + seedCounter++);
  
  // Base temperature varies by latitude (closer to equator = warmer)
  const baseTemp = 30 - Math.abs(lat - 20) * 0.5 + (getSeededRandom() - 0.5) * 8;
  const humidity = 45 + Math.abs(lat - 15) * 1.5 + getSeededRandom() * 20;
  const windSpeed = 8 + getSeededRandom() * 12;
  
  // Seasonal variation (assuming northern hemisphere patterns)
  const month = new Date().getMonth();
  const seasonalAdjustment = Math.sin((month - 3) * Math.PI / 6) * 8;
  
  const finalTemp = Math.round(baseTemp + seasonalAdjustment);
  
  return {
    current: {
      temperature: {
        current: finalTemp,
        feels_like: Math.round(finalTemp + (getSeededRandom() - 0.5) * 6),
        min: Math.round(finalTemp - 5),
        max: Math.round(finalTemp + 8),
      },
      humidity: Math.round(Math.max(30, Math.min(90, humidity))),
      precipitation: {
        probability: Math.round(getSeededRandom() * 100),
        amount: getSeededRandom() * 8,
      },
      wind: {
        speed: Math.round(windSpeed),
        direction: Math.round(getSeededRandom() * 360),
        degree: Math.round(getSeededRandom() * 360).toString(),
      },
      soil: {
        moisture: Math.round(25 + getSeededRandom() * 35),
        temperature: Math.round(finalTemp - 2),
        recommendation: getLocationBasedSoilRecommendation(lat, lon),
      },
      location: {
        name: locationName || getLocationName(lat, lon),
        country: 'IN',
        lat,
        lon,
      },
      condition: {
        main: getSeasonalWeather(month, lat),
        description: getWeatherDescription(month, lat),
        icon: getWeatherIcon(month, lat),
      },
      timestamp: Date.now(),
    },
    forecast: generateForecastData(finalTemp, lat, lon),
    reliability_score: 88,
  };
};

// Helper functions
const generateForecastData = (baseTemp: number, lat: number, lon: number) => {
  const seed = createLocationSeed(lat, lon);
  let forecastSeedCounter = 100; // Offset to avoid conflicts with current weather seed
  
  const getForecastSeededRandom = () => seededRandom(seed + forecastSeedCounter++);
  
  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const tempVariation = (getForecastSeededRandom() - 0.5) * 6;
    
    return {
      date: date.toISOString().split('T')[0],
      temperature: {
        min: Math.round(baseTemp - 4 + tempVariation),
        max: Math.round(baseTemp + 6 + tempVariation),
      },
      humidity: Math.round(50 + (getForecastSeededRandom() - 0.5) * 30),
      precipitation: getForecastSeededRandom() * 12,
      soil_moisture: Math.round(25 + getForecastSeededRandom() * 35),
      condition: ['Clear', 'Clouds', 'Rain'][Math.floor(getForecastSeededRandom() * 3)],
    };
  });
};

const getLocationName = (lat: number, lon: number): string => {
  if (lat > 28 && lat < 32 && lon > 76 && lon < 78) return 'Delhi Region';
  if (lat > 18 && lat < 20 && lon > 72 && lon < 74) return 'Mumbai Region';
  if (lat > 12 && lat < 14 && lon > 77 && lon < 78) return 'Bangalore Region';
  if (lat > 13 && lat < 14 && lon > 80 && lon < 81) return 'Chennai Region';
  return `Location ${lat.toFixed(2)}, ${lon.toFixed(2)}`;
};

const getLocationBasedSoilRecommendation = (lat: number, _lon: number): string => {
  if (lat > 20) return "Northern region soil conditions. Monitor for winter crop suitability.";
  if (lat < 15) return "Southern region soil conditions. Optimal for tropical crop cultivation.";
  return "Central region soil conditions. Suitable for diverse crop varieties.";
};

const getSeasonalWeather = (month: number, _lat: number): string => {
  if (month >= 6 && month <= 9) return 'Rain'; // Monsoon
  if (month >= 10 && month <= 2) return 'Clear'; // Post-monsoon/Winter
  return 'Clouds'; // Summer
};

const getWeatherDescription = (month: number, _lat: number): string => {
  if (month >= 6 && month <= 9) return 'Monsoon season with scattered showers';
  if (month >= 10 && month <= 2) return 'Clear skies with pleasant weather';
  return 'Partly cloudy with warm temperatures';
};

const getWeatherIcon = (month: number, _lat: number): string => {
  if (month >= 6 && month <= 9) return '10d'; // Rain
  if (month >= 10 && month <= 2) return '01d'; // Clear
  return '02d'; // Partly cloudy
};

// Real-time weather API fetching function
const fetchRealTimeWeatherData = async (latitude: number, longitude: number, locationName?: string): Promise<ConsolidatedData> => {
  const OPENWEATHER_KEY = '595ae513f242a4a11ecac18605e64f5c';
  const WEATHERAPI_KEY = 'f361e8de38564e3ba7d181427251309';

  try {
    // Parallel API calls for current weather data
    const [openWeatherResponse, weatherApiResponse, soilResponse] = await Promise.all([
      // OpenWeatherMap current weather
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_KEY}&units=metric`),
      
      // WeatherAPI current weather (backup)
      fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${latitude},${longitude}&aqi=no`),
      
      // Open-Meteo soil moisture data (corrected API endpoint)
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=soil_moisture_0_to_1cm&forecast_days=1`)
    ]);

    // Get forecast data from OpenWeatherMap
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_KEY}&units=metric&cnt=40`);

    // Process responses
    const openWeatherData = openWeatherResponse.ok ? await openWeatherResponse.json() : null;
    const weatherApiData = weatherApiResponse.ok ? await weatherApiResponse.json() : null;
    const soilData = soilResponse.ok ? await soilResponse.json() : null;
    const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;

    // Use primary API (OpenWeatherMap) or fallback to WeatherAPI
    const primaryData = openWeatherData || weatherApiData;
    
    if (!primaryData) {
      throw new Error('Unable to fetch weather data from any API');
    }

    // Get soil moisture (real API first, then fallback to generated)
    const realSoilMoisture = getRealSoilMoisture(soilData);
    const soilMoisture = realSoilMoisture !== null ? realSoilMoisture : 
                        generateSoilMoisture(latitude, longitude, openWeatherData?.main?.humidity || 60);
    
    console.log('Soil data source:', realSoilMoisture !== null ? 'Real API' : 'Generated', 
                'Moisture:', soilMoisture + '%');

    // Transform to our format
    const consolidated: ConsolidatedData = {
      current: {
        temperature: {
          current: Math.round(openWeatherData?.main?.temp || weatherApiData?.current?.temp_c || 25),
          feels_like: Math.round(openWeatherData?.main?.feels_like || weatherApiData?.current?.feelslike_c || 25),
          min: Math.round(openWeatherData?.main?.temp_min || (weatherApiData?.current?.temp_c || 25) - 5),
          max: Math.round(openWeatherData?.main?.temp_max || (weatherApiData?.current?.temp_c || 25) + 5),
        },
        humidity: openWeatherData?.main?.humidity || weatherApiData?.current?.humidity || 60,
        precipitation: {
          probability: weatherApiData?.current?.precip_mm ? Math.min(weatherApiData.current.precip_mm * 10, 100) : 
                      (openWeatherData?.rain?.['1h'] ? Math.min(openWeatherData.rain['1h'] * 20, 100) : 20),
          amount: weatherApiData?.current?.precip_mm || openWeatherData?.rain?.['1h'] || 0,
        },
        wind: {
          speed: Math.round(openWeatherData?.wind?.speed ? (openWeatherData.wind.speed * 3.6) : 
                           (weatherApiData?.current?.wind_kph || 10)),
          direction: openWeatherData?.wind?.deg || weatherApiData?.current?.wind_degree || 180,
          degree: (openWeatherData?.wind?.deg || weatherApiData?.current?.wind_degree || 180).toString(),
        },
        soil: {
          moisture: Math.round(soilMoisture),
          temperature: Math.round((openWeatherData?.main?.temp || weatherApiData?.current?.temp_c || 25) - 3),
          recommendation: getSoilRecommendation(soilMoisture),
        },
        location: {
          name: locationName || `${openWeatherData?.name || 'Unknown Location'}, ${openWeatherData?.sys?.country || 'IN'}`,
          country: openWeatherData?.sys?.country || 'IN',
          lat: latitude,
          lon: longitude,
        },
        condition: {
          main: openWeatherData?.weather?.[0]?.main || weatherApiData?.current?.condition?.text?.split(' ')[0] || 'Clear',
          description: openWeatherData?.weather?.[0]?.description || weatherApiData?.current?.condition?.text || 'Clear sky',
          icon: openWeatherData?.weather?.[0]?.icon || '01d',
        },
        timestamp: Date.now(),
      },
      forecast: generateRealTimeForecast(forecastData, latitude, longitude),
      reliability_score: realSoilMoisture !== null ? 97 : 95, // Higher score when soil data is real
    };

    return consolidated;
  } catch (error) {
    console.error('Real-time weather fetch failed:', error);
    throw error;
  }
};

// Extract current soil moisture from Open-Meteo API response
const getRealSoilMoisture = (soilData: any): number | null => {
  if (!soilData?.hourly?.soil_moisture_0_to_1cm || !soilData.hourly.time) {
    return null;
  }
  
  // Get the most recent soil moisture reading (convert from m³/m³ to percentage)
  const currentHour = new Date().getHours();
  const soilMoistureValues = soilData.hourly.soil_moisture_0_to_1cm;
  
  // Use current hour or closest available reading
  let moistureValue = soilMoistureValues[currentHour] || soilMoistureValues[0];
  
  // Convert from m³/m³ (0-1 range) to percentage (0-100)
  if (moistureValue !== null && moistureValue !== undefined) {
    return Math.round(moistureValue * 100);
  }
  
  return null;
};

// Generate soil recommendation based on moisture level
const getSoilRecommendation = (moisture: number): string => {
  if (moisture < 20) {
    return "Soil moisture critically low. Immediate irrigation recommended for optimal crop growth.";
  } else if (moisture < 40) {
    return "Soil moisture moderate. Consider light irrigation or monitor weather forecast.";
  } else if (moisture < 60) {
    return "Soil moisture is optimal for most crops. Good conditions for planting and growth.";
  } else {
    return "High soil moisture detected. Avoid overwatering and ensure proper drainage.";
  }
};

// Generate realistic soil moisture based on location and humidity
const generateSoilMoisture = (lat: number, lon: number, humidity: number): number => {
  // Base soil moisture influenced by humidity and location
  let baseMoisture = humidity * 0.6; // Humidity influence
  
  // Geographic adjustments for India
  if (lat > 20) {
    baseMoisture *= 0.8; // Northern regions typically drier
  } else if (lat < 15) {
    baseMoisture *= 1.2; // Southern regions more humid
  }
  
  // Coastal areas have higher soil moisture
  if ((lat > 8 && lat < 13 && lon > 76 && lon < 78) || // Kerala coast
      (lat > 18 && lat < 20 && lon > 72 && lon < 74)) { // Maharashtra coast
    baseMoisture *= 1.3;
  }
  
  // Seasonal adjustment (assuming monsoon affects soil moisture)
  const month = new Date().getMonth();
  if (month >= 6 && month <= 9) { // Monsoon season
    baseMoisture *= 1.4;
  } else if (month >= 3 && month <= 5) { // Summer
    baseMoisture *= 0.7;
  }
  
  return Math.max(15, Math.min(80, baseMoisture));
};

// Generate forecast from real API data
const generateRealTimeForecast = (forecastData: any, lat: number, lon: number) => {
  if (forecastData?.list) {
    const dailyForecasts = new Map();
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          date,
          temperature: { min: Math.round(item.main.temp), max: Math.round(item.main.temp) },
          humidity: item.main.humidity,
          precipitation: item.rain?.['3h'] || 0,
          soil_moisture: Math.max(10, 30 + (Math.random() - 0.5) * 20), // Estimate
          condition: item.weather[0].main,
        });
      } else {
        const existing = dailyForecasts.get(date);
        existing.temperature.min = Math.min(existing.temperature.min, Math.round(item.main.temp));
        existing.temperature.max = Math.max(existing.temperature.max, Math.round(item.main.temp));
        existing.precipitation = Math.max(existing.precipitation, item.rain?.['3h'] || 0);
      }
    });

    return Array.from(dailyForecasts.values()).slice(0, 14);
  }
  
  // Fallback to generated forecast if API fails
  return generateForecastData(25, lat, lon);
};

export const useWeatherData = (lat?: number, lon?: number, locationName?: string) => {
  const [data, setData] = useState<ConsolidatedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<string>(''); // Track last fetch to prevent duplicates

  const fetchWeatherData = async (latitude: number, longitude: number, locName?: string) => {
    // Create a key to prevent duplicate requests
    const fetchKey = `${latitude.toFixed(4)},${longitude.toFixed(4)},${locName || ''}`;
    
    // Prevent duplicate requests for the same location within 5 seconds
    if (lastFetch === fetchKey && data && Date.now() - data.current.timestamp < 5000) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastFetch(fetchKey);
    
    try {
      // Check if we should use mock data (from environment or runtime setting)
      const forceMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
                           (typeof window !== 'undefined' && (window as any).__VITE_USE_MOCK_DATA);
      
      if (!forceMockData) {
        try {
          // Try to fetch real-time weather data first
          console.log('Fetching real-time weather data...');
          const realTimeData = await fetchRealTimeWeatherData(latitude, longitude, locName);
          setData(realTimeData);
          setLoading(false);
          return;
        } catch (realTimeError) {
          console.warn('Real-time weather fetch failed, falling back to mock data:', realTimeError);
          setError('Real-time data unavailable, showing mock data');
        }
      } else {
        console.log('Mock data mode enabled');
      }
      
      // Fallback to mock data (commented for development/API failures)
      console.log('Using location-based mock data as fallback');
      setTimeout(() => {
        const mockData = generateLocationBasedMockData(latitude, longitude, locName);
        setData(mockData);
        setLoading(false);
      }, 800);
      
    } catch (err) {
      console.error('Weather data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData(lat, lon, locationName);
    }
  }, [lat, lon, locationName]);

  return { data, loading, error, refetch: fetchWeatherData };
};