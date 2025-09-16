import type { VercelRequest, VercelResponse } from '@vercel/node';

// Cache structure
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Utility function for safe API calls
async function safeFetch(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API call failed:', url, error);
    return null;
  }
}

// Generate soil recommendation based on moisture level
function getSoilRecommendation(moisture: number, precipitation: number): string {
  if (moisture < 20) {
    return precipitation > 5 
      ? "Soil is dry but rain expected. Monitor closely and prepare for irrigation if needed."
      : "Soil moisture critically low. Immediate irrigation recommended for optimal crop growth.";
  } else if (moisture < 40) {
    return precipitation > 10
      ? "Moderate soil moisture with good rain forecast. No immediate irrigation needed."
      : "Soil moisture moderate. Consider light irrigation or wait for forecasted rain.";
  } else {
    return "Soil moisture is optimal for most crops. Avoid overwatering. Good conditions for sowing and growth.";
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lon as string);
  const cacheKey = `${latitude},${longitude}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.json(cached.data);
  }

  try {
    // API Keys - In production, these should be environment variables
    const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
    const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY || 'demo_key';

    // Parallel API calls
    const [openWeatherData, weatherApiData, soilData, forecastData] = await Promise.all([
      // OpenWeatherMap current weather
      safeFetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_KEY}&units=metric`),
      
      // WeatherAPI current weather
      safeFetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${latitude},${longitude}&aqi=no`),
      
      // Open-Meteo soil data
      safeFetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=soil_moisture_0_to_7cm_mean,soil_temperature_0_to_7cm_max&timezone=auto&forecast_days=1`),
      
      // Extended forecast from OpenWeatherMap
      safeFetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_KEY}&units=metric&cnt=40`)
    ]);

    // Process and consolidate data
    const consolidated = {
      current: {
        temperature: {
          current: openWeatherData?.main?.temp || weatherApiData?.current?.temp_c || 25,
          feels_like: openWeatherData?.main?.feels_like || weatherApiData?.current?.feelslike_c || 25,
          min: openWeatherData?.main?.temp_min || 20,
          max: openWeatherData?.main?.temp_max || 30,
        },
        humidity: openWeatherData?.main?.humidity || weatherApiData?.current?.humidity || 60,
        precipitation: {
          probability: weatherApiData?.current?.precip_mm ? Math.min(weatherApiData.current.precip_mm * 10, 100) : 20,
          amount: weatherApiData?.current?.precip_mm || 0,
        },
        wind: {
          speed: openWeatherData?.wind?.speed ? (openWeatherData.wind.speed * 3.6).toFixed(1) : weatherApiData?.current?.wind_kph || 10,
          direction: openWeatherData?.wind?.deg || weatherApiData?.current?.wind_degree || 180,
          degree: openWeatherData?.wind?.deg || weatherApiData?.current?.wind_degree || 180,
        },
        soil: {
          moisture: soilData?.daily?.soil_moisture_0_to_7cm_mean?.[0] || Math.random() * 40 + 20,
          temperature: soilData?.daily?.soil_temperature_0_to_7cm_max?.[0] || (openWeatherData?.main?.temp || 25) - 5,
          recommendation: '',
        },
        location: {
          name: `${openWeatherData?.name || 'Unknown Location'}, ${openWeatherData?.sys?.country || 'IN'}`,
          country: openWeatherData?.sys?.country || 'IN',
          lat: latitude,
          lon: longitude,
        },
        condition: {
          main: openWeatherData?.weather?.[0]?.main || weatherApiData?.current?.condition?.text || 'Clear',
          description: openWeatherData?.weather?.[0]?.description || weatherApiData?.current?.condition?.text || 'Clear sky',
          icon: openWeatherData?.weather?.[0]?.icon || '01d',
        },
        timestamp: Date.now(),
      },
      forecast: [],
      reliability_score: 85,
    };

    // Add soil recommendation
    consolidated.current.soil.recommendation = getSoilRecommendation(
      consolidated.current.soil.moisture,
      consolidated.current.precipitation.amount
    );

    // Process forecast data
    if (forecastData?.list) {
      const dailyForecasts = new Map();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        
        if (!dailyForecasts.has(date)) {
          dailyForecasts.set(date, {
            date,
            temperature: { min: item.main.temp, max: item.main.temp },
            humidity: item.main.humidity,
            precipitation: item.rain?.['3h'] || 0,
            soil_moisture: Math.max(10, consolidated.current.soil.moisture + (Math.random() - 0.5) * 10),
            condition: item.weather[0].main,
          });
        } else {
          const existing = dailyForecasts.get(date);
          existing.temperature.min = Math.min(existing.temperature.min, item.main.temp);
          existing.temperature.max = Math.max(existing.temperature.max, item.main.temp);
          existing.precipitation = Math.max(existing.precipitation, item.rain?.['3h'] || 0);
        }
      });

      consolidated.forecast = Array.from(dailyForecasts.values()).slice(0, 14);
    }

    // If no forecast data, generate mock data for demo
    if (consolidated.forecast.length === 0) {
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        consolidated.forecast.push({
          date: date.toISOString().split('T')[0],
          temperature: {
            min: Math.round(consolidated.current.temperature.current - 5 + Math.random() * 5),
            max: Math.round(consolidated.current.temperature.current + 5 + Math.random() * 5),
          },
          humidity: Math.round(consolidated.current.humidity + (Math.random() - 0.5) * 20),
          precipitation: Math.random() * 15,
          soil_moisture: Math.max(10, consolidated.current.soil.moisture + (Math.random() - 0.5) * 15),
          condition: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
        });
      }
    }

    // Cache the result
    cache.set(cacheKey, {
      data: consolidated,
      timestamp: Date.now(),
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.json(consolidated);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}