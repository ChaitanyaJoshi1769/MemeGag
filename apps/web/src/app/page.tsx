'use client';

import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">🎭 MemeGag</div>
          <div className="space-x-4">
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              Login
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Where the Internet Laughs
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          A next-generation social entertainment platform combining the best of meme culture, community, and AI creativity.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => setIsLoading(true)}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
          >
            Get Started
          </button>
          <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 font-semibold transition-colors">
            Learn More
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Browse & Share',
              description: 'Discover endless memes, GIFs, and short-form videos from creators worldwide',
            },
            {
              title: 'AI-Powered',
              description: 'Generate memes with AI, get smart recommendations, and discover trends automatically',
            },
            {
              title: 'Creator Economy',
              description: 'Monetize your content, build audiences, and earn from your creativity',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 MemeGag. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
