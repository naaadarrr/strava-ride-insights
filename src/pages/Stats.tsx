import React from 'react';
import { StatsContainer } from '../components/stats/StatsContainer';
import { useStatsActivities } from '../hooks/useStatsActivities';
import { AuthGuard } from '../components/AuthGuard';

export function Stats() {
  const { activities, isLoading, error } = useStatsActivities();

  return (
    <AuthGuard>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : (
        <StatsContainer activities={activities} />
      )}
    </AuthGuard>
  );
}