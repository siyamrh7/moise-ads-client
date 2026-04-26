import { useState } from 'react';
import api from '../utils/api.js';
import { useToast } from '../contexts/ToastContext.jsx';
import ContactModal from './ContactModal.jsx';

export default function ContactsView({ contacts, ads, onChange }) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const filtered = contacts.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    const hay = [c.name, c.instagram, c.tiktok, c.email, c.phone, c.whatsapp, c.notes].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(q);
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section>
      <header className="section-header">
        <div>
          <h1 className="section-title">Contacts</h1>
          <p className="section-subtitle">Creators in one place. Click any card for details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ New contact</button>
      </header>

      <div className="filters">
        <div className="filter-row">
          <span className="filter-label">Search</span>
          <input
            type="text" className="search-input"
            placeholder="Name, handle, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No contacts yet</h3>
          <p>Add your first creator to get started.</p>
        </div>
      ) : (
        <div className="contacts-grid">
          {filtered.map(c => (
            <div key={c._id} className="contact-card" onClick={() => setEditing(c)}>
              <div className="contact-head">
                <div className="contact-avatar">
                  {(c.name.split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase()) || '?'}
                </div>
                <div>
                  <div className="contact-name">{c.name}</div>
                  {c.adsCount > 0 && (
                    <div className="contact-count">{c.adsCount} {c.adsCount === 1 ? 'ad' : 'ads'}</div>
                  )}
                </div>
              </div>
              {c.notes && <div className="contact-notes">{c.notes.slice(0, 100)}{c.notes.length > 100 ? '…' : ''}</div>}
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <ContactModal
          contact={editing._id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onChange(); }}
        />
      )}

      <style>{`
        .section-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .section-title {
          font-family: var(--font-display); font-size: 32px; font-weight: 400;
          color: var(--ink); margin-bottom: 4px;
        }
        .section-subtitle { color: var(--ink-soft); font-size: 14px; }
        .filters {
          background: white; border: 1px solid var(--cream-200);
          border-radius: var(--radius-lg); margin-bottom: 20px;
          box-shadow: var(--shadow-sm); overflow: hidden;
        }
        .filter-row {
          display: grid; grid-template-columns: 100px 1fr;
          align-items: center; gap: 12px; padding: 12px 16px;
        }
        .filter-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--ink-faint);
        }
        .search-input {
          padding: 7px 12px; border: 1px solid var(--cream-200);
          border-radius: var(--radius-sm); font-size: 13px;
          background: var(--cream-50); font-family: var(--font-body); width: 100%;
        }
        .contacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }
        .contact-card {
          background: white; border-radius: var(--radius-md);
          padding: 16px; cursor: pointer;
          border: 1px solid var(--cream-200);
          box-shadow: var(--shadow-sm);
          transition: all 0.15s;
        }
        .contact-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
        .contact-head { display: flex; gap: 12px; align-items: center; margin-bottom: 10px; }
        .contact-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: var(--sage-soft); color: #4A5A3C;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; font-size: 14px;
        }
        .contact-name {
          font-family: var(--font-display); font-size: 17px;
          font-weight: 500; color: var(--ink);
        }
        .contact-count { font-size: 12px; color: var(--ink-faint); margin-top: 2px; }
        .contact-notes { font-size: 12px; color: var(--ink-soft); line-height: 1.5; }
      `}</style>
    </section>
  );
}
