export type StravaSportType =
  | 'AlpineSki'
  | 'BackcountrySki'
  | 'Badminton'
  | 'Canoeing'
  | 'Crossfit'
  | 'EBikeRide'
  | 'Elliptical'
  | 'EMountainBikeRide'
  | 'Golf'
  | 'GravelRide'
  | 'Handcycle'
  | 'HighIntensityIntervalTraining'
  | 'Hike'
  | 'IceSkate'
  | 'InlineSkate'
  | 'Kayaking'
  | 'Kitesurf'
  | 'MountainBikeRide'
  | 'NordicSki'
  | 'Pickleball'
  | 'Pilates'
  | 'Racquetball'
  | 'Ride'
  | 'RockClimbing'
  | 'RollerSki'
  | 'Rowing'
  | 'Run'
  | 'Sail'
  | 'Skateboard'
  | 'Snowboard'
  | 'Snowshoe'
  | 'Soccer'
  | 'Squash'
  | 'StairStepper'
  | 'StandUpPaddling'
  | 'Surfing'
  | 'Swim'
  | 'TableTennis'
  | 'Tennis'
  | 'TrailRun'
  | 'Velomobile'
  | 'VirtualRide'
  | 'VirtualRow'
  | 'VirtualRun'
  | 'Walk'
  | 'WeightTraining'
  | 'Wheelchair'
  | 'Windsurf'
  | 'Workout'
  | 'Yoga'

export interface StravaActivity {
  id: number
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: string
  sport_type: StravaSportType
  start_date: string
  start_date_local: string
  timezone: string
  utc_offset: number
  location_country?: string
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  average_speed: number
  max_speed: number
  average_cadence?: number
  average_temp?: number
  average_watts?: number
  weighted_average_watts?: number
  kilojoules?: number
  device_watts?: boolean
  has_heartrate: boolean
  average_heartrate?: number
  max_heartrate?: number
  heartrate_opt_out: boolean
  elev_high: number
  elev_low: number
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  visibility: string
  gear_id?: string
  start_latlng: number[]
  end_latlng: number[]
  map: {
    id: string
    summary_polyline: string
    resource_state: number
  }
  athlete: {
    id: number
    resource_state: number
  }
}

export interface StravaStats {
  total_distance: number
  total_elevation_gain: number
  total_time: number
  total_activities: number
  longest_ride: number
  highest_elevation: number
  fastest_speed: number
}

export interface StravaAthlete {
  id: number
  firstname: string
  lastname: string
  profile: string // 头像 URL
  profile_medium: string // 中等尺寸头像 URL
}

export interface StravaAuthResponse {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete: StravaAthlete
}
