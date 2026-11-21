import React from 'react';

// ZORA - Alien-Haendlerin. Kopf/Haare/Kleidung fest, nur FACES haengt von der Emotion ab.
const O = '#2a1d18'; // Kontur
const SKIN = '#b79ae6';
const SHADE = '#9a7bd8';
const CLOAK = '#3b2160';
const COLLAR = '#5a3593';
const GOLD = '#f4b942';
const MAG = '#d6359a';
const TEAL = '#2fd4c4';
const PINK = '#ff7ab8';
const IRIS = '#f6cf4a';
const MOUTH = '#7a2145';
const RED = '#e8384f';
const DROP = '#8fdcf7';

const SW = { stroke: O, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' };

const EYE_DEFAULT = { ro: -30, ri: -30, look: [0, 0], pr: 1, sc: 1, bl: null };

const Sparkle = ({ x, y, s = 1, fill = GOLD }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 -7 Q1 -1 7 0 Q1 1 0 7 Q-1 1 -7 0 Q-1 -1 0 -7Z"
    fill={fill}
    {...SW}
    strokeWidth={1.8 / s}
  />
);

const Zee = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 0H10L0 12H10" stroke={O} strokeWidth="5" />
    <path d="M0 0H10L0 12H10" stroke="#fff" strokeWidth="2.2" />
  </g>
);

const Brow = ({ d }) => <path d={d} fill="none" stroke={O} strokeWidth="4.6" strokeLinecap="round" />;

