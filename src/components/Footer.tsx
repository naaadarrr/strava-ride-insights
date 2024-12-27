import React from 'react';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
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
  );
}
