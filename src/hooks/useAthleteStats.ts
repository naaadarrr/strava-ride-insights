import { useState, useEffect } from 'react';
import type { StravaStats } from '../types/strava';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { useAuth } from '../hooks/useAuth';

export function useAthleteStats() {
  const [stats, setStats] = useState<StravaStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { athlete } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!athlete?.id) {
          throw new Error('No athlete ID found');
        }

        const response = await fetchWithAuth(
          `https://www.strava.com/api/v3/athletes/${athlete.id}/stats`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch athlete stats');
        }

        const data = await response.json();
        setStats({
          total_distance: data.all_ride_totals.distance,
          total_elevation_gain: data.all_ride_totals.elevation_gain,
          total_time: data.all_ride_totals.moving_time,
          total_activities: data.all_ride_totals.count,
          longest_ride: data.biggest_ride_distance,
          highest_elevation: data.biggest_climb_elevation_gain,
          fastest_speed: 0, // This needs to be calculated from activities if needed
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    if (athlete?.id) {
      fetchStats();
    }
  }, [athlete?.id]);

  return { stats, isLoading, error };
}
