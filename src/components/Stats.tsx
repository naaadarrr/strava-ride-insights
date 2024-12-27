import React, { useState } from 'react';
import { Activity, Timer, TrendingUp, Map, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import type { StravaActivity, StravaStats } from '../types/strava';
import { calculateStats, getYearlyActivities } from '../utils/stats';
import { useTranslation } from 'react-i18next';

interface StatsProps {
  activities: StravaActivity[];
}

export function Stats({ activities }: StatsProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [showYearSelector, setShowYearSelector] = useState(false);

  const years = [...new Set(activities.map(a => 
    new Date(a.start_date).getFullYear()
  ))].sort((a, b) => b - a);

  const stats = calculateStats(
    showYearSelector ? getYearlyActivities(activities, selectedYear) : activities
  );

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}${t('stats.hours')} ${minutes}${t('stats.minutes')}`;
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    const currentIndex = years.indexOf(selectedYear);
    if (direction === 'prev' && currentIndex < years.length - 1) {
      setSelectedYear(years[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedYear(years[currentIndex - 1]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="text-orange-500" />
          {t('stats.title')}
        </h2>
        <div className="flex items-center gap-2">
          {showYearSelector && (
            <>
              <button
                onClick={() => handleYearChange('prev')}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={years.indexOf(selectedYear) === years.length - 1}
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <span className="font-medium text-gray-700">{selectedYear}{t('stats.year')}</span>
              <button
                onClick={() => handleYearChange('next')}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={years.indexOf(selectedYear) === 0}
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </>
          )}
          <button
            onClick={() => setShowYearSelector(!showYearSelector)}
            className="ml-2 text-sm text-gray-500 hover:text-gray-700"
          >
            {showYearSelector ? t('stats.view_total') : t('stats.view_by_year')}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Map className="h-5 w-5" />
            <h3 className="font-semibold">{t('stats.total_distance')}</h3>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {(stats.total_distance / 1000).toFixed(1)} {t('stats.kilometers')}
          </p>
          <p className="text-sm text-orange-600 mt-1">
            {t('stats.longest_ride')}: {(stats.longest_ride / 1000).toFixed(1)} {t('stats.kilometers')}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Timer className="h-5 w-5" />
            <h3 className="font-semibold">{t('stats.total_time')}</h3>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {formatDuration(stats.total_time)}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {t('stats.total_activities')}: {stats.total_activities}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-semibold">{t('stats.total_elevation')}</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {stats.total_elevation_gain.toFixed(0)} {t('stats.meters')}
          </p>
          <p className="text-sm text-green-600 mt-1">
            {t('stats.highest_elevation')}: {stats.highest_elevation.toFixed(0)} {t('stats.meters')}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Zap className="h-5 w-5" />
            <h3 className="font-semibold">{t('stats.fastest_speed')}</h3>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {(stats.fastest_speed * 3.6).toFixed(1)} {t('stats.kilometers_per_hour')}
          </p>
          <p className="text-sm text-purple-600 mt-1">
            {t('stats.fastest_speed_record')}
          </p>
        </div>
      </div>
    </div>
  );
}