import { Reveal } from '../components/Layout';
import PageHero from '../components/PageHero';
import { DOWNLOADS } from '../data';

export default function Download() {
  return (
    <>
      <PageHero eyebrow="Free · forever" title="Download the book" lede="No registration, no fees, no email lists. Choose your language and take a permanent free copy." art={['books-cloud', 'f-star']} />
      <section className="dusk page-body">
        <div className="wrap">
          <div className="dl-grid">
            {DOWNLOADS.map((d, i) => (
              <Reveal key={d.code} delay={(i % 3) * 0.08}>
                <article className="glass dl-card">
                  <div>
                    <span className="code">{d.code}</span>
                    <h2 dir={d.rtl ? 'rtl' : undefined} lang={d.rtl ? 'ar' : undefined}>{d.name}</h2>
                    <p className="meta">PDF e-book · {d.file}</p>
                  </div>
                  <a className="btn" href={`/books/${d.file}`} download={d.file} dir={d.rtl ? 'rtl' : undefined}><span>{d.cta}</span></a>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="narrow-box">
            <div className="glass tri center">
              <h3>Distribution guidelines</h3>
              <p>You are encouraged and fully licensed to share, print, distribute or upload these PDF copies anywhere — with friends, family, libraries, reading circles or online repositories. The author asks only that the content remains unmodified and properly attributed.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
