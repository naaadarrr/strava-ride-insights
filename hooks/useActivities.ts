import { useEffect, useState } from 'react'
import type { StravaActivity } from '@/types/strava'

interface UseActivitiesReturn {
  activities: StravaActivity[]
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => void
}

export function useActivities(): UseActivitiesReturn {
  const [activities, setActivities] = useState<StravaActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async (pageNum = 1) => {
    if (isLoading && pageNum > 1) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/strava/activities?per_page=10&page=${pageNum}`)
      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }

      const data = await response.json()
      if (data.length === 0) {
        setHasMore(false)
      } else {
        setActivities(prev => (pageNum === 1 ? data : [...prev, ...data]))
        setPage(pageNum)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch activities'))
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    fetchActivities(page + 1)
  }

  return {
    activities,
    isLoading,
    hasMore,
    error,
    loadMore,
  }
}
