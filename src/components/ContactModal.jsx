import { useState } from 'react';
import api from '../utils/api.js';
import { useToast } from '../contexts/ToastContext.jsx';

const EMPTY = {
  name: '', instagram: '', tiktok: '', email: '',
  phone: '', whatsapp: '', preferredChannel: '', notes: ''
};

const CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp', href: v => 'https://wa.me/' + v.replace(/[^0-9]/g, '') },
  { key: 'email', label: 'Email', href: v => 'mailto:' + v },
  { key: 'instagram', label: 'Instagram', href: v => 'https://instagram.com/' + v.replace(/^@/, '') },
  { key: 'tiktok', label: 'TikTok', href: v => 'https://tiktok.com/@' + v.replace(/^@/, '') },
  { key: 'phone', label: 'Phone', href: v => 'tel:' + v.replace(/\s/g, '') }
];

export default function ContactModal({ contact, onClose, onSaved }) {
  const toast = useToast();
  const isNew = !contact;
  const [form, setForm] = useState(() => contact ? { ...EMPTY, ...contact } : { ...EMPTY });
  const [saving, setSaving] = useState(false);

  function field(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSave() {
    if (!form.name.trim()) { toast('Give the contact a name.'); return; }
    setSaving(true);
    try {
      if (isNew) await api.post('/contacts', form);
      else await api.patch('/contacts/' + contact._id, form);
      toast(isNew ? 'Contact added.' : 'Contact updated.');
      onSaved();
    } catch (err) {
      toast('Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!contact) return;
    if (!confirm('Delete this contact? Their ads will stay but lose the link.')) return;
    try {
      await api.delete('/contacts/' + contact._id);
      toast('Contact deleted.');
      onSaved();
    } catch (err) {
      toast('Delete failed.');
    }
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header className="modal-head">
          <h2>{isNew ? 'New contact' : 'Edit contact'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </header>

        <div className="modal-body">
          {/* Channel chips when editing */}
          {!isNew && (
            <div className="channel-chips">
              {CHANNELS.map(ch => {
                const val = form[ch.key];
                if (!val) return null;
                return (
                  <a key={ch.key}
                     className={'chan ' + (form.preferredChannel === ch.key ? 'preferred' : '')}
                     href={ch.href(val)}
                     target={(ch.key === 'instagram' || ch.key === 'tiktok') ? '_blank' : undefined}
                     rel="noopener">
                    {ch.label}
                  </a>
                );
              })}
            </div>
          )}

          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={e => field('name', e.target.value)} />
          </div>

          <div className="grid-2">
            <div>
              <label className="label">Instagram</label>
              <input className="input" value={form.instagram} onChange={e => field('instagram', e.target.value)} placeholder="@handle" />
            </div>
            <div>
              <label className="label">TikTok</label>
              <input className="input" value={form.tiktok} onChange={e => field('tiktok', e.target.value)} placeholder="@handle" />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={e => field('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={e => field('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">WhatsApp</label>
              <input className="input" value={form.whatsapp} onChange={e => field('whatsapp', e.target.value)} placeholder="+31…" />
            </div>
            <div>
              <label className="label">Preferred channel</label>
              <select className="select" value={form.preferredChannel} onChange={e => field('preferredChannel', e.target.value)}>
                <option value="">— None —</option>
                {CHANNELS.map(ch => <option key={ch.key} value={ch.key}>{ch.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea className="textarea" value={form.notes} onChange={e => field('notes', e.target.value)} />
          </div>
        </div>

        <footer className="modal-foot">
          {!isNew && <button className="btn btn-danger" onClick={handleDelete}>Delete</button>}
          <div className="spacer" />
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </footer>
      </div>

      <style>{`
        .modal-bg {
          position: fixed; inset: 0; background: rgba(43,36,30,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 20px;
        }
        .modal {
          background: var(--cream-50); border-radius: var(--radius-lg);
          width: 100%; max-width: 600px; max-height: 90vh;
          display: flex; flex-direction: column;
        }
        .modal-head {
          padding: 18px 24px; border-bottom: 1px solid var(--cream-200);
          display: flex; justify-content: space-between; align-items: center;
          background: white; border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }
        .modal-head h2 { font-family: var(--font-display); font-size: 22px; font-weight: 500; }
        .modal-close { background: none; border: none; font-size: 28px; color: var(--ink-faint); cursor: pointer; }
        .modal-body {
          overflow-y: auto; padding: 20px 24px; flex: 1;
          display: flex; flex-direction: column; gap: 16px;
        }
        .channel-chips { display: flex; gap: 6px; flex-wrap: wrap; padding-bottom: 6px; }
        .chan {
          padding: 6px 12px; border-radius: 16px;
          background: var(--cream-100); color: var(--ink-soft);
          font-size: 12px; font-weight: 500; text-decoration: none;
          border: 1px solid var(--cream-200);
        }
        .chan.preferred { background: var(--ink); color: var(--cream-50); border-color: var(--ink); }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .modal-foot {
          padding: 14px 24px; border-top: 1px solid var(--cream-200);
          display: flex; gap: 8px; align-items: center; background: white;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }
        .spacer { flex: 1; }
        @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
