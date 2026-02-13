import { eventStore } from './eventStore';

const SPARTAN_SYSTEM_PROMPT = `You are "The Spartan" — an extremely harsh, direct, zero-tolerance AI coach embedded in a daily routine management app called Routine OS.

PERSONALITY:
- Brutal honesty. No sugarcoating. No participation trophies.
- You speak in short, punchy sentences. Like a drill sergeant who reads Marcus Aurelius.
- You despise excuses. If someone skips a task, you call it out HARD.
- However, you are PRACTICAL. You never demand the impossible. You optimize for MAXIMUM DENSITY OF EFFORT within the user's actual constraints. If they have 4 hours of meetings, you won't tell them to do a 5-hour workout.
- You assign "penalty tasks" when tasks are skipped — short, intense, immediate actions.
- When the user feels bad, you don't go soft. You channel Stoic philosophy — acknowledge the pain exists, then DEMAND action regardless. "Pain is information, not permission to quit."

RULES:
- Never be encouraging in a soft way. Your encouragement is through challenge.
- Reference their actual schedule data when giving feedback.
- Penalty tasks must be concrete, measurable, and completable in under 15 minutes.
- Keep responses concise. 2-4 sentences max for feedback. Slightly longer for chat.
- Use their mood data to calibrate intensity — bad mood means Stoic fire, not softness.
- Good performance gets minimal praise: "Acceptable." or "That's baseline. Now raise it."`;

const PENALTY_TASKS = [
  { task: '50 burpees. Now.', intensity: 'high', duration: '10 min' },
  { task: '100 pushups. No breaks longer than 10 seconds.', intensity: 'high', duration: '8 min' },
  { task: '2 minute cold shower. Full cold. No easing in.', intensity: 'high', duration: '2 min' },
  { task: '5 minute plank. If you collapse, restart that minute.', intensity: 'high', duration: '5 min' },
  { task: '200 jumping jacks. Count every single one.', intensity: 'medium', duration: '8 min' },
  { task: '3 sets of 30 squats. 10 second rest between sets.', intensity: 'medium', duration: '6 min' },
  { task: 'Write 500 words about why you failed today. No excuses allowed — only analysis.', intensity: 'mental', duration: '15 min' },
  { task: 'Hold wall sit until failure. Rest 30 seconds. Repeat 3 times.', intensity: 'high', duration: '8 min' },
  { task: '10 minute sprint intervals. 30 seconds on, 15 seconds off.', intensity: 'high', duration: '10 min' },
  { task: 'Tomorrow starts at 5 AM. Non-negotiable. Set the alarm now.', intensity: 'schedule', duration: 'next day' },
];

const STOIC_QUOTES = [
  "The impediment to action advances action. What stands in the way becomes the way. — Marcus Aurelius",
  "We suffer more in imagination than in reality. — Seneca",
  "Man is not worried by real problems so much as by his imagined anxieties about real problems. — Epictetus",
  "You have power over your mind — not outside events. Realize this, and you will find strength. — Marcus Aurelius",
  "The best revenge is not to be like your enemy. — Marcus Aurelius",
  "Waste no more time arguing about what a good man should be. Be one. — Marcus Aurelius",
  "It is not that we have a short time to live, but that we waste a great deal of it. — Seneca",
  "First say to yourself what you would be; and then do what you have to do. — Epictetus",
  "He who fears death will never do anything worthy of a man who is alive. — Seneca",
  "Difficulties strengthen the mind, as labor does the body. — Seneca",
];

class CoachService {
  constructor() {
    this.apiKey = this.loadApiKey();
    this.chatHistory = this.loadChatHistory();
    this.intensity = this.loadIntensity();
    this.model = 'gpt-4o';
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
  }

  loadApiKey() {
    return localStorage.getItem('routine-os-api-key') || '';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('routine-os-api-key', key);
  }

  getApiKey() {
    return this.apiKey;
  }

  hasApiKey() {
    return this.apiKey.length > 0;
  }

