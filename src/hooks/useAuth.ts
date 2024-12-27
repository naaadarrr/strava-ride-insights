import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REDIRECT_URI } from '../config/strava';
import { refreshToken } from '../utils/auth';
import type { StravaAthlete } from '../types/strava';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [athlete, setAthlete] = useState<StravaAthlete | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleStravaCallback(code);
    } else {
      checkAuthStatus();
    }
  }, [searchParams]);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('strava_access_token');
    const refreshTokenStr = localStorage.getItem('strava_refresh_token');
    const expiresAt = localStorage.getItem('strava_token_expires_at');
    const athleteData = localStorage.getItem('strava_athlete');

    if (!token || !refreshTokenStr || !expiresAt) {
      setIsAuthenticated(false);
      setAthlete(null);
      setIsLoading(false);
      return;
    }

    if (athleteData) {
      setAthlete(JSON.parse(athleteData));
    }

    // Check if token is expired or will expire in next 5 minutes
    const expiresAtTime = parseInt(expiresAt, 10) * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (currentTime + fiveMinutes >= expiresAtTime) {
      console.log('Token expired or expiring soon, refreshing...');
      // Token is expired or will expire soon, try to refresh
      const newTokenInfo = await refreshToken(refreshTokenStr);
      
      if (newTokenInfo) {
        // Save new token info
        localStorage.setItem('strava_access_token', newTokenInfo.access_token);
        localStorage.setItem('strava_refresh_token', newTokenInfo.refresh_token);
        localStorage.setItem('strava_token_expires_at', newTokenInfo.expires_at.toString());
        setIsAuthenticated(true);
      } else {
        // Refresh failed, clear everything
        logout();
      }
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  };

  const handleStravaCallback = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: STRAVA_CLIENT_ID,
          client_secret: STRAVA_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('strava_access_token', data.access_token);
        localStorage.setItem('strava_refresh_token', data.refresh_token);
        localStorage.setItem('strava_token_expires_at', data.expires_at.toString());
        localStorage.setItem('strava_athlete', JSON.stringify(data.athlete));
        setAthlete(data.athlete);
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (error) {
      console.error('Error authenticating with Strava:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    const scope = 'activity:read_all';
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${STRAVA_REDIRECT_URI}&response_type=code&scope=${scope}`;
  };

  const logout = () => {
    localStorage.removeItem('strava_access_token');
    localStorage.removeItem('strava_refresh_token');
    localStorage.removeItem('strava_token_expires_at');
    localStorage.removeItem('strava_athlete');
    setIsAuthenticated(false);
    setAthlete(null);
    navigate('/');
  };

  return {
    isAuthenticated,
    isLoading,
    athlete,
    login,
    logout,
  };
}