const FACES = {
  happy: {
    eyes: [{ bl: 11, look: [0, -1] }],
    brows: ['M63 79 Q78 69 93 75', 'M107 75 Q122 69 137 79'],
    mouth: (
      <g>
        <path d="M82 117 Q100 125 118 117 Q114 141 100 141 Q86 141 82 117Z" fill={MOUTH} {...SW} />
        <path d="M91 134 Q100 127 109 134 Q100 141 91 134Z" fill={PINK} />
      </g>
    ),
    ant: { l: 'M86 48 C84 36 74 30 72 20', r: 'M114 48 C116 36 126 30 128 20', tl: [72, 20], tr: [128, 20] },
    extras: (
      <g>
        <Sparkle x={152} y={56} s={1} />
        <Sparkle x={46} y={60} s={0.7} fill={TEAL} />
      </g>
    ),
  },
  curious: {
    eyes: [{ ro: -8, ri: -8, look: [5, -2] }, { sc: 1.1, look: [5, -3] }],
    brows: ['M63 82 Q78 78 93 82', 'M107 67 Q124 56 138 69'],
    mouth: (
      <g>
        <path d="M95 128 Q104 122 112 127 Q108 135 100 135 Q94 134 95 128Z" fill={MOUTH} {...SW} />
      </g>
    ),
    ant: {
      l: 'M86 48 C82 30 58 22 54 36 C53 42 59 44 61 40',
      r: 'M114 48 C116 36 124 28 128 20',
      tl: [61, 40],
      tr: [128, 20],
    },
    extras: (
      <g transform="translate(140 40)">
        <path d="M0 0 Q0 -9 9 -9 Q18 -9 18 -1 Q18 5 9 8 L9 13" fill="none" stroke={O} strokeWidth="6" strokeLinecap="round" />
        <path d="M0 0 Q0 -9 9 -9 Q18 -9 18 -1 Q18 5 9 8 L9 13" fill="none" stroke={GOLD} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="9" cy="21" r="3" fill={GOLD} {...SW} strokeWidth="2" />
      </g>
    ),
  },
  surprised: {
    eyes: [{ sc: 1.15, pr: 0.6 }],
    brows: ['M62 68 Q78 56 94 66', 'M106 66 Q122 56 138 68'],
    mouth: <ellipse cx="100" cy="129" rx="7.5" ry="10" fill={MOUTH} {...SW} />,
    ant: { l: 'M90 46 C88 36 84 28 83 14', r: 'M110 46 C112 36 116 28 117 14', tl: [83, 14], tr: [117, 14], r0: 7 },
    extras: (
      <g fill="none" stroke={O} strokeWidth="3.2" strokeLinecap="round">
        <path d="M36 50 L28 42 M30 64 L20 60 M164 50 L172 42 M170 64 L180 60" />
      </g>
    ),
  },
  worried: {
    eyes: [{ ro: -3, ri: -18, look: [0, 3], pr: 1.15 }],
    brows: ['M63 83 Q80 77 93 68', 'M107 68 Q120 77 137 83'],
    mouth: <path d="M86 133 Q93 121 100 127 Q107 121 114 133" fill="none" {...SW} />,
    ant: { l: 'M84 48 C72 30 50 36 46 60', r: 'M116 48 C128 30 150 36 154 60', tl: [46, 60], tr: [154, 60] },
    extras: (
      <path d="M140 54 Q148 68 140 74 Q132 68 140 54Z" fill={DROP} {...SW} strokeWidth="2.4" />
    ),
  },
  angry: {
    eyes: [{ ro: -14, ri: 0, pr: 0.9 }],
    brows: ['M60 68 Q78 74 95 87', 'M105 87 Q122 74 140 68'],
    mouth: (
      <g>
        <path d="M84 127 Q100 120 116 127 L113 137 Q100 132 87 137Z" fill="#fff" {...SW} />
        <path d="M93 124 V134 M100 123 V133 M107 124 V134" fill="none" stroke={O} strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
    ant: { l: 'M84 46 C72 36 58 38 44 48', r: 'M116 46 C128 36 142 38 156 48', tl: [44, 48], tr: [156, 48], col: [RED, RED] },
    extras: (
      <g transform="translate(142 76)" fill="none" stroke={RED} strokeWidth="2.8" strokeLinecap="round">
        <path d="M-6 -6 Q-1 -5 -1 -1 M6 -6 Q1 -5 1 -1 M-6 6 Q-1 5 -1 1 M6 6 Q1 5 1 1" />
      </g>
    ),
  },
  determined: {
    eyes: [{ ro: -12, ri: -4, bl: 15, look: [2, 0] }],
    brows: ['M60 76 Q78 74 95 83', 'M105 83 Q122 74 140 76'],
    mouth: (
      <g fill="none" {...SW}>
        <path d="M86 128 L111 128 Q116 127 118 121" />
        <path d="M119 117 L119 124" strokeWidth="2" />
      </g>
    ),
    ant: { l: 'M86 48 C84 34 80 26 76 18', r: 'M114 48 C116 34 120 26 124 18', tl: [76, 18], tr: [124, 18] },
    extras: null,
  },
  sleepy: {
    eyes: [{ ro: 7, ri: 3, look: [0, 5], pr: 0.9 }],
    brows: ['M64 85 Q78 79 92 82', 'M108 82 Q122 79 136 85'],
    mouth: <ellipse cx="100" cy="130" rx="5" ry="4" fill={MOUTH} {...SW} />,
    ant: {
      l: 'M86 48 C80 28 60 26 56 40 C54 48 58 54 54 60',
      r: 'M114 48 C120 28 140 26 144 40 C146 48 142 54 146 60',
      tl: [54, 60],
      tr: [146, 60],
      dim: true,
    },
    extras: (
      <g>
        <Zee x={134} y={54} s={1} />
        <Zee x={150} y={38} s={0.75} />
      </g>
    ),
  },
  proud: {
    eyes: [{ ro: -6, ri: -6, bl: 12, look: [0, 1] }],
    brows: ['M63 77 Q78 68 93 73', 'M107 73 Q122 68 137 77'],
    mouth: (
      <g fill="none" {...SW}>
        <path d="M79 120 Q100 140 121 120" />
        <path d="M76 116 L80 121 M124 116 L120 121" strokeWidth="2.4" />
      </g>
    ),
    ant: { l: 'M86 48 C84 36 74 30 72 20', r: 'M114 48 C116 36 126 30 128 20', tl: [72, 20], tr: [128, 20] },
    extras: (
      <g>
        <Sparkle x={154} y={70} s={1.3} />
        <Sparkle x={44} y={72} s={1} />
        <Sparkle x={162} y={52} s={0.6} fill="#fff" />
      </g>
    ),
  },
};

function Eye({ cx, cy, s, id, spec }) {
  const e = { ...EYE_DEFAULT, ...spec };
  const xi = s * 21;
  const xo = -xi;
  const [dx, dy] = e.look;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${e.sc})`}>
      <clipPath id={id}>
        <ellipse rx="15" ry="19" />
      </clipPath>
      <ellipse rx="15" ry="19" fill="#fff" />
      <g clipPath={`url(#${id})`}>
        <ellipse cx={dx} cy={dy + 1} rx="10.5" ry="13.5" fill={IRIS} stroke="#c98f1d" strokeWidth="1.5" />
        <ellipse cx={dx} cy={dy + 1} rx={5.5 * e.pr} ry={8 * e.pr} fill={O} />
        <circle cx={dx - 3.5} cy={dy - 5} r="3.8" fill="#fff" />
        <circle cx={dx + 3.5} cy={dy + 5} r="1.9" fill="#fff" />
        <path d={`M${xo} -30 L${xi} -30 L${xi} ${e.ri} L${xo} ${e.ro}Z`} fill={SKIN} />
        <path d={`M${xo} ${e.ro} L${xi} ${e.ri}`} fill="none" {...SW} />
        {e.bl !== null && (
          <g>
            <path d={`M-22 30 L-22 ${e.bl} Q0 ${e.bl - 9} 22 ${e.bl} L22 30Z`} fill={SKIN} />
            <path d={`M-22 ${e.bl} Q0 ${e.bl - 9} 22 ${e.bl}`} fill="none" {...SW} strokeWidth="2.4" />
          </g>
        )}
      </g>
      <ellipse rx="15" ry="19" fill="none" {...SW} />
      <path d={`M${-s * 13} -11 L${-s * 22} -17`} fill="none" {...SW} strokeWidth="3.4" />
    </g>
  );
}

