import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { seededSession, lastSet } from '../lib/engine.js';
import { checkSolution } from '../lib/check.js';
import { analyzeError, analyzeWarnings, esc } from '../lib/errors.js';
import { fmt } from '../lib/hl.js';
import { aiChat, strip, BOLZEN_SYSTEM, useAiKey } from '../lib/ai.js';
import Editor from '../components/Editor.jsx';
import { SPEAKERS, MISSIONS, KAPITEL, KEY_HELP } from './story.js';
import { Juna, Brum, Bolzen, Zora, Crate, StarIcon, FrachtraumBg, BrueckeBg } from './art/index.js';

const ART = { juna: Juna, brum: Brum, bolzen: Bolzen, zora: Zora };
const SCHEMA = {
  fracht: ['id', 'name', 'ziel', 'gewicht', 'wert', 'haendler_id', 'status', 'notiz'],
  haendler: ['id', 'name', 'heimat'],
  ziele: ['id', 'name', 'art', 'entfernung', 'einwohner'],
  crew: ['id', 'name', 'rolle', 'gehalt', 'chef_id', 'deck'],
  protokoll: ['id', 'crew_id', 'aktion', 'zeit'],
};
const SCHEMA_TEXT = Object.entries(SCHEMA).map(([t, c]) => t + '(' + c.join(', ') + ')').join('\n');
const KEY = 'kosmo-game-v2';
const loadStars = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}').stars || {}; } catch { return {}; } };
const MULTI = ['ORDER BY', 'GROUP BY', 'LEFT JOIN', 'INSERT INTO', 'DELETE FROM', 'IS NULL', 'PARTITION BY'];

const hasWord = (sql, k) => new RegExp('(^|[^A-Za-z_])' + k.split(' ').join('[ ]+') + '($|[^A-Za-z_])', 'i').test(sql);

function blocksOf(solution) {
  let s = solution;
  MULTI.forEach((k) => { s = s.split(k).join(k.replace(' ', '_')); });
  const toks = s.match(/'[^']*'|[A-Za-z_][A-Za-z_0-9.]*|[0-9]+(\.[0-9]+)?|<=|>=|<>|[(),*;<>=+-]/g) || [];
  const seen = new Set(); const out = [];
  toks.forEach((t) => { const d = t.replace('_', ' '); const disp = MULTI.includes(d) ? d : t; if (!seen.has(disp)) { seen.add(disp); out.push(disp); } });
  const isKw = (t) => !!KEY_HELP[t] || /^(SELECT|FROM|WHERE|AND|OR|NOT|DESC|ASC)$/i.test(t);
  return out.sort((a, b) => (isKw(b) ? 1 : 0) - (isKw(a) ? 1 : 0) || a.localeCompare(b));
}

function Portrait({ who, e, size = 112 }) {
  const C = ART[who] || Juna;
  return (
    <div className="portrait" key={who + e} style={{ width: size, height: size, borderColor: (SPEAKERS[who] || {}).color }}>
      <C emotion={e} size={size - 6} />
    </div>
  );
}
function Stars({ n, size = 18 }) { return <span className="stars">{[1, 2, 3].map((i) => <StarIcon key={i} filled={i <= n} size={size} />)}</span>; }

