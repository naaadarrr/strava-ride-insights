import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityCard } from '../components/ActivityCard';
import { useActivities } from '../hooks/useActivities';
import { AuthGuard } from '../components/AuthGuard';

export function Activities() {
  const { activities, isLoading, loadMore, hasMore, error } = useActivities();
  const { t } = useTranslation();

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{t('activities.title')}</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {isLoading && activities.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {activities
              .filter(activity => !activity.trainer)
              .map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center py-4">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? t('common.loading') : t('activities.loadMore')}
            </button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}