import React from 'react';

// JUNA - Frachtmeister-Azubi der Kosmo-Express. Handgezeichnetes SVG, 8 Gefuehle.
const INK = '#2a1d18';
const SKIN = '#e3a676';
const SHADE = '#cf8d5f';
const HAIR = '#4a2c20';
const TEAL = '#2fbfbc';
const DTEAL = '#17898b';
const ORANGE = '#f0552e';
const CREAM = '#fff0d2';
const CHEEK = '#f28b7d';
const GOLD = '#ffd23f';
const MOUTH = '#7a2431';
const L = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' };
const LINE = { ...L, fill: 'none' };

// Locken als Kreise: einmal als Kontur, einmal als Fuellung => saubere Gesamtkontur
const BACK = [[52, 96, 13], [50, 116, 11], [54, 74, 15], [72, 54, 16], [100, 46, 17], [128, 54, 16], [146, 74, 15], [150, 96, 13], [148, 116, 11], [100, 76, 44]];
const TAIL = [[163, 86, 10], [170, 100, 9], [166, 114, 8]];
const FRINGE = [[100, 62, 0], [62, 68, 9], [78, 70, 9], [94, 71, 8], [108, 71, 8], [124, 70, 9], [140, 68, 9], [52, 82, 8], [148, 82, 8]];

function Blob({ pts, ell }) {
  const shapes = (p) => (
    <>
      {ell && <ellipse cx="100" cy="62" rx="47" ry="15" {...p} />}
      {pts.filter((c) => c[2]).map((c, i) => <circle key={i} cx={c[0]} cy={c[1]} r={c[2]} {...p} />)}
    </>
  );
  return (
    <g>
      <g fill={INK} stroke={INK} strokeWidth="6" strokeLinejoin="round">{shapes({})}</g>
      <g fill={HAIR}>{shapes({})}</g>
    </g>
  );
}

function Eye({ cx, rx = 13, ry = 15, px = 0, py = 0, ir = 9, pr = 5 }) {
  const cy = 106;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" {...L} />
      <circle cx={cx + px} cy={cy + py} r={ir} fill="#6b3a22" />
      <circle cx={cx + px} cy={cy + py} r={pr} fill={INK} />
      <circle cx={cx + px - 3} cy={cy + py - 3.5} r="3" fill="#fff" />
      <circle cx={cx + px + 3} cy={cy + py + 3} r="1.5" fill="#fff" />
    </g>
  );
}

const Brow = ({ d, w = 4.5 }) => <path d={d} {...LINE} strokeWidth={w} />;
const Eyes = (p = {}) => (<><Eye cx={78} {...p} /><Eye cx={122} {...p} /></>);

function Star({ x, y, s = 8 }) {
  return (
    <path
      transform={`translate(${x} ${y})`}
      d={`M0 ${-s} Q0 0 ${s} 0 Q0 0 0 ${s} Q0 0 ${-s} 0 Q0 0 0 ${-s}Z`}
      fill={GOLD} {...L} strokeWidth="2"
    />
  );
}

function Outlined({ d, color, w = 3.5, t }) {
  return (
    <g transform={t} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={w + 3.5} />
      <path d={d} stroke={color} strokeWidth={w} />
    </g>
  );
}

const Drop = () => (
  <path d="M54 88 Q62 99 54 106 Q46 99 54 88Z" fill="#9fdcf5" {...L} strokeWidth="2.5" />
);

