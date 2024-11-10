import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

function Output() {
  const [prompt, setPrompt] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [selectedChart, setSelectedChart] = useState(''); // Track selected chart recommendation
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch cleaned data and chart recommendations based on the user prompt
  const handleVisualizeData = async () => {
    setLoading(true); // Start loading
    setErrorMessage(''); // Clear previous error messages

    try {
      const response = await axios.post("http://localhost:8000/Visualize/", { prompt: prompt.trim() });
      const data = response.data;

      setQueryResults(data.rows);
      setErrorMessage('');
    } catch (error) {
      console.error("Error fetching cleaned data:", error);
      setErrorMessage("There was an error fetching the data.");
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  // Prepare data for visualization based on selected chart type and columns
  useEffect(() => {
    if (!selectedChart || !queryResults.length) return;

    const labels = [...new Set(queryResults.map(row => row.Product))]; // Unique product names
    const values = labels.map(label => queryResults.filter(row => row.Product === label).length); // Frequency count for each product

    setChartData({
      labels: labels,
      datasets: [
        {
          label: `${selectedChart} Chart`,
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        }
      ]
    });
  }, [selectedChart, queryResults]); // Trigger data preparation when selectedChart or queryResults change

  // Render the selected chart
  const renderChart = () => {
    if (!chartData) return null;

    const chartOptions = { responsive: true, maintainAspectRatio: false };
    const chartSize = { width: 600, height: 400 }; // Increase chart size

    switch (selectedChart) {
      case 'Bar':
        return <Bar data={chartData} options={chartOptions} {...chartSize} />;
      case 'Pie':
        return <Pie data={chartData} options={chartOptions} {...chartSize} />;
      case 'Line':
        return <Line data={chartData} options={chartOptions} {...chartSize} />;
      case 'Doughnut':
        return <Doughnut data={chartData} options={chartOptions} {...chartSize} />;
      case 'Radar':
        return <Radar data={chartData} options={chartOptions} {...chartSize} />;
      default:
        return <p>Select a valid chart type to view the visualization.</p>;
    }
  };

  return (
    <section className="flex flex-col items-center p-8 bg-darkBg min-h-screen text-white">
      <h2 className="text-3xl font-semibold mb-6">Output Page</h2>

      {/* Prompt Input Field */}
      <input
        className="w-3/4 md:w-1/2 p-4 mb-4 text-black rounded-md border-2 border-primaryPurple focus:outline-none shadow-lg"
        type="text"
        placeholder="Enter your analysis prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Visualize Button */}
      <button
        onClick={handleVisualizeData}
        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all mb-6"
        disabled={loading} // Disable button while loading
      >
        {loading ? "Loading..." : "Visualize the Data"}
      </button>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex flex-col items-center mb-6">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-purple-500"
            style={{
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              borderWidth: '4px',
            }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-purple-400 mt-2">AI is loading your data, please wait...</p>
        </div>
      )}

      {/* Chart Type Dropdown */}
      <div className="w-3/4 md:w-1/2 mb-4">
        <select
          className="w-full p-2 rounded-md text-black"
          value={selectedChart}
          onChange={(e) => setSelectedChart(e.target.value)}
        >
          <option value="">Select Chart Type</option>
          <option value="Bar">Bar Chart</option>
          <option value="Pie">Pie Chart</option>
          <option value="Line">Line Chart</option>
          <option value="Doughnut">Doughnut Chart</option>
          <option value="Radar">Radar Chart</option>
        </select>
      </div>

      {/* Display Selected Chart */}
      <div className="w-3/4 md:w-1/2 p-6 mb-6 bg-gray-800 rounded-md shadow-lg" style={{ width: '90%', height: '500px' }}>
        {renderChart()}
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </section>
  );
}

export default Output;
