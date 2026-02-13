class EventStore {
  constructor() {
    this.events = this.loadEvents();
    this.completionLog = this.loadCompletionLog();
    this.moodLog = this.loadMoodLog();
    this.listeners = [];
  }

  loadEvents() {
    const stored = localStorage.getItem('routine-os-events');
    return stored ? JSON.parse(stored) : [];
  }

  loadCompletionLog() {
    const stored = localStorage.getItem('routine-os-completion-log');
    return stored ? JSON.parse(stored) : {};
  }

  loadMoodLog() {
    const stored = localStorage.getItem('routine-os-mood-log');
    return stored ? JSON.parse(stored) : {};
  }

  saveEvents() {
    localStorage.setItem('routine-os-events', JSON.stringify(this.events));
    this.notifyListeners();
  }

  saveCompletionLog() {
    localStorage.setItem('routine-os-completion-log', JSON.stringify(this.completionLog));
    this.notifyListeners();
  }

  saveMoodLog() {
    localStorage.setItem('routine-os-mood-log', JSON.stringify(this.moodLog));
    this.notifyListeners();
  }

  addEvent(event) {
    const newEvent = {
      id: Date.now().toString(),
      ...event,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.events.push(newEvent);
    this.saveEvents();
    return newEvent;
  }

  removeEvent(id) {
    this.events = this.events.filter(event => event.id !== id);
    this.saveEvents();
  }

  completeEvent(id, date) {
    const dateKey = new Date(date).toDateString();
    if (!this.completionLog[dateKey]) {
      this.completionLog[dateKey] = {};
    }
    this.completionLog[dateKey][id] = {
      status: 'completed',
      completedAt: new Date().toISOString()
    };
    this.saveCompletionLog();
  }

  skipEvent(id, date, reason = '') {
    const dateKey = new Date(date).toDateString();
    if (!this.completionLog[dateKey]) {
      this.completionLog[dateKey] = {};
    }
    this.completionLog[dateKey][id] = {
      status: 'skipped',
      skippedAt: new Date().toISOString(),
      reason
    };
    this.saveCompletionLog();
  }

  getEventStatus(id, date) {
    const dateKey = new Date(date).toDateString();
    return this.completionLog[dateKey]?.[id]?.status || 'pending';
  }

  getEventsForDate(date) {
    const targetDate = new Date(date).toDateString();
    return this.events.filter(event => {
      if (event.type === 'recurring') {
        return true;
      }
      return new Date(event.date).toDateString() === targetDate;
    });
  }

  getDailyStats(date) {
    const dateKey = new Date(date).toDateString();
    const dayEvents = this.getEventsForDate(date);
    const dayLog = this.completionLog[dateKey] || {};
    const total = dayEvents.length;
    let completed = 0;
    let skipped = 0;
    let pending = 0;
    const skippedTasks = [];

    dayEvents.forEach(event => {
      const log = dayLog[event.id];
      if (log?.status === 'completed') {
        completed++;
      } else if (log?.status === 'skipped') {
        skipped++;
        skippedTasks.push({ ...event, reason: log.reason });
      } else {
        pending++;
      }
    });

    return {
      total,
      completed,
      skipped,
      pending,
      skippedTasks,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  logMood(date, mood, note = '') {
    const dateKey = new Date(date).toDateString();
    this.moodLog[dateKey] = {
      mood,
      note,
      loggedAt: new Date().toISOString()
    };
    this.saveMoodLog();
  }

  getMood(date) {
    const dateKey = new Date(date).toDateString();
    return this.moodLog[dateKey] || null;
  }

  getMoodHistory(days = 7) {
    const history = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      history.push({
        date: key,
        ...(this.moodLog[key] || { mood: null })
      });
    }
    return history;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.events));
  }
}

export const eventStore = new EventStore();
