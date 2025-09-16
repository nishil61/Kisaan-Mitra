import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
  recentLocations: { name: string; lat: number; lon: number }[];
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  recentLocations
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentSearchRef = useRef<string>('');

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowSuggestions(false);
      currentSearchRef.current = '';
      return;
    }

    const debounceTimeout = setTimeout(() => {
      currentSearchRef.current = query;
      searchLocation(query);
    }, 200); // Reduced debounce for faster response

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        console.log('Click outside detected - hiding suggestions');
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          selectLocation(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    // Check if this search is still current
    if (currentSearchRef.current !== searchQuery) {
      return;
    }

    setLoading(true);
    try {
      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        // Use Nominatim (OpenStreetMap) geocoding service for real data
        // Add wildcard search and boost parameters for better partial matching
        let apiResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=10&addressdetails=1&extratags=1&namedetails=1&accept-language=en&dedupe=1`
        );
        
        if (!apiResponse.ok) {
          throw new Error(`HTTP ${apiResponse.status}`);
        }
        
        let data = await apiResponse.json();
        
        // Check again if this search is still current after API call
        if (currentSearchRef.current !== searchQuery) {
          return;
        }
        
        // If no results with exact search, try with wildcard
        if (data.length === 0 && searchQuery.length >= 3) {
          // Try wildcard search for better partial matching
          apiResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + '*')}&countrycodes=in&limit=10&addressdetails=1`
          );
          if (apiResponse.ok) {
            data = await apiResponse.json();
          }
        }
        
        
        const transformedResults = data
          .filter((item: any) => {
            // Filter to ensure we get relevant results
            const cityName = item.address?.city || item.address?.town || item.address?.village || '';
            const searchLower = searchQuery.toLowerCase();
            const cityLower = cityName.toLowerCase();
            
            // Include if city name starts with search query or contains it
            return cityLower.includes(searchLower) || 
                   item.display_name.toLowerCase().includes(searchLower);
          })
          .map((item: any) => ({
            formatted: item.display_name,
            geometry: { 
              lat: parseFloat(item.lat), 
              lng: parseFloat(item.lon) 
            },
            components: {
              village: item.address?.village || item.address?.town || item.address?.city,
              town: item.address?.town || item.address?.city,
              city: item.address?.city || item.address?.state_district,
              state: item.address?.state,
              country: item.address?.country || 'India'
            },
            type: item.type || (item.address?.village ? 'village' : item.address?.city ? 'city' : 'location')
          }))
          .slice(0, 8); // Limit to 8 results after filtering
        setResults(transformedResults);
        setSelectedIndex(-1);
        setShowSuggestions(true);
        setLoading(false);
        return;
      }

      const productionResponse = await fetch(
        `/api/geocode?q=${encodeURIComponent(searchQuery)}&limit=8`
      );
      
      if (!productionResponse.ok) {
        throw new Error(`HTTP ${productionResponse.status}`);
      }
      
      const productionData = await productionResponse.json();
      setResults(productionData.results || []);
      setSelectedIndex(-1);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const selectLocation = (result: any) => {
    const name = result.formatted || `${result.components.village || result.components.town || result.components.city}, ${result.components.state}`;
    onLocationSelect(result.geometry.lat, result.geometry.lng, name);
    setQuery(name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="space-y-4" ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0 && query.trim()) {
              console.log('Input focused - showing suggestions');
              setShowSuggestions(true);
            }
          }}
          placeholder="Search village, district, city, or pin code..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl max-h-80 overflow-y-auto mt-2"
          >
            {results.map((result, index) => {
              const isSelected = index === selectedIndex;
              const locationName = result.components.village || result.components.town || result.components.city;
              const locationType = result.type || 'location';
              
              return (
                <motion.button
                  key={index}
                  onClick={() => selectLocation(result)}
                  className={`w-full px-4 py-3 text-left border-b border-gray-100 dark:border-gray-700 last:border-0 transition-all duration-150 ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-full ${
                      locationType === 'city' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      locationType === 'district' ? 'bg-green-100 dark:bg-green-900/30' :
                      locationType === 'village' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {locationType === 'city' ? (
                        <Navigation className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <MapPin className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {locationName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {result.components.state}, {result.components.country}
                        {locationType && (
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            locationType === 'city' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            locationType === 'district' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            locationType === 'village' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {locationType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {recentLocations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Recent Locations</span>
          </h3>
          <div className="space-y-1">
            {recentLocations.slice(0, 3).map((location, index) => (
              <motion.button
                key={index}
                onClick={() => onLocationSelect(location.lat, location.lon, location.name)}
                className="w-full px-3 py-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span>{location.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {query.length >= 2 && !loading && results.length === 0 && showSuggestions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm"
        >
          No locations found for "{query}". Try searching for a city, district, or village name.
        </motion.div>
      )}
    </div>
  );
};