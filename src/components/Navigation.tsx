import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, BarChart2, Bike, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export function Navigation() {
  const location = useLocation();
  const { isAuthenticated, athlete, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const links = [
    { to: '/', icon: Activity, label: t('navigation.home') },
    { to: '/stats', icon: BarChart2, label: t('navigation.stats') },
    { to: '/activities', icon: Bike, label: t('navigation.activities') },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {t('app.title')}
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2">
              {links.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === to
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 dark:hover:text-orange-400'
                    }`}
                >
                  <Icon className="h-5 w-5 mr-1.5" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              {isAuthenticated && (
                <>
                  <div className="flex items-center space-x-2">
                    {athlete?.profile_medium && (
                      <img
                        src={athlete.profile_medium}
                        alt={`${athlete.firstname}'s avatar`}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {athlete?.firstname} {athlete?.lastname}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-1.5" />
                    {t('navigation.logout')}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 dark:hover:text-orange-400"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            {isAuthenticated && athlete && (
              <div className="flex items-center space-x-2 px-3 py-2">
                {athlete.profile_medium && (
                  <img
                    src={athlete.profile_medium}
                    alt={`${athlete.firstname}'s avatar`}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {athlete.firstname} {athlete.lastname}
                </span>
              </div>
            )}
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === to
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 dark:hover:text-orange-400'
                  }`}
              >
                <Icon className="h-5 w-5 mr-1.5" />
                {label}
              </Link>
            ))}

            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1.5" />
                {t('navigation.logout')}
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}