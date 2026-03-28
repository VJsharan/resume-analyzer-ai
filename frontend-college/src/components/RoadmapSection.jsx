import React, { useState } from 'react';
import { Map, ArrowRight, ExternalLink } from 'lucide-react';

const roleToRoadmapMap = {
  "Junior Software Developer": [
    { name: "Software Design Roadmap", url: "https://roadmap.sh/software-design" }
  ],
  "Frontend Developer (Junior)": [
    { name: "Frontend Roadmap", url: "https://roadmap.sh/frontend" }
  ],
  "Backend Developer (Junior)": [
    { name: "Backend Roadmap", url: "https://roadmap.sh/backend" }
  ],
  "QA / Test Engineer": [
    { name: "QA Roadmap", url: "https://roadmap.sh/qa" }
  ],
  "Data Analyst (Junior)": [
    { name: "Data Analyst Roadmap", url: "https://roadmap.sh/data-analyst" }
  ],
  "IT Support / Helpdesk Technician": [
    { name: "Linux Roadmap", url: "https://roadmap.sh/linux" }
  ],
  "Cybersecurity Analyst (Tier 1)": [
    { name: "Cyber Security Roadmap", url: "https://roadmap.sh/cyber-security" }
  ],
  "DevOps Engineer (Junior)": [
    { name: "DevOps Roadmap", url: "https://roadmap.sh/devops" }
  ],
  "Cloud Support Associate": [
    { name: "AWS Roadmap", url: "https://roadmap.sh/aws" },
    { name: "DevOps Roadmap", url: "https://roadmap.sh/devops" }
  ],
  "Business Intelligence (BI) Analyst": [
    { name: "Data Analyst Roadmap", url: "https://roadmap.sh/data-analyst" }
  ],
  "Web Developer (Junior)": [
    { name: "Frontend Roadmap", url: "https://roadmap.sh/frontend" },
    { name: "Backend Roadmap", url: "https://roadmap.sh/backend" },
    { name: "Full Stack Roadmap", url: "https://roadmap.sh/full-stack" }
  ],
  "App Developer (Junior)": [
    { name: "Android Roadmap", url: "https://roadmap.sh/android" },
    { name: "iOS Roadmap", url: "https://roadmap.sh/ios" },
    { name: "Flutter Roadmap", url: "https://roadmap.sh/flutter" },
    { name: "React Native Roadmap", url: "https://roadmap.sh/react-native" }
  ],
  "Generative AI Engineer (Junior)": [
    { name: "AI and Data Scientist Roadmap", url: "https://roadmap.sh/ai-data-scientist" },
    { name: "Prompt Engineering Roadmap", url: "https://roadmap.sh/prompt-engineering" }
  ]
};

export default function RoadmapSection({ jobRole }) {
  const [accepted, setAccepted] = useState(false);

  const roadmaps = roleToRoadmapMap[jobRole] || [
    { name: "Developer Roadmap", url: "https://roadmap.sh/" }
  ];

  if (!accepted) {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shrink-0">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Career Roadmap</h3>
            <p className="text-slate-600">Would you like to view a tailored learning roadmap for your role as a <span className="font-semibold text-indigo-700">{jobRole}</span>?</p>
          </div>
        </div>
        <button 
          onClick={() => setAccepted(true)}
          className="shrink-0 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          View Roadmap <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 transition-all duration-500 ease-in-out">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Map className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Your Recommended Roadmaps</h3>
          <p className="text-slate-500 text-gray-700">Based on your target role: {jobRole}</p>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {roadmaps.map((rm, idx) => (
          <a 
            key={idx}
            href={rm.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <Map className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <h4 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{rm.name}</h4>
          </a>
        ))}
      </div>
    </div>
  );
}
