class PluginSystem {
  constructor() {
    this.plugins = new Map();
    this.hooks = {
      beforeEventAdd: [],
      afterEventAdd: [],
      beforeEventRemove: [],
      afterEventRemove: [],
      renderTimelineItem: [],
      renderHeader: []
    };
  }

  registerPlugin(name, plugin) {
    if (this.plugins.has(name)) {
      console.warn(`Plugin ${name} is already registered`);
      return false;
    }

    // Register plugin hooks
    if (plugin.hooks) {
      Object.entries(plugin.hooks).forEach(([hookName, callback]) => {
        if (this.hooks[hookName]) {
          this.hooks[hookName].push(callback);
        }
      });
    }

    this.plugins.set(name, plugin);
    console.log(`Plugin ${name} registered successfully`);
    return true;
  }

  unregisterPlugin(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) return false;

    // Remove plugin hooks
    if (plugin.hooks) {
      Object.keys(plugin.hooks).forEach(hookName => {
        if (this.hooks[hookName]) {
          this.hooks[hookName] = this.hooks[hookName].filter(
            callback => callback !== plugin.hooks[hookName]
          );
        }
      });
    }

    this.plugins.delete(name);
    console.log(`Plugin ${name} unregistered`);
    return true;
  }

  async executeHook(hookName, data) {
    if (!this.hooks[hookName]) return data;

    let result = data;
    for (const callback of this.hooks[hookName]) {
      try {
        result = await callback(result);
      } catch (error) {
        console.error(`Error in hook ${hookName}:`, error);
      }
    }
    return result;
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }

  getAllPlugins() {
    return Array.from(this.plugins.entries());
  }
}

export const pluginSystem = new PluginSystem();
