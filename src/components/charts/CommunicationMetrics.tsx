import { useState } from 'react';
import { MessageCircle, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface Phrase {
  text: string;
  context: string;
}

interface CommunicationMetricsProps {
  empathyScore: number;
  inclusivePhrases: Phrase[] | number;
  egoCentricPhrases: Phrase[] | number;
  authenticityScore: number;
}

export default function CommunicationMetrics({
  empathyScore,
  inclusivePhrases,
  egoCentricPhrases,
  authenticityScore
}: CommunicationMetricsProps) {
  // State for collapsible sections
  const [showInclusivePhrases, setShowInclusivePhrases] = useState(false);
  const [showEgoCentricPhrases, setShowEgoCentricPhrases] = useState(false);

  // Handle both old format (number) and new format (array)
  const inclusivePhrasesArray = Array.isArray(inclusivePhrases) ? inclusivePhrases : [];
  const egoCentricPhrasesArray = Array.isArray(egoCentricPhrases) ? egoCentricPhrases : [];

  const inclusiveCount = Array.isArray(inclusivePhrases) ? inclusivePhrases.length : inclusivePhrases;
  const egoCentricCount = Array.isArray(egoCentricPhrases) ? egoCentricPhrases.length : egoCentricPhrases;

  const totalPhrases = inclusiveCount + egoCentricCount;
  const inclusiveRatio = totalPhrases > 0 ? (inclusiveCount / totalPhrases) * 100 : 50;

  const getScoreColor = (score: number, max: number = 100) => {
    const normalized = (score / max) * 100;
    if (normalized >= 70) return 'bg-green-500';
    if (normalized >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Empathy Score */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Empathy Score</span>
          <span className="text-lg font-bold text-gray-900">{empathyScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${getScoreColor(empathyScore)}`}
            style={{ width: `${empathyScore}%` }}
          ></div>
        </div>
      </div>

      {/* Inclusive vs Ego-Centric */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Communication Style</span>
          <div className="text-xs text-gray-600">
            <span className="text-green-600 font-medium">{inclusiveCount}</span> inclusive /
            <span className="text-red-600 font-medium ml-1">{egoCentricCount}</span> ego-centric
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
          <div
            className="bg-green-500 h-3"
            style={{ width: `${inclusiveRatio}%` }}
          ></div>
          <div
            className="bg-red-500 h-3"
            style={{ width: `${100 - inclusiveRatio}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Inclusive</span>
          <span>Ego-Centric</span>
        </div>
      </div>

      {/* Authenticity Score */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Authenticity</span>
          <span className="text-lg font-bold text-gray-900">{Math.round(authenticityScore * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${getScoreColor(authenticityScore * 100)}`}
            style={{ width: `${authenticityScore * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Collapsible Phrases Section */}
      <div className="pt-4 border-t border-gray-200 space-y-3">
        {/* Summary Count Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Inclusive Phrases Card */}
          <button
            onClick={() => inclusivePhrasesArray.length > 0 && setShowInclusivePhrases(!showInclusivePhrases)}
            disabled={inclusivePhrasesArray.length === 0}
            className={`text-center p-3 bg-green-50 rounded-lg border border-green-200 transition-all ${
              inclusivePhrasesArray.length > 0
                ? 'hover:bg-green-100 cursor-pointer hover:shadow-md'
                : 'cursor-default'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              <div className="text-2xl font-bold text-green-700">{inclusiveCount}</div>
              {inclusivePhrasesArray.length > 0 && (
                showInclusivePhrases ?
                  <ChevronUp className="w-4 h-4 text-green-600" /> :
                  <ChevronDown className="w-4 h-4 text-green-600" />
              )}
            </div>
            <div className="text-xs text-green-600 mt-1">
              Inclusive Phrases
              {inclusivePhrasesArray.length > 0 && (
                <span className="block text-[10px] text-green-500 mt-0.5">
                  Click to {showInclusivePhrases ? 'hide' : 'view'} details
                </span>
              )}
            </div>
          </button>

          {/* Ego-Centric Phrases Card */}
          <button
            onClick={() => egoCentricPhrasesArray.length > 0 && setShowEgoCentricPhrases(!showEgoCentricPhrases)}
            disabled={egoCentricPhrasesArray.length === 0}
            className={`text-center p-3 bg-red-50 rounded-lg border border-red-200 transition-all ${
              egoCentricPhrasesArray.length > 0
                ? 'hover:bg-red-100 cursor-pointer hover:shadow-md'
                : 'cursor-default'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4 text-red-600" />
              <div className="text-2xl font-bold text-red-700">{egoCentricCount}</div>
              {egoCentricPhrasesArray.length > 0 && (
                showEgoCentricPhrases ?
                  <ChevronUp className="w-4 h-4 text-red-600" /> :
                  <ChevronDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="text-xs text-red-600 mt-1">
              Ego-Centric Phrases
              {egoCentricPhrasesArray.length > 0 && (
                <span className="block text-[10px] text-red-500 mt-0.5">
                  Click to {showEgoCentricPhrases ? 'hide' : 'view'} details
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Expandable Inclusive Phrases Details */}
        {showInclusivePhrases && inclusivePhrasesArray.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Inclusive Phrases Details</h4>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {inclusivePhrasesArray.map((phrase, index) => (
                <div key={index} className="bg-white rounded p-3 border border-green-100 shadow-sm">
                  <p className="text-sm font-medium text-green-800 mb-1">"{phrase.text}"</p>
                  {phrase.context && (
                    <p className="text-xs text-gray-600 italic">{phrase.context}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Ego-Centric Phrases Details */}
        {showEgoCentricPhrases && egoCentricPhrasesArray.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200 animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-900">Ego-Centric Phrases Details</h4>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {egoCentricPhrasesArray.map((phrase, index) => (
                <div key={index} className="bg-white rounded p-3 border border-red-100 shadow-sm">
                  <p className="text-sm font-medium text-red-800 mb-1">"{phrase.text}"</p>
                  {phrase.context && (
                    <p className="text-xs text-gray-600 italic">{phrase.context}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
