import { Link } from 'react-router-dom';
import { Reveal } from '../components/Layout';
import PageHero from '../components/PageHero';
import { DIFFERENT, KEY_MESSAGES, READ } from '../data';

export default function About() {
  return (
    <>
      <PageHero eyebrow="About the book" title="A seeker’s path to universal coherence" lede="A decade of reading, thinking and searching — distilled into a personal letter to every truth-seeker on earth." art={['prism-light', 'f-leaf-gold']} rightWidth="clamp(200px, 30vw, 420px)" />
      <section className="dusk page-body">
        <div className="wrap narrow">
          <Reveal className="prose">
            <h2>The question</h2>
            <p>What if the divisions that tear our world apart — religious, racial, political, economic — are not inevitable? What if there exists a truth so universal, so rational, so merciful, that it could unite every honest human being who encounters it?</p>
            <p>This book was born from that question. It is not a theological treatise written for scholars. It is not a polemic against other religions. It is a personal letter, written by one human being to another, saying: <em>I have searched. I have struggled. And I have found something I believe you deserve to know.</em></p>
            <h2>The journey</h2>
            <p>The author, Ahmed Attijani Ahmed Albadawi, is a Sudanese journalist and researcher who spent more than ten years reading the Torah, the Gospel, the Quran and the major works of philosophy — not to confirm what he already believed, but to test it. He applied a single standard to every text: rational coherence, historical reliability and moral beauty.</p>
          </Reveal>

          <div className="triptych">
            {[
              ['The awakening', 'A journalist in Khartoum asks himself: “Do I believe because I was born to believe, or because I have found the truth?” The question terrifies him. He cannot live with the uncertainty.'],
              ['The method', 'He resolves to test every scripture and every philosophy by three criteria: rational coherence, historical reliability and moral beauty. No authority without evidence. No tradition without examination.'],
              ['The result', 'He returns to the Quran as a seeker, not a born believer. He finds rational coherence in its pure monotheism, historical reliability in its preservation and moral beauty in its commands.'],
            ].map(([t, p], i) => (
              <Reveal key={t} delay={i * 0.1}><div className="glass tri"><h3>{t}</h3><p>{p}</p></div></Reveal>
            ))}
          </div>

          <Reveal className="prose">
            <h2>What makes this book different</h2>
          </Reveal>
          <ul className="different">
            {DIFFERENT.map(([a, b], i) => (
              <Reveal key={a} delay={i * 0.06}><li className="glass"><strong>{a}</strong> {b}</li></Reveal>
            ))}
          </ul>

          <Reveal className="prose"><h2>Key messages</h2><p>Open any topic to read the full explanation in the book.</p></Reveal>
          <div className="msg-grid">
            {KEY_MESSAGES.map((m, i) => (
              <Reveal key={m.title} delay={(i % 3) * 0.08}>
                <a className="glass msg" href={`${READ.en}#${m.hash}`}><h3>{m.title}</h3><p>{m.text}</p><span className="more">Read in the book →</span></a>
              </Reveal>
            ))}
          </div>

          <div className="btns center">
            <a href={READ.en} className="btn"><span>Read online now</span></a>
            <Link to="/download" className="btn ghost"><span>Download free PDF</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
