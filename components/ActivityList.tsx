import { Calendar, MapPin, Timer, TrendingUp } from 'lucide-react'
import type { StravaActivity } from '../types/strava'
import { CityStyleMap } from './CityStyleMap'

interface ActivityListProps {
  activities: StravaActivity[]
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="space-y-6">
      {activities.map(activity => (
        <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">{activity.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>{(activity.distance / 1000).toFixed(2)} km</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-500" />
              <span>{Math.floor(activity.moving_time / 60)} mins</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>{activity.total_elevation_gain}m gain</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span>{new Date(activity.start_date).toLocaleDateString()}</span>
            </div>
          </div>
          {activity.map.summary_polyline && <CityStyleMap activity={activity} />}
        </div>
      ))}
    </div>
  )
}
