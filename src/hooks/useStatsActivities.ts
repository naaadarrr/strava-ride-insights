// src/hooks/useStatsActivities.ts
import { useState, useEffect, useCallback } from 'react';
import type { StravaActivity } from '../types/strava';

const CACHE_KEY = 'strava_activities_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const PAGE_SIZE = 100;

export function useStatsActivities() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivitiesPage = useCallback(async (page: number, token: string) => {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${PAGE_SIZE}&page=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error(response.status === 401 ? 'Session expired' : 'Failed to fetch');
    }

    return response.json();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAllActivities = async () => {
      const token = localStorage.getItem('strava_access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Check cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setActivities(data);
          setIsLoading(false);
          return;
        }
      }

      try {
        let page = 1;
        let allActivities: StravaActivity[] = [];
        
        while (true) {
          const data = await fetchActivitiesPage(page, token);
          if (!data.length || !isMounted) break;
          
          allActivities = [...allActivities, ...data];
          if (data.length < PAGE_SIZE) break;
          page++;
        }

        if (isMounted) {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: allActivities,
            timestamp: Date.now()
          }));
          
          setActivities(allActivities);
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAllActivities();

    return () => {
      isMounted = false;
    };
  }, []); // 只在组件挂载时执行一次

  return { activities, isLoading, error };
}
