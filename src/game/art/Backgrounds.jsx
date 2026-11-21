// Hintergruende: Frachtraum, Kommandobruecke, Sternenkarte (reines SVG, keine externen Assets)

function stars(seed, n, x0, y0, w, h, rMax = 1.3) {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd() * w;
    const y = y0 + rnd() * h;
    const r = 0.4 + rnd() * rMax;
    const warm = rnd() > 0.8;
    out.push(
      <circle
        key={i}
        cx={x.toFixed(1)}
        cy={y.toFixed(1)}
        r={r.toFixed(2)}
        fill={warm ? '#ffe2b0' : '#dfe6ff'}
        opacity={(0.35 + rnd() * 0.55).toFixed(2)}
      />
    );
  }
  return out;
}

function Rivets({ x, y, n, dx, dy = 0, r = 1.6, fill = '#5b6b85' }) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(<circle key={i} cx={x + i * dx} cy={y + i * dy} r={r} fill={fill} />);
  return <g>{out}</g>;
}

function Planet({ cx, cy, r, base, shade, light, band, ring, ringColor = '#e8c9a0' }) {
  return (
    <g>
      {ring && (
        <ellipse cx={cx} cy={cy} rx={r * 1.7} ry={r * 0.38} fill="none" stroke={ringColor} strokeWidth={r * 0.14} opacity="0.3" transform={`rotate(-14 ${cx} ${cy})`} />
      )}
      <circle cx={cx} cy={cy} r={r} fill={base} />
      <path d={`M${cx + r * 0.2} ${cy - r * 0.98} A${r} ${r} 0 0 1 ${cx + r * 0.2} ${cy + r * 0.98} A${r * 1.15} ${r} 0 0 0 ${cx + r * 0.2} ${cy - r * 0.98}Z`} fill={shade} opacity="0.55" />
      {band && (
        <g opacity="0.35" fill={band}>
          <ellipse cx={cx - r * 0.1} cy={cy - r * 0.35} rx={r * 0.85} ry={r * 0.11} />
          <ellipse cx={cx + r * 0.05} cy={cy + r * 0.1} rx={r * 0.95} ry={r * 0.09} />
          <ellipse cx={cx - r * 0.1} cy={cy + r * 0.5} rx={r * 0.7} ry={r * 0.08} />
        </g>
      )}
      <ellipse cx={cx - r * 0.38} cy={cy - r * 0.4} rx={r * 0.3} ry={r * 0.18} fill={light} opacity="0.35" transform={`rotate(-30 ${cx - r * 0.38} ${cy - r * 0.4})`} />
    </g>
  );
}

function Crate({ x, y, w, h, c = '#3d4d6b', d = '#2f3d57' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1.5" fill={c} />
      <rect x={x} y={y} width={w} height={h * 0.18} fill="#fff" opacity="0.07" />
      <path d={`M${x} ${y + h * 0.5}H${x + w}M${x + w / 2} ${y}V${y + h}`} stroke={d} strokeWidth="1.2" opacity="0.8" />
      <rect x={x} y={y} width={w} height={h} rx="1.5" fill="none" stroke={d} strokeWidth="1.2" />
    </g>
  );
}

function Lamp({ x, w = 34, cone = 120, spread = 70 }) {
  return (
    <g>
      <polygon points={`${x - w / 2 + 4},12 ${x + w / 2 - 4},12 ${x + spread},${12 + cone} ${x - spread},${12 + cone}`} fill="url(#fr-cone)" />
      <rect x={x - 2} y="0" width="4" height="6" fill="#2a3550" />
      <path d={`M${x - w / 2} 14 L${x - w / 2 + 6} 5 H${x + w / 2 - 6} L${x + w / 2} 14Z`} fill="#3a4766" />
      <rect x={x - w / 2 + 4} y="13" width={w - 8} height="4" rx="2" fill="#ffc46b" />
      <rect x={x - w / 2 + 8} y="13.5" width={w - 16} height="2" rx="1" fill="#fff3d0" />
    </g>
  );
}

function Hazard({ x, y, w, h }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="url(#hazard)" />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#1b2438" strokeWidth="1" opacity="0.6" />
    </g>
  );
}

