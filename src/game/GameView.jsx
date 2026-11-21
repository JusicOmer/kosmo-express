import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { seededSession, lastSet } from '../lib/engine.js';
import { checkSolution } from '../lib/check.js';
import { analyzeError, analyzeWarnings, esc } from '../lib/errors.js';
import { fmt } from '../lib/hl.js';
import Editor from '../components/Editor.jsx';
import { SPEAKERS, MISSIONS, KAPITEL } from './story.js';
import { Juna, Brum, Bolzen, Zora, Crate, StarIcon, FrachtraumBg, BrueckeBg } from './art/index.js';

const ART = { juna: Juna, brum: Brum, bolzen: Bolzen, zora: Zora };
const SCHEMA = { fracht: ['id', 'name', 'ziel', 'gewicht'] };
const KEY = 'kosmo-game-v1';
const loadStars = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}').stars || []; } catch { return []; } };

function Portrait({ who, e, size = 112 }) {
  const C = ART[who] || Juna;
  return (
    <div className="portrait" key={who + e} style={{ width: size, height: size, borderColor: (SPEAKERS[who] || {}).color }}>
      <C emotion={e} size={size - 6} />
    </div>
  );
}

function Stars({ n, size = 18 }) {
  return <span className="stars">{[1, 2, 3].map((i) => <StarIcon key={i} filled={i <= n} size={size} />)}</span>;
}

async function loadRows(s) {
  const r = await s.exec('SELECT id, name, ziel, gewicht FROM fracht ORDER BY id');
  const set = lastSet(r.sets);
  return set ? set.values.map(([id, name, ziel, gewicht]) => ({ id, name, ziel, gewicht })) : [];
}

function mapResult(set, rows) {
  if (!set) return null;
  const ci = set.columns.indexOf('id'), cn = set.columns.indexOf('name');
  if (ci >= 0) return set.values.map((r) => rows.find((x) => x.id === r[ci])).filter(Boolean).map((x) => x.id);
  if (cn >= 0) return set.values.map((r) => rows.find((x) => x.name === r[cn])).filter(Boolean).map((x) => x.id);
  return null;
}

