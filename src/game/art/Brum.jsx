import React from 'react';

// Kapitän Brum, Mentor des Raumfrachters "Kosmo-Express".
// Feste Teile: Körper, Kopf, Mütze, Accessoires. Emotionsabhängig (FACES): Augen, Brauen, Mund, Schnurrbart, Extras.

const C = {
  line: '#2a1d18',
  skin: '#f5c0a6',
  shade: '#e5a58b',
  navy: '#26396b',
  navyDark: '#141e3b',
  gold: '#f2b632',
  hair: '#ecebe6',
  nose: '#e5766b',
  red: '#e2453c',
  blue: '#8fd3f4',
  mouth: '#7a2a30',
};

const r = (n) => Math.round(n * 10) / 10;

// 5-zackiger Stern
const star = (cx, cy, R, ri) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? ri : R;
    pts.push(`${r(cx + rad * Math.cos(a))} ${r(cy + rad * Math.sin(a))}`);
  }
  return `M${pts.join('L')}Z`;
};

// 4-zackiges Glitzern
const sparkle = (x, y, s) =>
  `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;

// Buschige Braue (linke Seite; rechte wird gespiegelt). p = [außenX, außenY, innenX, innenY, Dicke]
const browPath = ([xo, yo, xi, yi, h]) => {
  const dx = xi - xo;
  const dy = yi - yo;
  const L = Math.hypot(dx, dy);
  const nx = dy / L;
  const ny = -dx / L;
  const P = (t, k) => `${r(xo + dx * t + nx * h * k)} ${r(yo + dy * t + ny * h * k)}`;
  return (
    `M${P(0, 0)}Q${P(0.1, 1.2)} ${P(0.25, 0.8)}Q${P(0.35, 1.5)} ${P(0.5, 1)}` +
    `Q${P(0.6, 1.6)} ${P(0.75, 1)}Q${P(0.9, 1.4)} ${P(1, 0.5)}` +
    `Q${P(1.05, 0.1)} ${P(0.96, -0.4)}Q${P(0.5, -0.7)} ${P(0, 0)}Z`
  );
};

// Schnurrbart; t < 0 = hochgezogen, t > 0 = hängend
const stachePath = (t) =>
  `M100 116C92 112 78 112 68 120C60 126 56 ${128 + t} 52 ${132 + t}` +
  `C64 ${136 + t * 0.5} 80 134 100 130C120 134 136 ${136 + t * 0.5} 148 ${132 + t}` +
  `C144 ${128 + t} 140 126 132 120C122 112 108 112 100 116Z`;

// Auge: side = +1 linkes Auge (innen rechts), -1 rechtes Auge.
const EY = 95;
const Eye = ({ cx, side, o }) => {
  if (o.t === 'up') {
    return <path d={`M${cx - 10} ${EY + 4}Q${cx} ${EY - 11} ${cx + 10} ${EY + 4}`} fill="none" strokeWidth="4.5" />;
  }
  if (o.t === 'down') {
    return <path d={`M${cx - 10} ${EY + 1}Q${cx} ${EY + 9} ${cx + 10} ${EY + 1}`} fill="none" strokeWidth="4" />;
  }
  const rx = o.rx || 9.5;
  const ry = o.ry || 10.5;
  const pr = o.pr || 5;
  let lid = null;
  if (o.lid) {
    const yo = EY + o.lid[0];
    const yi = EY + o.lid[1];
    const xo = cx - side * (rx + 3);
    const xi = cx + side * (rx + 3);
    lid = (
      <g>
        <path d={`M${xo} ${EY - 16}L${xi} ${EY - 16}L${xi} ${yi}L${xo} ${yo}Z`} fill={C.skin} stroke="none" />
        <path d={`M${xo} ${yo}L${xi} ${yi}`} fill="none" strokeWidth="3.5" />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx={cx} cy={EY} rx={rx} ry={ry} fill="#fff" strokeWidth="2.5" />
      <circle cx={cx + (o.px || 0)} cy={EY + (o.py || 0)} r={pr} fill={C.line} stroke="none" />
      <circle cx={cx + (o.px || 0) - 1.6} cy={EY + (o.py || 0) - 1.8} r="1.7" fill="#fff" stroke="none" />
      {lid}
    </g>
  );
};

const Cheeks = () => (
  <g fill="#ef8f86" opacity="0.65" stroke="none">
    <ellipse cx="66" cy="120" rx="8" ry="5" />
    <ellipse cx="134" cy="120" rx="8" ry="5" />
  </g>
);

const Zs = () => (
  <g fill="none" strokeWidth="3">
    <path d="M150 66h8l-8 9h8" />
    <path d="M162 44h11l-11 12h11" />
  </g>
);

const FACES = {
  happy: {
    brows: [[54, 80, 94, 74, 9], [54, 80, 94, 74, 9]],
    eyes: [{ t: 'up' }, { t: 'up' }],
    stache: -9,
    mouth: (
      <g>
        <path d="M84 137Q100 162 116 137Z" fill={C.mouth} />
        <path d="M92 148Q100 142 108 148Q100 154 92 148Z" fill="#e8808a" strokeWidth="1.5" />
      </g>
    ),
    extra: <Cheeks />,
  },
  curious: {
    brows: [[54, 86, 94, 84, 8], [56, 73, 94, 66, 9]],
    eyes: [{ rx: 8, ry: 6.5, pr: 4, px: 2, py: -1 }, { rx: 11, ry: 12, pr: 5.5, px: 3, py: -3 }],
    stache: -1,
    mouth: <path d="M88 143Q96 138 102 143T114 141" fill="none" strokeWidth="3.5" />,
    extra: (
      <path d="M158 44Q158 35 166 35Q174 35 174 42Q174 48 166 51L166 56M166 63v.5" fill="none" strokeWidth="4" />
    ),
  },
  surprised: {
    brows: [[54, 72, 94, 65, 10], [54, 72, 94, 65, 10]],
    eyes: [{ rx: 11.5, ry: 13, pr: 3.5 }, { rx: 11.5, ry: 13, pr: 3.5 }],
    stache: -11,
    mouth: (
      <g>
        <ellipse cx="100" cy="144" rx="9" ry="10" fill={C.mouth} />
        <ellipse cx="100" cy="150" rx="5" ry="3.5" fill="#e8808a" stroke="none" />
      </g>
    ),
    extra: (
      <g fill="none" strokeWidth="3">
        <path d="M36 74l-8-4M34 88l-10 0M164 74l8-4M166 88l10 0" />
      </g>
    ),
  },
  worried: {
    brows: [[54, 87, 94, 70, 9], [54, 87, 94, 70, 9]],
    eyes: [{ px: -2, py: -3, pr: 4.5 }, { px: -2, py: -3, pr: 4.5 }],
    stache: 5,
    mouth: <path d="M86 148Q93 139 100 145Q107 151 114 142" fill="none" strokeWidth="3.5" />,
    extra: (
      <path d="M152 78Q159 88 152 95Q145 88 152 78Z" fill={C.blue} strokeWidth="2.5" />
    ),
  },
  angry: {
    brows: [[52, 70, 94, 90, 10], [52, 70, 94, 90, 10]],
    eyes: [{ py: 2, pr: 4.5, lid: [-7, 1] }, { py: 2, pr: 4.5, lid: [-7, 1] }],
    stache: 11,
    mouth: (
      <g>
        <path d="M83 145Q100 136 117 145L113 153Q100 148 87 153Z" fill="#fff" strokeWidth="3" />
        <path d="M93 142v8M100 141v8M107 142v8" fill="none" strokeWidth="1.8" />
      </g>
    ),
    extra: (
      <path
        d="M138 66q6 0 6 6M152 66q-6 0-6 6M138 80q6 0 6-6M152 80q-6 0-6-6"
        fill="none"
        stroke={C.red}
        strokeWidth="3"
      />
    ),
  },
  determined: {
    brows: [[54, 78, 94, 87, 9.5], [54, 78, 94, 87, 9.5]],
    eyes: [{ px: 1, pr: 5, lid: [-4, 0] }, { px: 1, pr: 5, lid: [-4, 0] }],
    stache: 3,
    mouth: <path d="M87 144H109Q114 144 117 139" fill="none" strokeWidth="4" />,
    extra: (
      <path d="M40 130l-8 4M160 130l8 4" fill="none" strokeWidth="3" />
    ),
  },
  sleepy: {
    brows: [[54, 88, 94, 83, 8], [54, 88, 94, 83, 8]],
    eyes: [{ t: 'down' }, { t: 'down' }],
    stache: 7,
    mouth: <ellipse cx="104" cy="145" rx="5.5" ry="6.5" fill={C.mouth} />,
    extra: <Zs />,
  },
  proud: {
    brows: [[54, 76, 94, 69, 9.5], [54, 76, 94, 69, 9.5]],
    eyes: [{ px: 1, py: -2, pr: 5.5 }, { px: 1, py: -2, pr: 5.5 }],
    stache: -13,
    mouth: <path d="M85 140Q100 156 115 140" fill="none" strokeWidth="4" />,
    extra: (
      <g>
        <Cheeks />
        <g fill={C.gold} strokeWidth="1.8">
          <path d={sparkle(38, 64, 9)} />
          <path d={sparkle(164, 70, 7)} />
          <path d={sparkle(170, 114, 9)} />
          <path d={sparkle(32, 112, 6)} />
        </g>
      </g>
    ),
  },
};

export default function Brum({ emotion = 'happy', size = 160 }) {
  const f = FACES[emotion] || FACES.happy;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Kapitän Brum">
      <g stroke={C.line} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Körper */}
        <path d="M82 148H118V176H82Z" fill={C.shade} />
        <path d="M14 200Q16 168 62 160L100 178L138 160Q184 168 186 200Z" fill={C.navy} />
        <path d="M76 160L100 192L124 160Q100 176 76 160Z" fill="#f4efe6" />
        <path d="M62 160L88 200M138 160L112 200" fill="none" strokeWidth="2.5" />
        <g fill={C.gold} strokeWidth="2.5">
          <path d="M26 184L50 166L64 177L36 198Z" />
          <path d="M174 184L150 166L136 177L164 198Z" />
        </g>
        <path d="M34 182l22 14M166 182l-22 14" fill="none" strokeWidth="1.8" />
        <g fill={C.gold} strokeWidth="2.5">
          <circle cx="94" cy="194" r="3.5" />
          <circle cx="106" cy="194" r="3.5" />
        </g>

        {/* Ohren und Haarbüschel */}
        <circle cx="46" cy="108" r="9" fill={C.skin} />
        <circle cx="154" cy="108" r="9" fill={C.skin} />
        <path d="M52 70Q36 80 40 104Q50 98 56 92Z" fill={C.hair} />
        <path d="M148 70Q164 80 160 104Q150 98 144 92Z" fill={C.hair} />

        {/* Kopf */}
        <ellipse cx="100" cy="106" rx="54" ry="50" fill={C.skin} />

        {/* Mund, Schnurrbart, Nase */}
        {f.mouth}
        <path d={stachePath(f.stache)} fill={C.hair} />
        <circle cx="100" cy="110" r="11.5" fill={C.nose} />
        <ellipse cx="96" cy="105.5" rx="3.5" ry="2.2" fill="#fff" opacity="0.6" stroke="none" />

        {/* Augen */}
        <Eye cx={80} side={1} o={f.eyes[0]} />
        <Eye cx={120} side={-1} o={f.eyes[1]} />

        {/* Mütze */}
        <path d="M40 64C37 40 60 25 100 25C140 25 163 40 160 64Z" fill={C.navy} />
        <path d="M39.5 62Q100 76 160.5 62L160 48Q100 60 40 48Z" fill={C.navyDark} />
        <path d="M40.5 52Q100 64 159.5 52M39.5 60Q100 73 160.5 60" fill="none" stroke={C.gold} strokeWidth="2" />
        <path d="M58 65Q100 86 142 65Q100 73 58 65Z" fill={C.navyDark} />
        <circle cx="100" cy="44" r="12" fill={C.gold} />
        <path d={star(100, 44, 8, 3.4)} fill={C.navy} strokeWidth="1.5" />

        {/* Brauen */}
        <path d={browPath(f.brows[0])} fill={C.hair} strokeWidth="2.5" />
        <g transform="matrix(-1 0 0 1 200 0)">
          <path d={browPath(f.brows[1])} fill={C.hair} strokeWidth="2.5" />
        </g>

        {/* Extras */}
        {f.extra}
      </g>
    </svg>
  );
}
