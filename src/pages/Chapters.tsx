import { Reveal } from '../components/Layout';
import PageHero from '../components/PageHero';
import { PARTS, READ, SECTIONS } from '../data';

export default function Chapters() {
  return (
    <>
      <PageHero eyebrow="A roadmap through the journey" title="Table of chapters" lede="Four parts, from the first question to the last light." art={['books-open-together', 'f-lantern']} rightWidth="clamp(240px, 34vw, 480px)" />
      <section className="dusk page-body">
        <div className="wrap narrow">
          <ol className="chapter-list">
            {PARTS.map((p, i) => (
              <Reveal key={p.n} delay={0.05}>
                <li className="glass chapter">
                  <span className="big-n" aria-hidden="true">{p.n}</span>
                  <div>
                    <h2>Part {p.n}: {p.title}</h2>
                    <p className="ar" lang="ar" dir="rtl">{p.ar}</p>
                    <p className="meta">{p.min} read</p>
                    <p>{p.text}</p>
                    <div className="btns">
                      <a className="btn" href={`${READ.en}#part${p.n}`}><span>Read in English →</span></a>
                      <a className="btn ghost" lang="ar" href={`${READ.ar}#part${p.n}`}><span>← اقرأ بالعربية</span></a>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal className="prose center">
            <h2>Jump straight to a topic</h2>
          </Reveal>
          <div className="chips">
            {SECTIONS.map((s) => (
              <a key={s.hash} className="glass chip" href={`${READ.en}#${s.hash}`}>{s.label} <span lang="ar" dir="rtl">/ {s.ar}</span></a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
