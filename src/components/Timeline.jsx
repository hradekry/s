import React from 'react';
import TimelineItem from './TimelineItem';
import { Clock } from 'lucide-react';
import { eventStore } from '../core/eventStore';

const Timeline = ({ events, onRemoveEvent, onCompleteEvent, onSkipEvent, currentDate }) => {
  const sortedEvents = [...events].sort((a, b) => {
    const statusA = eventStore.getEventStatus(a.id, currentDate);
    const statusB = eventStore.getEventStatus(b.id, currentDate);
    const order = { pending: 0, skipped: 1, completed: 2 };
    if (order[statusA] !== order[statusB]) return order[statusA] - order[statusB];
    if (a.type === 'recurring' && b.type !== 'recurring') return -1;
    if (a.type !== 'recurring' && b.type === 'recurring') return 1;
    return (a.time || '').localeCompare(b.time || '');
  });

  if (events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <Clock size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-lg font-medium text-gray-300 mb-2">No events yet</h2>
          <p className="text-sm text-gray-500">
            Tap the + button to add your first event or task
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="max-w-md mx-auto">
        {sortedEvents.map((event) => (
          <TimelineItem
            key={event.id}
            event={event}
            status={eventStore.getEventStatus(event.id, currentDate)}
            onRemove={onRemoveEvent}
            onComplete={onCompleteEvent}
            onSkip={onSkipEvent}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
