import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'routine-os-hydration';

const loadHydration = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { targetMl: 2000, consumedMl: 0 };
};

const saveHydration = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const HydrationWidget = () => {
  const [data, setData] = useState(loadHydration());

  useEffect(() => {
    saveHydration(data);
  }, [data]);

  const percent = Math.min(100, Math.round((data.consumedMl / data.targetMl) * 100));

  const add = (amount) => {
    setData((prev) => ({
      ...prev,
      consumedMl: Math.min(prev.targetMl, prev.consumedMl + amount)
    }));
  };

  const reset = () => {
    setData((prev) => ({ ...prev, consumedMl: 0 }));
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white">Hydration</h3>
        <span className="text-xs text-purple-300">{percent}%</span>
      </div>
      <div className="w-full h-1 bg-deep-black rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-purple-500 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <span>{data.consumedMl}ml</span>
        <span>Target {data.targetMl}ml</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => add(250)}
          className="touch-target px-3 py-1.5 text-xs bg-deep-black border border-purple-light text-purple-300 rounded-lg hover:bg-gray-900 transition-colors"
        >
          +250ml
        </button>
        <button
          onClick={() => add(500)}
          className="touch-target px-3 py-1.5 text-xs bg-deep-black border border-purple-light text-purple-300 rounded-lg hover:bg-gray-900 transition-colors"
        >
          +500ml
        </button>
        <button
          onClick={reset}
          className="touch-target px-3 py-1.5 text-xs bg-deep-black border border-purple-light text-gray-400 rounded-lg hover:bg-gray-900 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const hydrationPlugin = {
  id: 'hydration',
  name: 'Hydration',
  description: 'Quick water intake tracker',
  defaultEnabled: false,
  widget: HydrationWidget
};

export default hydrationPlugin;
