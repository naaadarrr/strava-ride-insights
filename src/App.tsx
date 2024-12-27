import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Stats } from './pages/Stats';
import { Activities } from './pages/Activities';
import { Callback } from './components/Callback';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;