  loadChatHistory() {
    const stored = localStorage.getItem('routine-os-coach-chat');
    return stored ? JSON.parse(stored) : [];
  }

  loadIntensity() {
    return localStorage.getItem('routine-os-coach-intensity') || 'spartan';
  }

  setIntensity(level) {
    this.intensity = level;
    localStorage.setItem('routine-os-coach-intensity', level);
  }

  getIntensity() {
    return this.intensity;
  }

  getIntensityPrompt() {
    if (this.intensity === 'warrior') {
      return 'Tone: strict but less abrasive. Still direct. Reduce insults. Focus on discipline.';
    }
    if (this.intensity === 'human') {
      return 'Tone: firm and practical but more supportive. No insults. Still demands action.';
    }
    return 'Tone: full Spartan. Harsh, direct, zero tolerance.';
  }

  applyIntensity(text) {
    if (this.intensity === 'spartan') return text;
    if (this.intensity === 'warrior') {
      return text
        .replace(/pathetic/gi, 'below standard')
        .replace(/unacceptable/gi, 'not acceptable')
        .replace(/disappointment/gi, 'setback')
        .replace(/quit/gi, 'stopped')
        .replace(/coward/gi, 'undisciplined');
    }
    return `I hear you. ${text
      .replace(/pathetic/gi, 'not good enough')
      .replace(/unacceptable/gi, 'not acceptable')
      .replace(/disappointment/gi, 'setback')
      .replace(/quit/gi, 'stopped')
      .replace(/coward/gi, 'undisciplined')}`;
  }

  saveChatHistory() {
    localStorage.setItem('routine-os-coach-chat', JSON.stringify(this.chatHistory));
  }

  clearChatHistory() {
    this.chatHistory = [];
    this.saveChatHistory();
  }

  getRandomPenalty() {
    return PENALTY_TASKS[Math.floor(Math.random() * PENALTY_TASKS.length)];
  }

  getRandomStoicQuote() {
    return STOIC_QUOTES[Math.floor(Math.random() * STOIC_QUOTES.length)];
  }

  buildScheduleContext(date) {
    const stats = eventStore.getDailyStats(date);
    const mood = eventStore.getMood(date);
    const events = eventStore.getEventsForDate(date);

    let context = `\n--- TODAY'S DATA ---\n`;
    context += `Date: ${new Date(date).toDateString()}\n`;
    context += `Total tasks: ${stats.total}\n`;
    context += `Completed: ${stats.completed} | Skipped: ${stats.skipped} | Pending: ${stats.pending}\n`;
    context += `Completion rate: ${stats.completionRate}%\n`;

    if (stats.skippedTasks.length > 0) {
      context += `\nSKIPPED TASKS:\n`;
      stats.skippedTasks.forEach(t => {
        context += `- "${t.title}" at ${t.time || 'unscheduled'}${t.reason ? ` (excuse: "${t.reason}")` : ' (no excuse given)'}\n`;
      });
    }

    if (mood) {
      context += `\nUSER MOOD: ${mood.mood}${mood.note ? ` — "${mood.note}"` : ''}\n`;
    }

    if (events.length > 0) {
      context += `\nFULL SCHEDULE:\n`;
      events.forEach(e => {
        const status = eventStore.getEventStatus(e.id, date);
        context += `- [${status.toUpperCase()}] "${e.title}" at ${e.time || 'unscheduled'} (${e.type})\n`;
      });
    }

    return context;
  }

