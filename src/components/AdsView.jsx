import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useToast } from '../contexts/ToastContext.jsx';
import { PHASES, ICPS, FUNNELS, STATUSES, CONTENT_TYPES, getPhase, getStatus, getFunnel } from '../utils/constants.js';
import { isActionNeeded } from '../utils/actions.js';
import AdModal from './AdModal.jsx';
import LibraryFilters from './LibraryFilters.jsx';

const EMPTY_FILTERS = { search: '', phase: '', icp: '', type: '', creator: '', status: 'active', media: '', funnel: '', priority: false };

export default function AdsView({ ads, contacts, user, onChange }) {
  const toast = useToast();
  const [view, setView] = useState('pipeline');
  const [editingAd, setEditingAd] = useState(null);
  const [parentAdId, setParentAdId] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // If sessionStorage has filters from CoverageView, apply them
  useEffect(() => {
    const stored = sessionStorage.getItem('moise_lib_filters');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFilters({ ...EMPTY_FILTERS, ...parsed, status: '' });
        setView('library');
      } catch {}
      sessionStorage.removeItem('moise_lib_filters');
    }
  }, []);

  function openNew() { setEditingAd({}); setParentAdId(null); }
  function openEdit(ad) { setEditingAd(ad); setParentAdId(null); }
  function openIteration(parent) { setEditingAd({}); setParentAdId(parent._id); }
  function closeModal() { setEditingAd(null); setParentAdId(null); }

  const pendingCount = ads.filter(a => isActionNeeded(a, user.role)).length;

  return (
    <section>
      <header className="section-header">
        <div>
          <h1 className="section-title">Ads</h1>
          <p className="section-subtitle">
            {pendingCount > 0 ? <strong style={{color: 'var(--danger)'}}>{pendingCount} need your attention.</strong> : 'Everything is on track.'}
          </p>
        </div>
        <div className="section-actions">
          <div className="view-toggle">
            <button className={'toggle-btn ' + (view === 'pipeline' ? 'active' : '')} onClick={() => setView('pipeline')}>Pipeline</button>
            <button className={'toggle-btn ' + (view === 'library' ? 'active' : '')} onClick={() => setView('library')}>Library</button>
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ New idea</button>
        </div>
      </header>

      {view === 'pipeline'
        ? <PipelineView ads={ads} contacts={contacts} user={user} onCardClick={openEdit} />
        : <LibraryView ads={ads} contacts={contacts} filters={filters} setFilters={setFilters} onCardClick={openEdit} />}

      {editingAd !== null && (
        <AdModal
          ad={editingAd._id ? editingAd : null}
          parentAdId={parentAdId}
          contacts={contacts}
          ads={ads}
          user={user}
          onClose={closeModal}
          onSaved={() => { closeModal(); onChange(); }}
          onIterate={openIteration}
        />
      )}

      <style>{`
        .section-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .section-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .view-toggle {
          display: inline-flex; background: var(--cream-100);
          border-radius: var(--radius-sm); padding: 3px;
        }
        .toggle-btn {
          padding: 7px 14px; background: none; border: none;
          font-size: 13px; font-weight: 500; color: var(--ink-soft);
          border-radius: 4px; transition: all 0.15s;
        }
        .toggle-btn.active { background: white; color: var(--ink); box-shadow: var(--shadow-sm); }
      `}</style>
    </section>
  );
}

