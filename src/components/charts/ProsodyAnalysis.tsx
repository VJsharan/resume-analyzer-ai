import { Activity, Volume2, Mic } from 'lucide-react';

interface ProsodyAnalysisProps {
  prosodyData?: {
    overall_metrics: {
      avg_pitch_hz: number;
      pitch_variability: number;
      avg_energy: number;
      pitch_range_hz: number;
      energy_dynamics: number;
    };
    vocal_emotions: {
      dominant_emotion: string;
      emotion_distribution: Record<string, number>;
    };
    features_extracted: number;
  };
}

export default function ProsodyAnalysis({ prosodyData }: ProsodyAnalysisProps) {
  // Safety checks for data integrity
  if (!prosodyData || !prosodyData.overall_metrics || !prosodyData.vocal_emotions) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        <Mic className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>Voice prosody analysis not available</p>
      </div>
    );
  }

  const { overall_metrics, vocal_emotions } = prosodyData;

  // Additional safety checks for nested data
  if (!overall_metrics || !vocal_emotions || !vocal_emotions.emotion_distribution) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        <Mic className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>Voice prosody data is incomplete</p>
      </div>
    );
  }

  const getPitchLevel = (pitch: number) => {
    if (pitch > 180) return { label: 'High', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (pitch < 130) return { label: 'Low', color: 'text-purple-600', bg: 'bg-purple-100' };
    return { label: 'Moderate', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getEnergyLevel = (energy: number) => {
    if (energy > 0.7) return { label: 'Strong', color: 'text-red-600', bg: 'bg-red-100' };
    if (energy < 0.4) return { label: 'Soft', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { label: 'Balanced', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const pitchLevel = getPitchLevel(overall_metrics.avg_pitch_hz);
  const energyLevel = getEnergyLevel(overall_metrics.avg_energy);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Volume2 className="w-6 h-6 text-indigo-600" />
        <h3 className="text-xl font-semibold text-gray-900">Voice Tone Analysis</h3>
        <span className="text-sm text-gray-500 ml-auto">
          {prosodyData.features_extracted} features analyzed
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pitch */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Pitch</span>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {overall_metrics.avg_pitch_hz.toFixed(0)} Hz
          </div>
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${pitchLevel.bg} ${pitchLevel.color}`}>
            {pitchLevel.label}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Range: {overall_metrics.pitch_range_hz.toFixed(0)} Hz
          </div>
        </div>

        {/* Energy */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Energy</span>
            <Volume2 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(overall_metrics.avg_energy * 100).toFixed(0)}%
          </div>
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${energyLevel.bg} ${energyLevel.color}`}>
            {energyLevel.label}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Dynamics: {(overall_metrics.energy_dynamics * 100).toFixed(0)}%
          </div>
        </div>

        {/* Vocal Emotion */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Vocal Emotion</span>
            <Mic className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 capitalize">
            {vocal_emotions.dominant_emotion}
          </div>
          <div className="text-sm text-indigo-600 mt-2 font-medium">
            From voice tone
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Variability: {overall_metrics.pitch_variability.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Emotion Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Vocal Emotion Distribution</h4>
        <div className="space-y-3">
          {Object.entries(vocal_emotions.emotion_distribution)
            .sort(([, a], [, b]) => b - a)
            .map(([emotion, value]) => (
              <div key={emotion}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-700 font-medium">{emotion}</span>
                  <span className="text-gray-600">{(value * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-indigo-900 mb-2">Interpretation</h4>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li><strong>High pitch + high energy:</strong> Excitement, passion, or urgency</li>
          <li><strong>Stable pitch + moderate energy:</strong> Confidence and composure</li>
          <li><strong>High variability:</strong> Emphatic, passionate delivery</li>
          <li><strong>Low variability:</strong> Calm, measured communication</li>
        </ul>
      </div>
    </div>
  );
}
