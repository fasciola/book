import { useState } from 'react';
import { Cut } from './Cut';

/** Medallion centres on one-tree-many-branches.png (1536×1024), as % of the image. */
const SPOTS = [
  { t: 'Islam', n: 'Crescent and star', x: 500, y: 225 },
  { t: 'Christianity', n: 'Cross', x: 692, y: 205 },
  { t: 'Judaism', n: 'Star of David', x: 896, y: 215 },
  { t: 'Hinduism', n: 'Om', x: 1086, y: 240 },
  { t: 'Buddhism', n: 'Dharma wheel', x: 408, y: 368 },
  { t: 'Sikhism', n: 'Khanda', x: 652, y: 352 },
  { t: 'Shinto', n: 'Torii gate', x: 922, y: 352 },
  { t: 'Taoism', n: 'Yin and yang', x: 1154, y: 375 },
  { t: 'Bahá’í Faith', n: 'Nine-pointed star', x: 320, y: 507 },
  { t: 'Zoroastrianism', n: 'Winged emblem', x: 575, y: 490 },
  { t: 'Jainism', n: 'Open hand and wheel', x: 981, y: 507 },
  { t: 'Indigenous traditions', n: 'Dreamcatcher', x: 1219, y: 513 },
];

/** The golden olive tree with a focusable hotspot on every medallion, so each emblem is named for everyone. */
export default function TreeMap() {
  const [on, setOn] = useState<number | null>(null);
  const cur = on === null ? null : SPOTS[on];
  return (
    <div className="treemap">
      <div className="treemap-stage">
        <Cut name="one-tree-many-branches" speed={-20} className="treemap-img" />
        {SPOTS.map((s, i) => (
          <button
            key={s.t}
            className={`hot ${on === i ? 'on' : ''}`}
            style={{ left: `${(s.x / 1536) * 100}%`, top: `${(s.y / 1024) * 100}%` }}
            aria-label={`${s.t}: ${s.n}`}
            onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)}
            onFocus={() => setOn(i)} onBlur={() => setOn(null)} onClick={() => setOn(i)}
          >
            <span className="tip">{s.t}</span>
          </button>
        ))}
      </div>
      <p className="treemap-cap" aria-live="polite">
        {cur ? <><b>{cur.t}</b> · {cur.n}</> : 'Hover or tap a medallion'}
      </p>
    </div>
  );
}
