import { useRef, useState } from 'react';

interface VideoCardProps {
  src: string;
  title: string;
  caption: string;
  /** width / height of the video, to reserve space and avoid layout jump */
  ratio: number;
  /** second into the video shown as the still before playing */
  still?: number;
  lang?: string;
  className?: string;
}

/** Click-to-play video: nothing heavy downloads until the visitor presses play. */
export default function VideoCard({ src, title, caption, ratio, still = 1, lang, className = '' }: VideoCardProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    // only one video plays at a time
    document.querySelectorAll('video').forEach((v) => { if (v !== ref.current) v.pause(); });
    setStarted(true);
    ref.current?.play().catch(() => undefined);
  };

  return (
    <figure className={`vcard ${className}`}>
      <div className="vframe" style={{ aspectRatio: String(ratio) }}>
        <video
          ref={ref}
          src={`${src}#t=${still}`}
          preload="metadata"
          playsInline
          controls={started}
          aria-label={title}
          onPlay={() => setStarted(true)}
          onEnded={() => setStarted(false)}
        />
        {!started && (
          <button className="vplay" onClick={play} aria-label={`Play: ${title}`}>
            <span className="vplay-ring"><svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M8 5.500v13l11-6.500z" fill="currentColor" /></svg></span>
          </button>
        )}
      </div>
      <figcaption>
        <strong lang={lang}>{title}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
