import React from 'react';
import { Droplets, Thermometer, AlertTriangle, CheckCircle } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { motion } from 'framer-motion';

interface SoilCardProps {
  data: WeatherData;
}

export const SoilCard: React.FC<SoilCardProps> = ({ data }) => {
  const getSoilStatus = (moisture: number) => {
    if (moisture < 20) return { status: 'Dry', color: 'text-red-500', icon: AlertTriangle, bg: 'bg-red-50 dark:bg-red-900/20' };
    if (moisture < 40) return { status: 'Moderate', color: 'text-yellow-500', icon: AlertTriangle, bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
    return { status: 'Optimal', color: 'text-green-500', icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/20' };
  };

  const soilStatus = getSoilStatus(data.soil.moisture);
  const StatusIcon = soilStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-emerald-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Soil Conditions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time soil monitoring</p>
        </div>
        <div className={`p-3 rounded-full ${soilStatus.bg}`}>
          <StatusIcon className={`h-8 w-8 ${soilStatus.color}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Soil Moisture
            </span>
          </div>
          <div className="mb-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.soil.moisture)}%
            </span>
            <span className={`text-sm font-medium ml-2 ${soilStatus.color}`}>
              {soilStatus.status}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                data.soil.moisture < 20 ? 'bg-red-400' :
                data.soil.moisture < 40 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${Math.min(data.soil.moisture, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Soil Temperature
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(data.soil.temperature)}°C
            </span>
          </div>
        </div>
      </div>

      <div className={`${soilStatus.bg} rounded-lg p-4 border-l-4 ${
        data.soil.moisture < 20 ? 'border-red-400' :
        data.soil.moisture < 40 ? 'border-yellow-400' : 'border-green-400'
      }`}>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Agricultural Recommendation
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {data.soil.recommendation}
        </p>
      </div>
    </motion.div>
  );
};