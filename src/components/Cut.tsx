import { useRef, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface CutProps {
  /** file name inside /assets/cutouts, without extension */
  name: string;
  ext?: 'png' | 'jpg';
  /** parallax: px travelled per full pass through the viewport (negative = opposite direction) */
  speed?: number;
  /** gentle idle bobbing */
  float?: boolean;
  /** black-background atmosphere image blended with `screen` */
  screen?: boolean;
  className?: string;
  style?: CSSProperties;
  rotate?: number;
  hideOnMobile?: boolean;
}

/** A transparent illustration that drifts on scroll. Hides itself if the file is missing. */
export function Cut({ name, ext = 'png', speed = 0, float, screen, className = '', style, rotate = 0, hideOnMobile }: CutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [missing, setMissing] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [speed, -speed]);
  if (missing) return null;
  return (
    <div
      ref={ref}
      className={`cut ${float ? 'float' : ''} ${screen ? 'screen' : ''} ${hideOnMobile ? 'hide-sm' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <motion.img
        src={`/assets/cutouts/${name}.${ext}`}
        alt=""
        draggable={false}
        style={{ y, rotate }}
        onError={() => setMissing(true)}
      />
    </div>
  );
}
