import React from 'react';

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center h-screen text-white overflow-hidden bg-hero-pattern">
      {/* Glowing Vertical Line */}
      <div className="absolute left-8 top-0 h-full w-2 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse"></div>

      {/* Hero Content */}
      <div className="text-center px-4 mt-8">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
          Transform Data into Insights Instantly with{' '}
          <span className="text-primary">PRO INSIGHT</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Ask, visualize, and gain insights effortlessly. Our AI-powered platform turns your data requests into stunning visuals with just a prompt.
        </p>
        <button className="px-8 py-3 mt-4 text-lg bg-transparent border-2 border-purple-400 text-purple-400 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300">
          Get Started →
        </button>
      </div>
    </section>
  );
}

export default Hero;
