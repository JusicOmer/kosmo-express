import React from 'react';

const O = '#2a1d18';

const PALETTE = {
  Mars: { main: '#c8552c', light: '#e57c42', dark: '#8c3720', strap: '#4a2a22' },
  Venus: { main: '#dcab22', light: '#f4d35e', dark: '#a87a14', strap: '#5a3d1a' },
  Mond: { main: '#8798ae', light: '#b9c6d6', dark: '#5a6a82', strap: '#2f3a4d' },
};

const strokeProps = {
  stroke: O,
  strokeWidth: 2.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* ---------- Planeten ---------- */

function PlanetBody({ ziel }) {
  if (ziel === 'Venus') {
    return (
      <g {...strokeProps} strokeWidth={1.8}>
        <circle cx="12" cy="12" r="9" fill="#f2c94c" />
        <g fill="none" strokeWidth="1.6">
          <path d="M5 9 Q8.5 7.4 12 9 T19 9" stroke="#d99a22" />
          <path d="M4.2 13 Q8 11.4 12 13 T19.8 13" stroke="#fff2b0" />
          <path d="M5.8 16.6 Q9 15 12 16.6 T18.2 16.6" stroke="#d99a22" />
        </g>
      </g>
    );
  }
  if (ziel === 'Mond') {
    return (
      <g {...strokeProps} strokeWidth={1.8}>
        <circle cx="12" cy="12" r="9" fill="#b9c0cb" />
        <g stroke="none" fill="#8993a3">
          <circle cx="8.5" cy="9" r="2.3" />
          <circle cx="15.5" cy="14" r="2.8" />
          <circle cx="10" cy="16.5" r="1.3" />
          <circle cx="15" cy="7.6" r="1.1" />
        </g>
      </g>
    );
  }
  return (
    <g {...strokeProps} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" fill="#d9573a" />
      <g stroke="none" fill="#a03a24">
        <circle cx="8.5" cy="9" r="2.1" />
        <circle cx="15" cy="14.5" r="2.5" />
        <circle cx="12.5" cy="7" r="1.1" />
        <circle cx="8.5" cy="16" r="1.2" />
      </g>
    </g>
  );
}

export function PlanetIcon({ ziel, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <PlanetBody ziel={ziel} />
    </svg>
  );
}

/* ---------- Stern ---------- */

const STAR_POINTS = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 === 0 ? 11 : 4.7;
  const a = (-90 + i * 36) * (Math.PI / 180);
  return `${(12 + r * Math.cos(a)).toFixed(2)},${(12.6 + r * Math.sin(a)).toFixed(2)}`;
}).join(' ');

