'use client'
import { BarChart2, Bike, TrendingUp, Map, Timer, Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import AthleteStats from '@/components/AthleteStats'

export default function Home() {
  const t = useTranslations()
  return (
    <div className="space-y-12 pb-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>

      <AthleteStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          href="/stats"
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all p-6 flex items-start space-x-4"
        >
          <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
            <BarChart2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t('home.stats.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.stats.description')}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{t('home.stats.trendAnalysis')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{t('home.stats.timeDistribution')}</span>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/activities"
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all p-6 flex items-start space-x-4"
        >
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
            <Bike className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t('home.activities.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.activities.description')}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Map className="h-4 w-4 mr-1" />
                <span>{t('home.activities.routeVisualization')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Timer className="h-4 w-4 mr-1" />
                <span>{t('home.activities.activityDetails')}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
