import { useEffect, useState } from 'react'

import type { StravaStats } from '../types/strava'

export function useAthleteStats() {
  const [stats, setStats] = useState<StravaStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/strava/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats({
        total_distance: data.all_ride_totals.distance,
        total_elevation_gain: data.all_ride_totals.elevation_gain,
        total_time: data.all_ride_totals.moving_time,
        total_activities: data.all_ride_totals.count,
        longest_ride: data.biggest_ride_distance,
        highest_elevation: data.biggest_climb_elevation_gain,
        fastest_speed: 0, // This needs to be calculated from activities if needed
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  }
}
