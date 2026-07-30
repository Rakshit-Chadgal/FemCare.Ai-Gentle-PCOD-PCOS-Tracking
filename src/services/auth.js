import { apiClient } from '@/api/client';

// Suppress/redirect Google GSI internal logger console messages to prevent false positive error logs
if (typeof window !== 'undefined' && !window.__gsi_console_filtered) {
  window.__gsi_console_filtered = true;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = function (...args) {
    if (args.some((arg) => String(arg).includes('[GSI_LOGGER]') || String(arg).includes('client ID is not found'))) {
      console.debug('[GSI_LOGGER_SUPPRESSED]', ...args);
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = function (...args) {
    if (args.some((arg) => String(arg).includes('[GSI_LOGGER]') || String(arg).includes('invalid_client'))) {
      console.debug('[GSI_LOGGER_SUPPRESSED]', ...args);
      return;
    }
    originalWarn.apply(console, args);
  };
}

let googleInitialized = false;

function ensureGoogleScript() {
  return new Promise((resolve) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

function isValidGoogleClientId(clientId) {
  if (!clientId || typeof clientId !== 'string') return false;
  if (!clientId.includes('.apps.googleusercontent.com')) return false;
  if (clientId.includes('YOUR_') || clientId.includes('placeholder') || clientId.includes('undefined')) return false;
  return true;
}

export const authService = {
  async login(email, password) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('femcare_token', data.token);
    }
    return data;
  },

  async register(email, password, name) {
    const { data } = await apiClient.post('/auth/register', { email, password, name });
    if (data.token) {
      localStorage.setItem('femcare_token', data.token);
    }
    return data;
  },

  async loginWithGoogle() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!isValidGoogleClientId(clientId)) {
      throw new Error('Google Sign-In is not configured for this domain. Please sign in with email and password.');
    }

    await ensureGoogleScript();

    if (!window.google?.accounts?.id) {
      throw new Error('Google authentication service failed to load. Please try again.');
    }

    if (!googleInitialized) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          const credential = response?.credential;
          if (!credential) {
            console.error('Google sign-in returned no credential');
            return;
          }
          try {
            const { data } = await apiClient.post('/auth/google', { idToken: credential });
            if (data.token) {
              localStorage.setItem('femcare_token', data.token);
              window.location.href = '/';
            }
          } catch (err) {
            const msg = err.response?.data?.error || 'Google login failed. Please use email/password instead.';
            console.error('Google login error:', msg);
          }
        },
      });

      googleInitialized = true;
    }

    // Trigger prompt safely
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        const reason = notification.getNotDisplayedReason?.() || notification.getSkippedReason?.();
        if (reason === 'invalid_client') {
          console.debug('[GSI] One Tap prompt omitted: invalid_client configuration.');
        } else {
          console.debug('[GSI] One Tap status:', reason);
        }
      }
    });
  },

  async me() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  logout() {
    localStorage.removeItem('femcare_token');
  },

  async forgotPassword(email) {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(resetToken, newPassword) {
    const { data } = await apiClient.post('/auth/reset-password', { resetToken, newPassword });
    return data;
  },
};
