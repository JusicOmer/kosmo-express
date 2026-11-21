import React from 'react';

// BOLZEN - kleiner Reparatur-Roboter. Fest: Koerper, Kopf, Antenne, Bildschirm.
// Emotionsabhaengig: Bildschirm-Inhalt (FACES), Extras (EXTRAS), Antennenlicht (ANTENNA), Brust (PUFF).

const C = {
  ink: '#1f2a30',
  metal: '#7fd8d4',
  metalHi: '#c4f4f0',
  metalLo: '#4db5b5',
  screen: '#16252d',
  rim: '#2e4854',
  led: '#5ef2ff',
  yellow: '#ffc93c',
  orange: '#ff8a3d',
  red: '#ff4d5a',
};

const SW = 3;

// LED-Strich mit weichem Leuchtrand
const led = (d, color = C.led, w = 6, fill = 'none') => (
  <g fill={fill} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={color} strokeWidth={w + 7} opacity=".22" />
    <path d={d} stroke={color} strokeWidth={w} />
  </g>
);

const ledFill = (d, color = C.led) => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <path d={d} fill={color} stroke={color} strokeWidth="11" opacity=".22" />
    <path d={d} fill={color} stroke={color} strokeWidth="3" />
  </g>
);

const star = (cx, cy, r) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
};

const SPARK = 'M0 -9Q1 -1 9 0Q1 1 0 9Q-1 1 -9 0Q-1 -1 0 -9Z';
const sparkle = (x, y, s) => (
  <path
    d={SPARK}
    transform={`translate(${x} ${y}) scale(${s})`}
    fill={C.yellow}
    stroke={C.ink}
    strokeWidth={2 / s}
    strokeLinejoin="round"
  />
);

const Z = (x, y, s) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M0 0H10L0 12H10" stroke={C.ink} strokeWidth={5 / s} />
    <path d="M0 0H10L0 12H10" stroke={C.led} strokeWidth={2.4 / s} />
  </g>
);

const cheeks = (
  <g fill={C.orange} opacity=".45">
    <ellipse cx="62" cy="108" rx="7" ry="4" />
    <ellipse cx="138" cy="108" rx="7" ry="4" />
  </g>
);

const FACES = {
  happy: (
    <>
      {led('M68 93Q78 77 88 93')}
      {led('M112 93Q122 77 132 93')}
      {ledFill('M80 103Q100 127 120 103Z')}
      {cheeks}
    </>
  ),
  curious: (
    <>
      {led('M110 70Q122 63 134 70', C.led, 4)}
      <circle cx="72" cy="88" r="12" fill="none" stroke={C.led} strokeWidth="5" />
      <circle cx="72" cy="88" r="12" fill="none" stroke={C.led} strokeWidth="12" opacity=".2" />
      <circle cx="75" cy="86" r="4.5" fill={C.led} />
      {led('M106 90m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0', C.led, 4, C.led)}
      {led('M68 111Q80 117 92 109', C.led, 4)}
      {led('M124 74Q124 66 133 66Q142 66 142 73Q142 79 133 83L133 87', C.yellow, 4.5)}
      <circle cx="133" cy="97" r="3.2" fill={C.yellow} />
    </>
  ),
  surprised: (
    <>
      {led('M62 66Q76 58 90 66', C.led, 4)}
      {led('M110 66Q124 58 138 66', C.led, 4)}
      <circle cx="76" cy="88" r="13" fill="none" stroke={C.led} strokeWidth="5" />
      <circle cx="124" cy="88" r="13" fill="none" stroke={C.led} strokeWidth="5" />
      <circle cx="76" cy="88" r="13" fill="none" stroke={C.led} strokeWidth="12" opacity=".2" />
      <circle cx="124" cy="88" r="13" fill="none" stroke={C.led} strokeWidth="12" opacity=".2" />
      <circle cx="76" cy="88" r="4" fill={C.led} />
      <circle cx="124" cy="88" r="4" fill={C.led} />
      <ellipse cx="100" cy="111" rx="7" ry="9" fill="none" stroke={C.led} strokeWidth="5" />
    </>
  ),
  worried: (
    <>
      {led('M62 80L90 68', C.led, 4.5)}
      {led('M110 68L138 80', C.led, 4.5)}
      {led('M78 93m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0', C.led, 4, C.led)}
      {led('M122 93m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0', C.led, 4, C.led)}
      {led('M78 114q7 -8 14 0t14 0t14 0', C.led, 4.5)}
    </>
  ),
  angry: (
    <>
      <rect x="50" y="56" width="100" height="68" rx="24" fill={C.red} opacity=".14" />
      {led('M58 64L92 76', C.red, 5.5)}
      {led('M108 76L142 64', C.red, 5.5)}
      {led('M68 83L88 92L68 101', C.red, 6)}
      {led('M132 83L112 92L132 101', C.red, 6)}
      {led('M82 117Q100 102 118 117', C.red, 6)}
    </>
  ),
  determined: (
    <>
      {ledFill('M63 83H91V96H63Z')}
      {ledFill('M109 83H137V96H109Z')}
      {led('M60 73L92 79', C.led, 5)}
      {led('M108 79L140 73', C.led, 5)}
      {led('M84 112H116', C.led, 6)}
    </>
  ),
  sleepy: (
    <>
      {led('M66 92H90', C.led, 5)}
      {led('M110 92H134', C.led, 5)}
      <ellipse cx="100" cy="111" rx="5" ry="4" fill="none" stroke={C.led} strokeWidth="3.5" opacity=".7" />
    </>
  ),
  proud: (
    <>
      {ledFill(star(78, 87, 14))}
      {ledFill(star(122, 87, 14))}
      {led('M78 106Q100 126 122 106', C.led, 6)}
      {cheeks}
    </>
  ),
};

