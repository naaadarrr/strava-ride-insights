import { useState, useEffect } from 'react';
import type { StravaActivity } from '../types/strava';
import { useAuth } from './useAuth';

export function useActivities() {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('strava_access_token');
    if (token) {
      fetchActivities(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchActivities = async (accessToken: string, pageNum = 1) => {
    if (isLoading && pageNum > 1) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?per_page=50&page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired
          logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch activities');
      }
      
      const data: StravaActivity[] = await response.json();
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setActivities(prev => pageNum === 1 ? data : [...prev, ...data]);
        setPage(pageNum);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    const token = localStorage.getItem('strava_access_token');
    if (token) {
      fetchActivities(token, page + 1);
    }
  };

  return {
    activities,
    isLoading,
    hasMore,
    error,
    loadMore,
  };
}