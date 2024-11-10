import React from 'react';

function Output() {
  return (
    <section className="flex flex-col items-center p-8 bg-darkBg min-h-screen text-white">
      <h2 className="text-3xl font-semibold mb-6">Output Page</h2>
      <input 
        className="w-3/4 md:w-1/2 p-4 mb-6 text-black rounded-md border-2 border-primaryPurple focus:outline-none shadow-lg"
        type="text"
        placeholder="Prompt"
      />
      <div className="w-3/4 md:w-1/2 p-6 mb-6 bg-gray-800 rounded-md border-2 border-primaryPurple text-center shadow-lg">
        Output will be displayed here
      </div>
      <button className="px-6 py-3 bg-transparent border-2 border-primaryPurple text-primaryPurple rounded-lg hover:bg-primaryPurple hover:text-white transition-all">
        Download
      </button>
    </section>
  );
}

export default Output;
