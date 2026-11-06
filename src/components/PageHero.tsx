import type { ReactNode } from 'react';
import { Cut } from './Cut';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  /** cut-out file names: [right-hand large art, left-hand small accent] */
  art: [string, string];
  rightWidth?: string;
}

export default function PageHero({ eyebrow, title, lede, art, rightWidth = 'clamp(160px, 24vw, 340px)' }: PageHeroProps) {
  return (
    <section className="sky page-hero">
      <Cut name="sky-dawn" ext="jpg" className="bg-fill" />
      <Cut name="rays" ext="jpg" screen speed={30} className="fill" style={{ opacity: 0.5 }} />
      <Cut name="sparkles" ext="jpg" screen speed={-40} className="fill" style={{ opacity: 0.55 }} />
      <Cut name={art[0]} speed={40} float hideOnMobile className="page-art-r" style={{ width: rightWidth }} />
      <Cut name={art[1]} speed={-60} hideOnMobile rotate={14} className="page-art-l" />
      <Cut name="mountains-far" speed={10} className="page-mtn" />
      <div className="page-hero-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
    </section>
  );
}
