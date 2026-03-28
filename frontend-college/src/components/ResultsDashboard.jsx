import React, { useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Award, Share2, Download, Copy, ExternalLink, X, Loader2 } from 'lucide-react';
import RoadmapSection from './RoadmapSection';
import ChatIntegration from './ChatIntegration';
import html2canvas from 'html2canvas';

export default function ResultsDashboard({ data, fileInfo, onReset, apiKey }) {
  const { overall_score, scores, ats_score, skills_analysis, improvement_tips } = data;
  
  const [screenshotDataUrl, setScreenshotDataUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const reportRef = useRef(null);

  const handleShare = async () => {
    if (!reportRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fafc',
      });
      setScreenshotDataUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error("Failed to capture screenshot", err);
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadScreenshot = () => {
    const link = document.createElement('a');
    link.download = `resume-audit-${data.job_role.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    link.href = screenshotDataUrl;
    link.click();
  };

  const copyScreenshot = async () => {
    try {
      const response = await fetch(screenshotDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert("Image copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy", err);
      alert("Failed to copy image. Your browser might not support this feature.");
    }
  };

  const openInNewTab = () => {
    const w = window.open("");
    w.document.write(`<img src="${screenshotDataUrl}" style="max-width: 100%; height: auto;" />`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status) => {
    const styles = status === 'Strong' || status === 'Excellent' 
      ? 'bg-green-50 text-green-700 border-green-200'
      : status === 'Good' 
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-red-50 text-red-700 border-red-200';
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <div ref={reportRef} className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-indigo-100 selection:text-indigo-900 font-['Google_Sans'] relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Resume Audit</h1>
            <p className="text-slate-500 font-medium">Target Role: <span className="text-indigo-600">{data.job_role}</span></p>
          </div>
          <button 
            onClick={handleShare}
            disabled={isCapturing}
            data-html2canvas-ignore="true"
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />} 
            {isCapturing ? 'Generating...' : 'Share Report'}
          </button>
        </div>

        <RoadmapSection jobRole={data.job_role} />

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Score & Breakdown (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overall Score Banner */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl opacity-50"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Overall Score</h2>
                  <p className="text-slate-500 max-w-md">Calculated based on industry standards for {data.job_role} roles.</p>
                </div>
                <div className="text-right">
                  <div className={`text-7xl font-bold tracking-tight ${getScoreColor(overall_score)}`}>
                    {overall_score}
                  </div>
                  <div className="text-slate-400 font-medium text-lg">out of 100</div>
                </div>
              </div>
            </div>

            {/* Detailed Scores Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {['Tone & Style', 'Content', 'Structure', 'Skills'].map((key, idx) => {
                const map = {
                  'Tone & Style': scores.tone_and_style,
                  'Content': scores.content,
                  'Structure': scores.structure,
                  'Skills': scores.skills
                };
                const metric = map[key];
                
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-slate-700">{key}</h3>
                      {getStatusBadge(metric.status)}
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-3xl font-bold text-slate-900">{metric.score}</span>
                      <span className="text-slate-400 text-sm mb-1">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getProgressColor(metric.score)}`} 
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Metrics (Horizontal bars) */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="space-y-4">
                {[
                  { label: 'Recruiter scan', score: 72 },
                  { label: 'Project depth', score: 78 },
                  { label: 'Impact metrics', score: 38 },
                  { label: 'Summary/headline', score: 0 },
                ].map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-36 text-sm font-medium text-slate-700">{metric.label}</div>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full rounded-full ${metric.score > 50 ? 'bg-blue-600' : 'bg-red-500'}`}
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right font-bold text-slate-900 text-sm">{metric.score}/100</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-indigo-600 w-6 h-6" />
                Action Plan
              </h3>
              <div className="space-y-4">
                {improvement_tips.map((tip, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="font-bold text-amber-700 text-sm">{i+1}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wide opacity-70">{tip.category}</p>
                      <p className="text-slate-700 font-medium">{tip.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (4 cols) - ATS & Skills */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* ATS Score Card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-white/10 rounded-lg">
                     <Award className="w-6 h-6 text-indigo-300" />
                   </div>
                   <h3 className="font-bold text-lg">ATS Check</h3>
                 </div>
                 
                 <div className="mb-6">
                   <div className="flex items-baseline gap-2">
                     <span className="text-5xl font-bold">{ats_score.score}</span>
                     <span className="text-slate-400">/ 100</span>
                   </div>
                   <p className="text-indigo-200 mt-2 font-medium">{ats_score.status} Compatibility</p>
                 </div>
                 
                 <div className="text-sm text-slate-400 leading-relaxed border-t border-white/10 pt-4">
                   Your resume is <span className="text-white font-semibold">mostly parsable</span> by automated systems. {ats_score.score < 80 && "Consider simplifying headers and removing complex tables."}
                 </div>
               </div>
            </div>

            {/* Skills Groups based on Image 2 */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Missing Keywords / To Learn</h3>
                <div className="flex flex-wrap gap-2.5">
                  {skills_analysis.missing_skills.map((skill, i) => {
                    const isRedTheme = i % 2 === 0;
                    return (
                      <span key={i} className={`px-3 py-1.5 rounded-md text-[13px] font-semibold ${isRedTheme ? 'bg-[#fceae9] text-[#9b3a38]' : 'bg-[#f4ebe1] text-[#7a6449]'}`}>
                        {skill}
                      </span>
                    );
                  })}
                  {skills_analysis.missing_skills.length === 0 && <span className="text-slate-400 text-sm">Perfect match!</span>}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Already strong</h3>
                <div className="flex flex-wrap gap-2.5">
                  {skills_analysis.matched_skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-md text-[13px] font-semibold bg-[#e1edf9] text-[#2c5f94]">
                      {skill}
                    </span>
                  ))}
                  {skills_analysis.matched_skills.length === 0 && <span className="text-slate-400 text-sm italic">No direct matches.</span>}
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Analyze Another Button */}
        <div className="flex justify-center mt-12 mb-8 relative z-10">
          <button
            onClick={onReset}
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            Analyze Another Resume
          </button>
        </div>
        
      </div>

      {/* Modal Overlay */}
      {screenshotDataUrl && (
        <div data-html2canvas-ignore="true" className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Share Report</h2>
              <button onClick={() => setScreenshotDataUrl(null)} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-100 flex-1 flex justify-center items-start">
              <img src={screenshotDataUrl} alt="Report Screenshot" className="max-w-full h-auto rounded-xl shadow-sm border border-slate-200" />
            </div>
            
            <div className="p-6 bg-white border-t border-slate-100 flex flex-wrap gap-4 justify-end">
              <button onClick={openInNewTab} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-2 transition-colors">
                <ExternalLink className="w-4 h-4" /> Open
              </button>
              <button onClick={copyScreenshot} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-2 transition-colors">
                <Copy className="w-4 h-4" /> Copy
              </button>
              <button onClick={downloadScreenshot} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatIntegration data={data} fileInfo={fileInfo} apiKey={apiKey} />
    </div>
  );
}
