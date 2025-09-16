import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart
} from 'recharts';
import { ForecastData } from '../types/weather';
import { motion } from 'framer-motion';

interface ForecastChartProps {
  data: ForecastData[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const chartData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
    avgTemp: (item.temperature.min + item.temperature.max) / 2,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        14-Day Forecast & Soil Analysis
      </h2>

      <div className="space-y-8">
        {/* Temperature & Precipitation Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Temperature & Rainfall Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="temp"
                orientation="left"
                stroke="#EF4444"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="rain"
                orientation="right"
                stroke="#3B82F6"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="avgTemp"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                name="Avg Temperature (°C)"
              />
              <Bar
                yAxisId="rain"
                dataKey="precipitation"
                fill="#3B82F6"
                name="Precipitation (mm)"
                radius={[2, 2, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Soil Moisture Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Soil Moisture Forecast
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                stroke="#10B981"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line
                type="monotone"
                dataKey="soil_moisture"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Soil Moisture (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
            Next 3 Days
          </h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
            Expected rainfall: {chartData.slice(0, 3).reduce((sum, day) => sum + day.precipitation, 0).toFixed(1)}mm
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 dark:text-green-100">
            Soil Trend
          </h4>
          <p className="text-green-700 dark:text-green-300 text-sm mt-1">
            {chartData[0]?.soil_moisture > chartData[6]?.soil_moisture ? 'Decreasing moisture' : 'Improving moisture'}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 dark:text-orange-100">
            Temperature Range
          </h4>
          <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
            {Math.min(...chartData.map(d => d.temperature.min))}°C to {Math.max(...chartData.map(d => d.temperature.max))}°C
          </p>
        </div>
      </div>
    </motion.div>
  );
};