
import { Api } from './api/api';

const api = new Api({
  baseUrl: import.meta.env.VITE_API_URL,
  baseApiParams: { credentials: 'include' },
  
  
});

export default api;