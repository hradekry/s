import React from 'react';
import { Trash2, Repeat, Calendar } from 'lucide-react';

const TimelineItem = ({ event, onRemove }) => {
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

  return (
    <div className="timeline-item mb-4">
      <div className="card">
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
          </div>
          
          <button
            onClick={handleRemove}
            className="touch-target text-gray-500 hover:text-red-400 transition-colors"
            aria-label="Remove event"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <h3 className="text-white font-medium mb-1">{event.title}</h3>
        {event.description && (
          <p className="text-sm text-gray-400">{event.description}</p>
        )}
        
        {event.type === 'recurring' && (
          <div className="mt-2">
            <span className="inline-block text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded">
              Daily
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
