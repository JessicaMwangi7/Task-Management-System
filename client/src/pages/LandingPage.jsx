import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import doodle from '../assets/doodle.svg';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* subtle doodle accent: using the imported `doodle` SVG */}
      <img
        src={doodle}
        alt=""
        className="absolute top-4 right-4 w-24 opacity-20 pointer-events-none"
      />

      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-4 bg-clip-text text-transparent
                     bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        >
          Welcome to TaskFlow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-sm md:text-base max-w-xl"
        >
          The Task Collaboration and Accountability App. Track your team’s tasks in one simple platform.
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex space-x-4 mt-6"
        >
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 rounded-lg shadow-lg
                       bg-gradient-to-r from-green-400 to-blue-500
                       hover:from-blue-500 hover:to-purple-500
                       text-white font-semibold
                       transform hover:scale-105 transition"
          >
            Get Started
          </button>
        </motion.div>
      </main>
    </div>
  );
}
