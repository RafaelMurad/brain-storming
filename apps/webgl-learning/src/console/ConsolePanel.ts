/**
 * ConsolePanel - Interactive console output for Three.js sandbox
 * 
 * Captures and displays console.log, console.warn, console.error
 * with syntax highlighting and object inspection.
 */

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info' | 'system';
  content: string;
  timestamp: number;
  expanded?: boolean;
  raw?: unknown;
}

export interface ConsolePanelOptions {
  container: HTMLElement;
  maxMessages?: number;
  onClear?: () => void;
}

export class ConsolePanel {
  private container: HTMLElement;
  private messagesContainer: HTMLElement;
  private messages: ConsoleMessage[] = [];
  private maxMessages: number;
  private onClear?: () => void;
  private messageCount = 0;

  constructor(options: ConsolePanelOptions) {
    this.container = options.container;
    this.maxMessages = options.maxMessages || 500;
    this.onClear = options.onClear;

    this.messagesContainer = document.createElement('div');
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="console-panel">
        <div class="console-toolbar">
          <div class="console-filters">
            <button class="console-filter active" data-filter="all">All</button>
            <button class="console-filter" data-filter="log">Log</button>
            <button class="console-filter" data-filter="warn">Warn</button>
            <button class="console-filter" data-filter="error">Error</button>
          </div>
          <div class="console-actions">
            <button class="console-clear" title="Clear console">🗑️</button>
          </div>
        </div>
        <div class="console-messages"></div>
        <div class="console-input-wrapper">
          <span class="console-prompt">›</span>
          <input type="text" class="console-input" placeholder="Evaluate expression..." disabled />
        </div>
      </div>
    `;

    this.messagesContainer = this.container.querySelector('.console-messages')!;
    this.addStyles();
    this.setupEventListeners();
    
    // Show welcome message
    this.addSystemMessage('Three.js Console ready. Run your code to see output.');
  }

  private addStyles(): void {
    const styleId = 'console-panel-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      .console-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #0d0d0d;
        font-family: 'Space Mono', monospace;
        font-size: 12px;
      }

      .console-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #111;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }

      .console-filters {
        display: flex;
        gap: 4px;
      }

      .console-filter {
        padding: 4px 8px;
        background: transparent;
        border: 1px solid rgba(255,255,255,0.1);
        color: #888;
        font-size: 10px;
        font-family: inherit;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .console-filter:hover {
        border-color: rgba(255,255,255,0.2);
        color: #fff;
      }

      .console-filter.active {
        background: rgba(255,77,0,0.15);
        border-color: #FF4D00;
        color: #FF4D00;
      }

      .console-clear {
        padding: 4px 8px;
        background: transparent;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 12px;
        transition: color 0.15s ease;
      }

      .console-clear:hover {
        color: #fff;
      }

      .console-messages {
        flex: 1;
        overflow-y: auto;
        padding: 8px 0;
      }

      .console-message {
        display: flex;
        align-items: flex-start;
        padding: 4px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.03);
        transition: background 0.1s ease;
      }

      .console-message:hover {
        background: rgba(255,255,255,0.02);
      }

      .console-message.log { color: #fff; }
      .console-message.info { color: #00D4FF; }
      .console-message.warn { 
        color: #FFD700; 
        background: rgba(255,215,0,0.05);
      }
      .console-message.error { 
        color: #FF4D4D; 
        background: rgba(255,77,77,0.08);
      }
      .console-message.system { 
        color: #666; 
        font-style: italic;
      }

      .console-icon {
        width: 16px;
        margin-right: 8px;
        opacity: 0.7;
        flex-shrink: 0;
      }

      .console-content {
        flex: 1;
        word-break: break-word;
        line-height: 1.5;
      }

      .console-timestamp {
        color: #444;
        font-size: 10px;
        margin-left: 8px;
        flex-shrink: 0;
      }

      .console-object {
        color: #00D4FF;
        cursor: pointer;
      }

      .console-object:hover {
        text-decoration: underline;
      }

      .console-string { color: #98C379; }
      .console-number { color: #D19A66; }
      .console-boolean { color: #C678DD; }
      .console-null { color: #666; }
      .console-key { color: #E06C75; }

      .console-input-wrapper {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background: #0a0a0a;
        border-top: 1px solid rgba(255,255,255,0.06);
      }

      .console-prompt {
        color: #FF4D00;
        margin-right: 8px;
        font-weight: bold;
      }

      .console-input {
        flex: 1;
        background: transparent;
        border: none;
        color: #fff;
        font-family: inherit;
        font-size: 12px;
        outline: none;
      }

      .console-input::placeholder {
        color: #444;
      }

      .console-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .console-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #444;
        text-align: center;
        padding: 20px;
      }

      .console-empty-icon {
        font-size: 32px;
        margin-bottom: 12px;
        opacity: 0.5;
      }

      .console-message-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        background: rgba(255,77,0,0.3);
        color: #FF4D00;
        font-size: 10px;
        border-radius: 9px;
        margin-left: 8px;
      }
    `;
    document.head.appendChild(styles);
  }

