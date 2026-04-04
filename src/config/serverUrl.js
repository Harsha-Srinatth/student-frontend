/**
 * Backend base URL for REST (Axios) and Socket.IO.
 *
 * Local (Vite):  VITE_API_URL=3000  →  http://localhost:3000
 * Vercel prod:   VITE_API_URL=https://your-api.onrender.com  (full URL, no trailing slash)
 */
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

/** Match student-backend PORT in local .env (Render sets PORT in production). */
const DEFAULT_DEV_PORT = '3000';

function resolveServerUrl() {
  let raw = import.meta.env.VITE_API_URL?.trim() || '';

  if (!raw) {
    if (isProduction) {
      console.error(
        'VITE_API_URL is missing. In Vercel → Settings → Environment Variables, set it to your Render API URL (https://...).'
      );
      return '';
    }
    return `http://localhost:${DEFAULT_DEV_PORT}`;
  }

  if (/^\d+$/.test(raw)) {
    if (isProduction) {
      console.error('VITE_API_URL on Vercel must be a full https URL, not a port number.');
      return '';
    }
    return `http://localhost:${raw}`;
  }

  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    if (isProduction) {
      console.error('VITE_API_URL must start with https:// or http://');
      return '';
    }
    return `http://localhost:${DEFAULT_DEV_PORT}`;
  }

  return raw.replace(/\/$/, '');
}

export const SERVER_URL = resolveServerUrl();

if (isDevelopment && SERVER_URL) {
  console.log('SERVER_URL →', SERVER_URL);
}
