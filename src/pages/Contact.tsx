import { Reveal } from '../components/Layout';
import PageHero from '../components/PageHero';
import { SITE } from '../data';

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Sincere dialogue is always welcome" title="Write to the author" lede="Questions, feedback or respectful interfaith exchange — searchers of every background are welcome." art={['dove-letter', 'f-leaf-gold']} rightWidth="clamp(220px, 32vw, 460px)" />
      <section className="dusk page-body">
        <div className="wrap narrow">
          <div className="two">
            <Reveal>
              <div className="glass tri">
                <h3>Email</h3>
                <p>For correspondence, questions, translation approvals or direct feedback:</p>
                <a className="btn" href={`mailto:${SITE.email}`}><span>{SITE.email}</span></a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="glass tri">
                <h3>WhatsApp</h3>
                <p>For quicker questions, chat with the author directly:</p>
                <a className="btn wa-btn" href={SITE.whatsapp} target="_blank" rel="noopener noreferrer"><span>Chat with the author</span></a>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div className="glass tri center">
              <h3>What to expect</h3>
              <p>The author receives letters from seekers around the world and tries to answer each personally. Please allow a few days for detailed answers — and thank you for your patience.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
