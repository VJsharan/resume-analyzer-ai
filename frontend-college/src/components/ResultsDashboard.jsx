import React from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Award, Share2 } from 'lucide-react';

export default function ResultsDashboard({ data }) {
  const { overall_score, scores, ats_score, skills_analysis, improvement_tips } = data;

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
    <div className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-indigo-100 selection:text-indigo-900 font-['Google_Sans']">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Resume Audit</h1>
            <p className="text-slate-500 font-medium">Target Role: <span className="text-indigo-600">{data.job_role}</span></p>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium transition-colors">
            <Share2 className="w-4 h-4" /> Share Report
          </button>
        </div>

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

            {/* Validated Skills */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-green-500" />
                 Matched Skills
               </h3>
               <div className="flex flex-wrap gap-2">
                 {skills_analysis.matched_skills.map((skill, i) => (
                   <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold border border-slate-200">
                     {skill}
                   </span>
                 ))}
                 {skills_analysis.matched_skills.length === 0 && <span className="text-slate-400 text-sm italic">No direct matches found.</span>}
               </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <AlertCircle className="w-5 h-5 text-amber-500" />
                 Missing Keywords
               </h3>
               <div className="flex flex-wrap gap-2">
                 {skills_analysis.missing_skills.map((skill, i) => (
                   <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-100 opacity-90">
                     {skill}
                   </span>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
