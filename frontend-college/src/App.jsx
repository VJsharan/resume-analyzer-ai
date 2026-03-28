import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import ResultsDashboard from './components/ResultsDashboard';
import LoadingScreen from './components/LoadingScreen';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload' | 'analyzing' | 'results'
  const [analysisData, setAnalysisData] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async (file, role, key) => {
    setCurrentStep('analyzing');
    setError('');
    setUploadedFile({ name: file.name, type: file.type || 'PDF' });
    setApiKey(key);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_role', role);

    try {
      const startTime = Date.now();
      
      const response = await axios.post('http://127.0.0.1:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const elapsedTime = Date.now() - startTime;
      const minLoadTime = 2500;
      
      if (elapsedTime < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
      }

      setAnalysisData(response.data);
      setCurrentStep('results');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to analyze resume. Please try again.');
      setCurrentStep('upload');
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setUploadedFile(null);
    setApiKey('');
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {currentStep === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <UploadSection onAnalyze={handleAnalyze} />
          </motion.div>
        )}

        {currentStep === 'analyzing' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingScreen />
          </motion.div>
        )}

        {currentStep === 'results' && analysisData && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ResultsDashboard data={analysisData} fileInfo={uploadedFile} onReset={handleReset} apiKey={apiKey} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 px-6 py-3 rounded-full shadow-lg border border-red-100 font-medium z-50">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
