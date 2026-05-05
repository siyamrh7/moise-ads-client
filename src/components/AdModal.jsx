import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useToast } from '../contexts/ToastContext.jsx';
import { PHASES, ICPS, FUNNELS, CONTENT_TYPES, FORMATS, getPhase, getStatus, getFunnel } from '../utils/constants.js';
import { getAvailableActions, statusBannerText } from '../utils/actions.js';

const EMPTY = {
  title: '', phase: '', format: '', icp: '', media: '', contentType: '',
  creator: '', hook: '', concept: '', script: '', shotlist: [],
  visualRef: '', visualDesc: '', driveLink: '', notes: ''
};

export default function AdModal({ ad, parentAdId, contacts, ads, user, onClose, onSaved, onIterate }) {
  const toast = useToast();
  const isNew = !ad;
  const [form, setForm] = useState(() => {
    if (!ad) return { ...EMPTY };
    return {
      ...EMPTY,
      ...ad,
      creator: ad.creator?._id || ad.creator || '',
      shotlist: Array.isArray(ad.shotlist) ? ad.shotlist : []
    };
  });
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState('');

  function field(key, val) { setForm(f => ({ ...f, [key]: val })); }

  // When phase changes, reset format
  useEffect(() => {
    if (ad && ad.phase === form.phase) return;
    setForm(f => ({ ...f, format: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.phase]);

  async function handleSave({ thenDeploy = false } = {}) {
    if (!form.title.trim()) { toast('Give the ad a title.'); return; }
    if (thenDeploy && !form.driveLink) { toast('Add the Drive link first.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, creator: form.creator || null, parentAdId: parentAdId || form.parentAdId || null };
      let savedAd;
      if (isNew) {
        const res = await api.post('/ads', payload);
        savedAd = res.data.ad;
      } else {
        const res = await api.patch('/ads/' + ad._id, payload);
        savedAd = res.data.ad;
      }
      if (thenDeploy) {
        await api.post('/ads/' + savedAd._id + '/transition', {
          newStatus: 'ready',
          systemMessage: 'Ray: marked the creative ready (Drive link added).'
        });
        toast('Saved as Ready.');
      } else {
        toast(isNew ? 'Idea created.' : 'Saved.');
      }
      onSaved();
    } catch (err) {
      toast(err.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAction(action) {
    if (!ad) { toast('Save the ad first.'); return; }
    if (action.requiresDrive && !form.driveLink) { toast('Add the Drive link first.'); return; }
    setBusy(true);
    try {
      // Save current form first (in case fields changed)
      await api.patch('/ads/' + ad._id, { ...form, creator: form.creator || null });
      await api.post('/ads/' + ad._id + '/transition', {
        newStatus: action.newStatus,
        systemMessage: action.systemMessage
      });
      toast(action.label + ' done.');
      onSaved();
    } catch (err) {
      toast(err.response?.data?.error || 'Action failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleComment() {
    if (!comment.trim() || !ad) return;
    try {
      await api.post('/ads/' + ad._id + '/comments', { body: comment });
      setComment('');
      toast('Comment added.');
      onSaved();
    } catch (err) {
      toast('Failed to add comment.');
    }
  }

  async function handleDelete() {
    if (!ad) return;
    if (!confirm('Delete this ad? This cannot be undone.')) return;
    try {
      await api.delete('/ads/' + ad._id);
      toast('Ad deleted.');
      onSaved();
    } catch (err) {
      toast('Delete failed.');
    }
  }

  const status = ad ? getStatus(ad.status) : null;
  const banner = ad ? statusBannerText(ad, user.role) : null;
  const actions = ad ? getAvailableActions(ad, user.role) : [];
  const formats = FORMATS[form.phase] || [];
  const showProductionSection = ad
    ? ['production', 'ready', 'live', 'paused', 'archive'].includes(ad.status) || (user.role === 'ray' && ad.status === 'idea')
    : user.role === 'ray';

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header className="modal-head">
          <h2>{isNew ? 'New idea' : 'Edit ad'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </header>

        <div className="modal-body">
          {/* Status banner (existing ads) */}
          {banner && (
            <div className="banner">
              <div className="banner-title">{banner.title}</div>
              <div className="banner-hint">{banner.hint}</div>
            </div>
          )}

          {/* Action zone */}
          {actions.length > 0 && (
            <div className="action-zone">
              <div className="action-zone-title">Available actions</div>
              <div className="action-zone-buttons">
                {actions.map(a => (
                  <button
                    key={a.id}
                    className={'btn btn-' + a.style}
                    onClick={() => handleAction(a)}
                    disabled={busy}
                    title={a.hint}
                  >{a.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Form fields */}
          <div className="form-grid">
            <div className="full">
              <label className="label">Title</label>
              <input className="input" value={form.title} onChange={e => field('title', e.target.value)} placeholder="Short, descriptive title" />
            </div>

            <div>
              <label className="label">Phase</label>
              <select className="select" value={form.phase} onChange={e => field('phase', e.target.value)}>
                <option value="">— Not decided yet —</option>
                {PHASES.map(p => {
                  const funnel = FUNNELS.find(f => f.id === p.funnel);
                  const count = ads.filter(a => a.phase === p.id && a.status !== 'archive').length;
                  return <option key={p.id} value={p.id}>{funnel.short} · {p.label} ({count})</option>;
                })}
              </select>
            </div>

            <div>
              <label className="label">Format</label>
              <select className="select" value={form.format} onChange={e => field('format', e.target.value)}>
                <option value="">— Not decided yet —</option>
                {formats.map(f => <option key={f.id} value={f.id}>{f.priority ? '★ ' : ''}{f.label}</option>)}
              </select>
            </div>

            <div>
              <label className="label">ICP</label>
              <select className="select" value={form.icp} onChange={e => field('icp', e.target.value)}>
                <option value="">— Not decided yet —</option>
                {ICPS.map(i => <option key={i.id} value={i.id}>{i.label} — {i.desc}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Media</label>
              <select className="select" value={form.media} onChange={e => field('media', e.target.value)}>
                <option value="">— Not decided yet —</option>
                <option value="video">Video</option>
                <option value="static">Static</option>
              </select>
            </div>

            <div>
              <label className="label">Content type</label>
              <select className="select" value={form.contentType} onChange={e => field('contentType', e.target.value)}>
                <option value="">— Not decided yet —</option>
                {CONTENT_TYPES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Creator</label>
              <select className="select" value={form.creator} onChange={e => field('creator', e.target.value)}>
                <option value="">— Not decided yet —</option>
                {contacts.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div className="full">
              <label className="label">Hook</label>
              <input className="input" value={form.hook} onChange={e => field('hook', e.target.value)} placeholder="Opening line that stops the scroll" />
            </div>

            <div className="full">
              <label className="label">Concept</label>
              <textarea className="textarea" value={form.concept} onChange={e => field('concept', e.target.value)} placeholder="One paragraph: what is this ad?" />
            </div>

            {form.media === 'video' && (
              <div className="full">
                <label className="label">Script</label>
                <textarea className="textarea" rows="6" value={form.script} onChange={e => field('script', e.target.value)} />
              </div>
            )}

            {form.media === 'static' && (
              <>
                <div className="full">
                  <label className="label">Visual reference URL</label>
                  <input className="input" value={form.visualRef} onChange={e => field('visualRef', e.target.value)} placeholder="https://…" />
                </div>
                <div className="full">
                  <label className="label">Visual description</label>
                  <textarea className="textarea" value={form.visualDesc} onChange={e => field('visualDesc', e.target.value)} />
                </div>
              </>
            )}

            <div className="full">
              <label className="label">Notes</label>
              <textarea className="textarea" value={form.notes} onChange={e => field('notes', e.target.value)} />
            </div>

            {/* Production section */}
            {showProductionSection && (
              <div className="full production-section">
                <div className="section-divider">Production</div>
                <label className="label">Google Drive link</label>
                <input className="input" value={form.driveLink} onChange={e => field('driveLink', e.target.value)} placeholder="https://drive.google.com/…" />
              </div>
            )}
          </div>

          {/* Comments */}
          {ad && (
            <div className="comments">
              <div className="section-divider">Conversation</div>
              <div className="comment-list">
                {(ad.comments || []).length === 0 && <div className="muted">No messages yet.</div>}
                {(ad.comments || []).map((c, idx) => (
                  <div key={idx} className={'comment comment-' + c.author}>
                    <div className="comment-meta">
                      <strong>{c.author === 'system' ? '⚙ System' : c.author === 'ray' ? 'Ray' : 'Agency'}</strong>
                      <span>{new Date(c.createdAt).toLocaleString('en-GB')}</span>
                    </div>
                    <div className="comment-body">{c.body}</div>
                  </div>
                ))}
              </div>
              <div className="comment-input">
                <textarea
                  className="textarea"
                  rows="2"
                  placeholder="Write a comment…"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
                <button className="btn btn-secondary" onClick={handleComment} disabled={!comment.trim()}>Send</button>
              </div>
            </div>
          )}
        </div>

        <footer className="modal-foot">
          {ad && <button className="btn btn-danger" onClick={handleDelete}>Delete</button>}
          <div className="spacer" />
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-secondary" onClick={() => handleSave()} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          {isNew && user.role === 'ray' && (
            <button className="btn btn-approve" onClick={() => handleSave({ thenDeploy: true })} disabled={saving}>⚡ Save & mark Ready</button>
          )}
        </footer>
      </div>

      <style>{`
        .modal-bg {
          position: fixed; inset: 0; background: rgba(43, 36, 30, 0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 100; padding: 20px;
        }
        .modal {
          background: var(--cream-50);
          border-radius: var(--radius-lg);
          width: 100%; max-width: 720px; max-height: 90vh;
          display: flex; flex-direction: column;
          box-shadow: var(--shadow-lg);
        }
        .modal-head {
          padding: 18px 24px;
          border-bottom: 1px solid var(--cream-200);
          display: flex; justify-content: space-between; align-items: center;
          background: white; border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }
        .modal-head h2 { font-family: var(--font-display); font-size: 22px; font-weight: 500; }
        .modal-close {
          background: none; border: none; font-size: 28px; color: var(--ink-faint);
          cursor: pointer; line-height: 1;
        }
        .modal-body {
          overflow-y: auto;
          padding: 20px 24px;
          flex: 1;
          display: flex; flex-direction: column; gap: 18px;
        }
        .banner {
          padding: 12px 16px;
          background: white;
          border-left: 3px solid var(--terracotta);
          border-radius: var(--radius-sm);
        }
        .banner-title {
          font-family: var(--font-display); font-size: 16px;
          font-weight: 500; color: var(--ink);
        }
        .banner-hint { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }
        .action-zone {
          background: white;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          border: 1px solid var(--cream-200);
        }
        .action-zone-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--ink-faint); margin-bottom: 10px;
        }
        .action-zone-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
        .form-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }
        .form-grid .full { grid-column: 1 / -1; }
        .section-divider {
          font-family: var(--font-display); font-size: 14px;
          color: var(--ink-soft); border-top: 1px solid var(--cream-200);
          padding-top: 12px; margin-top: 4px; font-style: italic;
        }
        .production-section { padding-top: 10px; }
        .comments { display: flex; flex-direction: column; gap: 12px; }
        .comment-list { display: flex; flex-direction: column; gap: 8px; }
        .comment {
          padding: 10px 12px; border-radius: var(--radius-sm);
          background: white; border: 1px solid var(--cream-200);
        }
        .comment-system { background: var(--cream-100); border-style: dashed; font-style: italic; }
        .comment-meta {
          display: flex; justify-content: space-between;
          font-size: 11px; color: var(--ink-faint); margin-bottom: 4px;
        }
        .comment-body { font-size: 13px; color: var(--ink); white-space: pre-wrap; }
        .comment-input { display: flex; gap: 8px; align-items: flex-end; }
        .comment-input textarea { flex: 1; }
        .muted { color: var(--ink-faint); font-style: italic; padding: 12px 0; }
        .modal-foot {
          padding: 14px 24px;
          border-top: 1px solid var(--cream-200);
          display: flex; gap: 8px; align-items: center;
          background: white; border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }
        .spacer { flex: 1; }
        @media (max-width: 640px) {
          .modal { max-height: 100vh; border-radius: 0; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
