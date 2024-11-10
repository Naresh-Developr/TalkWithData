// Output.js
import React, { useState } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';

function Output() {
  const [prompt, setPrompt] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartRecommendations, setChartRecommendations] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null); // Track selected chart recommendation
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch cleaned data and chart recommendations based on the user prompt
  const handleVisualizeData = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/chart-recommendations/", { prompt });
      const data = response.data;

      setQueryResults(data.rows);
      setChartRecommendations(JSON.parse(data.chart_recommendations)); // Parse chart recommendations JSON
      setErrorMessage('');
    } catch (error) {
      console.error("Error fetching cleaned data:", error);
      setErrorMessage("There was an error fetching the data.");
    }
  };

  // Prepare data for visualization based on selected chart type and columns
  const prepareChartData = () => {
    if (!selectedChart || !queryResults) return;

    const labels = queryResults.map(row => row[selectedChart.x]);
    const values = queryResults.map(row => row[selectedChart.y]);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: selectedChart.chartType,
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)"
        }
      ]
    });
  };

  // Render the selected chart
  const renderChart = () => {
    if (!chartData) return null;

    switch (selectedChart.chartType) {
      case 'Bar':
        return <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />;
      case 'Line':
        return <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />;
      case 'Pie':
        return <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />;
      default:
        return null;
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
      >
        Visualize the Data
      </button>

      {/* Chart Type Recommendations */}
      {chartRecommendations.length > 0 && (
        <select
          className="mb-4 p-2 rounded-md text-black"
          value={selectedChart ? selectedChart.chartType : ""}
          onChange={(e) => {
            const selected = chartRecommendations.find(rec => rec.chartType === e.target.value);
            setSelectedChart(selected);
            prepareChartData(); // Prepare chart data after selecting a chart type
          }}
        >
          <option value="">Select Chart Type</option>
          {chartRecommendations.map((rec, index) => (
            <option key={index} value={rec.chartType}>{rec.chartType} Chart</option>
          ))}
        </select>
      )}

      {/* Display Table with Query Results */}
      <div className="w-3/4 md:w-1/2 p-6 mb-6 bg-gray-800 rounded-md border-2 border-primaryPurple text-center shadow-lg">
        {queryResults.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                {Object.keys(queryResults[0]).map((key) => (
                  <th className="px-4 py-2 border-b" key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResults.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td className="px-4 py-2 border-b" key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data to display.</p>
        )}
      </div>

      {/* Display Selected Chart */}
      <div className="w-3/4 md:w-1/2 p-6 mb-6 bg-gray-800 rounded-md shadow-lg">
        {renderChart()}
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </section>
  );
}

export default Output;
