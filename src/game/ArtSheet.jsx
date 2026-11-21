import React from 'react';
import { Juna, Brum, Bolzen, Zora, Crate, ItemIcon, PlanetIcon, StarIcon, FrachtraumBg, BrueckeBg, MapBg } from './art/index.js';
const EM = ['happy', 'curious', 'surprised', 'worried', 'angry', 'determined', 'sleepy', 'proud'];
const CH = { Juna, Brum, Bolzen, Zora };
const NAMES = ['Pizzaofen', 'Kaktus', 'Raumanzug', 'Eisblock', 'Gitarre', 'Tomaten', 'Ersatzteile', 'Teleskop'];
export default function ArtSheet() {
  return (
    <div style={{ background: '#fbf8ec', color: '#222', padding: 12 }}>
      {Object.entries(CH).map(([n, C]) => (
        <div key={n} style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {EM.map((e) => <div key={e} style={{ textAlign: 'center', fontSize: 11 }}><div style={{ width: 96, height: 96, borderRadius: '50%', background: '#f4e3bb', overflow: 'hidden' }}><C emotion={e} size={96} /></div>{n}:{e}</div>)}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['Mars', 'Venus', 'Mond'].flatMap((z) => NAMES.slice(0, 4).map((n) => <div key={z + n} style={{ width: 80 }}><Crate ziel={z} name={n} size={80} /></div>))}
        {NAMES.map((n) => <ItemIcon key={n} name={n} size={50} />)}
        {['Mars', 'Venus', 'Mond'].map((z) => <PlanetIcon key={z} ziel={z} size={40} />)}<StarIcon size={30} /><StarIcon filled={false} size={30} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>{[FrachtraumBg, BrueckeBg, MapBg].map((B, i) => <div key={i} style={{ width: 300, height: 132 }}><B /></div>)}</div>
    </div>
  );
}
