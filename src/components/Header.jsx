import { useAuth } from '../contexts/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-mark">m</div>
        <div>
          <div className="header-title">Moise Care</div>
          <div className="header-sub">Ads Dashboard</div>
        </div>
      </div>
      <div className="header-user">
        <span className="header-role">{user?.role === 'ray' ? 'Ray (admin)' : 'Agency'}</span>
        <button className="btn btn-ghost" onClick={logout}>Sign out</button>
      </div>

      <style>{`
        .header {
          background: white;
          border-bottom: 1px solid var(--cream-200);
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .header-brand { display: flex; align-items: center; gap: 12px; }
        .header-mark {
          width: 36px; height: 36px;
          background: var(--terracotta);
          color: var(--cream-50);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display);
          font-size: 22px;
        }
        .header-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 500;
          color: var(--ink);
          line-height: 1.1;
        }
        .header-sub {
          font-size: 11px;
          color: var(--ink-faint);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .header-user { display: flex; align-items: center; gap: 12px; }
        .header-role {
          font-size: 12px;
          color: var(--ink-soft);
          padding: 4px 10px;
          background: var(--cream-100);
          border-radius: 12px;
        }
        @media (max-width: 640px) {
          .header { padding: 12px 16px; }
          .header-sub { display: none; }
        }
      `}</style>
    </header>
  );
}
