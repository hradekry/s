import React, { useState } from 'react';
import { X, Repeat, Calendar } from 'lucide-react';

const AddEventModal = ({ onClose, onAddEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    type: 'onetime' // 'onetime' or 'recurring'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const eventData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      time: formData.time,
      type: formData.type,
      ...(formData.type === 'onetime' && { date: new Date().toISOString() })
    };

    onAddEvent(eventData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-charcoal border-t border-purple-light w-full max-w-md rounded-t-xl animate-slide-up">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Add New Item</h2>
            <button
              onClick={onClose}
              className="touch-target text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-deep-black border border-purple-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter title"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 bg-deep-black border border-purple-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Add description (optional)"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-3 py-2 bg-deep-black border border-purple-light rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'onetime')}
                  className={`touch-target flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    formData.type === 'onetime'
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-deep-black border-purple-light text-gray-300 hover:border-purple-400'
                  }`}
                >
                  <Calendar size={16} />
                  <span>One-time</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'recurring')}
                  className={`touch-target flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    formData.type === 'recurring'
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-deep-black border-purple-light text-gray-300 hover:border-purple-400'
                  }`}
                >
                  <Repeat size={16} />
                  <span>Daily</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 touch-target px-4 py-2 bg-deep-black border border-purple-light text-gray-300 rounded-lg hover:bg-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim()}
                className="flex-1 touch-target px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
