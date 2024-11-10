import React from 'react';

function Upload() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-gray-900 text-white relative">
      <h2 className="absolute top-16 left-10 text-lg font-semibold text-white">File Upload</h2>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-gray-900 opacity-50" />

      {/* Upload Box */}
      <div className="flex flex-col items-center justify-center w-3/4 md:w-1/2 p-10 bg-gray-800 bg-opacity-80 rounded-xl border border-purple-500 shadow-lg">
        <div className="mb-4">
          <svg className="w-12 h-12 text-purple-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="text-gray-300 mb-4">Drag and Drop your file here</p>
        <p className="text-gray-500 mb-6">OR</p>
        <button className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all">Get Started</button>
      </div>

      {/* Decorative Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-1/4 left-1/3 transform -rotate-45 opacity-25 text-purple-600" width="200" height="200">
          <polygon points="100,10 40,180 190,60 10,60 160,180" fill="currentColor" />
        </svg>
        <svg className="absolute top-1/2 right-1/4 transform rotate-45 opacity-25 text-blue-600" width="150" height="150">
          <polygon points="75,10 25,140 140,40 10,40 110,140" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}

export default Upload;
