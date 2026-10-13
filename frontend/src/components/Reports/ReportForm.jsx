import React, { useState, useMemo } from 'react';
import { useReports } from '../../context/ReportsContext';
import { classifyLocal } from '../../utils/classifier';
import { PriorityBadge } from '../Common/PriorityBadge';
import {
  Send,
  Upload,
  X,
  Sparkles,
  ShieldAlert,
  MapPin,
  Tag,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'pothole', label: 'Pothole (Roadway Crater / Cavity)' },
  { value: 'garbage', label: 'Garbage Overflow / Waste Dumping' },
  { value: 'water_leakage', label: 'Water Leakage / Pipe Burst' },
  { value: 'damaged_streetlight', label: 'Damaged Streetlight / Exposed Wiring' },
  { value: 'drainage', label: 'Drainage / Sewage Clog / Manhole' },
  { value: 'road_damage', label: 'Road / Sidewalk Damage' },
  { value: 'other', label: 'Other Civic Infrastructure Issue' }
];

const PRESET_LOCATIONS = [
  'Grand Avenue & 5th Crossing, Downtown',
  'Oakridge Blvd (St. Jude School Zone)',
  'Highway 101 Southbound Exit Ramp',
  'Sunset Recreation Park & 14th Ave',
  'Meadowbrook Plaza Metro Station Gate 2'
];

const TEST_KEYWORDS = [
  { label: '⚡ Exposed Live Wire', text: 'There is an exposed live wire hanging down sparking near the sidewalk.' },
  { label: '🕳️ Open Manhole', text: 'Missing manhole cover on busy intersection causing severe vehicle fall hazard.' },
  { label: '🌊 Flooding Pipe Burst', text: 'Drinking water main pipe burst causing knee-deep flooding across 2 blocks.' },
  { label: '🏫 School Zone Hazard', text: 'Faded crosswalk markings outside elementary school where cars are speeding.' }
];

export function ReportForm({ onReportCreated }) {
  const { submitReport, setSelectedReport } = useReports();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('pothole');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Real-time interactive heuristic classification
  const liveClassification = useMemo(() => {
    return classifyLocal({
      title,
      description,
      category,
      location
    });
  }, [title, description, category, location]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Please upload an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!title.trim() || title.trim().length < 4) {
      errs.title = 'Title must be at least 4 characters.';
    }
    if (!description.trim() || description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters so our classifier can triage effectively.';
    }
    if (!location.trim() || location.trim().length < 3) {
      errs.location = 'Please specify a street address, crossing, or landmark.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newReport = await submitReport({
        title,
        category,
        description,
        location,
        reporterName: reporterName.trim() || 'Anonymous Resident',
        imagePreview
      });

      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setReporterName('');
      setImagePreview(null);
      setErrors({});

      if (onReportCreated) {
        onReportCreated(newReport);
      }
    } catch {
      // Error handled by context toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyKeywordTemplate = (text) => {
    setDescription((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Report a Civic Issue
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Submit potholes, street hazards, sanitation issues, or water leaks. Our transparent heuristic engine assigns an instant priority score based on safety criteria.
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-teal-50 text-teal-800 rounded-xl border border-teal-200 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Instant Triage</span>
          </div>
        </div>

        {/* Quick Test Hazard Presets */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Try Demo Hazard Keywords (Click to test rule engine):
          </span>
          <div className="flex flex-wrap gap-2">
            {TEST_KEYWORDS.map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyKeywordTemplate(kw.text)}
                className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center font-medium"
              >
                <span>{kw.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form (2 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Deep pothole expanding after heavy rain"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-teal-500'
              } focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 transition-all`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Issue Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 bg-white transition-all"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {description.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Describe the severity, depth, proximity to pedestrians or traffic, and any active danger (e.g. exposed live wire, flooding)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-teal-500'
              } focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 transition-all leading-relaxed`}
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Location or Landmark <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. 5th Crossing & Grand Ave or near St. Jude Elementary"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.location ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-teal-500'
                } focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 transition-all`}
              />
            </div>
            {errors.location && <p className="text-xs text-rose-500 mt-1">{errors.location}</p>}

            {/* Quick Location Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 mr-1 self-center">Presets:</span>
              {PRESET_LOCATIONS.map((loc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md transition-colors"
                >
                  {loc.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Reporter Name & Image Upload Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reporter Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins (or leave blank)"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Attach Photo Preview (Optional)
              </label>
              <label className="flex items-center justify-center px-4 py-2.5 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-xs text-slate-600">
                <Upload className="w-4 h-4 mr-1.5 text-slate-400" />
                <span>{imagePreview ? 'Replace Image' : 'Choose local image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Image Preview Container */}
          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48 w-full bg-slate-50 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Civic issue preview"
                className="max-h-48 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 bg-slate-900/70 text-white rounded-full hover:bg-slate-900 transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold rounded-xl shadow-md shadow-teal-500/25 flex items-center justify-center transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Classifying and submitting report...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  <span>Submit Civic Issue Report</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Live Assessment Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <ShieldAlert className="w-4 h-4 mr-1.5 text-teal-600" />
                Live Heuristic Assessment
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                Transparent
              </span>
            </div>

            {/* Score & Badge Display */}
            <div className="py-4 text-center bg-slate-50/70 rounded-xl my-3 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                Estimated Priority
              </span>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl font-black text-slate-900">
                  {liveClassification.priorityScore}
                </span>
                <span className="text-sm text-slate-400 font-bold">/ 100</span>
              </div>
              <div className="mt-2 flex justify-center">
                <PriorityBadge
                  label={liveClassification.priorityLabel}
                  score={liveClassification.priorityScore}
                  showScore={false}
                />
              </div>
            </div>

            {/* Breakdown of detected reasons */}
            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Assessment Rationale:
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {liveClassification.classificationReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-teal-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="mt-5 p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
              <div className="flex items-center font-bold mb-0.5 text-blue-900">
                <Info className="w-3.5 h-3.5 mr-1 text-blue-600 shrink-0" />
                <span>Deterministic Heuristics</span>
              </div>
              Priority is derived deterministically from category baseline weights and safety hazard patterns.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
