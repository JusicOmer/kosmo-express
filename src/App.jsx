import React, { useEffect, useState } from 'react';
import GameView from './game/GameView.jsx';
import ArtSheet from './game/ArtSheet.jsx';
import { Juna } from './game/art/index.js';
import { initEngine } from './lib/engine.js';

export default function App() {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  const [hash, setHash] = useState(() => location.hash.slice(1));

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
        <button className="icon-btn" aria-label="Design wechseln" onClick={toggle} title="Hell/Dunkel">{theme === 'dark' ? '☀' : '☾'}</button>
      </header>
      <main style={{ maxWidth: 1180, margin: '0 auto' }}>
        {err && <div className="fb bad"><b>SQLite konnte nicht geladen werden</b>{err}</div>}
        {!ready && !err && <div className="loading"><div className="spinner" />Lade Spielwelt …</div>}
        {ready && hash === '/figuren' && <ArtSheet />}
        {ready && hash !== '/figuren' && <GameView dark={theme === 'dark'} />}
      </main>
      <footer className="footer"><span>Kosmo-Express (Prototyp)</span><a href="#/figuren">Figuren und Grafiken</a></footer>
    </div>
  );
}
