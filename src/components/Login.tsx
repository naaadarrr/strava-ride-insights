import React from 'react';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-xl mx-auto p-8">
        <div className="flex justify-center">
          <Activity className="h-16 w-16 text-orange-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('login.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {t('login.description')}
        </p>
        <button
          onClick={login}
          className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors"
        >
          {t('login.connectButton')}
        </button>
      </div>
    </div>
  );
}