async function loadRows(s) {
  const set = lastSet((await s.exec('SELECT id, name, ziel, gewicht FROM fracht ORDER BY id')).sets);
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
  const aiKey = useAiKey();
  const [stars, setStars] = useState(loadStars);
  const [idx, setIdx] = useState(() => { const s = loadStars(); const i = MISSIONS.findIndex((m) => !s[m.id]); return i < 0 ? 0 : i; });
  const [phase, setPhase] = useState('intro');
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
  const [monitor, setMonitor] = useState(null);
  const [busy, setBusy] = useState(false);
  const [hints, setHints] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [solShown, setSolShown] = useState(false);
  const [regTab, setRegTab] = useState('fracht');
  const [reg, setReg] = useState(null);
  const [ver, setVer] = useState(0);
  const [blocksOpen, setBlocksOpen] = useState(true);
  const [lektOpen, setLektOpen] = useState(true);
  const [question, setQuestion] = useState('');
  const m = MISSIONS[idx];
  const kap = KAPITEL.find((k) => k.id === m.kapitel);
  const sessRef = useRef(null);
  const reqRef = useRef(0);

  const resetWorld = useCallback(async (mission) => {
    if (sessRef.current) await sessRef.current.close();
    const s = await seededSession(mission.seed);
    sessRef.current = s;
    setSession(s);
    const r = await loadRows(s);
    setRows(r); setOrder(r.map((x) => x.id)); setDim(new Set()); setGlow(new Set()); setPop(new Set());
    setResult(null); setMonitor(null); setFb([]); setVer((v) => v + 1);
  }, []);

  useEffect(() => {
    setPhase('intro'); setLi(0); setCustom(null); setHints(0); setWrong(0); setSolShown(false); setCode('');
    setRegTab(m.tabs ? m.tabs[0] : kap.tabs[0]); setBlocksOpen(m.kapitel <= 2); setLektOpen(true);
    reqRef.current++;
    resetWorld(m);
  }, [idx, resetWorld]);
  useEffect(() => () => { if (sessRef.current) sessRef.current.close(); }, []);

  // Weltregister (aktiver Tab)
  useEffect(() => {
    if (!session) return;
    let off = false;
    session.exec('SELECT * FROM ' + regTab).then((r) => { const set = lastSet(r.sets); if (!off) setReg(set); }).catch(() => !off && setReg(null));
    return () => { off = true; };
  }, [session, regTab, ver]);

  const lines = phase === 'intro' ? m.intro : phase === 'win' ? m.win : null;
  const current = custom || (lines && lines[li]) || { who: 'bolzen', e: 'curious', t: 'Lies den Auftrag, schau dir die neue Lektion an und schreibe deine Abfrage. Ich helfe dir, wenn du nicht weiterkommst!' };

  useEffect(() => {
    setShown(0);
    const t = current.t || '';
    const id = setInterval(() => setShown((s) => { if (s >= t.length) { clearInterval(id); return s; } return s + 2; }), 20);
    return () => clearInterval(id);
  }, [current.t, current.who]);

  const typed = (current.t || '').slice(0, shown);
  const done = shown >= (current.t || '').length;
  const atEnd = lines ? li >= lines.length - 1 : true;
  const say = (who, e, t) => setCustom({ who, e, t });

  const advance = () => {
    if (!done) { setShown((current.t || '').length); return; }
    if (custom) { setCustom(null); return; }
    if (!lines) return;
    if (li < lines.length - 1) setLi(li + 1);
    else if (phase === 'intro') { setPhase('play'); setCustom(null); }
  };

  const applyWorld = (newRows, set, prevRows) => {
    const changed = new Set(newRows.filter((n) => { const o = prevRows.find((x) => x.id === n.id); return o && (o.ziel !== n.ziel || o.gewicht !== n.gewicht || o.name !== n.name); }).map((x) => x.id));
    const keys = m.map === 'fracht' ? mapResult(set, newRows) : null;
    if (keys) {
      const rest = newRows.map((x) => x.id).filter((id) => !keys.includes(id));
      setOrder([...keys, ...rest]); setGlow(new Set(keys)); setDim(new Set(rest)); setMonitor(null);
    } else {
      setOrder(newRows.map((x) => x.id)); setDim(new Set()); setGlow(changed);
      setMonitor(set && set.values.length ? set : null);
    }
    setPop(changed);
    if (changed.size) setTimeout(() => setPop(new Set()), 1400);
  };

  // ---------- KI-Bolzen ----------
  const context = (sql, problem) => [
    'AUFTRAG: ' + strip(m.aufgabe),
    'TABELLEN:\n' + SCHEMA_TEXT,
    'FÜR DIESEN AUFTRAG NÖTIGE SCHLÜSSELWÖRTER: ' + (m.keys || []).join(', '),
    'EINGABE DER SPIELERIN: ' + (sql.trim() || '(leer)'),
    problem ? 'PROBLEM: ' + problem : '',
  ].filter(Boolean).join('\n');

  const askAI = async (userText, ctx, emotion) => {
    const id = ++reqRef.current;
    setCustom({ who: 'bolzen', e: 'curious', t: 'Piep, ich schaue mir das genau an …' });
    try {
      const txt = await aiChat({ messages: [{ role: 'system', content: BOLZEN_SYSTEM }, { role: 'user', content: ctx + '\n\n' + userText }] });
      if (id === reqRef.current) setCustom({ who: 'bolzen', e: emotion, t: txt || 'Piep? Dazu fällt mir gerade nichts ein.' });
      return true;
    } catch (e) {
      if (id === reqRef.current) return e.message;
      return false;
    }
  };

  const localDiagnose = (sql, cmp, errMsg) => {
    if (errMsg) {
      const an = analyzeError(errMsg, sql, SCHEMA);
      return 'Das Bordsystem meldet einen Fehler. ' + (an[0] ? strip(an[0].text) : 'Lies die Meldung unter dem Editor genau.');
    }
    const missing = (m.keys || []).filter((k) => !hasWord(sql, k));
    if (missing.length) return 'Dir fehlt noch: ' + missing.join(', ') + '. ' + (KEY_HELP[missing[0]] || '');
    if (m.verify) return 'Die Tabelle sieht nach deiner Anweisung noch nicht richtig aus. Schau im Weltregister, welche Zeilen sich geändert haben, und prüfe dein WHERE.';
    const msgs = (cmp ? cmp.msgs : []).map(strip).filter((x) => !/JOIN/.test(x));
    return 'Fast, aber noch nicht ganz. ' + (msgs.join(' ') || 'Vergleiche dein Ergebnis mit dem Auftrag.') + ' Prüfe die Bedingung und die Spalten.';
  };

  const run = async (sqlOverride, practice) => {
    const sql = (sqlOverride != null ? sqlOverride : code).trim();
    if (!sql) { say('bolzen', 'curious', 'Der Editor ist noch leer. Klicke ein paar Bausteine oder schreibe deine Abfrage!'); return; }
    if (!session || busy) return;
    setBusy(true);
    let ok = false, errMsg = '';
    try {
      const prev = rows;
      const r = await session.exec(sql);
      const set = lastSet(r.sets);
      const nr = await loadRows(session);
      setRows(nr); setResult(set); setVer((v) => v + 1);
      applyWorld(nr, set, prev);
      setFb(practice ? [] : analyzeWarnings(sql, set).map((w) => ({ kind: 'warn', title: w.titel, html: w.text })));
      ok = true;
    } catch (e) {
      errMsg = String(e.message || e);
      setResult(null);
      setFb([{ kind: 'bad', title: 'Fehler im Bordsystem', html: '<code class="plain">' + esc(errMsg) + '</code>' }]);
    }
    if (practice) { if (ok) say('bolzen', 'happy', 'So sieht das Beispiel aus! Schau auf die Kisten und das Weltregister. Jetzt bist du dran.'); setBusy(false); return; }
    let cmp = null;
    if (ok) {
      const c = await checkSolution(m, sql);
      cmp = c.cmp;
      if (cmp && cmp.ok) { setBusy(false); win(); return; }
    }
    setWrong((w) => w + 1);
    const local = localDiagnose(sql, cmp, errMsg);
    say('bolzen', 'worried', local);
    setBusy(false);
    if (aiKey) {
      const problem = errMsg ? 'Fehlermeldung des Bordsystems: ' + errMsg : 'Ergebnis stimmt nicht. ' + (cmp ? cmp.msgs.map(strip).filter((x) => !/JOIN/.test(x)).join(' ') : '') + ' Fehlende Schlüsselwörter: ' + ((m.keys || []).filter((k) => !hasWord(sql, k)).join(', ') || 'keine');
      const r = await askAI('Erkläre der Spielerin genau, was an ihrer Eingabe nicht stimmt und was sie als Nächstes tun soll. Verrate nicht die ganze Lösung.', context(sql, problem), 'worried');
      if (typeof r === 'string') setFb((f) => [...f, { kind: 'warn', title: 'KI nicht erreichbar', html: esc(r) }]);
    }
  };

  const win = () => {
    let s = 3;
    if (hints > 0) s = 2;
    if (wrong >= 3) s -= 1;
    if (solShown) s = 1;
    s = Math.max(1, s);
    const ns = { ...stars, [m.id]: Math.max(stars[m.id] || 0, s) };
    setStars(ns);
    try { localStorage.setItem(KEY, JSON.stringify({ stars: ns })); } catch {}
    reqRef.current++;
    setCustom(null); setLi(0); setPhase('win');
  };

  const askBolzen = async () => {
    const n = Math.min(hints + 1, m.hinweise.length);
    setHints(n);
    const stat = 'Hinweis ' + n + ' von ' + m.hinweise.length + ': ' + strip(m.hinweise[n - 1]);
    if (!aiKey) { say('bolzen', 'curious', stat); return; }
    const level = ['Gib nur eine kleine Denkrichtung, ohne ein Schlüsselwort zu verraten.', 'Nenne das wichtigste Schlüsselwort oder den nächsten Schritt.', 'Zeige ein kleines Gerüst mit Lücken (___), aber nicht die fertige Lösung.'][n - 1];
    const r = await askAI('Die Spielerin braucht einen Hinweis. ' + level + ' Gehe auf ihre aktuelle Eingabe ein.', context(code, ''), 'curious');
    if (typeof r === 'string') say('bolzen', 'curious', stat);
  };
  const askFree = async (e) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || !aiKey) return;
    setQuestion('');
    const r = await askAI('FRAGE DER SPIELERIN: ' + q + '\nBeantworte sie kurz und einfach. Verrate nicht die komplette Lösung des Auftrags.', context(code, ''), 'happy');
    if (typeof r === 'string') say('bolzen', 'worried', r);
  };

  const showSolution = () => { setSolShown(true); setCode(m.loesung); say('bolzen', 'proud', 'Hier ist die Lösung im Editor. Drücke „Ausführen“ und schau dir an, was passiert. Dafür gibt es weniger Sterne, aber verstehen zählt!'); };
  const resetBtn = async () => { await resetWorld(m); say('juna', 'determined', 'Frachtraum zurückgesetzt. Wieder alles wie am Anfang.'); };
  const addBlock = (t) => setCode((c) => c + (/^[,;)]$/.test(t) || !c || /[(]$/.test(c) ? '' : ' ') + t);
  const next = () => { if (idx < MISSIONS.length - 1) setIdx(idx + 1); };
  const firstOpen = MISSIONS.findIndex((x) => !stars[x.id]);
  const unlocked = firstOpen < 0 ? MISSIONS.length - 1 : firstOpen;
  const goTo = (i) => { if (i <= unlocked) setIdx(i); };
  const restart = () => { if (confirm('Alle Sterne löschen und das Spiel von vorn beginnen?')) { setStars({}); try { localStorage.removeItem(KEY); } catch {} setIdx(0); } };

  const bg = phase === 'intro' && m.introBg === 'bruecke' ? 'bruecke' : 'fracht';
  const Bg = bg === 'bruecke' ? BrueckeBg : FrachtraumBg;
  const total = Object.values(stars).reduce((a, b) => a + (b || 0), 0);
  const inWork = phase !== 'intro';
  const last = idx === MISSIONS.length - 1;
  const blocks = useMemo(() => blocksOf(m.loesung), [m]);
  const keysState = (m.keys || []).map((k) => ({ k, ok: hasWord(code, k) }));
  const lektRunnable = m.lektion && /^\s*(select|with)/i.test(m.lektion.code);
  const n = Math.max(rows.length, 1);
  const cw = Math.min(9.6, (78 / n) * 0.94);
  const gap = n > 1 ? Math.min(10.1, 78 / n) : 10;
  const chapMissions = MISSIONS.filter((x) => x.kapitel === m.kapitel);
  const chapDone = chapMissions.filter((x) => stars[x.id]).length;

  return (
    <div className="game">
      <div className="game-top">
        <div className="game-top-l">
          <select className="chap-select" value={m.kapitel} onChange={(e) => { const k = +e.target.value; const i = MISSIONS.findIndex((x) => x.kapitel === k && !stars[x.id]); goTo(i < 0 ? MISSIONS.findIndex((x) => x.kapitel === k) : i); }} aria-label="Kapitel wählen">
            {KAPITEL.map((k) => { const first = MISSIONS.findIndex((x) => x.kapitel === k.id); return <option key={k.id} value={k.id} disabled={first > unlocked}>Kapitel {k.id}: {k.titel}</option>; })}
          </select>
          <span className="muted small">{kap.ort} · {chapDone}/{chapMissions.length} Missionen</span>
        </div>
        <div className="game-dots">
          {chapMissions.map((x) => { const i = MISSIONS.indexOf(x); return <button key={x.id} className={'gdot' + (i === idx ? ' cur' : '') + (stars[x.id] ? ' done' : '') + (x.boss ? ' boss' : '')} onClick={() => goTo(i)} title={x.titel} aria-label={'Mission ' + x.titel} disabled={i > unlocked}>{stars[x.id] ? '★' : x.nr}</button>; })}
          <span className="game-total"><StarIcon size={16} /> {total} / {MISSIONS.length * 3}</span>
        </div>
      </div>

      <div className="game-grid">
        <div className="game-left">
          <div className="stage">
            <div className="stage-bg"><Bg /></div>
            {bg === 'fracht' && (
              <div className="crates">
                {rows.map((r) => {
                  const pos = order.indexOf(r.id);
                  return (
                    <div key={r.id} title={r.name + ' · ' + r.ziel + ' · ' + r.gewicht + ' kg'} className={'crate' + (dim.has(r.id) ? ' dim' : '') + (glow.has(r.id) ? ' glow' : '') + (pop.has(r.id) ? ' pop' : '')} style={{ left: 18 + pos * gap + '%', width: cw + '%' }}>
                      <Crate ziel={r.ziel} name={r.name} size="100%" />
                      {n <= 9 && <span className="crate-name">{r.name}</span>}
                    </div>
                  );
                })}
              </div>
            )}
            {monitor && bg === 'fracht' && (
              <div className="monitor" aria-label="Bordmonitor">
                <div className="monitor-t">Bordmonitor · {monitor.values.length} Zeile{monitor.values.length === 1 ? '' : 'n'}</div>
                <table><thead><tr>{monitor.columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
                  <tbody>{monitor.values.slice(0, 7).map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{v === null ? 'NULL' : String(v)}</td>)}</tr>)}</tbody></table>
                {monitor.values.length > 7 && <div className="monitor-more">… und {monitor.values.length - 7} weitere</div>}
              </div>
            )}
            <div className="stage-portrait"><Portrait who={current.who} e={current.e} /></div>
            <div className="stage-ribbon">Mission {m.nr}: {m.titel}{m.boss ? ' · Boss' : ''}</div>
          </div>

          <div className="dlg2" onClick={advance} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && advance()}>
            <div className="dlg2-name" style={{ color: (SPEAKERS[current.who] || {}).color }}>{(SPEAKERS[current.who] || {}).name}</div>
            <div className="dlg2-text">{typed}<span className="caret">{done ? '' : '▍'}</span></div>
            <div className="dlg2-next">
              {phase === 'intro' && done && <span className="go">{atEnd ? 'Los geht’s ▶' : 'Weiter ▶'}</span>}
              {phase === 'win' && done && !atEnd && <span className="go">Weiter ▶</span>}
            </div>
          </div>

          {inWork && phase === 'play' && (
            aiKey
              ? <form className="askbar" onSubmit={askFree}><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Frag Bolzen etwas zu SQL oder zum Auftrag …" aria-label="Frage an Bolzen" /><button className="btn sm primary" disabled={!question.trim()}>Fragen</button></form>
              : <div className="askbar off muted small">Tipp: Mit einem Groq-Schlüssel (Button „KI“ oben) analysiert Bolzen deine Fehler genau und beantwortet Fragen.</div>
          )}

          {phase === 'win' && atEnd && done && (
            <div className="winbar">
              <div><b>Mission geschafft!</b> <Stars n={stars[m.id] || 1} size={22} /><div className="muted small" style={{ color: 'inherit', opacity: .85 }}>Gelernt: {m.lehre}</div></div>
              {!last ? <button className="btn primary" onClick={next}>{m.nr === chapMissions.length ? 'Nächstes Kapitel ▶' : 'Nächste Mission ▶'}</button> : null}
            </div>
          )}
          {phase === 'win' && atEnd && done && last && (
            <div className="finale">
              <h2>Du hast den Kosmo-Express gerettet!</h2>
              <p>Von <code>SELECT</code> bis zu Window Functions: Du hast {MISSIONS.length} Missionen gemeistert und <b>{total} von {MISSIONS.length * 3}</b> Sternen gesammelt.</p>
              <div className="actions"><button className="btn" onClick={() => setIdx(0)}>Noch einmal von vorn spielen</button><button className="btn ghost" onClick={restart}>Sterne zurücksetzen</button></div>
            </div>
          )}

          {inWork && (
            <div className="pane register">
              <div className="reg-head">
                <span className="task-label" style={{ color: 'var(--muted)', margin: 0 }}>Weltregister (live)</span>
                <div className="reg-tabs" role="tablist">
                  {(m.tabs || kap.tabs).map((t) => <button key={t} role="tab" aria-selected={regTab === t} className={'tab-chip' + (regTab === t ? ' on' : '')} onClick={() => setRegTab(t)}>{t}</button>)}
                </div>
              </div>
              {reg && (
                <div className="tbl-wrap" style={{ maxHeight: 360 }}>
                  <table className="tbl">
                    <thead><tr>{reg.columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
                    <tbody>{reg.values.map((r, i) => {
                      const id = r[reg.columns.indexOf('id')];
                      const mapped = m.map === regTab;
                      return <tr key={i} className={'wr' + (mapped && glow.has(id) ? ' glowrow' : '') + (mapped && dim.has(id) ? ' dimrow' : '')}>{r.map((v, j) => <td key={j} className={v === null ? 'nul' : ''}>{v === null ? 'NULL' : String(v)}</td>)}</tr>;
                    })}</tbody>
                  </table>
                </div>
              )}
              <p className="muted small" style={{ margin: '8px 0 0' }}>Leuchtende Zeilen und Kisten gehören zu deinem Ergebnis, abgedunkelte wurden nicht ausgewählt. Änderungen siehst du sofort.</p>
            </div>
          )}
        </div>

        <div className="game-right">
          {!inWork && (
            <div className="pane intro-hint"><h3>Mission {m.nr}: {m.titel}</h3><p className="muted">Klicke auf den Dialog unter dem Bild, um die Geschichte weiterzulesen. Danach siehst du hier deinen Auftrag und die neue Lektion.</p></div>
          )}
          {inWork && (
            <>
              {m.lektion && (
                <div className="pane lektion">
                  <button className="lekt-head" onClick={() => setLektOpen((v) => !v)} aria-expanded={lektOpen}>
                    <span className="lekt-ic">★</span><b>{m.lektion.titel}</b><span className="grow" /><span className="muted small">{lektOpen ? 'einklappen' : 'aufklappen'}</span>
                  </button>
                  {lektOpen && (
                    <div className="lekt-body">
                      <div dangerouslySetInnerHTML={{ __html: m.lektion.text }} />
                      <pre className="code">{m.lektion.code}</pre>
                      <div className="actions" style={{ margin: 0 }}>
                        {lektRunnable && <button className="btn sm primary" onClick={() => run(m.lektion.code, true)} disabled={busy}>Beispiel in der Welt zeigen</button>}
                        <button className="btn sm" onClick={() => setCode(m.lektion.code)}>In den Editor kopieren</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="pane">
                <div className="task-box"><span className="task-label">Auftrag</span><div dangerouslySetInnerHTML={{ __html: m.aufgabe }} /></div>
                <div className="checklist">
                  <span className="muted small">Das brauchst du:</span>
                  {keysState.map(({ k, ok }) => <span key={k} className={'kchip' + (ok ? ' ok' : '')} title={KEY_HELP[k]}>{ok ? '✓' : '○'} {k}</span>)}
                </div>
                <div className="blocks-head"><button className="linkbtn" onClick={() => setBlocksOpen((v) => !v)}>{blocksOpen ? 'Bausteine ausblenden' : 'Bausteine zeigen'}</button></div>
                {blocksOpen && <div className="blocks">{blocks.map((t) => <button key={t} className={'blk' + (KEY_HELP[t] ? ' kw' : '')} onClick={() => addBlock(t)}>{t}</button>)}<button className="blk clr" onClick={() => setCode('')}>löschen</button></div>}
                <Editor value={code} onChange={setCode} onRun={() => run()} schema={SCHEMA} dark={dark} kind="sqlite" />
                <div className="actions">
                  <button className="btn primary" onClick={() => run()} disabled={!session || busy || phase === 'win'}>▶ Ausführen</button>
                  <button className="btn ai" onClick={askBolzen} disabled={phase === 'win' || hints >= m.hinweise.length}>Bolzen fragen ({hints}/{m.hinweise.length}){aiKey ? ' · KI' : ''}</button>
                  {hints >= m.hinweise.length && !solShown && phase !== 'win' && <button className="btn ghost sm" onClick={showSolution}>Lösung zeigen</button>}
                  <span className="grow" />
                  <button className="btn ghost sm" onClick={resetBtn} title="Frachtraum zurücksetzen">↺ Welt</button>
                </div>
                {fb.map((f, i) => <div key={i} className={'fb ' + f.kind}><b>{f.title}</b><div dangerouslySetInnerHTML={{ __html: f.html }} /></div>)}
                {result && (
                  <div className="tbl-wrap" style={{ marginTop: 10 }}>
                    <table className="tbl"><thead><tr>{result.columns.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
                      <tbody>{result.values.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className={v === null ? 'nul' : ''}>{v === null ? 'NULL' : String(v)}</td>)}</tr>)}</tbody></table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
