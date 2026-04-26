import { PHASES, ICPS, FUNNELS } from '../utils/constants.js';

export default function CoverageView({ ads, onJumpToAds }) {
  // Group phases by funnel
  const phasesByFunnel = FUNNELS.map(f => ({
    funnel: f,
    phases: PHASES.filter(p => p.funnel === f.id)
  }));

  function cellData(icpId, phaseId) {
    const counted = ads.filter(a =>
      a.icp === icpId && a.phase === phaseId && a.status !== 'archive'
    );
    return {
      total: counted.length,
      video: counted.filter(a => a.media === 'video').length,
      static: counted.filter(a => a.media === 'static').length
    };
  }

  function cellClass(total) {
    if (total === 0) return 'cell-empty';
    if (total === 1) return 'cell-low';
    if (total === 2) return 'cell-med';
    return 'cell-good';
  }

  return (
    <section>
      <header className="section-header">
        <h1 className="section-title">Coverage</h1>
        <p className="section-subtitle">
          How many ads have you <strong>made</strong> for each ICP and awareness stage? Click any cell to jump to those ads.
        </p>
      </header>

      <div className="legend">
        <span className="legend-item"><span className="swatch swatch-empty"></span>None</span>
        <span className="legend-item"><span className="swatch swatch-low"></span>1 ad</span>
        <span className="legend-item"><span className="swatch swatch-med"></span>2 ads</span>
        <span className="legend-item"><span className="swatch swatch-good"></span>3+ ads</span>
        <span className="legend-note">All ads counted except Archive · click to filter</span>
      </div>

      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th></th>
              {phasesByFunnel.map(({ funnel, phases }) => (
                <th key={funnel.id} colSpan={phases.length} className={'funnel-head funnel-' + funnel.id}>
                  {funnel.short}
                </th>
              ))}
            </tr>
            <tr>
              <th></th>
              {PHASES.map(p => (
                <th key={p.id} className="phase-head">{p.short}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ICPS.map(icp => (
              <tr key={icp.id}>
                <th className="icp-head">
                  <div className="icp-name">{icp.label}</div>
                  <div className="icp-desc">{icp.desc}</div>
                </th>
                {PHASES.map(phase => {
                  const data = cellData(icp.id, phase.id);
                  return (
                    <td
                      key={phase.id}
                      className={'matrix-cell ' + cellClass(data.total)}
                      onClick={() => onJumpToAds({ phase: phase.id, icp: icp.id })}
                    >
                      <div className="cell-total">{data.total}</div>
                      <div className="cell-breakdown">
                        {data.total > 0
                          ? `${data.static}s · ${data.video}v`
                          : 'none made'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .section-header { margin-bottom: 20px; }
        .section-title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 400;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .section-subtitle { color: var(--ink-soft); font-size: 14px; }
        .legend {
          display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
          padding: 12px 16px;
          background: white;
          border: 1px solid var(--cream-200);
          border-radius: var(--radius-md);
          margin-bottom: 16px;
          font-size: 12px;
        }
        .legend-item { display: flex; align-items: center; gap: 6px; }
        .swatch { width: 14px; height: 14px; border-radius: 3px; }
        .swatch-empty { background: var(--cream-100); border: 1px dashed var(--cream-300); }
        .swatch-low { background: #FBE9B5; }
        .swatch-med { background: #D6E0C2; }
        .swatch-good { background: var(--sage-soft); }
        .legend-note { margin-left: auto; color: var(--ink-faint); }
        .matrix-wrap { overflow-x: auto; background: white; border-radius: var(--radius-lg); border: 1px solid var(--cream-200); }
        .matrix { width: 100%; border-collapse: collapse; }
        .funnel-head {
          padding: 8px 6px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-align: center;
          border-bottom: 1px solid var(--cream-200);
        }
        .funnel-top { background: #F5EFE0; color: #8C6820; }
        .funnel-mid { background: #F5E5DA; color: var(--terracotta-dark); }
        .funnel-lower { background: #E8EFE0; color: #4A5A3C; }
        .phase-head {
          padding: 10px 6px;
          font-size: 11px;
          font-weight: 600;
          color: var(--ink-soft);
          text-align: center;
          border-bottom: 1px solid var(--cream-200);
          background: var(--cream-50);
        }
        .icp-head {
          padding: 12px 14px;
          text-align: left;
          background: var(--cream-50);
          border-right: 1px solid var(--cream-200);
          min-width: 140px;
        }
        .icp-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 500;
          color: var(--ink);
        }
        .icp-desc { font-size: 11px; color: var(--ink-faint); }
        .matrix-cell {
          padding: 14px 8px;
          text-align: center;
          cursor: pointer;
          border: 1px solid var(--cream-100);
          transition: all 0.12s;
          min-width: 90px;
        }
        .matrix-cell:hover { transform: scale(1.02); box-shadow: var(--shadow-sm); position: relative; z-index: 1; }
        .cell-empty { background: var(--cream-50); border-style: dashed; }
        .cell-low { background: #FBE9B5; }
        .cell-med { background: #D6E0C2; }
        .cell-good { background: var(--sage-soft); }
        .cell-total {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 500;
          color: var(--ink);
          line-height: 1;
        }
        .cell-empty .cell-total { color: var(--ink-faint); }
        .cell-breakdown { font-size: 10px; color: var(--ink-soft); margin-top: 4px; }
        .cell-empty .cell-breakdown { font-style: italic; color: var(--ink-faint); }
      `}</style>
    </section>
  );
}
