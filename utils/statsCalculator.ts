// src/utils/statsCalculator.ts
import type { StravaActivity } from '../types/strava'
import type { RideStats, TimeDistribution, SeasonalStatsData, WeekdayStats } from '../types/stats'

export function calculateRideStats(activities: StravaActivity[]): RideStats {
  // 移除过滤器,使用所有活动
  if (activities.length === 0) {
    return {
      totalDistance: 0,
      totalTime: 0,
      totalElevation: 0,
      totalRides: 0,
      averageDistance: 0,
      averageSpeed: 0,
      longestRide: {
        distance: 0,
        date: new Date().toISOString(),
        name: '',
      },
      highestClimb: {
        elevation: 0,
        date: new Date().toISOString(),
        name: '',
      },
      fastestSpeed: {
        speed: 0,
        date: new Date().toISOString(),
        name: '',
      },
    }
  }

  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0)
  const totalTime = activities.reduce((sum, a) => sum + a.moving_time, 0)
  const totalElevation = activities.reduce((sum, a) => sum + a.total_elevation_gain, 0)

  const longestRide = activities.reduce(
    (max, current) => (current.distance > max.distance ? current : max),
    activities[0]
  )

  const highestClimb = activities.reduce(
    (max, current) => (current.total_elevation_gain > max.total_elevation_gain ? current : max),
    activities[0]
  )

  const fastestRide = activities.reduce(
    (max, current) => (current.max_speed > max.max_speed ? current : max),
    activities[0]
  )

  return {
    totalDistance,
    totalTime,
    totalElevation,
    totalRides: activities.length,
    averageDistance: totalDistance / activities.length,
    averageSpeed: totalDistance / totalTime,
    longestRide: {
      distance: longestRide.distance,
      date: longestRide.start_date,
      name: longestRide.name,
    },
    highestClimb: {
      elevation: highestClimb.total_elevation_gain,
      date: highestClimb.start_date,
      name: highestClimb.name,
    },
    fastestSpeed: {
      speed: fastestRide.max_speed,
      date: fastestRide.start_date,
      name: fastestRide.name,
    },
  }
}

// 其他函数也需要移除 trainer 过滤
export function calculateTimeDistribution(activities: StravaActivity[]): TimeDistribution {
  const initialDistribution = { morning: 0, afternoon: 0, evening: 0, night: 0 }

  if (activities.length === 0) {
    return initialDistribution
  }

  return activities.reduce((dist, activity) => {
    const hour = new Date(activity.start_date).getHours()
    if (hour >= 5 && hour < 11) dist.morning++
    else if (hour >= 11 && hour < 17) dist.afternoon++
    else if (hour >= 17 && hour < 22) dist.evening++
    else dist.night++
    return dist
  }, initialDistribution)
}

export function calculateSeasonalStats(activities: StravaActivity[]): SeasonalStatsData {
  const initialSeasons = {
    spring: [] as StravaActivity[],
    summer: [] as StravaActivity[],
    autumn: [] as StravaActivity[],
    winter: [] as StravaActivity[],
  }

  const seasonalActivities = activities.reduce((seasons, activity) => {
    const month = new Date(activity.start_date).getMonth()
    if (month >= 2 && month <= 4) seasons.spring.push(activity)
    else if (month >= 5 && month <= 7) seasons.summer.push(activity)
    else if (month >= 8 && month <= 10) seasons.autumn.push(activity)
    else seasons.winter.push(activity)
    return seasons
  }, initialSeasons)

  return {
    spring: calculateRideStats(seasonalActivities.spring),
    summer: calculateRideStats(seasonalActivities.summer),
    autumn: calculateRideStats(seasonalActivities.autumn),
    winter: calculateRideStats(seasonalActivities.winter),
  }
}

export function calculateWeekdayStats(activities: StravaActivity[]): WeekdayStats {
  const initialGroups = {
    weekday: [] as StravaActivity[],
    weekend: [] as StravaActivity[],
  }

  const grouped = activities.reduce((groups, activity) => {
    const day = new Date(activity.start_date).getDay()
    if (day === 0 || day === 6) {
      groups.weekend.push(activity)
    } else {
      groups.weekday.push(activity)
    }
    return groups
  }, initialGroups)

  return {
    weekday: calculateRideStats(grouped.weekday),
    weekend: calculateRideStats(grouped.weekend),
  }
}