  generateLocalFeedback(date) {
    const stats = eventStore.getDailyStats(date);
    const mood = eventStore.getMood(date);
    const messages = [];

    if (stats.total === 0) {
      return [{
        role: 'coach',
        content: this.applyIntensity("You have zero tasks scheduled. That's not discipline — that's hiding. Build your day or your day builds you."),
        type: 'feedback'
      }];
    }

    if (stats.completionRate === 100) {
      messages.push({
        role: 'coach',
        content: this.applyIntensity("All tasks completed. Acceptable. Don't let this make you comfortable — that's where decay starts. Raise the bar tomorrow."),
        type: 'feedback'
      });
    } else if (stats.completionRate >= 80) {
      messages.push({
        role: 'coach',
        content: this.applyIntensity(`${stats.completionRate}% completion. Almost. "Almost" is the language of people who don't finish. Close the gap.`),
        type: 'feedback'
      });
    } else if (stats.completionRate >= 50) {
      messages.push({
        role: 'coach',
        content: this.applyIntensity(`${stats.completionRate}%. Half-measures. You showed up for half your life today. The other half? Wasted. That's unacceptable.`),
        type: 'feedback'
      });
    } else if (stats.completed > 0) {
      messages.push({
        role: 'coach',
        content: this.applyIntensity(`${stats.completionRate}% completion rate. Pathetic. You had ${stats.total} tasks and couldn't handle ${stats.total - stats.completed} of them. What exactly were you doing?`),
        type: 'feedback'
      });
    } else if (stats.skipped > 0) {
      messages.push({
        role: 'coach',
        content: this.applyIntensity(`Zero completions. ${stats.skipped} skipped. You didn't have a bad day — you chose to fail. Every skip was a decision. Own it.`),
        type: 'feedback'
      });
    }

    if (stats.skippedTasks.length > 0) {
      stats.skippedTasks.forEach(task => {
        const penalty = this.getRandomPenalty();
        messages.push({
          role: 'coach',
          content: this.applyIntensity(`You skipped "${task.title}."${task.reason ? ` Your excuse: "${task.reason}." Irrelevant.` : ' No excuse given. At least you didn\'t insult me with a lie.'} Penalty: ${penalty.task}`),
          type: 'penalty',
          penalty
        });
      });
    }

    if (mood && (mood.mood === 'bad' || mood.mood === 'terrible')) {
      const quote = this.getRandomStoicQuote();
      messages.push({
        role: 'coach',
        content: this.applyIntensity(`You feel "${mood.mood}." Good — you're aware. Now hear this: pain is information, not permission to quit. ${quote} Your feelings are valid. Your excuses are not. Move.`),
        type: 'stoic'
      });
    } else if (mood && mood.mood === 'neutral') {
      messages.push({
        role: 'coach',
        content: this.applyIntensity(`"Neutral" is just comfortable mediocrity dressed up as stability. You're not here to coast. Find the edge and push past it.`),
        type: 'stoic'
      });
    }

    if (stats.pending > 0) {
      messages.push({
        role: 'coach',
        content: this.applyIntensity(`${stats.pending} task${stats.pending > 1 ? 's' : ''} still pending. The day isn't over. You still have time to not be a disappointment. Execute.`),
        type: 'reminder'
      });
    }

    return messages;
  }

  async sendToLLM(messages) {
    if (!this.hasApiKey()) {
      return null;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.8,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || null;
    } catch (error) {
      console.error('LLM request failed:', error);
      throw error;
    }
  }

  async getDailyFeedback(date) {
    const scheduleContext = this.buildScheduleContext(date);

    if (this.hasApiKey()) {
      try {
        const llmResponse = await this.sendToLLM([
          { role: 'system', content: SPARTAN_SYSTEM_PROMPT },
          { role: 'system', content: this.getIntensityPrompt() },
          { role: 'user', content: `Analyze my schedule and give me today's feedback. Be The Spartan.\n${scheduleContext}` }
        ]);

        if (llmResponse) {
          return [{
            role: 'coach',
            content: llmResponse,
            type: 'feedback',
            source: 'llm'
          }];
        }
      } catch (e) {
        // Fall through to local feedback
      }
    }

    return this.generateLocalFeedback(date);
  }

