import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { StravaActivity } from '../../types/strava'
import { OverallStats } from './OverallStats'
import { TimeDistributionChart } from './TimeDistributionChart'
import { WeekendStats } from './WeekendStats'
import { SeasonalStats } from './SeasonalStats'
import {
  calculateRideStats,
  calculateTimeDistribution,
  calculateWeekdayStats,
  calculateSeasonalStats,
} from '../../utils/statsCalculator'
import { useTranslations } from 'next-intl'
import { useStatsActivities } from '@/hooks/useStatsActivities'

const YEARS_TO_SHOW = 5 // 控制显示最近几年的数据

export function StatsContainer() {
  const t = useTranslations()
  const now = new Date()
  const currentYear = now.getFullYear()
  // 如果是1月份的前7天，默认显示上一年的数据
  const defaultYear = now.getMonth() === 0 && now.getDate() <= 7 ? currentYear - 1 : currentYear
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear)
  const { activities, isLoading, error } = useStatsActivities(selectedYear)

  const years = useMemo(() => {
    return Array.from({ length: YEARS_TO_SHOW }, (_, i) => currentYear - i)
  }, [currentYear])

  const stats = useMemo(() => calculateRideStats(activities || []), [activities])
  const timeDistribution = useMemo(
    () => calculateTimeDistribution(activities || []),
    [activities]
  )
  const weekdayStats = useMemo(
    () => calculateWeekdayStats(activities || []),
    [activities]
  )
  const seasonalStats = useMemo(
    () => calculateSeasonalStats(activities || []),
    [activities]
  )

  const handleYearChange = (direction: 'prev' | 'next') => {
    const currentIndex = years.indexOf(selectedYear)
    if (direction === 'prev' && currentIndex < years.length - 1) {
      setSelectedYear(years[currentIndex + 1])
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedYear(years[currentIndex - 1])
    }
  }

  return (
    <div className={`space-y-6 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('stats.title')}</h2>
        <div className="flex items-center justify-center sm:justify-end gap-1 text-sm">
          <button
            onClick={() => handleYearChange('prev')}
            className={`p-1 rounded transition-colors ${
              years.indexOf(selectedYear) === years.length - 1 || isLoading
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
            }`}
            disabled={years.indexOf(selectedYear) === years.length - 1 || isLoading}
          >
            <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[4rem] text-center">
            {selectedYear}
            {isLoading && (
              <span className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-orange-500" />
            )}
          </span>
          <button
            onClick={() => handleYearChange('next')}
            className={`p-1 rounded transition-colors ${
              years.indexOf(selectedYear) === 0 || isLoading
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
            }`}
            disabled={years.indexOf(selectedYear) === 0 || isLoading}
          >
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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
  )
}
