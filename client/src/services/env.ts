const apiBaseFromEnv = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');
const apiRootFromEnv = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

export const ENV = {
  API_BASE_URL: apiBaseFromEnv || `${apiRootFromEnv || 'http://localhost:5000'}/api`,
  API_ROOT_URL: apiRootFromEnv || apiBaseFromEnv?.replace(/\/api\/?$/, '') || 'http://localhost:5000',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