// --- Pipeline view (kanban) ---
function PipelineView({ ads, contacts, user, onCardClick }) {
  return (
    <div className="pipeline">
      {STATUSES.map(status => {
        const items = ads.filter(a => a.status === status.id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return (
          <div className="pipeline-col" key={status.id}>
            <div className="col-head">
              <span className={'col-dot col-dot-' + status.id}></span>
              <span className="col-title">{status.short}</span>
              <span className="col-count">{items.length}</span>
            </div>
            <div className="col-list">
              {items.length === 0 ? <div className="col-empty">—</div> : items.map((ad, idx) => (
                <PipelineCard key={ad._id} ad={ad} num={idx + 1} user={user} onClick={() => onCardClick(ad)} />
              ))}
            </div>
          </div>
        );
      })}

      <style>{`
        .pipeline {
          display: grid;
          grid-template-columns: repeat(8, minmax(220px, 1fr));
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 16px;
        }
        .pipeline-col {
          background: var(--cream-100);
          border-radius: var(--radius-md);
          padding: 12px;
          min-height: 200px;
        }
        .col-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .col-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ink-faint); }
        .col-dot-idea { background: #C7B8A0; }
        .col-dot-review { background: var(--amber); }
        .col-dot-feedback { background: var(--rose); }
        .col-dot-production { background: var(--terracotta); }
        .col-dot-ready { background: #9B6BB5; }
        .col-dot-live { background: var(--success); }
        .col-dot-paused { background: var(--ink-faint); }
        .col-dot-archive { background: var(--cream-300); }
        .col-title {
          font-size: 12px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--ink-soft); flex: 1;
        }
        .col-count {
          font-size: 11px; font-weight: 700;
          background: white; padding: 2px 8px; border-radius: 10px;
          color: var(--ink-soft);
        }
        .col-empty { text-align: center; color: var(--ink-faint); padding: 24px 0; font-style: italic; }
        .col-list { display: flex; flex-direction: column; gap: 8px; }
      `}</style>
    </div>
  );
}

function PipelineCard({ ad, num, user, onClick }) {
  const phase = getPhase(ad.phase);
  const needsAction = isActionNeeded(ad, user.role);

  return (
    <div className={'pipe-card ' + (needsAction ? 'pipe-card-action' : '')} onClick={onClick}>
      {ad.parentAdId && <div className="iter-badge">↳ iteration</div>}
      <div className="pipe-card-head">
        <span className="card-num">{num}</span>
        <span className="pipe-card-title">{ad.title || '(no title)'}</span>
      </div>
      <div className="pipe-card-meta">
        {phase && <span className={'tag tag-phase tag-' + phase.id}>{phase.short}</span>}
        {ad.icp && <span className="tag tag-icp">{ad.icp}</span>}
        {ad.media && <span className="tag tag-media">{ad.media}</span>}
      </div>
      <div className="pipe-card-foot">
        <span>{ad.creator?.name || '—'}</span>
        <span>{(ad.comments || []).filter(c => c.author !== 'system').length > 0 ? '💬' : ''}</span>
      </div>
      <style>{`
        .pipe-card {
          background: white;
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          border-left: 3px solid transparent;
          transition: all 0.15s;
        }
        .pipe-card:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
        .pipe-card-action { border-left-color: var(--danger); }
        .iter-badge { font-size: 10px; color: var(--ink-faint); margin-bottom: 4px; }
        .pipe-card-head { display: flex; gap: 6px; align-items: flex-start; margin-bottom: 6px; }
        .card-num {
          font-family: var(--font-display);
          font-size: 11px; color: var(--ink-faint);
          background: var(--cream-100); border-radius: 4px;
          padding: 1px 6px; flex-shrink: 0;
        }
        .pipe-card-title {
          font-family: var(--font-display); font-size: 14px;
          color: var(--ink); line-height: 1.3; flex: 1;
        }
        .pipe-card-meta { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
        .tag {
          font-size: 9px; font-weight: 600; padding: 2px 7px;
          border-radius: 8px; text-transform: uppercase; letter-spacing: 0.04em;
        }
        .tag-unaware, .tag-problem { background: #F0EBE0; color: #7A6A4A; }
        .tag-solution, .tag-product { background: #F5E5DA; color: var(--terracotta-dark); }
        .tag-most, .tag-caring { background: var(--sage-soft); color: #4A5A3C; }
        .tag-icp { background: var(--cream-200); color: var(--ink-soft); }
        .tag-media { background: var(--cream-100); color: var(--ink-soft); }
        .pipe-card-foot {
          display: flex; justify-content: space-between;
          font-size: 11px; color: var(--ink-faint);
        }
      `}</style>
    </div>
  );
}

// --- Library view ---
function LibraryView({ ads, contacts, filters, setFilters, onCardClick }) {
  const filtered = ads.filter(ad => {
    if (filters.phase && ad.phase !== filters.phase) return false;
    if (filters.icp && ad.icp !== filters.icp) return false;
    if (filters.type && ad.contentType !== filters.type) return false;
    if (filters.creator && ad.creator?._id !== filters.creator) return false;
    if (filters.media && ad.media !== filters.media) return false;
    if (filters.funnel) {
      const phase = getPhase(ad.phase);
      if (!phase || phase.funnel !== filters.funnel) return false;
    }
    if (filters.status === 'active' && !['live', 'paused'].includes(ad.status)) return false;
    if (filters.status === 'in-progress' && !['idea', 'review', 'feedback', 'production', 'ready'].includes(ad.status)) return false;
    if (filters.status === 'live' && ad.status !== 'live') return false;
    if (filters.status === 'archive' && ad.status !== 'archive') return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const hay = [ad.title, ad.notes, ad.concept, ad.hook].filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div>
      <LibraryFilters filters={filters} setFilters={setFilters} contacts={contacts} resultCount={filtered.length} />
      {filtered.length === 0 ? (
        <div className="empty-state"><h3>No ads match your filters</h3><p>Try clearing or broadening the filters above.</p></div>
      ) : (
        <div className="lib-grid">
          {filtered.map((ad, idx) => <LibraryCard key={ad._id} ad={ad} num={idx + 1} onClick={() => onCardClick(ad)} />)}
        </div>
      )}
      <style>{`
        .lib-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
      `}</style>
    </div>
  );
}

function LibraryCard({ ad, num, onClick }) {
  const phase = getPhase(ad.phase);
  const status = getStatus(ad.status);
  return (
    <div className="lib-card" onClick={onClick}>
      <div className="lib-card-head">
        <span className="card-num">{num}</span>
        <span className="lib-card-title">{ad.title || '(no title)'}</span>
        <span className={'pill pill-' + status.id}>{status.short}</span>
      </div>
      {ad.parentAdId && <div className="iter-tag">↳ Iteration</div>}
      <div className="lib-card-meta">
        {phase && <span className={'tag tag-phase tag-' + phase.id}>{phase.short}</span>}
        {ad.icp && <span className="tag tag-icp">{ad.icp}</span>}
        {ad.media && <span className="tag tag-media">{ad.media}</span>}
      </div>
      <div className="lib-card-foot">
        <span>{ad.creator?.name || 'No creator'}</span>
        {ad.driveLink && <a href={ad.driveLink} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>Drive ↗</a>}
      </div>
      <style>{`
        .lib-card {
          background: white; border-radius: var(--radius-md);
          padding: 14px; cursor: pointer;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--cream-200);
          transition: all 0.15s;
          display: flex; flex-direction: column; gap: 8px;
        }
        .lib-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
        .lib-card-head { display: flex; gap: 8px; align-items: flex-start; }
        .card-num {
          font-family: var(--font-display); font-size: 11px; color: var(--ink-faint);
          background: var(--cream-100); border-radius: 4px;
          padding: 1px 6px; flex-shrink: 0;
        }
        .lib-card-title {
          flex: 1; font-family: var(--font-display); font-size: 16px;
          color: var(--ink); line-height: 1.3;
        }
        .pill {
          font-size: 10px; font-weight: 600; padding: 3px 8px;
          border-radius: 10px; text-transform: uppercase; letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .pill-idea { background: var(--cream-200); color: var(--ink-soft); }
        .pill-review { background: var(--amber-soft); color: #8C6820; }
        .pill-feedback { background: var(--rose-soft); color: #8A3E3E; }
        .pill-production { background: var(--terracotta-soft); color: var(--terracotta-dark); }
        .pill-ready { background: #E8D5EF; color: #6B3E85; }
        .pill-live { background: var(--sage-soft); color: #4A5A3C; }
        .pill-paused { background: var(--cream-200); color: var(--ink-faint); }
        .pill-archive { background: #EEE8DF; color: var(--ink-faint); }
        .iter-tag { font-size: 11px; color: var(--ink-faint); }
        .lib-card-meta { display: flex; gap: 4px; flex-wrap: wrap; }
        .tag {
          font-size: 9px; font-weight: 600; padding: 2px 7px;
          border-radius: 8px; text-transform: uppercase; letter-spacing: 0.04em;
        }
        .tag-unaware, .tag-problem { background: #F0EBE0; color: #7A6A4A; }
        .tag-solution, .tag-product { background: #F5E5DA; color: var(--terracotta-dark); }
        .tag-most, .tag-caring { background: var(--sage-soft); color: #4A5A3C; }
        .tag-icp { background: var(--cream-200); color: var(--ink-soft); }
        .tag-media { background: var(--cream-100); color: var(--ink-soft); }
        .lib-card-foot {
          display: flex; justify-content: space-between;
          font-size: 12px; color: var(--ink-faint); margin-top: 4px;
        }
        .lib-card-foot a { color: var(--terracotta); text-decoration: none; }
      `}</style>
    </div>
  );
}
