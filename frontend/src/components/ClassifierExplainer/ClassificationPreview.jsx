import React, { useState, useMemo } from 'react';
import {
  CATEGORY_BASE_SCORES,
  KEYWORD_RULES,
  classifyLocal
} from '../../utils/classifier';
import { PriorityBadge } from '../Common/PriorityBadge';
import {
  Cpu,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Zap
} from 'lucide-react';

export function ClassificationPreview() {
  const [testTitle, setTestTitle] = useState('Exposed power cable sparking near school crossing');
  const [testCategory, setTestCategory] = useState('damaged_streetlight');
  const [testDescription, setTestDescription] = useState(
    'Storm knocked over the post. Live electrical wire is dangling with sparks, and school kids pass by every morning.'
  );

  const evaluation = useMemo(() => {
    return classifyLocal({
      title: testTitle,
      description: testDescription,
      category: testCategory
    });
  }, [testTitle, testDescription, testCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-teal-600" />
              Transparent Heuristic Priority Engine
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              CivicFix AI utilizes an auditable, deterministic, rule-based algorithm rather than a black-box AI model. Priority scores (0–100) are computed dynamically using category risk baselines and life-safety keyword triggers.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-xl border border-teal-200">
            Open Algorithm
          </span>
        </div>
      </div>

      {/* Interactive Sandbox */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>Interactive Algorithm Sandbox (Test in Real-Time)</span>
          </div>
          <span className="text-[11px] text-slate-400">Type below to see score react</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={testCategory}
                onChange={(e) => setTestCategory(e.target.value)}
                className="w-full text-xs font-medium py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
              >
                {Object.keys(CATEGORY_BASE_SCORES).map((k) => (
                  <option key={k} value={k}>
                    {k.replace(/_/g, ' ')} (Base: {CATEGORY_BASE_SCORES[k]} pts)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Headline / Title
              </label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Description / Context
              </label>
              <textarea
                rows={3}
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Sandbox Evaluation Output */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-bold text-slate-300">Deterministic Output</span>
                <PriorityBadge
                  label={evaluation.priorityLabel}
                  score={evaluation.priorityScore}
                />
              </div>

              <div className="my-3 text-center">
                <div className="text-3xl font-black text-teal-400">
                  {evaluation.priorityScore}{' '}
                  <span className="text-sm text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="text-xs text-slate-300 font-semibold mt-1">
                  Tier: <span className="text-teal-300 font-bold">{evaluation.priorityLabel} Priority</span>
                </div>
              </div>

              <div className="space-y-1.5 mt-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Scoring Breakdown:
                </span>
                {evaluation.classificationReasons.map((r, idx) => (
                  <div key={idx} className="flex items-start text-xs text-slate-200">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/80 text-[10px] text-slate-400 leading-tight">
              Formula: <code className="text-teal-300">BaseScore + Σ(SafetyHazardPoints) - MitigatingPoints</code> (Clamped 10–100)
            </div>
          </div>
        </div>
      </div>

      {/* Rules Reference Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Baselines */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-1.5 text-teal-600" />
            1. Department Category Base Weights
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {Object.entries(CATEGORY_BASE_SCORES).map(([cat, score]) => (
              <div key={cat} className="py-2.5 flex items-center justify-between">
                <span className="font-semibold text-slate-800 capitalize">
                  {cat.replace(/_/g, ' ')}
                </span>
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {score} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Tiers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
            <ShieldAlert className="w-4 h-4 mr-1.5 text-teal-600" />
            2. Resolution Priority Tiers
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
              <div className="flex justify-between font-bold">
                <span>Critical Priority (85 – 100)</span>
                <span>Immediate 4-12h Response</span>
              </div>
              <p className="text-[11px] text-rose-700 mt-1">
                Life-safety hazards: exposed live wires, cave-ins, open manholes on arterial routes.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900">
              <div className="flex justify-between font-bold">
                <span>High Priority (65 – 84)</span>
                <span>Prompt 24-48h Response</span>
              </div>
              <p className="text-[11px] text-orange-700 mt-1">
                Traffic corridors, school zones, major water line bursts, dark pedestrian thoroughfares.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              <div className="flex justify-between font-bold">
                <span>Medium Priority (40 – 64)</span>
                <span>3 - 5 Days Standard SLA</span>
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                Non-arterial road wear, sidewalk curb cracks, slow dripping valves.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="flex justify-between font-bold">
                <span>Low Priority (0 – 39)</span>
                <span>7 - 14 Days Routine Schedule</span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                Cosmetic graffiti, side alley minor litter, superficial paint fade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
