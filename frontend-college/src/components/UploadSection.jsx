import React, { useState, useEffect } from 'react';
import { UploadCloud, ChevronDown, CheckCircle, Brain, Target, Shield, Clock, Award } from 'lucide-react';
import axios from 'axios';

export default function UploadSection({ onAnalyze }) {
  const [file, setFile] = useState(null);
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    // Simulated roles since we might not have a running backend yet for this specific endpoint
    // But ideally fetching from backend
    axios.get('http://127.0.0.1:8000/job-roles')
      .then(res => setJobRoles(res.data.roles || []))
      .catch(err => console.error("Failed to fetch roles", err));
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (file && selectedRole) {
      onAnalyze(file, selectedRole);
    }
  };

  const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="p-8 bg-white rounded-2xl border border-slate-400 shadow-sm hover:shadow-xl hover:border-indigo-600 transition-all duration-300 hover:-translate-y-2 group cursor-default">
      <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
        <Icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-slate-600 leading-relaxed group-hover:text-slate-800">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white pb-20 pt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 font-medium text-sm mb-6">
              <Brain className="w-4 h-4" />
              AI-Powered Resume Analyzer and Career Coach 
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Optimize your resume for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-700">
                your dream career
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get detailed feedback on your resume's content, structure, and ATS compatibility instantly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="grid md:grid-cols-5 h-full">
              {/* Left Side - Upload Form */}
              <div className="md:col-span-3 p-8 md:p-10 bg-white">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Target Job Role
                    </label>
                    <div className="relative">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium transition-colors"
                      >
                        <option value="">Select a position...</option>
                        {jobRoles.map((role, idx) => (
                          <option key={idx} value={role}>{role}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Upload Resume (PDF)
                    </label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        isDragOver 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-slate-200 bg-slate-50 hover:border-indigo-300'
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer block">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                          <UploadCloud className={`w-8 h-8 ${file ? 'text-green-500' : 'text-indigo-500'}`} />
                        </div>
                        {file ? (
                          <>
                            <p className="text-slate-900 font-semibold">{file.name}</p>
                            <p className="text-sm text-green-600 mt-1 flex items-center justify-center gap-1">
                              <CheckCircle className="w-4 h-4" /> Ready to analyze
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-slate-900 font-medium mb-1">Click to upload or drag & drop</p>
                            <p className="text-sm text-slate-500">PDF documents only (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={!file || !selectedRole}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] ${
                      !file || !selectedRole
                        ? 'bg-slate-300 cursor-not-allowed shadow-none'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                    }`}
                  >
                    Analyze Resume
                  </button>
                </div>
              </div>

              {/* Right Side - Features/Info */}
              <div className="md:col-span-2 bg-slate-50 p-8 md:p-10 border-l border-slate-100 flex flex-col justify-center">
                <h3 className="font-bold text-slate-900 mb-6">Why use our analyzer?</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">ATS Optimized</p>
                      <p className="text-xs text-slate-500">Check parseability for tracking systems</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Skills Gap Analysis</p>
                      <p className="text-xs text-slate-500">Compare against industry requirements</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Expert Scoring</p>
                      <p className="text-xs text-slate-500">Detailed feedback on tone & content</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center">
                    Trusted by students placed at top companies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Shield}
            title="Privacy First"
            description="Your resume is processed securely and deleted immediately after analysis. We value your data privacy."
          />
          <FeatureCard 
            icon={Clock}
            title="Instant Results"
            description="Get comprehensive feedback in seconds. No waiting days for a manual review."
          />
          <FeatureCard 
            icon={Award}
            title="Actionable Insights"
            description="Don't just get a score. Get specific, actionable tips to improve your resume immediately."
          />
        </div>
      </div>
    </div>
  );
}