  private setupEventListeners(): void {
    // Filter buttons
    this.container.querySelectorAll('.console-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const filter = target.dataset.filter;
        
        this.container.querySelectorAll('.console-filter').forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        
        this.filterMessages(filter || 'all');
      });
    });

    // Clear button
    this.container.querySelector('.console-clear')?.addEventListener('click', () => {
      this.clear();
    });
  }

  private filterMessages(filter: string): void {
    const messages = this.messagesContainer.querySelectorAll('.console-message');
    messages.forEach(msg => {
      const msgElement = msg as HTMLElement;
      if (filter === 'all') {
        msgElement.style.display = 'flex';
      } else {
        msgElement.style.display = msg.classList.contains(filter) ? 'flex' : 'none';
      }
    });
  }

  private formatValue(value: unknown): string {
    if (value === null) {
      return '<span class="console-null">null</span>';
    }
    if (value === undefined) {
      return '<span class="console-null">undefined</span>';
    }
    if (typeof value === 'string') {
      return `<span class="console-string">"${this.escapeHtml(value)}"</span>`;
    }
    if (typeof value === 'number') {
      return `<span class="console-number">${value}</span>`;
    }
    if (typeof value === 'boolean') {
      return `<span class="console-boolean">${value}</span>`;
    }
    if (Array.isArray(value)) {
      if (value.length <= 5) {
        return `[${value.map(v => this.formatValue(v)).join(', ')}]`;
      }
      return `<span class="console-object">Array(${value.length})</span>`;
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length <= 3) {
        const pairs = keys.map(k => `<span class="console-key">${k}</span>: ${this.formatValue((value as Record<string, unknown>)[k])}`);
        return `{${pairs.join(', ')}}`;
      }
      return `<span class="console-object">Object {${keys.slice(0, 3).join(', ')}...}</span>`;
    }
    return String(value);
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  private getIcon(type: string): string {
    switch (type) {
      case 'log': return '📝';
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'system': return '🔧';
      default: return '•';
    }
  }

  private formatTimestamp(ts: number): string {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  /**
   * Add a message to the console
   */
  addMessage(type: ConsoleMessage['type'], content: string, raw?: unknown): void {
    const id = `msg-${++this.messageCount}`;
    const message: ConsoleMessage = {
      id,
      type,
      content,
      timestamp: Date.now(),
      raw,
    };

    this.messages.push(message);

    // Limit messages
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
      this.messagesContainer.firstChild?.remove();
    }

    const msgEl = document.createElement('div');
    msgEl.className = `console-message ${type}`;
    msgEl.dataset.id = id;
    msgEl.innerHTML = `
      <span class="console-icon">${this.getIcon(type)}</span>
      <span class="console-content">${this.escapeHtml(content)}</span>
      <span class="console-timestamp">${this.formatTimestamp(message.timestamp)}</span>
    `;

    this.messagesContainer.appendChild(msgEl);
    
    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  /**
   * Add log message
   */
  log(content: string): void {
    this.addMessage('log', content);
  }

  /**
   * Add info message
   */
  info(content: string): void {
    this.addMessage('info', content);
  }

  /**
   * Add warning message
   */
  warn(content: string): void {
    this.addMessage('warn', content);
  }

  /**
   * Add error message
   */
  error(content: string): void {
    this.addMessage('error', content);
  }

  /**
   * Add system message
   */
  addSystemMessage(content: string): void {
    this.addMessage('system', content);
  }

  /**
   * Clear all messages
   */
  clear(): void {
    this.messages = [];
    this.messagesContainer.innerHTML = '';
    this.addSystemMessage('Console cleared');
    this.onClear?.();
  }

  /**
   * Get message count by type
   */
  getCount(type?: ConsoleMessage['type']): number {
    if (!type) return this.messages.length;
    return this.messages.filter(m => m.type === type).length;
  }

  /**
   * Dispose panel
   */
  dispose(): void {
    this.container.innerHTML = '';
    this.messages = [];
  }
}

export default ConsolePanel;