function Vent({ x, y, w, h }) {
  const lines = [];
  for (let i = 1; i < 6; i++) lines.push(<rect key={i} x={x + 4} y={y + (h / 6) * i - 1} width={w - 8} height="2.2" rx="1" fill="#141c30" />);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill="#33415d" stroke="#222c45" strokeWidth="1.5" />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx="2" fill="#1e2840" />
      {lines}
      <Rivets x={x + 3} y={y + 3} n={2} dx={w - 6} r={1.2} />
    </g>
  );
}

function SharedDefs() {
  return (
    <defs>
      <pattern id="hazard" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <rect width="16" height="16" fill="#e8b93a" />
        <rect width="8" height="16" fill="#2b2f3d" />
      </pattern>
      <linearGradient id="fr-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2c3a58" />
        <stop offset="1" stopColor="#3a4a68" />
      </linearGradient>
      <linearGradient id="fr-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#35425e" />
        <stop offset="1" stopColor="#222c45" />
      </linearGradient>
      <linearGradient id="fr-cone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffc46b" stopOpacity="0.28" />
        <stop offset="1" stopColor="#ffc46b" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="spaceG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#141233" />
        <stop offset="0.6" stopColor="#1f1a4a" />
        <stop offset="1" stopColor="#2b1d55" />
      </linearGradient>
      <radialGradient id="glowRed" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ff6a4a" stopOpacity="0.35" />
        <stop offset="1" stopColor="#ff6a4a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="glowYel" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffc46b" stopOpacity="0.3" />
        <stop offset="1" stopColor="#ffc46b" stopOpacity="0" />
      </radialGradient>
      <clipPath id="fr-door-clip">
        <circle cx="400" cy="105" r="64" />
      </clipPath>
      <clipPath id="br-win-clip">
        <rect x="78" y="22" width="524" height="128" rx="14" />
      </clipPath>
    </defs>
  );
}

