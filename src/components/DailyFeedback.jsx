import React, { useState, useEffect } from 'react';
import { coachService } from '../core/coachService';
import { Sword, AlertTriangle, Flame, Clock, X, Loader } from 'lucide-react';

const typeConfig = {
  feedback: { icon: Sword, accent: 'border-purple-500', label: 'The Spartan' },
  penalty: { icon: AlertTriangle, accent: 'border-red-500', label: 'Penalty' },
  stoic: { icon: Flame, accent: 'border-orange-500', label: 'Stoic Fire' },
  reminder: { icon: Clock, accent: 'border-yellow-500', label: 'Reminder' },
};

const DailyFeedback = ({ currentDate, onClose }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const result = await coachService.getDailyFeedback(currentDate);
        setFeedback(result);
      } catch (e) {
        setFeedback([{
          role: 'coach',
          content: 'Failed to load feedback. Even the system is testing you. Generate your own accountability.',
          type: 'feedback'
        }]);
      }
      setLoading(false);
    };
    loadFeedback();
  }, [currentDate]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50">
      <div className="bg-charcoal border-t sm:border border-purple-light w-full max-w-md sm:rounded-xl rounded-t-xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-purple-light/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Sword size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Daily Debrief</h2>
          </div>
          <button
            onClick={onClose}
            className="touch-target text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size={24} className="text-purple-400 animate-spin" />
              <span className="ml-2 text-gray-400">The Spartan is reviewing your day...</span>
            </div>
          ) : (
            feedback.map((msg, i) => {
              const config = typeConfig[msg.type] || typeConfig.feedback;
              const Icon = config.icon;
              return (
                <div
                  key={i}
                  className={`bg-deep-black border-l-2 ${config.accent} rounded-r-lg p-4`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon size={14} className="text-purple-400" />
                    <span className="text-xs font-medium text-purple-300 uppercase tracking-wide">
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">{msg.content}</p>
                  {msg.penalty && (
                    <div className="mt-3 p-2 bg-red-900/20 border border-red-800/40 rounded">
                      <span className="text-xs text-red-300 font-medium">
                        {msg.penalty.duration} — Intensity: {msg.penalty.intensity}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-purple-light/30 shrink-0">
          <button
            onClick={onClose}
            className="w-full touch-target px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Acknowledged
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyFeedback;
