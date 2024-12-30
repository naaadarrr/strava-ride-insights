'use client'
import React, { useState } from 'react'
import { BarChart2, Activity, LogOut, Menu, X, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './Logo'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useUser } from '@/hooks/useUser'

interface User {
  name: string
  image?: string
}

const links = [
  { to: '/', icon: LayoutDashboard, label: 'navigation.home' },
  { to: '/stats', icon: BarChart2, label: 'navigation.stats' },
  { to: '/activities', icon: Activity, label: 'navigation.activities' },
]

const NavLink = ({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
}) => {
  const pathname = usePathname()
  const t = useTranslations()
  return (
    <Link
      href={to}
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        pathname === to
          ? 'bg-orange-500 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 dark:hover:text-orange-400'
      }`}
    >
      <Icon className="mr-2" />
      {t(label)}
    </Link>
  )
}

const UserSection = ({
  user,
  logout,
  t,
}: {
  user: User
  logout: () => void
  t: (key: string) => string
}) => {
  if (!user) return null

  return (
    <>
      <div className="flex items-center space-x-2">
        {user.image && (
          <img src={user.image} alt={`${user.name}'s avatar`} className="h-8 w-8 rounded-full" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
      </div>
      <button
        onClick={logout}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-colors"
      >
        <LogOut className="h-5 w-5 mr-1.5" />
        {t('navigation.logout')}
      </button>
    </>
  )
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations()
  const { user, logout } = useUser()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-[1001] transition-colors">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo className="h-8 w-8" />
            <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {t('app.title')}
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {links.map(link => (
              <NavLink key={link.to} {...link} />
            ))}
            <LanguageSwitcher />
            <ThemeToggle />
            <UserSection user={user} logout={logout} t={t} />
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-500 dark:hover:text-orange-400"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            {user && (
              <div className="flex items-center space-x-2 px-3 py-2">
                {user.image && (
                  <img
                    src={user.image}
                    alt={`${user.name}'s avatar`}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </div>
            )}
            {links.map(link => (
              <NavLink key={link.to} {...link} onClick={() => setIsMenuOpen(false)} />
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
