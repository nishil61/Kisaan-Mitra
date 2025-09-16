import React, { useState } from 'react';
import { Settings, Database, Wifi } from 'lucide-react';

interface DataSourceToggleProps {
  onToggle: (useMockData: boolean) => void;
  currentMode: 'real-time' | 'mock';
}

export const DataSourceToggle: React.FC<DataSourceToggleProps> = ({ onToggle, currentMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (useMock: boolean) => {
    onToggle(useMock);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
        title="Data Source Settings"
      >
        <Settings size={16} />
        <span className="text-xs">
          {currentMode === 'real-time' ? 'Live Data' : 'Mock Data'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-48">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Data Source
            </h3>
            
            <button
              onClick={() => handleToggle(false)}
              className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors ${
                currentMode === 'real-time'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Wifi size={16} />
              <div>
                <div className="text-sm font-medium">Real-time Data</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Live weather from APIs
                </div>
              </div>
            </button>

            <button
              onClick={() => handleToggle(true)}
              className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors mt-1 ${
                currentMode === 'mock'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Database size={16} />
              <div>
                <div className="text-sm font-medium">Mock Data</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Consistent demo data
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
