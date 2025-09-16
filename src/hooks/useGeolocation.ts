import { useState } from 'react';

interface GeolocationState {
  lat?: number;
  lon?: number;
  loading: boolean;
  error?: string;
  locationName?: string;
}

// Function to get location name from coordinates
const getLocationName = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    
    const data = await response.json();
    
    // Extract meaningful location name
    const address = data.address || {};
    const city = address.city || address.town || address.village || address.state_district;
    const state = address.state;
    
    if (city && state) {
      return `${city}, ${state}`;
    } else if (city) {
      return city;
    } else if (state) {
      return state;
    }
    
    return `Location ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (error) {
    console.error('Error getting location name:', error);
    return `Location ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({ loading: false });

  const getCurrentLocation = async () => {
    setLocation({ loading: true });

    if (!navigator.geolocation) {
      setLocation({
        loading: false,
        error: 'Geolocation is not supported by this browser'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Get location name
        const locationName = await getLocationName(lat, lon);
        
        setLocation({
          lat,
          lon,
          locationName,
          loading: false
        });
      },
      (error) => {
        setLocation({
          loading: false,
          error: error.message
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  };

  return { ...location, getCurrentLocation };
};