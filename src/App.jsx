import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import AddEventModal from './components/AddEventModal';
import MoodTracker from './components/MoodTracker';
import DailyFeedback from './components/DailyFeedback';
import CoachChat from './components/CoachChat';
import SettingsPanel from './components/SettingsPanel';
import PluginDock from './components/PluginDock';
import { eventStore } from './core/eventStore';
import { Plus, Sword, Heart } from 'lucide-react';

function App() {
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCoachChat, setShowCoachChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMood, setCurrentMood] = useState(null);

  useEffect(() => {
    setEvents(eventStore.getEventsForDate(currentDate));
    setCurrentMood(eventStore.getMood(currentDate));
    
    const unsubscribe = eventStore.subscribe(() => {
      setEvents(eventStore.getEventsForDate(currentDate));
      setCurrentMood(eventStore.getMood(currentDate));
    });

    return unsubscribe;
  }, [currentDate]);

  const handleAddEvent = (eventData) => {
    eventStore.addEvent(eventData);
    setShowAddModal(false);
  };

  const handleRemoveEvent = (eventId) => {
    eventStore.removeEvent(eventId);
  };

  const handleCompleteEvent = (eventId) => {
    eventStore.completeEvent(eventId, currentDate);
  };

  const handleSkipEvent = (eventId) => {
    eventStore.skipEvent(eventId, currentDate);
  };

  const handleLogMood = (mood, note) => {
    eventStore.logMood(currentDate, mood, note);
    setShowMoodTracker(false);
  };

  const stats = eventStore.getDailyStats(currentDate);

  return (
    <div className="min-h-screen bg-deep-black flex flex-col">
      <Header
        currentDate={currentDate}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Stats Bar */}
      {events.length > 0 && (
        <div className="bg-charcoal border-b border-purple-light/30 px-4 py-2">
          <div className="max-w-md mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <span className="text-gray-500">
                {stats.completed}/{stats.total} done
              </span>
              <div className="w-24 h-1 bg-deep-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <span className="text-purple-400 font-medium">{stats.completionRate}%</span>
            </div>
            {currentMood && (
              <span className="text-gray-500">
                Mood: {currentMood.mood}
              </span>
            )}
          </div>
        </div>
      )}
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <Timeline 
            events={events} 
            onRemoveEvent={handleRemoveEvent}
            onCompleteEvent={handleCompleteEvent}
            onSkipEvent={handleSkipEvent}
            currentDate={currentDate}
          />
          <PluginDock />
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3 z-40">
        <button
          onClick={() => setShowMoodTracker(true)}
          className="touch-target w-12 h-12 bg-charcoal border border-purple-light text-purple-400 hover:text-purple-300 rounded-full transition-colors"
          aria-label="Log mood"
        >
          <Heart size={18} />
        </button>
        <button
          onClick={() => setShowCoachChat(true)}
          className="touch-target w-12 h-12 bg-charcoal border border-purple-light text-purple-400 hover:text-purple-300 rounded-full transition-colors"
          aria-label="Talk to The Spartan"
        >
          <Sword size={18} />
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="touch-target w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors"
          aria-label="Add new event or task"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Daily Feedback Trigger — top left after skips */}
      {stats.skipped > 0 && !showFeedback && (
        <button
          onClick={() => setShowFeedback(true)}
          className="fixed top-20 left-4 z-40 flex items-center space-x-2 px-3 py-2 bg-red-900/30 border border-red-800/50 rounded-lg animate-pulse"
        >
          <Sword size={14} className="text-red-400" />
          <span className="text-xs text-red-300 font-medium">The Spartan has words for you</span>
        </button>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAddEvent={handleAddEvent}
        />
      )}

      {showMoodTracker && (
        <MoodTracker
          onClose={() => setShowMoodTracker(false)}
          onLogMood={handleLogMood}
          currentMood={currentMood}
        />
      )}

      {showFeedback && (
        <DailyFeedback
          currentDate={currentDate}
          onClose={() => setShowFeedback(false)}
        />
      )}

      {showCoachChat && (
        <CoachChat
          currentDate={currentDate}
          onClose={() => setShowCoachChat(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

export default App;
