import { useState } from 'react';

export default function ResumeUpload({ resume, setResume, onAnalyze }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = () => {
    setErrorMsg('');
    if (!apiKey.trim()) {
      setErrorMsg('Gemini API key is required');
      return;
    }
    // Assuming backend takes role from somewhere else or hardcoded if this component is used
    onAnalyze(resume, "Software Engineer", apiKey.trim()); 
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-gradient-to-br from-white to-slate-100 rounded-3xl shadow-2xl p-8">
      
      <div className="flex justify-center mb-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-full shadow-lg">
          <span className="text-white text-xl">📄</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center text-gray-800">
        Upload Your Resume
      </h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Analyze skills and get a learning roadmap
      </p>

      {/* API Key Input Section with proper spacing */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Enter your Gemini API Key
        </label>
        <input
          type="password"
          placeholder="Paste your Gemini API key here..."
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            localStorage.setItem('gemini_api_key', e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Upload Resume Document (PDF)
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
          className="block w-full text-sm text-gray-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:bg-indigo-50 file:text-indigo-600
                     hover:file:bg-indigo-100 cursor-pointer"
        />
      </div>

      {errorMsg && (
        <p className="text-red-500 text-sm font-semibold text-center mb-4">{errorMsg}</p>
      )}

      <button
        disabled={!resume}
        onClick={handleAnalyze}
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                   hover:from-pink-500 hover:to-indigo-500
                   text-white font-semibold py-3 rounded-xl
                   shadow-lg transition-all duration-300
                   disabled:opacity-50"
      >
        Analyze Resume
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        Supported formats: PDF, DOC, DOCX
      </p>
    </div>
  );
}