const FACES = {
  happy: (
    <>
      <Eyes />
      <Brow d="M64 88 Q78 80 91 86" /><Brow d="M109 86 Q122 80 136 88" />
      <path d="M82 130 Q100 137 118 130 Q114 150 100 150 Q86 150 82 130Z" fill={MOUTH} {...L} />
      <ellipse cx="100" cy="145" rx="7" ry="3.5" fill="#f06a7a" />
      <path d="M85 132 Q100 139 115 132 L114 136 Q100 143 86 136Z" fill="#fff" />
    </>
  ),
  curious: (
    <>
      <Eyes px={3} py={-3} />
      <Brow d="M62 82 Q76 75 91 82" /><Brow d="M110 88 Q124 86 137 91" />
      <path d="M88 139 Q98 145 106 138 Q112 133 117 130" {...LINE} strokeWidth="3.5" />
      <Outlined d="M-5 -5 Q-5 -11 0 -11 Q6 -11 6 -5 Q6 -1 0 2 L0 5 M0 11 L0 11.1" color={GOLD} w={3} t="translate(40 46) scale(1.7)" />
    </>
  ),
  surprised: (
    <>
      <Eyes rx={14.5} ry={17.5} ir={6.5} pr={3.5} />
      <Brow d="M63 81 Q77 75 91 80" /><Brow d="M109 80 Q123 75 137 81" />
      <ellipse cx="100" cy="140" rx="8" ry="11" fill={MOUTH} {...L} />
      <ellipse cx="100" cy="146" rx="5" ry="3" fill="#f06a7a" />
      <path d="M36 70 L28 66 M34 84 L25 84 M164 70 L172 66" {...LINE} strokeWidth="2.5" />
    </>
  ),
  worried: (
    <>
      <Eyes py={-3} />
      <Brow d="M64 91 Q77 88 91 80" /><Brow d="M109 80 Q123 88 136 91" />
      <path d="M86 143 Q93 136 100 142 Q107 148 114 141" {...LINE} strokeWidth="3.5" />
      <Drop />
    </>
  ),
  angry: (
    <>
      <Eyes ry={14} py={3} />
      <path d="M62 88 L94 88 L94 104 L62 97Z M138 88 L106 88 L106 104 L138 97Z" fill={SKIN} />
      <path d="M63 97 L93 104 M137 97 L107 104" {...LINE} strokeWidth="3.5" />
      <Brow d="M62 80 L92 93" w={5.5} /><Brow d="M108 93 L138 80" w={5.5} />
      <path d="M84 146 Q100 128 116 146 Q100 140 84 146Z" fill={MOUTH} {...L} />
      <path d="M89 141 Q100 134 111 141 L110 144 Q100 138 90 144Z" fill="#fff" />
      <path d="M136 68 Q140 72 144 68 M136 78 Q140 74 144 78 M134 73 Q138 70 138 66 M146 73 Q142 70 142 66" {...LINE} stroke="#e03a3a" strokeWidth="2.5" />
    </>
  ),
  determined: (
    <>
      <Eyes ir={9.5} pr={6} />
      <Brow d="M63 84 L91 91" w={5.5} /><Brow d="M109 91 L137 84" w={5.5} />
      <path d="M84 134 Q102 142 118 128 Q112 148 98 147 Q88 145 84 134Z" fill={MOUTH} {...L} />
      <path d="M90 138 Q100 142 110 135 L108 140 Q100 144 91 141Z" fill="#fff" />
      <path d="M30 100 L40 102 M28 112 L38 112 M170 100 L160 102" {...LINE} strokeWidth="2.5" />
    </>
  ),
  sleepy: (
    <>
      <path d="M65 106 Q78 115 91 106 M109 106 Q122 115 135 106" {...LINE} strokeWidth="3.5" />
      <path d="M66 109 L62 113 M91 109 L95 113 M109 109 L105 113 M134 109 L138 113" {...LINE} strokeWidth="2.2" />
      <Brow d="M64 92 Q78 89 91 92" /><Brow d="M109 92 Q122 89 136 92" />
      <ellipse cx="100" cy="142" rx="6" ry="5.5" fill={MOUTH} {...L} />
      <Outlined d="M-5 -5 L5 -5 L-5 5 L5 5" color="#cfeeff" w={2.6} t="translate(146 40) scale(1.1)" />
      <Outlined d="M-5 -5 L5 -5 L-5 5 L5 5" color="#cfeeff" w={2.6} t="translate(160 28) scale(1.5)" />
    </>
  ),
  proud: (
    <>
      <path d="M65 109 Q78 94 91 109 M109 109 Q122 94 135 109" {...LINE} strokeWidth="4" />
      <Brow d="M64 84 Q78 76 91 83" /><Brow d="M109 83 Q122 76 136 84" />
      <path d="M83 135 Q100 150 117 135" {...LINE} strokeWidth="3.5" />
      <path d="M80 133 Q82 137 85 136 M120 133 Q118 137 115 136" {...LINE} strokeWidth="2" />
      <Star x={34} y={60} s={9} /><Star x={168} y={54} s={11} /><Star x={46} y={34} s={6} /><Star x={158} y={134} s={6} />
    </>
  ),
};

