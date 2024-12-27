import React from 'react';
import { Leaf, Sun, Cloud, Snowflake } from 'lucide-react';
import { SeasonalStatsData } from '../../types/stats';
import { useTranslation } from 'react-i18next';
import { formatDistance } from '../../utils/formatters';

interface SeasonalStatsProps {
  stats: SeasonalStatsData;
}

export function SeasonalStats({ stats }: SeasonalStatsProps) {
  const { t } = useTranslation();

  const seasons = [
    { name: t('stats.seasonal.spring'), icon: Leaf, color: 'emerald', data: stats.spring },
    { name: t('stats.seasonal.summer'), icon: Sun, color: 'orange', data: stats.summer },
    { name: t('stats.seasonal.autumn'), icon: Cloud, color: 'yellow', data: stats.autumn },
    { name: t('stats.seasonal.winter'), icon: Snowflake, color: 'sky', data: stats.winter },
  ];

  const totalRides = seasons.reduce((sum, season) => sum + season.data.totalRides, 0);

  const getColorClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500';
      case 'orange':
        return 'bg-orange-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'sky':
        return 'bg-sky-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIconColorClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'text-emerald-600';
      case 'orange':
        return 'text-orange-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'sky':
        return 'text-sky-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">{t('stats.seasonal.title')}</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {seasons.map(({ name, icon: Icon, color, data }) => (
          <div
            key={name}
            className="bg-white/60 dark:bg-black/20 p-4 rounded-lg transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/40 hover:scale-105 hover:shadow-md"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`h-5 w-5 ${getIconColorClass(color)} dark:text-${color}-300`} />
              <span className="font-medium text-gray-700 dark:text-gray-200">{name}</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">{t('stats.seasonal.rideCount')}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {data.totalRides}{t('stats.seasonal.rides')}
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${getColorClass(color)} dark:opacity-80 transition-all duration-500 ease-out`}
                    style={{
                      width: `${(data.totalRides / totalRides) * 100}%`,
                      transform: 'translateX(0)',
                    }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">{t('stats.seasonal.avgDistance')}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {formatDistance(data.averageDistance)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('stats.seasonal.totalDistance')}: {formatDistance(data.totalDistance)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}