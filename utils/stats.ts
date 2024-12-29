import type { StravaActivity, StravaStats } from '../types/strava'

export const calculateStats = (activities: StravaActivity[]): StravaStats => {
  const outdoorActivities = activities.filter(a => !a.trainer)
  return {
    total_distance: outdoorActivities.reduce((sum, a) => sum + a.distance, 0),
    total_elevation_gain: outdoorActivities.reduce((sum, a) => sum + a.total_elevation_gain, 0),
    total_time: outdoorActivities.reduce((sum, a) => sum + a.moving_time, 0),
    total_activities: outdoorActivities.length,
    longest_ride: Math.max(...outdoorActivities.map(a => a.distance)),
    highest_elevation: Math.max(...outdoorActivities.map(a => a.total_elevation_gain)),
    fastest_speed: Math.max(...outdoorActivities.map(a => a.max_speed)),
  }
}

export const getYearlyActivities = (activities: StravaActivity[], year: number) => {
  return activities.filter(activity => {
    const activityYear = new Date(activity.start_date).getFullYear()
    return activityYear === year
  })
}
