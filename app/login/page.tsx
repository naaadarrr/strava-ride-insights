'use client'
import { useTranslations } from 'next-intl'
import { getStravaAuthUrl } from '@/utils/strava'
import { useSearchParams } from 'next/navigation'

export default function Login() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('login.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">{t('login.description')}</p>
        <div className="flex justify-center">
          <button
            onClick={async () => {
              const authUrl = await getStravaAuthUrl(callbackUrl)
              window.location.href = authUrl
            }}
            className="hover:opacity-90 transition-opacity"
          >
            <img
              src={'/strava/btn_strava_connectwith_orange.svg'}
              alt="Connect with Strava"
              className="h-12"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