  async chat(userMessage, date) {
    const scheduleContext = this.buildScheduleContext(date);

    const chatEntry = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    this.chatHistory.push(chatEntry);

    if (this.hasApiKey()) {
      try {
        const recentHistory = this.chatHistory.slice(-20).map(msg => ({
          role: msg.role === 'coach' ? 'assistant' : msg.role,
          content: msg.content
        }));

        const llmMessages = [
          { role: 'system', content: SPARTAN_SYSTEM_PROMPT },
          { role: 'system', content: `Current schedule context:\n${scheduleContext}` },
          ...recentHistory
        ];

        const llmResponse = await this.sendToLLM(llmMessages);

        if (llmResponse) {
          const coachEntry = {
            role: 'coach',
            content: llmResponse,
            timestamp: new Date().toISOString(),
            source: 'llm'
          };
          this.chatHistory.push(coachEntry);
          this.saveChatHistory();
          return coachEntry;
        }
      } catch (e) {
        // Fall through to local response
      }
    }

    const localResponse = this.generateLocalChatResponse(userMessage, date);
    const coachEntry = {
      role: 'coach',
      content: localResponse,
      timestamp: new Date().toISOString(),
      source: 'local'
    };
    this.chatHistory.push(coachEntry);
    this.saveChatHistory();
    return coachEntry;
  }

  generateLocalChatResponse(userMessage, date) {
    const stats = eventStore.getDailyStats(date);
    const mood = eventStore.getMood(date);
    const msg = userMessage.toLowerCase();

    if (msg.includes('tired') || msg.includes('exhausted') || msg.includes('can\'t')) {
      return this.applyIntensity(`"Tired" is not a status — it's a choice to announce weakness. ${this.getRandomStoicQuote()} You have ${stats.pending} tasks left. Start the next one in the next 60 seconds or the tiredness wins.`);
    }

    if (msg.includes('skip') || msg.includes('postpone') || msg.includes('later') || msg.includes('tomorrow')) {
      const penalty = this.getRandomPenalty();
      return this.applyIntensity(`Postpone? That's just quitting with extra steps. You do it now or you pay the price. Penalty: ${penalty.task}. Your call.`);
    }

    if (msg.includes('feel') || msg.includes('mood') || msg.includes('bad') || msg.includes('sad') || msg.includes('depressed')) {
      return this.applyIntensity(`Your feelings are real. They're also irrelevant to whether you execute. ${this.getRandomStoicQuote()} Pain is the fee for a life worth living. Now get back to work.`);
    }

    if (msg.includes('good') || msg.includes('great') || msg.includes('amazing')) {
      return this.applyIntensity(`Feeling good is not an achievement. It's a temporary state. Use it. You have ${stats.pending} pending tasks — this is the easiest they'll ever be. Move while the momentum is there.`);
    }

    if (msg.includes('help') || msg.includes('advice') || msg.includes('what should')) {
      if (stats.pending > 0) {
        return this.applyIntensity(`Stop asking. Start doing. Your next task is waiting. ${stats.pending} items remain. Pick the hardest one and attack it first. That's my advice. Every time.`);
      }
      return this.applyIntensity(`You want advice? Add harder tasks. If you're finishing everything comfortably, your bar is too low. Discomfort is the only reliable compass for growth.`);
    }

    if (msg.includes('done') || msg.includes('finished') || msg.includes('completed')) {
      if (stats.completionRate === 100) {
        return this.applyIntensity("Acceptable. But don't celebrate baseline expectations. What's tomorrow look like? It should be harder than today.");
      }
      return this.applyIntensity(`"Done"? Your completion rate is ${stats.completionRate}%. You're not done — you quit. There's a difference. Get back in there.`);
    }

    if (stats.skipped > 0) {
      return this.applyIntensity(`You're chatting instead of executing. You have ${stats.skipped} skipped tasks haunting your record today. Every second here is a second not fixing that. Go.`);
    }

    return this.applyIntensity(`I don't do small talk. You have ${stats.pending} pending tasks and a ${stats.completionRate}% completion rate. Talk is cheap. Action is the only currency I accept. What are you going to DO?`);
  }

  getChatHistory() {
    return this.chatHistory;
  }
}

export const coachService = new CoachService();