const EXTRAS = {
  happy: null,
  curious: null,
  surprised: null,
  worried: (
    <path
      d="M158 48C156 57 150 61 150 68A8 8 0 0 0 166 68C166 61 160 57 158 48Z"
      fill="#9fe6ff"
      stroke={C.ink}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
  ),
  angry: null,
  determined: null,
  sleepy: (
    <>
      {Z(138, 52, 0.7)}
      {Z(148, 36, 0.95)}
      {Z(160, 18, 1.2)}
    </>
  ),
  proud: (
    <>
      {sparkle(26, 58, 1.1)}
      {sparkle(176, 50, 1.3)}
      {sparkle(46, 28, 0.8)}
      {sparkle(170, 80, 0.7)}
    </>
  ),
};

// rot: Kippwinkel, lift: Hoehe, color: Lichtfarbe, glow: Leuchtring
const ANTENNA = {
  happy: { rot: 0, lift: 0, color: C.orange, glow: true },
  curious: { rot: 20, lift: 0, color: C.orange, glow: true },
  surprised: { rot: 0, lift: -6, color: C.yellow, glow: true },
  worried: { rot: -8, lift: 2, color: C.orange, glow: false },
  angry: { rot: 0, lift: 0, color: C.red, glow: true },
  determined: { rot: 0, lift: 0, color: C.orange, glow: true },
  sleepy: { rot: -14, lift: 4, color: '#a6896f', glow: false },
  proud: { rot: 0, lift: 0, color: C.yellow, glow: true },
};

const PUFF = { proud: 1.06 };

export default function Bolzen({ emotion = 'happy', size = 160 }) {
  const key = FACES[emotion] ? emotion : 'happy';
  const a = ANTENNA[key];
  const puff = PUFF[key] || 1;
  const ballY = 20 + a.lift;

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Bolzen">
      <defs>
        <linearGradient id="bz-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.metalHi} />
          <stop offset="1" stopColor={C.metal} />
        </linearGradient>
        <clipPath id="bz-body-clip">
          <rect x="66" y="138" width="68" height="48" rx="14" />
        </clipPath>
      </defs>

      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth={SW} stroke={C.ink}>
        {/* Koerper */}
        <g transform={`translate(100 160) scale(${puff}) translate(-100 -160)`}>
          <rect x="66" y="138" width="68" height="48" rx="14" fill={C.metal} />
          <g clipPath="url(#bz-body-clip)" stroke="none">
            <rect x="66" y="166" width="68" height="13" fill={C.yellow} />
            <g fill={C.ink}>
              <path d="M70 166L80 166L72 179L62 179Z" />
              <path d="M90 166L100 166L92 179L82 179Z" />
              <path d="M110 166L120 166L112 179L102 179Z" />
              <path d="M130 166L140 166L132 179L122 179Z" />
            </g>
          </g>
          <path d="M66 166H134M66 179H134" fill="none" strokeWidth="2.5" />
          <rect x="66" y="138" width="68" height="48" rx="14" fill="none" />
          {/* Schraubenschluessel-Abzeichen */}
          <circle cx="100" cy="153" r="9.5" fill={C.yellow} />
          <path d="M95 158L103 150" fill="none" strokeWidth="3.4" />
          <circle cx="105" cy="148" r="3.6" fill="none" strokeWidth="2.6" />
          {/* Haendchen */}
          <circle cx="59" cy="160" r="7.5" fill={C.yellow} />
          <circle cx="141" cy="160" r="7.5" fill={C.yellow} />
        </g>

        {/* Hals */}
        <rect x="84" y="130" width="32" height="12" rx="4" fill={C.rim} />

        {/* Antenne */}
        <g transform={`rotate(${a.rot} 100 40)`}>
          <path d={`M100 40V${ballY + 7}`} fill="none" strokeWidth="4" />
          {a.glow && <circle cx="100" cy={ballY} r="12" fill={a.color} opacity=".3" stroke="none" />}
          <circle cx="100" cy={ballY} r="7.5" fill={a.color} />
          <circle cx="97.5" cy={ballY - 2.5} r="2" fill="#fff" opacity=".7" stroke="none" />
        </g>

        {/* Ohren mit Schrauben */}
        <circle cx="30" cy="98" r="10" fill={C.metalLo} />
        <circle cx="170" cy="98" r="10" fill={C.metalLo} />
        <path d="M25 98H35M165 98H175" fill="none" strokeWidth="2.4" />

        {/* Kopf */}
        <path
          d="M34 112C34 62 62 36 100 36C138 36 166 62 166 112C166 128 156 136 142 136H58C44 136 34 128 34 112Z"
          fill="url(#bz-head)"
        />
        <path d="M60 52Q74 42 90 40" fill="none" stroke="#fff" strokeWidth="4" opacity=".55" />
        <circle cx="100" cy="38" r="5" fill={C.metalLo} />
        <circle cx="60" cy="130" r="2.6" fill={C.metalLo} strokeWidth="2" />
        <circle cx="140" cy="130" r="2.6" fill={C.metalLo} strokeWidth="2" />

        {/* Bildschirm */}
        <rect x="50" y="56" width="100" height="68" rx="24" fill={C.screen} stroke={C.ink} />
        <rect x="53" y="59" width="94" height="62" rx="21" fill="none" stroke={C.rim} strokeWidth="2" />
        <g stroke="none">{FACES[key]}</g>
        <path d="M60 74Q62 66 72 63" fill="none" stroke="#fff" strokeWidth="3" opacity=".18" />

        {/* Extras ausserhalb des Bildschirms */}
        {EXTRAS[key]}
      </g>
    </svg>
  );
}
