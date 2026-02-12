import React from 'react';
import { pluginManager } from '../core/pluginManager';

const PluginDock = () => {
  const enabled = pluginManager.getEnabledPlugins();

  if (enabled.length === 0) {
    return null;
  }

  return (
    <section className="px-4 pb-4">
      <div className="max-w-md mx-auto space-y-3">
        <div className="text-xs text-gray-500 uppercase tracking-wider">Plugins</div>
        <div className="space-y-3">
          {enabled.map((plugin) => {
            const Widget = plugin.widget;
            if (!Widget) return null;
            return (
              <div key={plugin.id} className="border border-purple-light rounded-lg">
                <Widget />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PluginDock;
