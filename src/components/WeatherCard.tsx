import React from 'react';
import { Thermometer, Droplets, Wind, Eye, Sun, Wifi, Database } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { motion } from 'framer-motion';

interface WeatherCardProps {
  data: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const getWeatherIcon = (condition: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      Clear: <Sun className="h-12 w-12 text-yellow-400 animate-pulse" />,
      Clouds: <div className="h-12 w-12 bg-gray-400 rounded-full opacity-70"></div>,
      Rain: <Droplets className="h-12 w-12 text-blue-400 animate-bounce" />,
      Snow: <div className="h-12 w-12 bg-white rounded-full"></div>,
    };
    return iconMap[condition] || <Sun className="h-12 w-12 text-yellow-400" />;
  };

  const getWindDirection = (degree: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degree / 45) % 8];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Current Weather in {data.location.name.split(',')[0]}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{data.location.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              data.timestamp && Date.now() - data.timestamp < 600000 // 10 minutes
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {data.timestamp && Date.now() - data.timestamp < 600000 ? (
                <><Wifi size={10} /> Live Data</>
              ) : (
                <><Database size={10} /> Mock Data</>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Reliability: {data.timestamp && Date.now() - data.timestamp < 600000 ? '95%' : '88%'}
            </div>
          </div>
        </div>
        {getWeatherIcon(data.condition.main)}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Temperature
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.temperature.current)}°C
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              Feels {Math.round(data.temperature.feels_like)}°C
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Humidity
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.humidity}%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Wind className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Wind
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.wind.speed}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              km/h {getWindDirection(data.wind.direction)}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Precipitation
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.precipitation.probability}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {data.precipitation.amount}mm
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Today's Range
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Low: {Math.round(data.temperature.min)}°C
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            High: {Math.round(data.temperature.max)}°C
          </span>
        </div>
      </div>
    </motion.div>
  );
};