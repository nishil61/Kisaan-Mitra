# Weather Data Sources

This application supports both **real-time weather data** and **mock data** for testing and development purposes.

## 🌐 Real-Time Weather Data

The application fetches live weather data from multiple reliable sources:

### Primary APIs Used:
1. **OpenWeatherMap API** - Primary weather data source
   - Current weather conditions
   - 5-day weather forecast
   - Temperature, humidity, wind speed/direction
   - Weather descriptions and icons

2. **WeatherAPI.com** - Backup weather data source
   - Real-time weather conditions
   - Fallback when OpenWeatherMap is unavailable

3. **Open-Meteo API** - Soil moisture data
   - Real-time soil moisture levels (0-1cm depth)
   - Hourly soil moisture readings
   - Free API, no key required
   - Converts volumetric water content to percentage

### Features of Real-Time Data:
- ✅ **Live Data**: Updated every 10 minutes from weather stations
- ✅ **High Accuracy**: Reliability score of 95%
- ✅ **Multiple Sources**: Automatic fallback between APIs
- ✅ **Soil Data**: Real soil moisture and temperature readings
- ✅ **Smart Caching**: 10-minute cache to reduce API calls
- ✅ **Error Handling**: Graceful fallback to mock data if APIs fail

## 🔧 Mock Data (Fallback)

When real-time data is unavailable or disabled:

### Features of Mock Data:
- ✅ **Location-Based**: Consistent data based on coordinates
- ✅ **Realistic Values**: Weather patterns appropriate for location/season
- ✅ **Deterministic**: Same location always shows same weather
- ✅ **Seasonal Variation**: Accounts for time of year
- ✅ **Reliability Score**: 88% to indicate simulated data

## 🎛️ Data Source Toggle

Users can switch between data sources using the toggle in the top-right corner:

- **🌐 Real-time Data**: Live weather from APIs
- **💾 Mock Data**: Consistent demo data for testing

## 🔑 API Configuration

### Environment Variables:
```bash
# API Keys (already configured)
OPENWEATHER_API_KEY=595ae513f242a4a11ecac18605e64f5c
WEATHERAPI_KEY=f361e8de38564e3ba7d181427251309
VITE_USE_MOCK_DATA=false  # Set to 'true' to force mock data
```

### API Rate Limits:
- **OpenWeatherMap**: 1,000 calls/day (free tier)
- **WeatherAPI**: 1 million calls/month (free tier)
- **Open-Meteo**: Unlimited (free)

## 📊 Data Quality Indicators

The weather card shows data source information:

- 🟢 **Live Data** badge: Real-time from weather APIs (95% reliability)
- 🟡 **Mock Data** badge: Simulated data for testing (88% reliability)

## 🚀 How It Works

1. **Location Selection**: User searches or uses GPS
2. **Data Fetching**: App attempts real-time APIs first
3. **Fallback Strategy**: If APIs fail, uses location-based mock data
4. **Smart Updates**: Data refreshes when switching between sources
5. **Consistent Experience**: Same coordinates always show same mock weather

## 🔧 Development vs Production

- **Development**: Can toggle between real-time and mock data
- **Production**: Automatically uses real-time data with mock fallback
- **API Failure**: Gracefully falls back to mock data with user notification

This hybrid approach ensures the application always works reliably while providing accurate real-time data when available.
