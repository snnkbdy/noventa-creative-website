import * as React from 'react';
import gsap from 'gsap';

export type TumbleCard = { src: string; alt?: string };
export type TumbleDeckShowcaseProps = {
  cards: TumbleCard[];
  height?: number | string;
  aspect?: number;
  scrollPerCard?: number;
  depth?: number;
  background?: string;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
};

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const wrap = (k: number, n: number) => (n ? ((k % n) + n) % n : 0);
export function fallAngle(t: number): number {
  const u = clamp01(t), land = 0.78;
  if (u <= land) { const k = u / land; return -90 * k * k * k; }
  const k = (u - land) / (1 - land);
  return -90 + 6 * Math.sin(Math.PI * k) * (1 - k);
}
export function deckAdvance(pos: number): number {
  const i = Math.floor(pos), f = pos - i, k = clamp01((f - 0.28) / 0.6);
  return i + k * k * (3 - 2 * k);
}
export type Pose = { angle: number; z: number; lift: number; opacity: number; flat: boolean };
export function cardPose(k: number, pos: number, depth: number): Pose {
  const t = pos - k, lift = (k - Math.floor(pos) + 3) * 0.6;
  if (t >= 1) return { angle: -90, z: 0, lift, opacity: t < 3 ? 1 : 0, flat: true };
  if (t > 0) return { angle: fallAngle(t), z: 0, lift, opacity: 1, flat: false };
  const rel = k - deckAdvance(pos);
  return { angle: 0, z: -Math.max(rel, 0), lift: 0, opacity: clamp01(depth + 1 - rel), flat: false };
}

