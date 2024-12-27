import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StravaActivity } from '../../types/strava';
import { OverallStats } from './OverallStats';
import { TimeDistributionChart } from './TimeDistributionChart';
import { WeekendStats } from './WeekendStats';
import { SeasonalStats } from './SeasonalStats';
import { calculateRideStats, calculateTimeDistribution, calculateWeekdayStats, calculateSeasonalStats } from '../../utils/statsCalculator';
import { useTranslation } from 'react-i18next';

interface StatsContainerProps {
  activities: StravaActivity[];
}

export function StatsContainer({ activities }: StatsContainerProps) {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2];
  }, []);

  const filteredActivities = useMemo(() => 
    activities.filter(activity => 
      new Date(activity.start_date).getFullYear() === selectedYear
    )
  , [activities, selectedYear]);

  const stats = useMemo(() => calculateRideStats(filteredActivities), [filteredActivities]);
  const timeDistribution = useMemo(() => calculateTimeDistribution(filteredActivities), [filteredActivities]);
  const weekdayStats = useMemo(() => calculateWeekdayStats(filteredActivities), [filteredActivities]);
  const seasonalStats = useMemo(() => calculateSeasonalStats(filteredActivities), [filteredActivities]);

  const handleYearChange = (direction: 'prev' | 'next') => {
    const currentIndex = years.indexOf(selectedYear);
    if (direction === 'prev' && currentIndex < years.length - 1) {
      setSelectedYear(years[currentIndex + 1]);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedYear(years[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('stats.title')}</h2>
        <div className="flex items-center justify-center sm:justify-end gap-1 text-sm">
          <button
            onClick={() => handleYearChange('prev')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={years.indexOf(selectedYear) === years.length - 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-gray-700">{selectedYear}</span>
          <button
            onClick={() => handleYearChange('next')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={years.indexOf(selectedYear) === 0}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* First row - Overall Stats */}
      <div className="grid grid-cols-1">
        <OverallStats stats={stats} />
      </div>

      {/* Second row - Time Distribution and Weekend Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeDistributionChart distribution={timeDistribution} />
        <WeekendStats stats={weekdayStats} />
      </div>

      {/* Third row - Seasonal Stats */}
      <div className="grid grid-cols-1">
        <SeasonalStats stats={seasonalStats} />
      </div>
    </div>
  );
}