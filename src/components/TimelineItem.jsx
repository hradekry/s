import React from 'react';
import { Trash2, Repeat, Calendar, Check, SkipForward } from 'lucide-react';

const STATUS_STYLES = {
  pending: '',
  completed: 'opacity-60',
  skipped: 'opacity-40',
};

const TimelineItem = ({ event, onRemove, onComplete, onSkip, status = 'pending' }) => {
  const handleRemove = () => {
    onRemove(event.id);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const borderClass = status === 'completed'
    ? 'border-green-600/50'
    : status === 'skipped'
    ? 'border-red-600/50'
    : 'border-purple-light';

  return (
    <div className={`timeline-item mb-4 ${STATUS_STYLES[status]}`}>
      <div className={`bg-charcoal border ${borderClass} rounded-lg p-4`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {event.type === 'recurring' ? (
              <Repeat size={16} className="text-purple-400" />
            ) : (
              <Calendar size={16} className="text-purple-400" />
            )}
            {event.time && (
              <span className="text-sm font-medium text-purple-300">
                {formatTime(event.time)}
              </span>
            )}
            {status === 'completed' && (
              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">Done</span>
            )}
            {status === 'skipped' && (
              <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">Skipped</span>
            )}
          </div>
          
          <button
            onClick={handleRemove}
            className="touch-target text-gray-500 hover:text-red-400 transition-colors"
            aria-label="Remove event"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <h3 className={`font-medium mb-1 ${status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
          {event.title}
        </h3>
        {event.description && (
          <p className="text-sm text-gray-400">{event.description}</p>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div>
            {event.type === 'recurring' && (
              <span className="inline-block text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded">
                Daily
              </span>
            )}
          </div>
          
          {status === 'pending' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSkip(event.id)}
                className="touch-target flex items-center space-x-1 px-3 py-1.5 text-xs bg-deep-black border border-red-800/50 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors"
              >
                <SkipForward size={12} />
                <span>Skip</span>
              </button>
              <button
                onClick={() => onComplete(event.id)}
                className="touch-target flex items-center space-x-1 px-3 py-1.5 text-xs bg-deep-black border border-green-800/50 text-green-400 rounded-lg hover:bg-green-900/20 transition-colors"
              >
                <Check size={12} />
                <span>Done</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
