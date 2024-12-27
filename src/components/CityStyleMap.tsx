import React, { useEffect, useRef } from 'react';
import { decode } from 'polyline-encoded';
import type { StravaActivity } from '../types/strava';

interface CityStyleMapProps {
  activity: StravaActivity;
}

export function CityStyleMap({ activity }: CityStyleMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !activity.map.summary_polyline) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Decode the polyline into coordinates
    const coordinates = decode(activity.map.summary_polyline);
    if (coordinates.length === 0) return;

    // Calculate bounds
    const bounds = coordinates.reduce(
      (acc, [lat, lng]) => ({
        minLat: Math.min(acc.minLat, lat),
        maxLat: Math.max(acc.maxLat, lat),
        minLng: Math.min(acc.minLng, lng),
        maxLng: Math.max(acc.maxLng, lng),
      }),
      {
        minLat: coordinates[0][0],
        maxLat: coordinates[0][0],
        minLng: coordinates[0][1],
        maxLng: coordinates[0][1],
      }
    );

    // Add padding to bounds
    const padding = 0.001; // Approximately 100m at equator
    bounds.minLat -= padding;
    bounds.maxLat += padding;
    bounds.minLng -= padding;
    bounds.maxLng += padding;

    // Set canvas size
    const size = Math.min(window.innerWidth - 48, 800);
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Transform coordinates to canvas space
    const transform = (lat: number, lng: number) => {
      const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * canvas.width;
      const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * canvas.height;
      return [x, y];
    };

    // Draw path
    ctx.beginPath();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    coordinates.forEach(([lat, lng], i) => {
      const [x, y] = transform(lat, lng);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [activity.map.summary_polyline]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-lg"
      />
    </div>
  );
}