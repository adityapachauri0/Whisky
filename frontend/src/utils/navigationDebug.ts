// Navigation debugging utility to catch unwanted redirects

class NavigationDebugger {
  private logs: string[] = [];
  private originalPushState: any;
  private originalReplaceState: any;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeDebugger();
    }
  }

  private initializeDebugger() {
    // Store original methods
    this.originalPushState = window.history.pushState;
    this.originalReplaceState = window.history.replaceState;

    // Override pushState
    window.history.pushState = (state: any, title: string, url?: string | URL | null) => {
      const timestamp = new Date().toLocaleTimeString();
      const logMessage = `${timestamp}: pushState to ${url} (from ${window.location.pathname})`;
      this.addLog(logMessage);
      console.log('🔍 Navigation pushState:', logMessage);
      
      // Get stack trace to see where this came from
      console.trace('pushState called from:');
      
      return this.originalPushState.call(window.history, state, title, url);
    };

    // Override replaceState
    window.history.replaceState = (state: any, title: string, url?: string | URL | null) => {
      const timestamp = new Date().toLocaleTimeString();
      const logMessage = `${timestamp}: replaceState to ${url} (from ${window.location.pathname})`;
      this.addLog(logMessage);
      console.log('🔍 Navigation replaceState:', logMessage);
      
      // Get stack trace to see where this came from
      console.trace('replaceState called from:');
      
      return this.originalReplaceState.call(window.history, state, title, url);
    };

    // Listen for popstate events
    window.addEventListener('popstate', (event) => {
      const timestamp = new Date().toLocaleTimeString();
      const logMessage = `${timestamp}: popstate event - ${window.location.pathname}`;
      this.addLog(logMessage);
      console.log('🔍 Navigation popstate:', logMessage, event);
    });

    // Listen for hashchange events
    window.addEventListener('hashchange', (event) => {
      const timestamp = new Date().toLocaleTimeString();
      const logMessage = `${timestamp}: hashchange from ${event.oldURL} to ${event.newURL}`;
      this.addLog(logMessage);
      console.log('🔍 Navigation hashchange:', logMessage);
    });

    // Monitor for window.location changes
    let lastUrl = window.location.href;
    setInterval(() => {
      if (window.location.href !== lastUrl) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `${timestamp}: Direct location change from ${lastUrl} to ${window.location.href}`;
        this.addLog(logMessage);
        console.log('🔍 Navigation direct change:', logMessage);
        lastUrl = window.location.href;
      }
    }, 100); // Check every 100ms

    console.log('🔍 Navigation debugger initialized');
  }

  private addLog(message: string) {
    this.logs.push(message);
    // Keep only last 20 logs
    if (this.logs.length > 20) {
      this.logs = this.logs.slice(-20);
    }
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }

  public restore() {
    if (typeof window !== 'undefined') {
      window.history.pushState = this.originalPushState;
      window.history.replaceState = this.originalReplaceState;
    }
  }
}

// Create a global instance
const navigationDebugger = new NavigationDebugger();

export default navigationDebugger;