export function StarIcon({ filled = true, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <polygon
        points={STAR_POINTS}
        fill={filled ? '#f7c22d' : '#e3dfdc'}
        stroke={filled ? O : '#a79e99'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {filled && (
        <polygon points="12,5.2 13.3,9.4 11,9.4" fill="#fde58a" stroke="none" />
      )}
    </svg>
  );
}

/* ---------- Inhalts-Icons (64x64) ---------- */

const GEAR_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const ICONS = {
  Pizzaofen: () => (
    <g>
      <rect x="38" y="3" width="9" height="16" rx="1.5" fill="#8c3720" />
      <rect x="36" y="2" width="13" height="4" rx="1.5" fill="#6f2c1a" />
      <path d="M9 54 V33 Q9 10 32 10 Q55 10 55 33 V54 Z" fill="#c8552c" />
      <path d="M43 14 Q55 20 55 33 V54 H46 V30 Q46 20 43 14Z" fill="#a8421f" stroke="none" />
      <g fill="none" strokeWidth="1.6" stroke="#8c3720">
        <path d="M13 28 H20 M44 28 H51 M11 40 H19 M45 40 H53 M24 17 H32 M36 20 H42" />
      </g>
      <path d="M21 54 V41 Q21 28 32 28 Q43 28 43 41 V54 Z" fill="#3a2420" />
      <path d="M32 54 Q24 51 27 43 Q29 46 30 44 Q31 39 30 36 Q38 42 37 48 Q36 52 40 52 Q38 54 32 54Z" fill="#ff9d2b" strokeWidth="1.6" />
      <path d="M32 54 Q29 52 31 48 Q33 49 34 47 Q36 51 32 54Z" fill="#ffd84a" stroke="none" />
      <rect x="5" y="53" width="54" height="7" rx="2" fill="#8d8d9a" />
      <rect x="7" y="54.5" width="50" height="2" fill="#b4b4c0" stroke="none" />
    </g>
  ),

  Kaktus: () => (
    <g>
      <rect x="11" y="17" width="10" height="19" rx="5" fill="#4aa35a" />
      <rect x="13" y="28" width="16" height="9" rx="4.5" fill="#4aa35a" />
      <rect x="43" y="12" width="10" height="17" rx="5" fill="#4aa35a" />
      <rect x="35" y="22" width="16" height="9" rx="4.5" fill="#4aa35a" />
      <rect x="24" y="6" width="16" height="40" rx="8" fill="#4aa35a" />
      <path d="M35 14 V40" fill="none" stroke="#2f7a40" strokeWidth="3" />
      <path d="M28 14 V38" fill="none" stroke="#7fd08a" strokeWidth="2" />
      <g fill="none" strokeWidth="1.6">
        <path d="M32 20 L32 20 M30 30 L30 30 M33 36 L33 36" />
        <path d="M16 24 V24 M48 18 V18" />
      </g>
      <circle cx="32" cy="6.5" r="3.6" fill="#f06a8c" strokeWidth="2" />
      <circle cx="32" cy="6.5" r="1" fill="#ffd84a" stroke="none" />
      <path d="M19 44 H45 L42 60 H22 Z" fill="#c8693a" />
      <path d="M38 44 H45 L42 60 H36Z" fill="#a34f27" stroke="none" />
      <rect x="16" y="40" width="32" height="7" rx="2.5" fill="#d9783f" />
    </g>
  ),

  Raumanzug: () => (
    <g>
      <rect x="14" y="30" width="36" height="20" rx="5" fill="#8d95a6" />
      <rect x="9" y="32" width="10" height="19" rx="5" fill="#f1f1f6" />
      <rect x="45" y="32" width="10" height="19" rx="5" fill="#f1f1f6" />
      <circle cx="14" cy="52" r="4.5" fill="#d94f3d" />
      <circle cx="50" cy="52" r="4.5" fill="#d94f3d" />
      <rect x="21" y="47" width="10" height="14" rx="3.5" fill="#f1f1f6" />
      <rect x="33" y="47" width="10" height="14" rx="3.5" fill="#f1f1f6" />
      <rect x="20" y="57" width="12" height="5" rx="2" fill="#5a6277" />
      <rect x="32" y="57" width="12" height="5" rx="2" fill="#5a6277" />
      <rect x="18" y="29" width="28" height="22" rx="7" fill="#f1f1f6" />
      <path d="M39 30 Q46 31 46 40 V45 Q46 51 40 51 H38 Q42 44 39 30Z" fill="#cfd3de" stroke="none" />
      <rect x="25" y="35" width="14" height="9" rx="2" fill="#2f4f87" strokeWidth="2" />
      <circle cx="29" cy="39.5" r="1.8" fill="#ffd84a" stroke="none" />
      <circle cx="35" cy="39.5" r="1.8" fill="#d94f3d" stroke="none" />
      <circle cx="32" cy="17" r="13" fill="#f6f6fa" />
      <path d="M40 8 Q46 15 42 25 Q38 29 32 30 Q43 24 40 8Z" fill="#cfd3de" stroke="none" />
      <rect x="21" y="10" width="22" height="15" rx="7.5" fill="#2c4a7a" />
      <path d="M25 14 Q28 12 31 13" fill="none" stroke="#8fd0ff" strokeWidth="2.2" />
      <rect x="27" y="28" width="10" height="3" rx="1.5" fill="#8d95a6" strokeWidth="2" />
    </g>
  ),

  Eisblock: () => (
    <g>
      <path d="M8 22 L18 11 H58 L48 22Z" fill="#d8f4fc" />
      <path d="M48 22 L58 11 V45 L48 57Z" fill="#62aed6" />
      <rect x="8" y="22" width="40" height="35" rx="2" fill="#9fdcf0" />
      <path d="M12 27 H20 M12 27 V37" fill="none" stroke="#ffffff" strokeWidth="2.6" />
      <path d="M26 50 H42 M42 44 V50" fill="none" stroke="#6bb7d9" strokeWidth="2.2" />
      <path d="M30 22 L27 31 L33 36 L29 44" fill="none" stroke="#5aa3cc" strokeWidth="1.8" />
      <path d="M22 13 H36" fill="none" stroke="#ffffff" strokeWidth="2" />
      <path d="M54 3 L55.4 6.6 L59 8 L55.4 9.4 L54 13 L52.6 9.4 L49 8 L52.6 6.6Z" fill="#ffffff" strokeWidth="1.4" />
      <path d="M14 57 Q14 61 16.5 61 Q19 61 19 57" fill="#9fdcf0" strokeWidth="2" />
    </g>
  ),

  Gitarre: () => (
    <g transform="rotate(38 32 32)">
      <rect x="29" y="12" width="6" height="30" fill="#7a4b2a" />
      <rect x="30.2" y="12" width="3.6" height="30" fill="#3a2420" stroke="none" />
      <path d="M28 4 Q28 1 32 1 Q36 1 36 4 V13 H28Z" fill="#5a3520" />
      <circle cx="26" cy="5" r="1.7" fill="#e8c14a" strokeWidth="1.6" />
      <circle cx="38" cy="5" r="1.7" fill="#e8c14a" strokeWidth="1.6" />
      <ellipse cx="32" cy="36" rx="10" ry="9" fill="#e0953a" />
      <ellipse cx="32" cy="48" rx="13.5" ry="11.5" fill="#e0953a" />
      <rect x="23" y="37" width="18" height="8" fill="#e0953a" stroke="none" />
      <ellipse cx="32" cy="48" rx="13.5" ry="11.5" fill="none" stroke="none" />
      <path d="M41 40 Q44 46 44 50 Q43 57 36 58 Q43 52 41 40Z" fill="#b8702a" stroke="none" />
      <circle cx="32" cy="42" r="4.6" fill="#2a1d18" />
      <rect x="26.5" y="52" width="11" height="3.4" rx="1.5" fill="#5a3520" strokeWidth="1.8" />
      <path d="M31 13 V52 M33 13 V52" fill="none" stroke="#f1e6cf" strokeWidth="0.9" />
      <path d="M29 20 H35 M29 27 H35" fill="none" stroke="#c9b48a" strokeWidth="1" />
    </g>
  ),

  Tomaten: () => (
    <g>
      <circle cx="44" cy="42" r="14" fill="#d93a2a" />
      <path d="M51 31 Q60 40 52 52 Q48 55 42 55 Q55 48 51 31Z" fill="#a82a1f" stroke="none" />
      <path d="M44 29 L38 33 L42 32 L44 38 L46 32 L50 33Z" fill="#4aa35a" strokeWidth="1.8" />
      <circle cx="24" cy="39" r="17" fill="#e8472f" />
      <path d="M34 26 Q43 38 35 51 Q31 54 26 55 Q40 47 34 26Z" fill="#b82f22" stroke="none" />
      <ellipse cx="16" cy="33" rx="3.5" ry="5.5" transform="rotate(30 16 33)" fill="#ff9a86" stroke="none" />
      <path d="M24 24 L16 29 L21 27 L19 35 L24 29 L29 35 L27 27 L32 29Z" fill="#4aa35a" strokeWidth="2" />
      <path d="M24 24 Q24 18 28 15" fill="none" strokeWidth="3" />
      <path d="M24 24 Q24 18 28 15" fill="none" stroke="#4aa35a" strokeWidth="1.4" />
    </g>
  ),

  Ersatzteile: () => (
    <g>
      {GEAR_ANGLES.map((a) => (
        <rect key={a} x="-3.2" y="-17" width="6.4" height="8" rx="1.2" fill="#b4bcc9" transform={`translate(28 23) rotate(${a})`} />
      ))}
      <circle cx="28" cy="23" r="12" fill="#b4bcc9" />
      <path d="M28 11 A12 12 0 0 1 40 23 A12 12 0 0 1 28 35 Q38 28 28 11Z" fill="#8892a3" stroke="none" />
      <circle cx="28" cy="23" r="4.8" fill="#3a2f3f" />
      <polygon points="54,47 50,54 42,54 38,47 42,40 50,40" fill="#e0953a" />
      <polygon points="50,54 42,54 38,47 41,47 44,51 52,51" fill="#b8702a" stroke="none" />
      <circle cx="46" cy="47" r="3.6" fill="#3a2f3f" strokeWidth="2" />
      <rect x="15" y="50" width="21" height="6" rx="1.5" fill="#b4bcc9" />
      <path d="M21 51 L23 55 M26 51 L28 55 M31 51 L33 55" fill="none" stroke="#6b7487" strokeWidth="1.5" />
      <circle cx="12" cy="53" r="6" fill="#d94f3d" />
      <path d="M8 55 L16 51" fill="none" strokeWidth="2" />
    </g>
  ),

  Teleskop: () => (
    <g>
      <g fill="none" strokeLinecap="round">
        <path d="M30 36 L16 60 M30 36 L46 60 M30 36 L31 60" stroke={O} strokeWidth="7" />
        <path d="M30 36 L16 60 M30 36 L46 60 M30 36 L31 60" stroke="#8a5a34" strokeWidth="3" />
      </g>
      <g transform="rotate(-28 30 26)">
        <rect x="4" y="22" width="12" height="9" rx="2" fill="#5a6277" />
        <rect x="14" y="20" width="24" height="13" rx="2" fill="#3b6ea8" />
        <rect x="14" y="27" width="24" height="6" fill="#2d5586" stroke="none" />
        <rect x="35" y="17" width="20" height="19" rx="3" fill="#4d86c7" />
        <rect x="35" y="29" width="20" height="7" fill="#3b6ea8" stroke="none" />
        <rect x="18" y="20" width="4" height="13" fill="#e8c14a" strokeWidth="2" />
        <ellipse cx="55" cy="26.5" rx="2.6" ry="7.5" fill="#b8e6ff" strokeWidth="2.2" />
        <path d="M40 21 H50" fill="none" stroke="#a9cdf0" strokeWidth="2" />
      </g>
      <circle cx="30" cy="31" r="3.6" fill="#e8c14a" strokeWidth="2.2" />
      <path d="M52 4 L53.2 7.4 L56.6 8.6 L53.2 9.8 L52 13.2 L50.8 9.8 L47.4 8.6 L50.8 7.4Z" fill="#f7c22d" strokeWidth="1.4" />
    </g>
  ),
};

function UnknownIcon() {
  return (
    <g>
      <rect x="9" y="19" width="46" height="38" rx="4" fill="#c89b5e" />
      <rect x="9" y="19" width="46" height="9" rx="3" fill="#dbb677" />
      <rect x="27" y="19" width="10" height="9" fill="#f0e2bd" strokeWidth="2" />
      <path d="M26 38 Q26 31 32 31 Q39 31 39 37 Q39 41 33 43.5 V46" fill="none" stroke="#fff6df" strokeWidth="4.2" />
      <circle cx="33" cy="51.5" r="2.4" fill="#fff6df" strokeWidth="1.6" />
    </g>
  );
}

function IconBody({ name }) {
  const Draw = ICONS[name] || UnknownIcon;
  return (
    <g {...strokeProps}>
      <Draw />
    </g>
  );
}

export function ItemIcon({ name, size = 64 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <IconBody name={name} />
    </svg>
  );
}

/* ---------- Frachtkiste (100x100, Boden bei y=100) ---------- */

const CORNER = '8,20 22,20 22,24 12,24 12,34 8,34';

function CornerPlate({ transform }) {
  return (
    <g transform={transform}>
      <polygon points={CORNER} fill="#aeb4bd" strokeWidth="2.2" />
      <circle cx="16.5" cy="28" r="1" fill={O} stroke="none" />
    </g>
  );
}

export function Crate({ ziel = 'Mars', name = '', size = 90 }) {
  const c = PALETTE[ziel] || PALETTE.Mars;
  const known = Object.prototype.hasOwnProperty.call(ICONS, name);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <g {...strokeProps} strokeWidth={2.8}>
        {/* Bodenschatten */}
        <ellipse cx="50" cy="99" rx="44" ry="1" fill="#000" stroke="none" opacity="0.15" />
        {/* Korpus */}
        <rect x="8" y="20" width="84" height="78.5" rx="4" fill={c.main} />
        <rect x="9.4" y="88" width="81.2" height="9.2" fill={c.dark} stroke="none" />
        <rect x="9.4" y="21.4" width="81.2" height="10" fill={c.light} stroke="none" />
        <path d="M8 33 H92 M8 87 H92" fill="none" strokeWidth="2" />
        <path d="M30 33 V87 M70 33 V87" fill="none" strokeWidth="1.6" stroke={c.dark} />
        {/* Diagonal-Verstrebung */}
        <polygon points="10,34 22,34 90,86 90,96 78,96 10,44" fill={c.light} strokeWidth="2.4" />
        <polygon points="90,34 78,34 10,86 10,96 22,96 90,44" fill={c.light} strokeWidth="2.4" />
        {/* Gurt oben */}
        <rect x="8" y="23.5" width="84" height="6.5" fill={c.strap} strokeWidth="2.2" />
        <rect x="43" y="21.5" width="12" height="10.5" rx="2" fill="#e8c14a" strokeWidth="2.2" />
        <rect x="46.5" y="24.5" width="5" height="4.5" rx="1" fill={c.strap} strokeWidth="1.6" />
        {/* Inhaltsfeld */}
        <rect x="16" y="35" width="58" height="55" rx="4" fill="#f6ead2" />
        <rect x="18" y="37" width="54" height="5" rx="2" fill="#fff8e8" stroke="none" />
        {known && (
          <g transform="translate(19.5 37.5) scale(0.8)">
            <IconBody name={name} />
          </g>
        )}
        {/* Metallecken */}
        <CornerPlate transform="" />
        <CornerPlate transform="matrix(-1 0 0 1 100 0)" />
        <CornerPlate transform="matrix(1 0 0 -1 0 118.5)" />
        <CornerPlate transform="matrix(-1 0 0 -1 100 118.5)" />
        {/* Etikett mit Planet */}
        <g transform="rotate(7 77 75)">
          <rect x="66" y="64" width="22" height="22" rx="3" fill="#fbf4e4" strokeWidth="2.2" />
          <g transform="translate(68 66) scale(0.75)">
            <PlanetBody ziel={ziel} />
          </g>
        </g>
      </g>
    </svg>
  );
}
