import React from 'react';
import { Calendar, Menu } from 'lucide-react';

const Header = ({ currentDate, onOpenSettings }) => {
  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <header className="bg-charcoal border-b border-purple-light sticky top-0 z-30">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              className="touch-target text-purple-400 hover:text-purple-300 transition-colors"
              onClick={onOpenSettings}
              aria-label="Open settings"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {isToday(currentDate) ? 'Today' : formatDate(currentDate)}
              </h1>
              {isToday(currentDate) && (
                <p className="text-sm text-gray-400">{formatDate(currentDate)}</p>
              )}
            </div>
          </div>
          
          <button className="touch-target text-purple-400 hover:text-purple-300 transition-colors">
            <Calendar size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
