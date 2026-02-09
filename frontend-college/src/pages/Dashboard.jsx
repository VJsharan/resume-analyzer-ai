import { useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import { skillData, gaps, roadmap } from "../data/mockData";

export default function Dashboard() {
  const [resume, setResume] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <>
      {!analyzed && (
        <ResumeUpload
          resume={resume}
          setResume={setResume}
          onAnalyze={() => setAnalyzed(true)}
        />
      )}

      {analyzed && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

          {/* Skills */}
          <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Extracted Skills</h3>
            {skillData.map((s) => (
              <p key={s}>• {s}</p>
            ))}
          </div>

          {/* Skill Gaps */}
          <div className="bg-gradient-to-br from-rose-400 to-red-600 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Skill Gaps</h3>
            {gaps.map((g) => (
              <p key={g}>• {g}</p>
            ))}
          </div>

          {/* Roadmap */}
          <div className="md:col-span-2 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              Learning Roadmap
            </h3>

            <div className="grid md:grid-cols-4 gap-4">
              {roadmap.map((r) => (
                <div
                  key={r.week}
                  className="bg-white text-gray-800 rounded-xl p-4 shadow-md"
                >
                  <h4 className="font-bold">{r.week}</h4>
                  <p className="text-sm text-gray-600">{r.task}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </>
  );
}