export default function Juna({ emotion = 'happy', size = 160 }) {
  const face = FACES[emotion] || FACES.happy;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Juna" xmlns="http://www.w3.org/2000/svg">
      {/* Zopf + Haare hinten */}
      <Blob pts={TAIL} />
      <ellipse cx="156" cy="80" rx="6" ry="5" fill={ORANGE} {...L} strokeWidth="2.5" />
      <Blob pts={BACK} />
      {/* Hals + Koerper */}
      <path d="M86 138 L86 158 Q100 174 114 158 L114 138Z" fill={SHADE} {...L} />
      <path d="M28 200 Q30 166 72 157 L86 155 Q100 172 114 155 L128 157 Q170 166 172 200Z" fill={CREAM} {...L} />
      <path d="M64 200 L74 170 Q75 166 80 166 L120 166 Q125 166 126 170 L136 200Z" fill={ORANGE} {...L} />
      <path d="M74 170 L70 158 L82 156 L90 170Z M126 170 L130 158 L118 156 L110 170Z" fill={ORANGE} {...L} />
      <circle cx="83" cy="170" r="2.5" fill={GOLD} stroke={INK} strokeWidth="2" />
      <circle cx="117" cy="170" r="2.5" fill={GOLD} stroke={INK} strokeWidth="2" />
      <rect x="90" y="177" width="20" height="18" rx="5" fill={GOLD} {...L} strokeWidth="2.5" />
      <path d="M95 190 L104 182" {...LINE} strokeWidth="3" />
      <circle cx="105.5" cy="180.5" r="3" fill="none" {...L} strokeWidth="2" />
      {/* Kopf */}
      <circle cx="48" cy="108" r="8" fill={SKIN} {...L} />
      <circle cx="152" cy="108" r="8" fill={SKIN} {...L} />
      <ellipse cx="100" cy="104" rx="52" ry="50" fill={SKIN} {...L} />
      <ellipse cx="60" cy="126" rx="9" ry="6" fill={CHEEK} opacity="0.8" />
      <ellipse cx="140" cy="126" rx="9" ry="6" fill={CHEEK} opacity="0.8" />
      <path d="M97 120 Q100 123 103 120" {...LINE} stroke={SHADE} strokeWidth="2.5" />
      <g fill="#b9774d"><circle cx="86" cy="124" r="1.2" /><circle cx="92" cy="127" r="1.2" /><circle cx="114" cy="124" r="1.2" /><circle cx="108" cy="127" r="1.2" /></g>
      {/* Gefuehlsabhaengig */}
      {face}
      {/* Pony + Locken */}
      <Blob pts={FRINGE} ell />
      <path d="M68 60 q4 -6 8 0 M96 56 q4 -6 8 0 M124 62 q4 -6 8 0" {...LINE} stroke="#2f1a12" strokeWidth="2.5" />
      {/* Schutzbrille hochgeschoben */}
      <path d="M50 70 Q100 34 150 70" fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M50 70 Q100 34 150 70" fill="none" stroke={DTEAL} strokeWidth="7" strokeLinecap="round" />
      <rect x="95" y="48" width="10" height="7" fill={DTEAL} {...L} strokeWidth="2.5" />
      <circle cx="82" cy="52" r="13" fill={TEAL} {...L} />
      <circle cx="118" cy="52" r="13" fill={TEAL} {...L} />
      <circle cx="82" cy="52" r="8.5" fill="none" stroke={DTEAL} strokeWidth="2" />
      <circle cx="118" cy="52" r="8.5" fill="none" stroke={DTEAL} strokeWidth="2" />
      <path d="M75 47 Q78 43 83 43 M111 47 Q114 43 119 43" {...LINE} stroke="#fff" strokeWidth="2.5" />
    </svg>
  );
}
