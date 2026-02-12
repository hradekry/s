import { pluginSystem } from '../core/pluginSystem';

const examplePlugin = {
  name: 'Example Plugin',
  version: '1.0.0',
  description: 'An example plugin demonstrating the plugin system',
  
  hooks: {
    beforeEventAdd: async (eventData) => {
      // Add a timestamp to events before they're added
      console.log('Example plugin: Processing event before add', eventData);
      return eventData;
    },
    
    afterEventAdd: async (event) => {
      // Log after event is added
      console.log('Example plugin: Event added', event);
    },
    
    renderTimelineItem: async (itemData) => {
      // Could modify how timeline items are rendered
      return itemData;
    }
  },
  
  // Plugin initialization
  init: () => {
    console.log('Example plugin initialized');
  },
  
  // Plugin cleanup
  destroy: () => {
    console.log('Example plugin destroyed');
  }
};

export default examplePlugin;
