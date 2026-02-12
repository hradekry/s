import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { pluginManager } from '../core/pluginManager';
import { coachService } from '../core/coachService';

const INTENSITY_LEVELS = [
  { id: 'spartan', label: 'Spartan' },
  { id: 'warrior', label: 'Warrior' },
  { id: 'human', label: 'Human' }
];

const SettingsPanel = ({ onClose }) => {
  const [plugins, setPlugins] = useState(pluginManager.getAllPlugins());
  const [intensity, setIntensity] = useState(coachService.getIntensity());

  useEffect(() => {
    const unsubscribe = pluginManager.subscribe((updated) => {
      setPlugins(updated);
    });
    return unsubscribe;
  }, []);

  const handleToggle = (id) => {
    pluginManager.toggle(id);
    setPlugins(pluginManager.getAllPlugins());
  };

  const handleIntensity = (level) => {
    setIntensity(level);
    coachService.setIntensity(level);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50">
      <div className="bg-charcoal border-t border-purple-light w-full max-w-md rounded-t-xl max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-purple-light/30 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="touch-target text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <section className="card">
            <h3 className="text-sm font-semibold text-white mb-3">Coach Intensity</h3>
            <div className="grid grid-cols-3 gap-2">
              {INTENSITY_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleIntensity(level.id)}
                  className={`touch-target px-3 py-2 text-xs rounded-lg border transition-colors ${
                    intensity === level.id
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-deep-black border-purple-light text-gray-300 hover:border-purple-400'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Plugins</h3>
              <span className="text-xs text-gray-500">Toggle features</span>
            </div>
            <div className="space-y-3">
              {plugins.length === 0 && (
                <p className="text-xs text-gray-500">No plugins registered.</p>
              )}
              {plugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex items-center justify-between border-b border-purple-light/20 pb-2"
                >
                  <div>
                    <p className="text-sm text-white">{plugin.name}</p>
                    <p className="text-xs text-gray-500">{plugin.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(plugin.id)}
                    className={`touch-target px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      pluginManager.isEnabled(plugin.id)
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-deep-black border-purple-light text-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {pluginManager.isEnabled(plugin.id) ? 'On' : 'Off'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
