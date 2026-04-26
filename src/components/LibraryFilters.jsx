import { PHASES, ICPS, FUNNELS, CONTENT_TYPES } from '../utils/constants.js';

export default function LibraryFilters({ filters, setFilters, contacts, resultCount }) {
  function update(key, val) {
    setFilters({ ...filters, [key]: val });
  }

  return (
    <div className="filters">
      <div className="filter-section">
        <span className="filter-label">Search</span>
        <div className="filter-content">
          <input
            type="text"
            className="search-input"
            placeholder="Title, format, notes…"
            value={filters.search}
            onChange={e => update('search', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Narrow by</span>
        <div className="filter-content">
          <select className="filter-select" value={filters.phase} onChange={e => update('phase', e.target.value)}>
            <option value="">All phases</option>
            {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <select className="filter-select" value={filters.icp} onChange={e => update('icp', e.target.value)}>
            <option value="">All ICPs</option>
            {ICPS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
          </select>
          <select className="filter-select" value={filters.type} onChange={e => update('type', e.target.value)}>
            <option value="">All types</option>
            {CONTENT_TYPES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select className="filter-select" value={filters.creator} onChange={e => update('creator', e.target.value)}>
            <option value="">All creators</option>
            {contacts.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Funnel</span>
        <div className="filter-content">
          <ChipGroup
            value={filters.funnel}
            options={[{ value: '', label: 'All' }, ...FUNNELS.map(f => ({ value: f.id, label: f.short }))]}
            onChange={v => update('funnel', v)}
          />
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Status</span>
        <div className="filter-content">
          <ChipGroup
            value={filters.status}
            options={[
              { value: '', label: 'All' },
              { value: 'active', label: 'Live + Paused' },
              { value: 'in-progress', label: 'In progress' },
              { value: 'live', label: 'Live only' },
              { value: 'archive', label: 'Archive' }
            ]}
            onChange={v => update('status', v)}
          />
        </div>
      </div>

      <div className="filter-section">
        <span className="filter-label">Media</span>
        <div className="filter-content">
          <ChipGroup
            value={filters.media}
            options={[
              { value: '', label: 'All' },
              { value: 'static', label: 'Static' },
              { value: 'video', label: 'Video' }
            ]}
            onChange={v => update('media', v)}
          />
          <span className="result-count">{resultCount} {resultCount === 1 ? 'result' : 'results'}</span>
        </div>
      </div>

      <style>{`
        .filters {
          background: white;
          border: 1px solid var(--cream-200);
          border-radius: var(--radius-lg);
          margin-bottom: 20px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }
        .filter-section {
          display: grid;
          grid-template-columns: 100px 1fr;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--cream-100);
        }
        .filter-section:last-child { border-bottom: none; }
        .filter-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ink-faint);
          white-space: nowrap;
        }
        .filter-content {
          display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
        }
        .search-input {
          flex: 1; min-width: 200px;
          padding: 7px 12px;
          border: 1px solid var(--cream-200);
          border-radius: var(--radius-sm);
          font-size: 13px; background: var(--cream-50);
          font-family: var(--font-body);
        }
        .search-input:focus { outline: none; border-color: var(--terracotta); background: white; }
        .filter-select {
          padding: 7px 28px 7px 10px;
          border: 1px solid var(--cream-200);
          border-radius: var(--radius-sm);
          font-size: 12px;
          background: var(--cream-50);
          font-family: var(--font-body);
          cursor: pointer;
        }
        .result-count {
          margin-left: auto; font-size: 12px; color: var(--ink-faint); font-style: italic;
        }
        @media (max-width: 640px) {
          .filter-section { grid-template-columns: 1fr; gap: 6px; }
        }
      `}</style>
    </div>
  );
}

function ChipGroup({ value, options, onChange }) {
  return (
    <div className="chip-group">
      {options.map(opt => (
        <button
          key={opt.value}
          className={'chip ' + (value === opt.value ? 'active' : '')}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
      <style>{`
        .chip-group { display: flex; gap: 5px; flex-wrap: wrap; }
        .chip {
          padding: 5px 11px;
          border: 1px solid var(--cream-200);
          border-radius: 20px;
          background: var(--cream-50);
          font-size: 12px; font-weight: 500;
          color: var(--ink-soft); cursor: pointer;
          transition: all 0.15s;
          font-family: var(--font-body);
          white-space: nowrap;
        }
        .chip:hover { border-color: var(--ink-faint); color: var(--ink); }
        .chip.active { background: var(--ink); color: var(--cream-50); border-color: var(--ink); }
      `}</style>
    </div>
  );
}