export function FrachtraumBg() {
  const seams = [];
  for (let i = 0; i <= 8; i++) seams.push(<path key={i} d={`M${i * 85} 0V205`} stroke="#222c45" strokeWidth="2" opacity="0.7" />);
  const floorLines = [];
  for (let i = 0; i < 9; i++) floorLines.push(<path key={i} d={`M${340 + (i - 4) * 14} 205 L${340 + (i - 4) * 110} 300`} stroke="#4a5878" strokeWidth="1" opacity="0.22" />);
  return (
    <svg viewBox="0 0 680 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <SharedDefs />
      {/* Rueckwand */}
      <rect width="680" height="205" fill="url(#fr-wall)" />
      {seams}
      <g opacity="0.5">
        <rect x="0" y="0" width="680" height="18" fill="#1d2640" />
        <rect x="0" y="150" width="680" height="3" fill="#222c45" />
      </g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i}>
          <Rivets x={i * 85 + 8} y={30} n={2} dx={69} />
          <Rivets x={i * 85 + 8} y={140} n={2} dx={69} />
        </g>
      ))}
      {/* Rohre */}
      <g>
        <rect x="0" y="34" width="680" height="9" fill="#46557a" />
        <rect x="0" y="34" width="680" height="3" fill="#6a7ba0" opacity="0.5" />
        <rect x="0" y="47" width="680" height="6" fill="#3a4766" />
        <rect x="0" y="47" width="680" height="2" fill="#6a7ba0" opacity="0.35" />
        {[60, 230, 400, 560, 650].map((x) => (
          <g key={x}>
            <rect x={x} y="31" width="8" height="25" rx="2" fill="#2b3552" />
            <rect x={x + 1} y="33" width="2" height="21" fill="#fff" opacity="0.08" />
          </g>
        ))}
        <rect x="14" y="53" width="7" height="95" fill="#3a4766" />
        <rect x="15" y="53" width="2" height="95" fill="#6a7ba0" opacity="0.4" />
        <rect x="10" y="100" width="15" height="6" rx="2" fill="#2b3552" />
        <rect x="660" y="53" width="7" height="95" fill="#3a4766" />
        <rect x="656" y="110" width="15" height="6" rx="2" fill="#2b3552" />
      </g>
      {/* Warnstreifen */}
      <Hazard x={0} y={192} w={680} h={13} />
      <Hazard x={96} y={64} w={10} h={90} />
      <Hazard x={574} y={64} w={10} h={90} />
      {/* Lueftungsgitter */}
      <Vent x={34} y={70} w={44} h={34} />
      <Vent x={612} y={70} w={44} h={34} />
      <Vent x={36} y={118} w={40} h={24} />
      {/* Regal links */}
      <g>
        <rect x="118" y="66" width="164" height="124" fill="#1e2840" opacity="0.55" />
        <rect x="114" y="62" width="4" height="130" fill="#46557a" />
        <rect x="282" y="62" width="4" height="130" fill="#46557a" />
        {[104, 146, 188].map((y) => (
          <rect key={y} x="114" y={y - 3} width="172" height="4" fill="#5a6b8f" />
        ))}
        <Crate x={124} y={80} w={34} h={24} c="#4a5f86" d="#2c3957" />
        <Crate x={162} y={86} w={26} h={18} c="#6a5a4e" d="#3b2f29" />
        <Crate x={194} y={74} w={40} h={30} c="#3d4d6b" d="#2c3957" />
        <Crate x={240} y={88} w={30} h={16} c="#4a5f86" d="#2c3957" />
        <Crate x={126} y={124} w={44} h={22} c="#3d4d6b" d="#2c3957" />
        <Crate x={176} y={118} w={30} h={28} c="#6a5a4e" d="#3b2f29" />
        <Crate x={212} y={128} w={26} h={18} c="#4a5f86" d="#2c3957" />
        <Crate x={244} y={122} w={32} h={24} c="#3d4d6b" d="#2c3957" />
        <Crate x={124} y={166} w={30} h={22} c="#4a5f86" d="#2c3957" />
        <Crate x={160} y={160} w={46} h={28} c="#3d4d6b" d="#2c3957" />
        <Crate x={214} y={168} w={24} h={20} c="#6a5a4e" d="#3b2f29" />
        <Crate x={244} y={164} w={34} h={24} c="#4a5f86" d="#2c3957" />
      </g>
      {/* Regal rechts */}
      <g>
        <rect x="518" y="66" width="46" height="124" fill="#1e2840" opacity="0.55" />
        <rect x="514" y="62" width="4" height="130" fill="#46557a" />
        <rect x="564" y="62" width="4" height="130" fill="#46557a" />
        {[104, 146, 188].map((y) => (
          <rect key={y} x="514" y={y - 3} width="54" height="4" fill="#5a6b8f" />
        ))}
        <Crate x={522} y={82} w={36} h={22} c="#6a5a4e" d="#3b2f29" />
        <Crate x={524} y={122} w={30} h={24} c="#4a5f86" d="#2c3957" />
        <Crate x={522} y={162} w={38} h={26} c="#3d4d6b" d="#2c3957" />
      </g>
      {/* Frachttor */}
      <g>
        <circle cx="400" cy="105" r="84" fill="#2a3552" />
        <circle cx="400" cy="105" r="84" fill="none" stroke="#1b2438" strokeWidth="2" />
        <circle cx="400" cy="105" r="76" fill="#46557a" />
        <circle cx="400" cy="105" r="70" fill="#1b2438" />
        <circle cx="400" cy="105" r="64" fill="url(#spaceG)" />
        <g clipPath="url(#fr-door-clip)">
          {stars(7, 40, 336, 41, 128, 128, 1.1)}
          <ellipse cx="400" cy="105" rx="90" ry="8" fill="none" stroke="#b9a8e8" strokeWidth="4" opacity="0.1" transform="rotate(-24 400 105)" />
          <circle cx="440" cy="82" r="22" fill="url(#glowRed)" />
          <circle cx="440" cy="82" r="9" fill="#c4553f" />
          <path d="M443 73 A9 9 0 0 1 443 91 A11 9 0 0 0 443 73Z" fill="#7a2c3a" opacity="0.6" />
          <ellipse cx="437" cy="79" rx="3.5" ry="2" fill="#ff9a7a" opacity="0.45" />
          <circle cx="362" cy="140" r="3" fill="#8fa3d9" opacity="0.5" />
        </g>
        <path d="M345 60 A64 64 0 0 1 400 41" fill="none" stroke="#fff" strokeWidth="3" opacity="0.1" strokeLinecap="round" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <circle key={i} cx={(400 + Math.cos(a) * 73).toFixed(1)} cy={(105 + Math.sin(a) * 73).toFixed(1)} r="2" fill="#6a7ba0" />;
        })}
        {Array.from({ length: 4 }).map((_, i) => {
          const a = ((i * 90 + 45) * Math.PI) / 180;
          const px = (400 + Math.cos(a) * 80).toFixed(1);
          const py = (105 + Math.sin(a) * 80).toFixed(1);
          return <rect key={i} x={px - 5} y={py - 3} width="10" height="6" rx="2" fill="#e8b93a" opacity="0.9" transform={`rotate(${i * 90 + 45} ${px} ${py})`} />;
        })}
        <rect x="378" y="186" width="44" height="6" rx="2" fill="#e8b93a" opacity="0.8" />
      </g>
      {/* Lampen mit Lichtkegeln */}
      <Lamp x={190} />
      <Lamp x={400} cone={150} spread={90} />
      <Lamp x={600} />
      <circle cx="400" cy="15" r="16" fill="#ffc46b" opacity="0.1" />
      {/* Boden */}
      <rect x="0" y="205" width="680" height="95" fill="url(#fr-floor)" />
      <rect x="0" y="205" width="680" height="3" fill="#1b2438" opacity="0.6" />
      <rect x="0" y="208" width="680" height="2" fill="#6a7ba0" opacity="0.25" />
      {floorLines}
      <path d="M0 236 H680 M0 266 H680" stroke="#4a5878" strokeWidth="1" opacity="0.2" />
      <ellipse cx="400" cy="250" rx="240" ry="30" fill="#ffc46b" opacity="0.05" />
      {/* linker Bereich (Figur): Markierungen */}
      <g>
        <Hazard x={0} y={212} w={104} h={8} />
        <rect x="8" y="232" width="40" height="50" fill="none" stroke="#e8b93a" strokeWidth="1.5" opacity="0.5" />
        <rect x="56" y="232" width="40" height="50" fill="none" stroke="#e8b93a" strokeWidth="1.5" opacity="0.35" />
        <path d="M18 246 h5 v-5 M18 246 v10 M30 241 v15" fill="none" stroke="#e8b93a" strokeWidth="2" opacity="0.4" />
        <path d="M66 241 h14 M66 249 h14 M66 257 h14" stroke="#e8b93a" strokeWidth="2" opacity="0.3" />
      </g>
      <path d="M106 212 V296" stroke="#e8b93a" strokeWidth="1.5" opacity="0.18" strokeDasharray="8 6" />
    </svg>
  );
}

