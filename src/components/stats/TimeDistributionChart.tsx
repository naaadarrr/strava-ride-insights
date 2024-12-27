import React from 'react';
import { Clock } from 'lucide-react';
import type { TimeDistribution } from '../../types/stats';
import { useTranslation } from 'react-i18next';

interface TimeDistributionChartProps {
  distribution: TimeDistribution;
}

export function TimeDistributionChart({ distribution }: TimeDistributionChartProps) {
  const { t } = useTranslation();
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
  
  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-gradient-to-br hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900 dark:hover:to-purple-800">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-purple-500 dark:text-purple-300" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('stats.time_distribution.title')}</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(distribution).map(([time, count]) => (
          <div key={time} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                {t(`stats.time_distribution.${time}`)}
              </span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {getPercentage(count)}{t('stats.time_distribution.percentage')}
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  time === 'morning' ? 'bg-yellow-400' :
                  time === 'afternoon' ? 'bg-orange-400' :
                  time === 'evening' ? 'bg-purple-400' : 'bg-blue-400'
                }`}
                style={{ width: `${getPercentage(count)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}