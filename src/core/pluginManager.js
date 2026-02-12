import { pluginSystem } from './pluginSystem';

const STORAGE_KEY = 'routine-os-enabled-plugins';

class PluginManager {
  constructor() {
    this.registry = new Map();
    this.enabled = new Set(this.loadEnabled());
    this.listeners = [];
  }

  loadEnabled() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveEnabled() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this.enabled)));
    this.notify();
  }

  registerPlugin(plugin) {
    if (!plugin?.id) {
      console.warn('Plugin missing id');
      return;
    }

    if (this.registry.has(plugin.id)) return;
    this.registry.set(plugin.id, plugin);

    if (plugin.defaultEnabled && !this.enabled.has(plugin.id)) {
      this.enabled.add(plugin.id);
    }

    if (this.enabled.has(plugin.id)) {
      this.enable(plugin.id, true);
    }

    this.notify();
  }

  enable(id, silent = false) {
    const plugin = this.registry.get(id);
    if (!plugin) return;
    if (this.enabled.has(id)) return;

    this.enabled.add(id);
    if (plugin.hooks) {
      pluginSystem.registerPlugin(id, plugin);
    }
    plugin.init?.();

    if (!silent) this.saveEnabled();
  }

  disable(id, silent = false) {
    const plugin = this.registry.get(id);
    if (!plugin) return;
    if (!this.enabled.has(id)) return;

    this.enabled.delete(id);
    if (plugin.hooks) {
      pluginSystem.unregisterPlugin(id);
    }
    plugin.destroy?.();

    if (!silent) this.saveEnabled();
  }

  toggle(id) {
    if (this.enabled.has(id)) {
      this.disable(id);
    } else {
      this.enable(id);
    }
  }

  isEnabled(id) {
    return this.enabled.has(id);
  }

  getEnabledPlugins() {
    return this.getAllPlugins().filter((plugin) => this.enabled.has(plugin.id));
  }

  getAllPlugins() {
    return Array.from(this.registry.values());
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.getAllPlugins()));
  }
}

export const pluginManager = new PluginManager();
