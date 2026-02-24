/**
 * Global type declarations for Fact Check
 */

// Extend Node.js globals for undici
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GEMINI_API_KEY: string;
      TAVILY_API_KEY: string;
      PORT?: string;
      VITE_API_URL?: string;
      ALLOWED_ORIGINS?: string;
      HTTP_PROXY?: string;
      HTTPS_PROXY?: string;
      http_proxy?: string;
      https_proxy?: string;
    }
  }

  // Undici ProxyAgent type (available in Node.js 18+)
  var undici: {
    ProxyAgent: new (url: string) => {
      dispatch: () => void;
    };
  } | undefined;

  // Fetch options with dispatcher support
  interface RequestInit {
    dispatcher?: any;
    duplex?: 'half' | 'full';
  }
}

export {};
