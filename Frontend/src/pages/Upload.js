import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setUploadStatus("Invalid file type. Please upload a .csv, .xlsx, or .xls file.");
    } else if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadStatus(`File ready for upload: ${acceptedFiles[0].name}`);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
  });

  const handleFileUpload = async (fileToUpload) => {
    if (!fileToUpload) {
      setUploadStatus("No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setUploadStatus(`File uploaded successfully! Columns: ${response.data.columns.join(", ")}`);
      navigate('/output');
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file.");
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-r from-purple-900 to-gray-900">
      <h2 className="absolute top-16 left-10 text-lg font-semibold text-white z-10">File Upload</h2>

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-gray-900 opacity-50 z-0" />

      {/* Upload Box with Dropzone */}
      <div
        {...getRootProps()}
        className={`relative z-10 flex flex-col items-center justify-center w-3/4 md:w-1/2 p-10 bg-gray-800 bg-opacity-80 rounded-xl border border-purple-500 shadow-lg cursor-pointer ${isDragActive ? "border-dashed border-purple-300" : ""}`}
      >
        <input {...getInputProps()} />

        <div className="mb-4">
          <svg className="w-12 h-12 text-purple-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>

        {isDragActive ? (
          <p className="text-gray-300 mb-4">Drop the file here ...</p>
        ) : (
          <p className="text-gray-300 mb-4">Drag and Drop your file here, or click to select a file</p>
        )}

        <p className="text-gray-500 mb-6">OR</p>
      </div>

      {/* Upload Button - Only enabled when a file is selected */}
      <button
        onClick={() => handleFileUpload(file)}
        className={`px-6 py-2 mt-4 rounded-full transition-all z-10 ${file ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
        disabled={!file}
      >
        Get Started
      </button>

      {/* Status Message */}
      <div className="mt-4 text-white z-10">
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>

      {/* Decorative Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
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
