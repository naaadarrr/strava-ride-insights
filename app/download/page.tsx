'use client'
import { useState } from 'react'

export default function DownloadPage() {
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const handleDownload = async () => {
    if (!selectedYear) return

    setIsLoading(true)
    try {
      // Fetch activities and stats in parallel
      const [activitiesRes, statsRes] = await Promise.all([
        fetch(`/api/strava/activities/year?year=${selectedYear}`),
        fetch('/api/strava/stats'),
      ])

      const [activities, stats] = await Promise.all([
        activitiesRes.json(),
        statsRes.json(),
      ])

      // Create a combined data object
      const data = {
        year: selectedYear,
        activities,
        stats,
      }

      // Create and download the JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `strava-data-${selectedYear}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading data:', error)
      alert('Failed to download data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Download Strava Data</h2>
          <p className="text-gray-600">
            Download your Strava activities and stats for a specific year
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Select Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownload}
            disabled={!selectedYear || isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              !selectedYear || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Downloading...
              </span>
            ) : (
              'Download Data'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
