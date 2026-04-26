import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    try {
      await login(email, password);
      toast('Welcome back 🤍');
    } catch (err) {
      toast(err.response?.data?.error || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-mark">m</div>
          <h1>Moise Care</h1>
          <p>Ads Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary login-submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="login-hint">
          Trouble signing in? Contact your administrator.
        </p>
      </div>

      <style>{`
        .login-bg {
          min-height: 100vh;
          background:
            radial-gradient(ellipse at top, rgba(232, 185, 164, 0.4), transparent 60%),
            radial-gradient(ellipse at bottom, rgba(199, 209, 184, 0.3), transparent 50%),
            var(--cream-50);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .login-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 48px 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--cream-200);
        }
        .login-brand { text-align: center; margin-bottom: 36px; }
        .login-mark {
          width: 56px; height: 56px;
          background: var(--terracotta);
          color: var(--cream-50);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 400;
          margin-bottom: 18px;
        }
        .login-brand h1 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 400;
          color: var(--ink);
          letter-spacing: -0.01em;
          margin-bottom: 4px;
        }
        .login-brand p {
          font-size: 13px;
          color: var(--ink-faint);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .login-form {
          display: flex; flex-direction: column; gap: 16px;
        }
        .login-submit {
          margin-top: 8px;
          padding: 12px;
          justify-content: center;
          font-size: 14px;
        }
        .login-hint {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: var(--ink-faint);
        }
      `}</style>
    </div>
  );
}
