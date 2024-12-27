import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from '../config/strava';

export function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleStravaCallback(code);
    }
  }, [searchParams]);

  const handleStravaCallback = async (code: string) => {
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
        navigate('/');
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error('Error authenticating with Strava:', error);
      navigate('/');
    }
  };

  return (
    <div className="text-center">
      <p className="text-gray-500">Authenticating with Strava...</p>
    </div>
  );
}