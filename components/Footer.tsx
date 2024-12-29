import React from 'react'
import { Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-8">
          <img
            src={'/strava/api_logo_pwrdBy_strava_horiz_light.svg'}
            alt="Powered by Strava"
            className="h-5"
          />
          <a
            href="https://github.com/hi-otto/strava-ride-insights"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors flex items-center"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
