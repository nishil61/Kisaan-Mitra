import { useState, useEffect } from 'react';
import { Cloud, MapPin } from 'lucide-react';
import { LocationSearch } from './components/LocationSearch';
import { WeatherCard } from './components/WeatherCard';
import { SoilCard } from './components/SoilCard';
import { ForecastChart } from './components/ForecastChart';
import { ThemeToggle } from './components/ThemeToggle';
import { DataSourceToggle } from './components/DataSourceToggle';
import CropSuggestion from './components/CropSuggestion';
import { useWeatherData } from './hooks/useWeatherData';
import { useGeolocation } from './hooks/useGeolocation';
import { motion } from 'framer-motion';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lon: number;
    name: string;
  } | null>(null);
  const [recentLocations, setRecentLocations] = useState<Array<{
    name: string;
    lat: number;
    lon: number;
  }>>([]);

  const { lat, lon, locationName, loading: gpsLoading, error: gpsError, getCurrentLocation } = useGeolocation();
  const { data: weatherData, loading: weatherLoading, error: weatherError, refetch } = useWeatherData(
    currentLocation?.lat, 
    currentLocation?.lon,
    currentLocation?.name
  );

  // Set environment variable when mock data setting changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__VITE_USE_MOCK_DATA = useMockData;
    }
  }, [useMockData]);

  useEffect(() => {
    if (lat && lon) {
      const name = locationName || `Location ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      setCurrentLocation({ lat, lon, name });
    }
  }, [lat, lon, locationName]);

  useEffect(() => {
    const saved = localStorage.getItem('recentLocations');
    if (saved) {
      setRecentLocations(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setCurrentLocation({ lat, lon, name });
    
    // Add to recent locations
    const newLocation = { name, lat, lon };
    const updated = [newLocation, ...recentLocations.filter(loc => loc.name !== name)].slice(0, 5);
    setRecentLocations(updated);
    localStorage.setItem('recentLocations', JSON.stringify(updated));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Kisaan Mitra
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={getCurrentLocation}
                disabled={gpsLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <MapPin className="h-4 w-4" />
                <span>{gpsLoading ? 'Locating...' : 'Use GPS'}</span>
              </motion.button>
              <DataSourceToggle 
                onToggle={(useMock) => {
                  setUseMockData(useMock);
                  // Refetch data immediately when toggling
                  if (currentLocation && refetch) {
                    setTimeout(() => {
                      refetch(currentLocation.lat, currentLocation.lon, currentLocation.name);
                    }, 100);
                  }
                }}
                currentMode={useMockData ? 'mock' : 'real-time'}
              />
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Full-width Location Search */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Location Search
            </h2>
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              recentLocations={recentLocations}
            />
            {currentLocation && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Current Location:
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  {currentLocation.name}
                </p>
              </div>
            )}
            {gpsError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  GPS Error: {gpsError}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-4">
            {weatherLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading weather data...</span>
              </div>
            )}

            {weatherError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                <p className="text-red-700 dark:text-red-300">
                  Error loading weather data: {weatherError}
                </p>
              </div>
            )}

            {!currentLocation && !weatherLoading && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm mx-4">
                <Cloud className="h-16 w-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                  Welcome to Kisaan Mitra
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                  Search for a location or use GPS to get started with precision weather and soil monitoring
                </p>
              </div>
            )}

            {weatherData && currentLocation && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <WeatherCard data={weatherData.current} />
                  <SoilCard data={weatherData.current} />
                </div>
                <ForecastChart data={weatherData.forecast} />
                
                {/* Crop Cultivation Suggestions */}
                <div className="mt-8">
                  <CropSuggestion weatherData={weatherData} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Powered by Kisaan Mitra – Your Trusted Companion for Smart Farming & Weather Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;