function Antenna({ d, tip, color, dim, r = 6 }) {
  return (
    <g opacity={dim ? 0.8 : 1}>
      <path d={d} fill="none" stroke={O} strokeWidth="4.6" strokeLinecap="round" />
      <path d={d} fill="none" stroke={SHADE} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx={tip[0]} cy={tip[1]} r={r + 4} fill={color} opacity={dim ? 0.15 : 0.3} />
      <circle cx={tip[0]} cy={tip[1]} r={r} fill={color} opacity={dim ? 0.6 : 1} {...SW} strokeWidth="2.5" />
      <circle cx={tip[0] - 1.8} cy={tip[1] - 2} r="1.8" fill="#fff" />
    </g>
  );
}

export default function Zora({ emotion = 'happy', size = 160 }) {
  const key = Object.prototype.hasOwnProperty.call(FACES, emotion) ? emotion : 'happy';
  const f = FACES[key];
  const id = `zora-${key}`;
  const eyeL = { ...(f.eyes[0] || {}) };
  const eyeR = { ...(f.eyes[1] || f.eyes[0] || {}) };
  const col = f.ant.col || [TEAL, PINK];

  const ear = (
    <g>
      <path d="M50 88 Q36 84 20 72 Q26 98 48 112Z" fill={SKIN} {...SW} />
      <path d="M44 92 Q34 88 28 82 Q32 96 44 104Z" fill="#d9a5e6" />
      <circle cx="44" cy="111" r="5.5" fill="none" stroke={O} strokeWidth="4.6" />
      <circle cx="44" cy="111" r="5.5" fill="none" stroke={GOLD} strokeWidth="2" />
    </g>
  );
  const collar = (
    <path d="M64 148 Q56 136 52 120 Q82 122 102 166 Q82 164 64 148Z" fill={COLLAR} {...SW} />
  );

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Zora" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zora-cloak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2a78" />
          <stop offset="1" stopColor={CLOAK} />
        </linearGradient>
      </defs>

      {/* Fuehler (hinter dem Kopf) */}
      <g>
        <Antenna d={f.ant.l} tip={f.ant.tl} color={col[0]} dim={f.ant.dim} r={f.ant.r0} />
        <Antenna d={f.ant.r} tip={f.ant.tr} color={col[1]} dim={f.ant.dim} r={f.ant.r0} />
      </g>

      {/* Hals + Umhang */}
      <path d="M88 134 L88 156 Q100 164 112 156 L112 134Z" fill={SHADE} {...SW} />
      <path d="M8 200 C10 172 40 156 72 150 L128 150 C160 156 190 172 192 200Z" fill="url(#zora-cloak)" {...SW} />
      {collar}
      <g transform="translate(200 0) scale(-1 1)">{collar}</g>
      <path
        d="M100 167 L102.4 172.8 L108.6 173.2 L103.8 177.2 L105.3 183.3 L100 180 L94.7 183.3 L96.2 177.2 L91.4 173.2 L97.6 172.8Z"
        fill={GOLD}
        {...SW}
        strokeWidth="2"
      />

      {/* Haar hinten (Locke ueber der Schulter) */}
      <path d="M60 60 C30 70 20 118 32 150 C38 162 58 160 62 148 C54 140 54 128 62 118Z" fill={MAG} {...SW} />
      <path d="M44 100 C38 118 40 136 50 148" fill="none" stroke={TEAL} strokeWidth="3.4" strokeLinecap="round" />

      {/* Ohren */}
      {ear}
      <g transform="translate(200 0) scale(-1 1)">{ear}</g>

      {/* Kopf */}
      <path
        d="M100 40 C135 40 154 66 152 96 C150 126 126 144 100 144 C74 144 50 126 48 96 C46 66 65 40 100 40Z"
        fill={SKIN}
        {...SW}
      />
      <ellipse cx="62" cy="123" rx="8" ry="5" fill={PINK} opacity="0.5" />
      <ellipse cx="138" cy="123" rx="8" ry="5" fill={PINK} opacity="0.5" />
      <path d="M98 113 Q100 115 102 113" fill="none" stroke={O} strokeWidth="2" strokeLinecap="round" />

      {/* Gesicht (emotionsabhaengig) */}
      <Eye cx={78} cy={102} s={1} id={`${id}-l`} spec={eyeL} />
      <Eye cx={122} cy={102} s={-1} id={`${id}-r`} spec={eyeR} />
      {f.mouth}

      {/* Pony / Haarlocke */}
      <path
        d="M48 90 C42 56 70 34 102 36 C136 38 156 60 152 90 C146 70 128 58 108 58 C96 64 84 64 70 68 C60 72 54 84 48 90Z"
        fill={MAG}
        {...SW}
      />
      <path d="M62 56 C80 42 112 40 138 54" fill="none" stroke={TEAL} strokeWidth="3.6" strokeLinecap="round" />

      {/* Brauen */}
      <Brow d={f.brows[0]} />
      <Brow d={f.brows[1]} />

      {f.extras}
    </svg>
  );
}
