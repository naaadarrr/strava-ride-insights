import React from 'react'
import { Trophy, Timer, TrendingUp } from 'lucide-react'
import { useAthleteStats } from '../hooks/useAthleteStats'
import { useTranslations } from 'next-intl'
import { cn } from '../lib/utils'

export default function AthleteStats() {
  const { stats, isLoading } = useAthleteStats()
  const t = useTranslations()

  if (isLoading) return null
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={cn('rounded-xl p-6 shadow-sm', 'bg-white dark:bg-gray-800')}>
        <div className="flex items-center space-x-3">
          <div className={cn('rounded-lg p-3', 'bg-orange-100 dark:bg-orange-900/30')}>
            <Trophy className={cn('h-6 w-6', 'text-orange-600 dark:text-orange-500')} />
          </div>
          <div>
            <div className={cn('text-sm', 'text-gray-500 dark:text-gray-400')}>
              {t('stats.overview.total_rides')}
            </div>
            <div className={cn('text-2xl font-semibold', 'text-gray-900 dark:text-gray-100')}>
              {stats.total_activities}
            </div>
          </div>
        </div>
      </div>

      <div className={cn('rounded-xl p-6 shadow-sm', 'bg-white dark:bg-gray-800')}>
        <div className="flex items-center space-x-3">
          <div className={cn('rounded-lg p-3', 'bg-blue-100 dark:bg-blue-900/30')}>
            <Timer className={cn('h-6 w-6', 'text-blue-600 dark:text-blue-500')} />
          </div>
          <div>
            <div className={cn('text-sm', 'text-gray-500 dark:text-gray-400')}>
              {t('stats.overview.total_time')}
            </div>
            <div className={cn('text-2xl font-semibold', 'text-gray-900 dark:text-gray-100')}>
              {Math.round(stats.total_time / 3600)} {t('stats.hours')}
            </div>
          </div>
        </div>
      </div>

      <div className={cn('rounded-xl p-6 shadow-sm', 'bg-white dark:bg-gray-800')}>
        <div className="flex items-center space-x-3">
          <div className={cn('rounded-lg p-3', 'bg-green-100 dark:bg-green-900/30')}>
            <TrendingUp className={cn('h-6 w-6', 'text-green-600 dark:text-green-500')} />
          </div>
          <div>
            <div className={cn('text-sm', 'text-gray-500 dark:text-gray-400')}>
              {t('stats.total_elevation')}
            </div>
            <div className={cn('text-2xl font-semibold', 'text-gray-900 dark:text-gray-100')}>
              {Math.round(stats.total_elevation_gain)} {t('stats.meters')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