export function BrueckeBg() {
  const leds = [
    [132, 205, '#ff8a4a'], [146, 205, '#6ee0a8'], [160, 205, '#6ee0a8'], [174, 205, '#ffd25a'],
    [506, 205, '#6ee0a8'], [520, 205, '#ff8a4a'], [534, 205, '#6ee0a8'], [548, 205, '#8fb8ff'],
    [250, 205, '#6ee0a8'], [262, 205, '#ffd25a'], [418, 205, '#ff8a4a'], [430, 205, '#6ee0a8'],
  ];
  const struts = [190, 340, 490];
  return (
    <svg viewBox="0 0 680 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <SharedDefs />
      <rect width="680" height="300" fill="url(#fr-wall)" />
      <rect width="680" height="18" fill="#1d2640" opacity="0.6" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d={`M${i * 85 + 40} 0V160`} stroke="#222c45" strokeWidth="2" opacity="0.5" />
      ))}
      <rect x="0" y="6" width="680" height="7" fill="#46557a" opacity="0.7" />
      {/* Panoramafenster */}
      <rect x="70" y="14" width="540" height="144" rx="18" fill="#222c45" />
      <rect x="78" y="22" width="524" height="128" rx="14" fill="url(#spaceG)" />
      <g clipPath="url(#br-win-clip)">
        {stars(23, 90, 78, 22, 524, 128, 1.2)}
        <path d="M78 120 Q220 70 380 90 T602 60" fill="none" stroke="#9c8fe0" strokeWidth="26" opacity="0.06" />
        <circle cx="210" cy="84" r="44" fill="url(#glowRed)" />
        <Planet cx={210} cy={84} r={24} base="#c4553f" shade="#7a2c3a" light="#ff9a7a" band="#8a3a2e" />
        <circle cx="203" cy="90" r="3.5" fill="#8a3a2e" opacity="0.5" />
        <circle cx="216" cy="76" r="2.5" fill="#8a3a2e" opacity="0.5" />
        <circle cx="470" cy="72" r="62" fill="url(#glowYel)" />
        <Planet cx={470} cy={72} r={34} base="#e8a94a" shade="#a8602f" light="#fff0b0" band="#c9772f" ring />
        <circle cx="346" cy="118" r="6" fill="#aab4cf" />
        <path d="M347 112 A6 6 0 0 1 347 124 A7 6 0 0 0 347 112Z" fill="#6a7390" opacity="0.6" />
      </g>
      {struts.map((x) => (
        <g key={x}>
          <path d={`M${x - 6} 22 L${x + 6} 22 L${x + 10} 150 L${x - 10} 150Z`} fill="#2a3552" />
          <path d={`M${x - 6} 22 L${x - 3} 22 L${x - 7} 150 L${x - 10} 150Z`} fill="#fff" opacity="0.06" />
        </g>
      ))}
      <path d="M92 36 Q100 28 120 28" fill="none" stroke="#fff" strokeWidth="3" opacity="0.1" strokeLinecap="round" />
      <rect x="78" y="22" width="524" height="128" rx="14" fill="none" stroke="#46557a" strokeWidth="3" />
      <Rivets x={90} y={164} n={14} dx={38} r={1.6} />
      <rect x="0" y="158" width="680" height="22" fill="#2a3552" opacity="0.85" />
      <rect x="0" y="158" width="680" height="3" fill="#6a7ba0" opacity="0.35" />
      <Hazard x={0} y={176} w={680} h={4} />
      {/* Seiten-Panels */}
      <rect x="0" y="30" width="62" height="128" fill="#2a3552" opacity="0.8" />
      <rect x="618" y="30" width="62" height="128" fill="#2a3552" opacity="0.8" />
      <Vent x={14} y={44} w={36} h={28} />
      <Vent x={630} y={44} w={36} h={28} />
      <rect x="16" y="90" width="32" height="46" rx="3" fill="#1e2840" stroke="#46557a" strokeWidth="1.5" />
      <circle cx="32" cy="104" r="5" fill="#6ee0a8" opacity="0.7" />
      <circle cx="32" cy="122" r="5" fill="#ff8a4a" opacity="0.7" />
      <rect x="632" y="90" width="32" height="46" rx="3" fill="#1e2840" stroke="#46557a" strokeWidth="1.5" />
      <path d="M638 126 L644 100 L650 116 L658 98" fill="none" stroke="#8fb8ff" strokeWidth="1.8" opacity="0.8" />
      {/* Boden */}
      <rect x="0" y="262" width="680" height="38" fill="url(#fr-floor)" />
      <rect x="0" y="262" width="680" height="2" fill="#1b2438" opacity="0.6" />
      <path d="M0 280 H680" stroke="#4a5878" strokeWidth="1" opacity="0.2" />
      {/* Konsolen links */}
      <g>
        <path d="M0 262 V206 Q0 190 16 188 H300 Q316 190 316 206 V262Z" fill="#33415d" />
        <path d="M0 206 Q0 190 16 188 H300 Q316 190 316 206Z" fill="#46557a" />
        <rect x="0" y="206" width="316" height="3" fill="#1b2438" opacity="0.5" />
        <rect x="108" y="218" width="76" height="34" rx="3" fill="#1e2840" stroke="#46557a" strokeWidth="1.5" />
        <rect x="114" y="223" width="64" height="24" fill="#1d4a5e" />
        <path d="M118 242 L128 232 L138 238 L150 228 L160 236 L172 227" fill="none" stroke="#6ee0d8" strokeWidth="1.8" opacity="0.8" />
        <rect x="190" y="218" width="56" height="34" rx="3" fill="#1e2840" stroke="#46557a" strokeWidth="1.5" />
        <circle cx="218" cy="235" r="12" fill="#17384a" />
        <circle cx="218" cy="235" r="7" fill="none" stroke="#6ee0d8" strokeWidth="1.2" opacity="0.7" />
        <path d="M218 235 L224 229" stroke="#6ee0d8" strokeWidth="1.5" />
        {[258, 276, 294].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="228" r="6" fill="#222c45" stroke="#5a6b8f" strokeWidth="1.5" />
            <path d={`M${x} 228 l${i % 2 ? 3 : -3} -4`} stroke="#ffc46b" strokeWidth="1.8" />
          </g>
        ))}
        {[260, 276, 292].map((x, i) => (
          <g key={x}>
            <rect x={x - 2} y="238" width="4" height="14" rx="1" fill="#1b2438" />
            <rect x={x - 4} y={241 + ((i * 3) % 6)} width="8" height="5" rx="1.5" fill="#8fa3d9" />
          </g>
        ))}
        <rect x="14" y="218" width="84" height="34" rx="3" fill="#1e2840" stroke="#46557a" strokeWidth="1.5" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={22 + i * 19} y="226" width="14" height="6" rx="1.5" fill={i % 2 ? '#3a4766' : '#4a5f86'} />
            <rect x={22 + i * 19} y="238" width="14" height="6" rx="1.5" fill={i % 2 ? '#4a5f86' : '#3a4766'} />
          </g>
        ))}
      </g>
      {/* Konsolen rechts */}
      <g>
        <path d="M364 262 V206 Q364 190 380 188 H664 Q680 190 680 206 V262Z" fill="#33415d" />
        <path d="M364 206 Q364 190 380 188 H664 Q680 190 680 206Z" fill="#46557a" />
        <rect x="364" y="206" width="316" height="3" fill="#1b2438" opacity="0.5" />
        <rect x="378" y="218" width="76" height="34" rx="3" fill="#1e2840" stroke="#46557a" strokeWidth="1.5" />
        <rect x="384" y="223" width="64" height="24" fill="#3a2a4a" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={390 + i * 11} y={244 - ((i * 7 + 6) % 18)} width="7" height={(i * 7 + 6) % 18} fill="#ffc46b" opacity="0.75" />
        ))}
        <rect x="464" y="218" width="76" height="34" rx="3" fill="#1e2840" stroke="#46557a" strokeWidth="1.5" />
        <rect x="470" y="223" width="64" height="24" fill="#1d4a5e" />
        <circle cx="502" cy="235" r="9" fill="none" stroke="#6ee0d8" strokeWidth="1.5" opacity="0.7" />
        <path d="M486 235 H518 M502 224 V246" stroke="#6ee0d8" strokeWidth="1" opacity="0.5" />
        {[564, 582, 600, 618, 636, 654].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="228" r="6" fill="#222c45" stroke="#5a6b8f" strokeWidth="1.5" />
            <path d={`M${x} 228 l${i % 2 ? 3 : -3} -4`} stroke="#ffc46b" strokeWidth="1.8" />
          </g>
        ))}
        {[566, 586, 606, 626, 646].map((x, i) => (
          <g key={x}>
            <rect x={x - 2} y="238" width="4" height="14" rx="1" fill="#1b2438" />
            <rect x={x - 4} y={240 + ((i * 5) % 7)} width="8" height="5" rx="1.5" fill="#8fa3d9" />
          </g>
        ))}
      </g>
      {/* Kapitaenssessel (Silhouette) */}
      <g>
        <path d="M312 262 V250 H368 V262Z" fill="#1b2438" />
        <rect x="336" y="238" width="8" height="14" fill="#222c45" />
        <path d="M306 232 Q306 196 340 196 Q374 196 374 232 V244 H306Z" fill="#232c47" />
        <path d="M318 236 Q318 206 340 206 Q362 206 362 236Z" fill="#2c3757" />
        <rect x="298" y="226" width="14" height="28" rx="5" fill="#1b2438" />
        <rect x="368" y="226" width="14" height="28" rx="5" fill="#1b2438" />
        <path d="M312 202 Q326 194 340 196" fill="none" stroke="#6a7ba0" strokeWidth="1.5" opacity="0.4" />
        <rect x="320" y="250" width="40" height="6" rx="3" fill="#2c3757" />
      </g>
      {/* LEDs */}
      {leds.map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill={c} opacity="0.18" />
          <circle cx={x} cy={y} r="2.4" fill={c} />
        </g>
      ))}
      <Lamp x={120} w={30} cone={60} spread={36} />
      <Lamp x={560} w={30} cone={60} spread={36} />
    </svg>
  );
}

