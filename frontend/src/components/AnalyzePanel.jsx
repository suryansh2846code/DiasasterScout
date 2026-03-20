import React, { useState } from 'react';
import { Satellite } from 'lucide-react';

export default function AnalyzePanel({ onAnalyze, onDemo, loading, error }) {
  const [preUrl, setPreUrl] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');

  const handleAnalyze = () => {
    onAnalyze({ preImageUrl: preUrl, postImageUrl: postUrl, eventName, location });
  };

  const isFormValid = preUrl && postUrl && eventName && location;

  return (
    <div className="absolute inset-0 z-[1000] bg-[var(--sidebar-bg)] flex flex-col items-center justify-center p-6 bg-slate-900 overflow-y-auto">
      <div className="bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-xl w-full max-w-lg p-6 shadow-xl text-[var(--text-primary)]">
        <div className="flex items-center gap-3 mb-2">
          <Satellite className="w-6 h-6 text-[var(--accent)]" />
          <h2 className="text-xl font-semibold">New Analysis</h2>
        </div>
        <p className="text-[13px] text-[var(--text-secondary)] mb-6">
          Submit pre and post disaster image URLs for AI damage assessment
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
              Pre-disaster Image URL
            </label>
            <input
              type="url"
              placeholder="https://... (satellite image before disaster)"
              value={preUrl}
              onChange={(e) => setPreUrl(e.target.value)}
              className="w-full bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md px-3 py-2 text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
              Post-disaster Image URL
            </label>
            <input
              type="url"
              placeholder="https://... (satellite image after disaster)"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              className="w-full bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md px-3 py-2 text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
              Event Name
            </label>
            <input
              type="text"
              placeholder="e.g. 2024 Wayanad Landslide"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md px-3 py-2 text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Wayanad, Kerala, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-md px-3 py-2 text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !isFormValid}
            className="flex-1 bg-[#3B8BD4] text-white rounded-md py-2.5 px-4 text-[14px] font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              'Run Analysis'
            )}
          </button>

          <div className="flex-1 flex flex-col">
            <button
              onClick={onDemo}
              className="w-full bg-transparent border border-[var(--sidebar-border)] text-[var(--text-secondary)] rounded-md py-2.5 px-4 text-[14px] font-medium hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Load Demo Scenario
            </button>
            <span className="text-[10px] text-[var(--text-secondary)]/70 text-center mt-1">
              Uses 2023 Turkey earthquake data
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 border border-red-500/50 bg-red-500/10 rounded-md p-3">
            <p className="text-[13px] text-red-400 font-medium mb-1">{error}</p>
            <p className="text-[11px] text-red-400/80">Check image URLs are publicly accessible</p>
          </div>
        )}
      </div>
    </div>
  );
}
