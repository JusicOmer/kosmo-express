import React, { useEffect, useState } from 'react';
import GameView from './game/GameView.jsx';
import ArtSheet from './game/ArtSheet.jsx';
import { Juna } from './game/art/index.js';
import { initEngine } from './lib/engine.js';
import { setKey, useAiKey } from './lib/ai.js';

function KeyModal({ onClose }) {
  const cur = useAiKey();
  const [v, setV] = useState(cur);
  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="KI-Schlüssel">
        <div className="modal-head"><h3>Bolzen mit KI (Test)</h3><button className="icon-btn" aria-label="Schließen" onClick={onClose}>✕</button></div>
        <p className="muted small">Mit einem Groq-Schlüssel erklärt Bolzen deine Fehler genau und beantwortet Fragen. Den Schlüssel bekommst du kostenlos auf <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: 'var(--brand)' }}>console.groq.com/keys</a>.</p>
        <label className="field"><span>Groq API-Schlüssel</span><input type="password" value={v} placeholder="gsk_…" autoComplete="off" onChange={(e) => setV(e.target.value)} /></label>
        <div className="actions"><button className="btn primary" onClick={() => { setKey(v); onClose(); }}>Speichern</button>{cur && <button className="btn ghost" onClick={() => { setKey(''); setV(''); onClose(); }}>Schlüssel entfernen</button>}</div>
        <p className="muted small">Testbetrieb: Der Schlüssel wird nur in diesem Browser-Tab gehalten und ist weg, sobald du den Tab schließt. Er steht nicht im Code und wird nur direkt an Groq gesendet. Gib keine persönlichen Daten ein. Deine Eingaben und die Aufgabe werden dann an Groq (USA) übertragen.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const [hash, setHash] = useState(() => location.hash.slice(1));
  const [keyOpen, setKeyOpen] = useState(false);
  const aiKey = useAiKey();

  useEffect(() => { initEngine().then(() => setReady(true)).catch((e) => setErr(String(e.message || e))); }, []);
  useEffect(() => { const f = () => setHash(location.hash.slice(1)); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  const toggle = () => {
    const n = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = n;
    try { localStorage.setItem('kosmo-theme', n); } catch {}
    setTheme(n);
  };

  return (
    <div className="app">
      <header className="topbar">
        <a href="#/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', background: '#f4e3bb', display: 'inline-block' }}><Juna emotion="happy" size={38} /></span>
          <span className="logo-text"><span className="wm"><b>Kosmo</b><span className="grad">-Express</span></span><small>Das SQL-Abenteuer</small></span>
        </a>
        <span className="grow" />
        <button className={'btn sm ' + (aiKey ? 'ai on' : 'ghost')} onClick={() => setKeyOpen(true)} title="KI-Schlüssel für Bolzen">{aiKey ? '✦ KI aktiv' : '✦ KI'}</button>
        <button className="icon-btn" aria-label="Design wechseln" onClick={toggle} title="Hell/Dunkel">{theme === 'dark' ? '☀' : '☾'}</button>
      </header>
      <main className="game-main">
        {err && <div className="fb bad"><b>SQLite konnte nicht geladen werden</b>{err}</div>}
        {!ready && !err && <div className="loading"><div className="spinner" />Lade Spielwelt …</div>}
        {ready && hash === '/figuren' && <ArtSheet />}
        {ready && hash !== '/figuren' && <GameView dark={theme === 'dark'} />}
      </main>
      {keyOpen && <KeyModal onClose={() => setKeyOpen(false)} />}
      <footer className="footer"><span>Kosmo-Express (Prototyp)</span><a href="#/figuren">Figuren und Grafiken</a></footer>
    </div>
  );
}
