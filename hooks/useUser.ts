import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  image: string
}

interface UserState {
  isLoading: boolean
  isAuthenticated: boolean
  user: User | null
}

export function useUser() {
  const [state, setState] = useState<UserState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/strava/user')
        const data = await response.json()

        setState({
          isLoading: false,
          isAuthenticated: data.isAuthenticated,
          user: data.user || null,
        })
      } catch (error) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        })
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    try {
      // Clear cookies through an API endpoint
      await fetch('/api/strava/logout', { method: 'POST' })
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
      })
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return { ...state, logout }
}
