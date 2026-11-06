import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  id: string;
  src: string;
  title: string;
  lang: string;
  rtl?: boolean;
  /** known length in seconds, shown before the file has loaded */
  duration: number;
  readHref: string;
}

const fmt = (s: number) => {
  if (!isFinite(s)) return '0:00';
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
};
const SPEEDS = [1, 1.25, 1.5, 0.85];

/** Audiobook player: seek, ±15 s, speed, and it remembers where the listener stopped. Nothing downloads until play. */
export default function AudioPlayer({ id, src, title, lang, rtl, duration, readHref }: AudioPlayerProps) {
  const ref = useRef<HTMLAudioElement>(null);
  const key = `audio-pos:${id}`;
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(duration);
  const [speed, setSpeed] = useState(0);
  const [resume, setResume] = useState(0);
  const lastSave = useRef(0);

  useEffect(() => {
    try { const t = Number(localStorage.getItem(key)); if (t > 5) { setResume(t); setTime(t); } } catch { /* storage may be blocked */ }
  }, [key]);

  const toggle = () => {
    const a = ref.current; if (!a) return;
    if (a.paused) {
      document.querySelectorAll('audio').forEach((x) => { if (x !== a) x.pause(); });
      if (resume && a.currentTime < 1) a.currentTime = resume;
      a.play().catch(() => undefined);
    } else a.pause();
  };
  const seek = (t: number) => { const a = ref.current; if (!a) return; a.currentTime = Math.min(Math.max(t, 0), dur); setTime(a.currentTime); };
  const cycle = () => { const n = (speed + 1) % SPEEDS.length; setSpeed(n); if (ref.current) ref.current.playbackRate = SPEEDS[n]; };

  return (
    <div className={`aplayer ${playing ? 'playing' : ''}`}>
      <audio
        ref={ref}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => { setDur(e.currentTarget.duration || duration); if (resume) e.currentTarget.currentTime = resume; }}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime; setTime(t);
          if (Math.abs(t - lastSave.current) > 5) { lastSave.current = t; try { localStorage.setItem(key, String(Math.floor(t))); } catch { /* ignore */ } }
        }}
        onEnded={() => { setPlaying(false); try { localStorage.removeItem(key); } catch { /* ignore */ } }}
      />
      <div className="ap-head">
        <h3 lang={lang} dir={rtl ? 'rtl' : undefined}>{title}</h3>
        <span className="ap-len">{fmt(dur)}</span>
      </div>
      <div className="ap-row">
        <button className="ap-skip" onClick={() => seek(time - 15)} aria-label="Back 15 seconds">−15</button>
        <button className="ap-play" onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} ${title}`}>
          {playing
            ? <svg viewBox="0 0 24 24" width="22" height="22"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5.500v13l11-6.500z" fill="currentColor" /></svg>}
        </button>
        <button className="ap-skip" onClick={() => seek(time + 15)} aria-label="Forward 15 seconds">+15</button>
        <div className="ap-bar">
          <input type="range" min={0} max={dur} step={1} value={Math.min(time, dur)} onChange={(e) => seek(Number(e.target.value))} aria-label={`Position in ${title}`}
            style={{ ['--p' as string]: `${(time / dur) * 100}%` }} />
          <div className="ap-times"><span>{fmt(time)}</span><span>−{fmt(Math.max(dur - time, 0))}</span></div>
        </div>
        <button className="ap-speed" onClick={cycle} aria-label="Playback speed">{SPEEDS[speed]}×</button>
      </div>
      <div className="ap-links">
        {resume > 5 && !playing && <span className="ap-resume">Resume from {fmt(resume)}</span>}
        <a href={src} download>Download</a>
        <a href={readHref}>Read this edition</a>
      </div>
    </div>
  );
}