export default function GameView({ dark }) {
  const [idx, setIdx] = useState(0);
  const [stars, setStars] = useState(loadStars);
  const [phase, setPhase] = useState('intro'); // intro | play | win
  const [li, setLi] = useState(0);
  const [custom, setCustom] = useState(null);
  const [shown, setShown] = useState(0);
  const [session, setSession] = useState(null);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState([]);
  const [dim, setDim] = useState(new Set());
  const [glow, setGlow] = useState(new Set());
  const [pop, setPop] = useState(new Set());
  const [code, setCode] = useState('');
  const [fb, setFb] = useState([]);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [hints, setHints] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [solShown, setSolShown] = useState(false);
  const m = MISSIONS[idx];
  const sessRef = useRef(null);

  const resetWorld = useCallback(async (mission) => {
    if (sessRef.current) await sessRef.current.close();
    const s = await seededSession(mission.seed);
    sessRef.current = s;
    setSession(s);
    const r = await loadRows(s);
    setRows(r); setOrder(r.map((x) => x.id)); setDim(new Set()); setGlow(new Set()); setPop(new Set());
    setResult(null); setFb([]);
  }, []);

  // Mission starten
  useEffect(() => {
    setPhase('intro'); setLi(0); setCustom(null); setHints(0); setWrong(0); setSolShown(false); setCode('');
    resetWorld(m);
    return () => {};
  }, [idx, resetWorld]);
  useEffect(() => () => { if (sessRef.current) sessRef.current.close(); }, []);

  const lines = phase === 'intro' ? m.intro : phase === 'win' ? m.win : null;
  const current = custom || (lines && lines[li]) || { who: 'bolzen', e: 'curious', t: 'Schreibe deine Abfrage und drücke „Ausführen“. Ich helfe dir, wenn du nicht weiterkommst.' };

  // Schreibmaschine
  useEffect(() => {
    setShown(0);
    const t = current.t || '';
    const id = setInterval(() => setShown((s) => { if (s >= t.length) { clearInterval(id); return s; } return s + 2; }), 22);
    return () => clearInterval(id);
  }, [current.t, current.who]);

  const typed = (current.t || '').slice(0, shown);
  const done = shown >= (current.t || '').length;
  const atEnd = lines ? li >= lines.length - 1 : true;

  const advance = () => {
    if (!done) { setShown((current.t || '').length); return; }
    if (custom) { setCustom(null); return; }
    if (!lines) return;
    if (li < lines.length - 1) setLi(li + 1);
    else if (phase === 'intro') { setPhase('play'); setCustom(null); }
  };

  const say = (who, e, t) => setCustom({ who, e, t });

  const applyWorld = (newRows, set, prevRows) => {
    const changed = new Set(newRows.filter((n) => { const o = prevRows.find((x) => x.id === n.id); return o && (o.ziel !== n.ziel || o.gewicht !== n.gewicht || o.name !== n.name); }).map((x) => x.id));
    const keys = mapResult(set, newRows);
    if (keys) {
      const rest = newRows.map((x) => x.id).filter((id) => !keys.includes(id));
      setOrder([...keys, ...rest]); setGlow(new Set(keys)); setDim(new Set(rest));
    } else {
      setOrder(newRows.map((x) => x.id)); setDim(new Set()); setGlow(changed);
    }
    setPop(changed);
    if (changed.size) setTimeout(() => setPop(new Set()), 1400);
  };

  const run = async () => {
    const sql = code.trim();
    if (!sql || !session || busy) { if (!sql) say('bolzen', 'curious', 'Der Editor ist noch leer. Schreibe zuerst deine Abfrage!'); return; }
    setBusy(true);
    let ok = false;
    try {
      const prev = rows;
      const r = await session.exec(sql);
      const set = lastSet(r.sets);
      const nr = await loadRows(session);
      setRows(nr); setResult(set);
      applyWorld(nr, set, prev);
      setFb(analyzeWarnings(sql, set).map((w) => ({ kind: 'warn', title: w.titel, html: w.text })));
      ok = true;
    } catch (e) {
      const msg = String(e.message || e);
      const an = analyzeError(msg, sql, SCHEMA);
      setResult(null);
      setFb([{ kind: 'bad', title: 'Fehler im Bordsystem', html: '<code class="plain">' + esc(msg) + '</code>' }, ...an.map((a) => ({ kind: 'warn', title: a.titel, html: a.text }))]);
      setWrong((w) => w + 1);
      say('bolzen', 'worried', 'Piep, das Bordsystem meldet einen Fehler. ' + (an[0] ? an[0].text.replace(/<[^>]+>/g, '') : 'Schau dir die Meldung unten genau an.'));
    }
    if (ok) {
      const c = await checkSolution(m, sql);
      if (c.cmp && c.cmp.ok) win();
      else if (c.cmp) {
        setWrong((w) => w + 1);
        say('bolzen', 'worried', 'Fast, aber noch nicht ganz. ' + c.cmp.msgs.join(' ').replace(/<[^>]+>/g, ''));
      }
    }
    setBusy(false);
  };

  const win = () => {
    let s = 3;
    if (hints > 0) s = 2;
    if (wrong >= 3) s -= 1;
    if (solShown) s = 1;
    s = Math.max(1, s);
    const ns = [...stars];
    ns[idx] = Math.max(ns[idx] || 0, s);
    setStars(ns);
    try { localStorage.setItem(KEY, JSON.stringify({ stars: ns })); } catch {}
    setCustom(null); setLi(0); setPhase('win');
  };

  const askBolzen = () => {
    const n = Math.min(hints + 1, m.hinweise.length);
    setHints(n);
    say('bolzen', 'curious', 'Hinweis ' + n + ' von ' + m.hinweise.length + ': ' + m.hinweise[n - 1].replace(/\{\{|\}\}/g, '').replace(/<[^>]+>/g, ''));
  };
  const showSolution = () => { setSolShown(true); setCode(m.loesung); say('bolzen', 'proud', 'Hier ist die Lösung im Editor. Drücke „Ausführen“ und schau dir an, was passiert. Sterne gibt es dafür weniger, aber verstehen zählt!'); };
  const resetBtn = async () => { await resetWorld(m); say('juna', 'determined', 'Frachtraum zurückgesetzt. Wieder alles wie am Anfang.'); };
  const next = () => { if (idx < MISSIONS.length - 1) setIdx(idx + 1); };
  const goTo = (i) => { if (i <= stars.length || i === idx) setIdx(i); };

  const bg = phase === 'intro' && m.introBg === 'bruecke' ? 'bruecke' : 'fracht';
  const Bg = bg === 'bruecke' ? BrueckeBg : FrachtraumBg;
  const total = stars.reduce((a, b) => a + (b || 0), 0);
  const inWorkspace = phase !== 'intro';
  const last = idx === MISSIONS.length - 1;

  return (
    <div className="game">
      <div className="game-top">
        <div><span className="game-kap">{KAPITEL.titel}</span><span className="muted small"> · {KAPITEL.ort}</span></div>
        <div className="game-dots">
          {MISSIONS.map((x, i) => (
            <button key={x.id} className={'gdot' + (i === idx ? ' cur' : '') + (stars[i] ? ' done' : '')} onClick={() => goTo(i)} title={x.titel} aria-label={'Mission ' + x.id}>{stars[i] ? '★' : x.id}</button>
          ))}
          <span className="game-total"><StarIcon size={16} /> {total}</span>
        </div>
      </div>

      <div className="stage">
        <div className="stage-bg"><Bg /></div>
        {bg === 'fracht' && (
          <div className="crates">
            {rows.map((r) => {
              const pos = order.indexOf(r.id);
              return (
                <div key={r.id} className={'crate' + (dim.has(r.id) ? ' dim' : '') + (glow.has(r.id) ? ' glow' : '') + (pop.has(r.id) ? ' pop' : '')} style={{ left: 18 + pos * 10.1 + '%' }}>
                  <Crate ziel={r.ziel} name={r.name} size="100%" />
                  <span className="crate-name">{r.name}</span>
                </div>
              );
            })}
          </div>
        )}
        <div className="stage-portrait"><Portrait who={current.who} e={current.e} /></div>
        <div className="stage-ribbon">Mission {m.id}: {m.titel}</div>
      </div>

      <div className="dlg2" onClick={advance} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && advance()}>
        <div className="dlg2-name" style={{ color: (SPEAKERS[current.who] || {}).color }}>{(SPEAKERS[current.who] || {}).name}</div>
        <div className="dlg2-text">{typed}<span className="caret">{done ? '' : '▍'}</span></div>
        <div className="dlg2-next">
          {phase === 'intro' && done && <span className="go">{atEnd ? 'Los geht’s ▶' : 'Weiter ▶'}</span>}
          {phase === 'win' && done && !atEnd && <span className="go">Weiter ▶</span>}
        </div>
      </div>

      {phase === 'win' && atEnd && done && (
        <div className="winbar">
          <div><b>Mission geschafft!</b> <Stars n={stars[idx] || 1} size={22} /><div className="muted small">Gelernt: {m.lehre}</div></div>
          {!last ? <button className="btn primary" onClick={next}>Nächste Mission ▶</button> : <div className="fb ok" style={{ margin: 0 }}><b>Kapitel 1 geschafft!</b> Weitere Kapitel folgen. Hier endet der Prototyp.</div>}
        </div>
      )}

      {inWorkspace && (
        <div className="game-work">
          <div className="pane">
            <div className="task-box"><span className="task-label">Auftrag</span><div dangerouslySetInnerHTML={{ __html: m.aufgabe }} /></div>
            <Editor value={code} onChange={setCode} onRun={run} schema={SCHEMA} dark={dark} kind="sqlite" />
            <div className="actions">
              <button className="btn primary" onClick={run} disabled={!session || busy || phase === 'win'}>▶ Ausführen</button>
              <button className="btn ai" onClick={askBolzen} disabled={phase === 'win' || hints >= m.hinweise.length}>Bolzen fragen ({hints}/{m.hinweise.length})</button>
              {hints >= m.hinweise.length && !solShown && phase !== 'win' && <button className="btn ghost sm" onClick={showSolution}>Lösung zeigen</button>}
              <span className="grow" />
              <button className="btn ghost sm" onClick={resetBtn} title="Frachtraum zurücksetzen">↺ Welt</button>
            </div>
            {fb.map((f, i) => <div key={i} className={'fb ' + f.kind}><b>{f.title}</b><div dangerouslySetInnerHTML={{ __html: f.html }} /></div>)}
            {result && (
              <div className="tbl-wrap" style={{ marginTop: 10 }}>
                <table className="tbl"><thead><tr>{result.columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
                  <tbody>{result.values.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{String(v)}</td>)}</tr>)}</tbody></table>
              </div>
            )}
          </div>
          <div className="pane">
            <div className="task-label" style={{ color: 'var(--muted)' }}>Weltregister: Tabelle fracht (live)</div>
            <div className="tbl-wrap" style={{ maxHeight: 'none' }}>
              <table className="tbl">
                <thead><tr><th>id</th><th>name</th><th>ziel</th><th>gewicht</th></tr></thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className={'wr' + (glow.has(r.id) ? ' glowrow' : '') + (dim.has(r.id) ? ' dimrow' : '')}>
                      <td>{r.id}</td><td>{r.name}</td><td>{r.ziel}</td><td>{r.gewicht}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted small" style={{ margin: '8px 0 0' }}>Leuchtende Zeilen und Kisten gehören zu deinem Ergebnis. Abgedunkelte wurden nicht ausgewählt. Änderungen siehst du sofort in beiden.</p>
          </div>
        </div>
      )}
    </div>
  );
}
