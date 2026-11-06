import { Reveal } from '../components/Layout';
import AudioPlayer from '../components/AudioPlayer';
import PageHero from '../components/PageHero';
import { AUDIO, LANGUAGES } from '../data';

export default function Languages() {
  return (
    <>
      <PageHero eyebrow="Eight languages · one letter" title="Select your language" lede="Choose an edition to read the book in your own language — or press play and listen first." art={['globe-glass', 'f-leaf-gold']} />
      <section className="dusk page-body">
        <div className="wrap">
          <Reveal>
            <div className="glass audio-feature">
              <img src="/intro-poster.jpg" alt="The Search for Truth — illustrated multilingual cover" width={480} height={853} loading="lazy" />
              <div>
                <h2>Listen to The Search for Truth</h2>
                <p>Listen in Arabic, French or Chinese, or pick a language below to read online.</p>
                <div className="tracks">
                  {AUDIO.map((a) => (
                    <AudioPlayer key={a.lang} id={a.lang} src={a.src} title={a.name} lang={a.lang} rtl={a.rtl} duration={a.duration} readHref={a.read} />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lang-grid">
            {LANGUAGES.map((l, i) => (
              <Reveal key={l.code} delay={(i % 4) * 0.08}>
                <article className="lang-card glass" lang={l.lang} dir={l.rtl ? 'rtl' : undefined}>
                  <span className="glyph" aria-hidden="true">{l.glyph}</span>
                  <div><h2>{l.name}</h2><p>{l.blurb}</p></div>
                  <a href={l.href} className="btn"><span>{l.cta}</span></a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
