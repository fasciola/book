import { Reveal } from '../components/Layout';
import PageHero from '../components/PageHero';
import { SITE } from '../data';

export default function Author() {
  return (
    <>
      <PageHero eyebrow="About the author" title="A scholar, writer and journalist from Sudan" art={['desk-window', 'f-feather']} rightWidth="clamp(200px, 30vw, 420px)" />
      <section className="dusk page-body">
        <div className="wrap narrow">
          <Reveal>
            <div className="glass author-card">
              <h2>Ahmad Attijani Ahmad Albadawi</h2>
              <p className="meta">Scholar · Researcher · Journalist</p>
              <dl>
                <div><dt>Address</dt><dd>Khartoum, Sudan</dd></div>
                <div><dt>Occupation</dt><dd>Imam of Arrahad Mosque; journalist with Sudanile newspaper, Assahafa newspaper and many academic websites.</dd></div>
              </dl>
            </div>
          </Reveal>
          <Reveal className="prose">
            <p>Ahmad Attijani Ahmad Albadawi is a distinguished scholar, researcher and veteran journalist based in Khartoum, Sudan. For more than three decades he has written widely on religion, philosophy, society and culture — guided by the conviction that Islam, properly understood, is an infinite message of mercy, wisdom and peaceful coexistence, rather than extremism or hostility.</p>
            <p>His mission is clear and direct: to present the original, universal and merciful guidance of Islam to a world that has too often seen only distorted depictions of it. He writes not merely for academic audiences, but for every searcher of truth who has ever pondered human origins and destiny.</p>
            <p>He considers <em>Spare Some Minutes of Your Time</em> his most important contribution, because it was written not as an academic lecture but as a personal letter addressed directly to you, the reader, inviting shared reflection.</p>
            <p>He is the author of numerous printed and forthcoming publications, and is dedicated to inviting people to the peaceful invitation of Islam “in a way that is better.”</p>
          </Reveal>
          <Reveal>
            <div className="glass contact-mini">
              <h3>Contact the author</h3>
              <p>The author welcomes sincere enquiries, feedback and respectful interfaith dialogue from readers of every background.</p>
              <a className="btn" href={`mailto:${SITE.email}`}><span>{SITE.email}</span></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