export function MapBg() {
  return (
    <svg viewBox="0 0 680 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <SharedDefs />
      <rect width="680" height="300" fill="url(#spaceG)" />
      <ellipse cx="340" cy="150" rx="320" ry="110" fill="#3a2f7a" opacity="0.18" />
      <ellipse cx="150" cy="240" rx="150" ry="60" fill="#2a4a7a" opacity="0.14" />
      {stars(91, 130, 0, 0, 680, 300, 1.1)}
      <g stroke="#6a7ba0" strokeWidth="0.6" opacity="0.12">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <path key={i} d={`M${i * 68} 0V300`} />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <path key={i} d={`M0 ${i * 60}H680`} />
        ))}
      </g>
      <circle cx="-10" cy="150" r="60" fill="url(#glowYel)" />
      <g fill="none" stroke="#8fa3d9" strokeWidth="1.5" opacity="0.45" strokeDasharray="7 7" strokeLinecap="round">
        <ellipse cx="-10" cy="150" rx="130" ry="130" />
        <ellipse cx="-10" cy="150" rx="350" ry="240" />
        <ellipse cx="-10" cy="150" rx="550" ry="270" opacity="0.7" />
      </g>
      <g fill="none" stroke="#ffc46b" strokeWidth="2" strokeDasharray="3 8" strokeLinecap="round" opacity="0.7">
        <path d="M168 205 Q240 130 296 118" />
        <path d="M384 120 Q470 120 520 168" />
      </g>
      <path d="M290 112 l10 4 l-9 6z" fill="#ffc46b" opacity="0.7" />
      <path d="M514 160 l10 4 l-10 7z" fill="#ffc46b" opacity="0.7" />
      {/* Mond */}
      <circle cx="130" cy="215" r="44" fill="#aab4cf" opacity="0.07" />
      <Planet cx={130} cy={215} r={26} base="#b9c2da" shade="#6a7390" light="#ffffff" />
      <circle cx="122" cy="210" r="4.5" fill="#8c96b4" opacity="0.7" />
      <circle cx="138" cy="224" r="3" fill="#8c96b4" opacity="0.7" />
      <circle cx="136" cy="205" r="2.2" fill="#8c96b4" opacity="0.7" />
      {/* Mars */}
      <circle cx="340" cy="105" r="66" fill="url(#glowRed)" />
      <Planet cx={340} cy={105} r={34} base="#c4553f" shade="#7a2c3a" light="#ff9a7a" band="#8a3a2e" />
      <circle cx="330" cy="112" r="5" fill="#8a3a2e" opacity="0.5" />
      <circle cx="350" cy="94" r="3.5" fill="#8a3a2e" opacity="0.5" />
      {/* Venus */}
      <circle cx="560" cy="195" r="78" fill="url(#glowYel)" />
      <Planet cx={560} cy={195} r={42} base="#e8a94a" shade="#a8602f" light="#fff0b0" band="#c9772f" />
    </svg>
  );
}

export default { FrachtraumBg, BrueckeBg, MapBg };
