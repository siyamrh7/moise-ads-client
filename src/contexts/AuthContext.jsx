import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('moise_user') || 'null'); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, verify token is still valid
    const token = localStorage.getItem('moise_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
        localStorage.setItem('moise_user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem('moise_token');
        localStorage.removeItem('moise_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('moise_token', res.data.token);
    localStorage.setItem('moise_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem('moise_token');
    localStorage.removeItem('moise_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