export default function TumbleDeckShowcase({
  cards, height = 'min(690px, 78svh)', aspect = 1.6, scrollPerCard = 420,
  depth = 3, background = 'var(--paper)', className, style, ariaLabel = 'Noventa konsept çalışmaları galerisi',
}: TumbleDeckShowcaseProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = React.useRef<(HTMLImageElement | null)[]>([]);
  const slotK = React.useRef<number[]>([]);
  const state = React.useRef({ pos: 0 });
  const geo = React.useRef({ h: 200, gap: 44 });
  const n = cards.length, pool = n ? depth + 5 : 0;

  const paint = React.useCallback(() => {
    const { pos } = state.current, { gap } = geo.current, base = Math.floor(pos) - 2;
    cardRefs.current.forEach((el, j) => {
      const img = imgRefs.current[j];
      if (!el || !img || j >= pool || !n) return;
      const k = base + wrap(j - base, pool);
      if (slotK.current[j] !== k) {
        slotK.current[j] = k;
        const card = cards[wrap(k, n)];
        img.src = card.src; img.alt = card.alt ?? '';
      }
      const p = cardPose(k, pos, depth);
      el.style.transform = `translate3d(0, ${-p.lift}px, ${p.z * gap}px) rotateX(${p.angle}deg)`;
      el.style.opacity = String(p.opacity);
      el.style.visibility = p.opacity > 0 ? 'visible' : 'hidden';
      el.style.setProperty('--td-shade', String(p.flat ? 0.06 : (-p.angle / 90) * 0.06));
    });
  }, [cards, depth, n, pool]);

  React.useLayoutEffect(() => { slotK.current = []; paint(); }, [cards, paint]);
  React.useLayoutEffect(() => {
    const root = rootRef.current, scene = sceneRef.current;
    if (!root || !scene) return;
    const fit = () => {
      const W = root.clientWidth, H = root.clientHeight;
      const wFrac = W < 420 ? 0.84 : 0.72;
      const h = Math.max(60, Math.min((W * wFrac) / aspect, H * 0.48, 570));
      const w = h * aspect, top = H / 2 - 0.62 * h;
      geo.current = { h, gap: 0.24 * h };
      scene.style.perspective = `${6 * h}px`;
      scene.style.perspectiveOrigin = `50% ${top - 1.66 * h}px`;
      root.style.setProperty('--td-w', `${w}px`);
      root.style.setProperty('--td-h', `${h}px`);
      root.style.setProperty('--td-top', `${top}px`);
      paint();
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(root);
    return () => ro.disconnect();
  }, [aspect, paint]);

  const api = React.useRef<{ step: (dir: 1 | -1) => void }>({ step: () => {} });
  const dragged = React.useRef(false);
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || !n) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = state.current;
    let target = s.pos, running = false, idle: ReturnType<typeof setTimeout> | undefined, acc = 0;
    const follow = () => {
      const dt = gsap.ticker.deltaRatio(60) / 60;
      s.pos += (target - s.pos) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - s.pos) < 2e-3) { s.pos = target; gsap.ticker.remove(follow); running = false; }
      paint();
    };
    const push = (to: number) => {
      target = Math.max(Math.round(s.pos) - 3, Math.min(Math.round(s.pos) + 3, to));
      if (reduce) { s.pos = target; paint(); }
      else if (!running) { running = true; gsap.ticker.add(follow); }
    };
    const settle = (bias = 0) => push(bias > 0 ? Math.floor(target + 0.7) : bias < 0 ? Math.ceil(target - 0.7) : Math.round(target));
    api.current.step = dir => push(Math.round(target) + dir);
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? root.clientHeight : 1;
      const d = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * scale;
      if (reduce) {
        acc += d;
        while (Math.abs(acc) >= scrollPerCard) { const dir = Math.sign(acc); acc -= dir * scrollPerCard; push(target + dir); }
        return;
      }
      push(target + d / scrollPerCard);
      clearTimeout(idle); idle = setTimeout(() => settle(Math.sign(d)), 140);
    };
    let drag: { id: number; y: number; travel: number; last: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag = { id: e.pointerId, y: e.clientY, travel: 0, last: 0 };
      dragged.current = false; clearTimeout(idle);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dy = drag.y - e.clientY; drag.y = e.clientY; drag.travel += Math.abs(dy);
      if (dy) drag.last = Math.sign(dy);
      if (drag.travel > 6 && !dragged.current) { dragged.current = true; root.setPointerCapture(e.pointerId); }
      if (dragged.current && !reduce) push(target + dy / (geo.current.h * 1.1));
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (dragged.current) { if (reduce) push(Math.round(target) + (drag.last || 0)); else settle(drag.last); }
      drag = null;
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    paint();
    return () => {
      clearTimeout(idle); gsap.ticker.remove(follow);
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
    };
  }, [n, paint, scrollPerCard]);

  const onKey = (e: React.KeyboardEvent) => {
    if (['ArrowRight', 'ArrowDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); api.current.step(1); }
    else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); api.current.step(-1); }
  };

  return <div ref={rootRef} role="region" aria-roledescription="carousel" aria-label={ariaLabel}
    tabIndex={0} onKeyDown={onKey} onClick={() => { if (!dragged.current) api.current.step(1); }}
    className={['td-root', className].filter(Boolean).join(' ')} style={{ height, background, ...style }}>
    <style>{`
      .td-root{position:relative;width:100%;overflow:hidden;outline:none;user-select:none;touch-action:pan-y;isolation:isolate}
      .td-scene{position:absolute;inset:0;transform-style:preserve-3d}
      .td-card{position:absolute;left:50%;top:var(--td-top);width:var(--td-w);height:var(--td-h);margin-left:calc(var(--td-w)/-2);transform-origin:50% 100%;transform-style:preserve-3d;backface-visibility:visible;will-change:transform;border-radius:4px;overflow:hidden;cursor:grab;background:color-mix(in oklab,var(--ink) 8%,var(--paper));box-shadow:0 12px 35px rgba(32,33,30,.13)}
      .td-card img{display:block;width:100%;height:100%;max-width:none;object-fit:cover;pointer-events:none}
      .td-card:after{content:'';position:absolute;inset:0;pointer-events:none;background:#000;opacity:var(--td-shade,0)}
      .td-root:focus-visible{box-shadow:inset 0 0 0 2px var(--orange)}
      @media(prefers-reduced-motion:reduce){.td-card{will-change:auto}}
    `}</style>
    <div ref={sceneRef} className="td-scene">
      {Array.from({ length: pool }, (_, j) => <div key={j} ref={el => { cardRefs.current[j] = el; }} className="td-card">
        <img ref={el => { imgRefs.current[j] = el; }} alt="" width={720} height={450} draggable={false} decoding="async"/>
      </div>)}
    </div>
    <span className="sr-only" aria-live="polite">{n} konsept çalışması. Kaydırın, sürükleyin veya ok tuşlarıyla geçiş yapın.</span>
  </div>;
}
