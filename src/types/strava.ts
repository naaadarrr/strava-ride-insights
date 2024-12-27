export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  trainer: boolean;
  map: {
    summary_polyline: string;
  };
}

export interface StravaStats {
  total_distance: number;
  total_elevation_gain: number;
  total_time: number;
  total_activities: number;
  longest_ride: number;
  highest_elevation: number;
  fastest_speed: number;
}

export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;  // 头像 URL
  profile_medium: string;  // 中等尺寸头像 URL
}

export interface StravaAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: StravaAthlete;
}