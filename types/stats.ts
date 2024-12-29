export interface RideStats {
  totalDistance: number
  totalTime: number
  totalElevation: number
  totalRides: number
  averageDistance: number
  averageSpeed: number
  longestRide: {
    distance: number
    date: string
    name: string
  }
  highestClimb: {
    elevation: number
    date: string
    name: string
  }
  fastestSpeed: {
    speed: number
    date: string
    name: string
  }
}

export interface TimeDistribution {
  morning: number // 5-11
  afternoon: number // 11-17
  evening: number // 17-22
  night: number // 22-5
}

export interface SeasonalStatsData {
  spring: RideStats
  summer: RideStats
  autumn: RideStats
  winter: RideStats
}

export interface WeekdayStats {
  weekday: RideStats
  weekend: RideStats
}
