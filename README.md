> Note: VITE_STRAVA_CLIENT_SECRET will exposed and should not be used in production. We are working on a solution.

# Strava Ride Insights

A web application that provides insights and visualization for your Strava activities. Built with React, TypeScript, and Vite.

## Features

- 🔐 Strava OAuth Authentication
- 🗺️ Activity Map Visualization using Leaflet
- 📊 Activity Statistics and Insights
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

- Node.js (LTS version recommended)
- A Strava API Application (create one at https://www.strava.com/settings/api)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/strava-ride-insights.git
cd strava-ride-insights
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Strava API credentials in `.env`:
     ```
       VITE_STRAVA_CLIENT_ID=your_client_id
       VITE_STRAVA_CLIENT_SECRET=your_client_secret
       VITE_STRAVA_REDIRECT_URI=https://your_redirect_uri
     ```

4. Start the development server:
```bash
npm run dev
```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Map Library**: Leaflet with react-leaflet
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Development

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Deployment

This project is configured for deployment on Vercel. Make sure to:

1. Configure environment variables in your Vercel project settings
2. Set up the Strava OAuth redirect URI to match your deployed domain
3. Update the Strava API application settings with the correct callback URL

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
