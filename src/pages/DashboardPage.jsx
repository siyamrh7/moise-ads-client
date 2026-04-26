import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import Header from '../components/Header.jsx';
import CoverageView from '../components/CoverageView.jsx';
import AdsView from '../components/AdsView.jsx';
import ContactsView from '../components/ContactsView.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('coverage');
  const [ads, setAds] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const [adsRes, contactsRes] = await Promise.all([
        api.get('/ads'),
        api.get('/contacts')
      ]);
      setAds(adsRes.data.ads);
      setContacts(contactsRes.data.contacts);
    } catch (err) {
      toast('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { reload(); }, [reload]);

  if (loading) return <div className="loading">Loading dashboard…</div>;

  const tabs = [
    { id: 'coverage', label: 'Coverage' },
    { id: 'ads', label: 'Ads' },
    { id: 'contacts', label: 'Contacts' }
  ];

  return (
    <div className="dashboard">
      <Header />

      <nav className="tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={'tab ' + (activeTab === t.id ? 'active' : '')}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="dashboard-main">
        {activeTab === 'coverage' && (
          <CoverageView ads={ads} onJumpToAds={(filters) => {
            setActiveTab('ads');
            // pass filter via session
            sessionStorage.setItem('moise_lib_filters', JSON.stringify(filters));
          }} />
        )}
        {activeTab === 'ads' && (
          <AdsView ads={ads} contacts={contacts} user={user} onChange={reload} />
        )}
        {activeTab === 'contacts' && (
          <ContactsView contacts={contacts} ads={ads} onChange={reload} />
        )}
      </main>

      <style>{`
        .dashboard { min-height: 100vh; background: var(--cream-50); }
        .tabs {
          background: white;
          border-bottom: 1px solid var(--cream-200);
          padding: 0 24px;
          display: flex;
          gap: 4px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .tab {
          padding: 16px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-faint);
          font-family: var(--font-body);
          transition: all 0.15s;
        }
        .tab:hover { color: var(--ink-soft); }
        .tab.active { color: var(--ink); border-bottom-color: var(--terracotta); }
        .dashboard-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }
        @media (max-width: 640px) {
          .dashboard-main { padding: 16px; }
          .tabs { padding: 0 12px; }
          .tab { padding: 14px 14px; font-size: 13px; }
        }
      `}</style>
    </div>
  );
}
