import { Link } from 'react-router-dom';
import { Cut } from '../components/Cut';
import { Reveal } from '../components/Layout';
import TreeMap from '../components/TreeMap';
import VideoCard from '../components/VideoCard';
import AudioPlayer from '../components/AudioPlayer';
import { AUDIO, KEY_MESSAGES, LANGUAGES, PARTS, QUESTIONS, READ, SITE } from '../data';

export default function Home() {
  return (
    <>
      {/* 1 · HERO — dawn valley with the golden olive tree */}
      <section className="sky hero">
        <Cut name="sky-dawn" ext="jpg" className="bg-fill" />
        <Cut name="rays" ext="jpg" screen speed={40} className="fill" style={{ opacity: 0.7 }} />
        <Cut name="mountains-far" speed={20} className="hero-mtn-far" />
        <Cut name="cloud-wisp" ext="jpg" screen speed={-60} className="hero-wisp" style={{ opacity: 0.8 }} />
        <Cut name="olive-tree" speed={-30} float className="hero-tree" />
        <Cut name="island-book" speed={-90} float hideOnMobile className="hero-island-r" rotate={5} />
        <Cut name="island-lamp" speed={-130} float hideOnMobile className="hero-island-l" rotate={-6} />
        <Cut name="dove-flight" speed={80} className="hero-dove" rotate={-4} />
        <Cut name="f-leaf-gold" speed={160} hideOnMobile className="hero-leaf" rotate={20} />
        <Cut name="sparkles" ext="jpg" screen speed={-50} className="fill" style={{ opacity: 0.6 }} />
        <Cut name="mountains-near" speed={-10} className="hero-mtn-near" />

        <nav className="hero-langs" aria-label="Read in your language">
          <span>Read in</span>
          {LANGUAGES.map((l) => (
            <a key={l.code} href={l.href} lang={l.lang} dir={l.rtl ? 'rtl' : undefined}>{l.code === 'ar' ? 'العربية' : l.name}</a>
          ))}
        </nav>

        <div className="hero-copy">
          <span className="eyebrow">A personal letter to every truth-seeker</span>
          <h1>The Earth is <em>Home</em> to all Creatures</h1>
          <p className="lede">A decade-long search across the Torah, the Gospel, the Quran and philosophy — written for everyone who has ever asked what is true.</p>
          <div className="btns">
            <a href={READ.en} className="btn"><span>Begin the Journey</span></a>
            <Link to="/download" className="btn ghost"><span>Free PDF</span></Link>
          </div>
        </div>
        <span className="scroll-cue" aria-hidden="true">Scroll</span>
      </section>

      {/* 1b · WATCH — the introduction films */}
      <section className="dusk watch">
        <Cut name="rays" ext="jpg" screen speed={-30} className="fill" style={{ opacity: 0.4 }} />
        <div className="wrap">
          <Reveal className="head center">
            <span className="eyebrow">Watch</span>
            <h2>Begin with the introduction</h2>
            <p>Two short films, about a minute and a quarter each. Press play — nothing downloads until you do.</p>
          </Reveal>
          <div className="watch-grid">
            <Reveal><VideoCard src="/videos/story-1.mp4" ratio={478 / 850} still={4} title="The Introduction" caption="“Dear reader…” — a letter, opened" className="portrait" /></Reveal>
            <Reveal delay={0.12}><VideoCard src="/videos/story-2.mp4" ratio={848 / 478} still={5} title="हम सत्य की तलाश में थे" caption="Hindi · हिन्दी — with subtitles" lang="hi" className="wide" /></Reveal>
          </div>
        </div>
      </section>

      {/* 1c · LISTEN — audiobooks */}
      <section className="dusk night listen">
        <div className="wrap">
          <Reveal className="head center">
            <span className="eyebrow">Listen</span>
            <h2>Prefer to listen?</h2>
            <p>The full book as an audiobook — about an hour in each language. It remembers where you stopped.</p>
          </Reveal>
          <Reveal>
            <div className="glass listen-card">
              <img src="/intro-poster.jpg" alt="The Search for Truth — illustrated multilingual cover" width={480} height={853} loading="lazy" />
              <div className="tracks">
                {AUDIO.map((a) => (
                  <AudioPlayer key={a.lang} id={a.lang} src={a.src} title={a.name} lang={a.lang} rtl={a.rtl} duration={a.duration} readHref={a.read} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 · THREE QUESTIONS — floating islands */}
      <section className="dusk questions">
        <Cut name="cloud-bank" ext="jpg" screen speed={-70} className="fill" style={{ opacity: 0.45 }} />
        <div className="wrap">
          <Reveal className="head">
            <span className="eyebrow">Three questions</span>
            <h2>Every road in the book returns to these</h2>
            <p>Examined with intellectual honesty, one island at a time.</p>
          </Reveal>
          <div className="islands">
            {QUESTIONS.map((q, i) => (
              <Reveal key={q.n} delay={i * 0.12} className="island">
                <Cut name={q.img} float speed={i % 2 ? 20 : -20} className="island-img" style={{ animationDelay: `${-i * 2.3}s` }} />
                <div className="glass">
                  <span className="num">{q.n}</span>
                  <h3>{q.title}</h3>
                  <p>{q.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 2b · MANY PATHS, ONE SUMMIT */}
      <section className="dusk night summit">
        <Cut name="sparkles" ext="jpg" screen speed={-40} className="fill" style={{ opacity: 0.5 }} />
        <div className="wrap summit-grid">
          <Reveal>
            <span className="eyebrow">Many paths, one summit</span>
            <h2>Seven roads. One light at the top.</h2>
            <p>Stone stairs, forest tracks, rope bridges, river paths — people climb by different roads, from every side of the mountain. The author’s question was simple: where do they meet?</p>
            <p className="muted">He held the Torah, the Gospel, the Quran and the great philosophies to a single standard, and asked each of them the same three things.</p>
            <div className="btns"><Link to="/about" className="btn ghost"><span>The method</span></Link></div>
          </Reveal>
          <div className="summit-art">
            <Cut name="many-paths-one-summit" speed={-24} className="summit-img" />
            <Cut name="compass-light" float speed={40} hideOnMobile className="compass" />
          </div>
        </div>
      </section>

      {/* 2c · ONE LIGHT, MANY LAMPS */}
      <section className="dusk lamps">
        <div className="wrap center">
          <Reveal className="head center">
            <span className="eyebrow">One light</span>
            <h2>The same light, in many hands</h2>
            <p>A clay diya, a brass lantern, a paper lamp, a candelabrum — each flame is lit from the same source.</p>
          </Reveal>
        </div>
        <Cut name="one-light-many-lamps" speed={0} className="crop-cut lamps-img" />
      </section>

      {/* 2d · ONE SOURCE */}
      <section className="dusk night source">
        <div className="wrap">
          <Reveal className="head center">
            <span className="eyebrow">One source</span>
            <h2>Every stream finds the sea</h2>
          </Reveal>
          <div className="source-grid">
            <Reveal>
              <div className="glass source-card">
                <Cut name="rivers-to-sea" speed={0} className="crop-cut src-img" />
                <h3>Different springs, one lake</h3>
                <p>Rivers begin on different mountains and in different valleys. They are not rivals — they are travelling to the same water.</p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="glass source-card">
                <Cut name="seeds-to-tree" speed={0} className="crop-cut src-img" />
                <h3>Every seeker starts somewhere</h3>
                <p>Date, olive, grape, wheat, lotus, cedar — many seeds, one growing sapling, and a light at its tip.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2e · ONE TREE, MANY BRANCHES */}
      <section className="dusk tree-sec">
        <Cut name="cloud-bank" ext="jpg" screen speed={-60} className="fill" style={{ opacity: 0.35, top: '35%' }} />
        <div className="wrap center">
          <Reveal className="head center">
            <span className="eyebrow">One tree, many branches</span>
            <h2>The whole of humanity is invited</h2>
            <p>Twelve of the world’s traditions, each held in the same light and at the same size. Hover or tap a medallion to see its name.</p>
          </Reveal>
          <Reveal><TreeMap /></Reveal>
        </div>
      </section>

      {/* 2f · DIFFERENT HOMES, ONE EARTH */}
      <section className="dusk night homes">
        <div className="wrap center">
          <Reveal className="head center">
            <span className="eyebrow">One humanity</span>
            <h2>Different homes, one earth</h2>
            <p>Mosque, church, synagogue, temple, pagoda, gurdwara and shrine — they stand side by side under one sky, and the bridges between them are made of light.</p>
          </Reveal>
        </div>
        <Cut name="houses-of-worship" speed={0} className="crop-cut houses-img" />
        <div className="wrap center"><Cut name="bridge-islands" speed={-16} className="bridge-img" /></div>
      </section>

      {/* 3 · THE ROAD — four parts */}
      <section className="dusk night journey-sec">
        <div className="wrap">
          <Reveal className="head">
            <span className="eyebrow">The road</span>
            <h2>Four parts, one climb</h2>
            <p>Follow the path from the first question to the last light.</p>
          </Reveal>
          <div className="journey">
            <div className="journey-art">
              <Cut name="path-cliff" speed={-30} className="cliff" />
              <Cut name="traveler" className="traveler" />
              <Cut name="f-lantern" float speed={50} className="lantern" />
            </div>
            <ol className="stops">
              {PARTS.map((p, i) => (
                <Reveal key={p.n} delay={i * 0.1}>
                  <li className="glass">
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <span className="min">{p.min} read</span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <div className="btns center"><Link to="/chapters" className="btn ghost"><span>See all chapters</span></Link></div>
        </div>
      </section>

      {/* 4 · KEY MESSAGES */}
      <section className="dusk night messages">
        <div className="wrap">
          <Reveal className="head center">
            <span className="eyebrow">Key messages</span>
            <h2>What the letter says</h2>
          </Reveal>
          <div className="msg-grid">
            {KEY_MESSAGES.map((m, i) => (
              <Reveal key={m.title} delay={(i % 3) * 0.1}>
                <a className="glass msg" href={`${READ.en}#${m.hash}`}>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                  <span className="more">Read in the book →</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · QUOTE — sea of clouds */}
      <section className="dusk quote">
        <Cut name="cloud-bank" ext="jpg" screen speed={-80} className="fill" style={{ opacity: 0.9, top: '52%' }} />
        <Cut name="dove-flight" speed={100} hideOnMobile className="q-dove" rotate={-6} />
        <Cut name="f-pages" speed={-90} hideOnMobile className="q-pages" rotate={12} />
        <div className="wrap center">
          <span className="eyebrow">From the book</span>
          <blockquote>I have come to believe — with full conviction — that the original, pure message of Islam is the truth that unites all of humanity.</blockquote>
          <cite>{SITE.author}</cite>
          <div className="btns center"><a href={READ.en} className="btn"><span>Continue Reading</span></a></div>
        </div>
      </section>

      {/* 6 · LANGUAGES — orbit */}
      <section className="dusk night langs">
        <Cut name="circle-of-light" float speed={-30} className="langs-glow" />
        <div className="wrap center">
          <Reveal>
            <span className="eyebrow">Eight languages</span>
            <h2>One letter, every tongue</h2>
          </Reveal>
          <div className="orbit">
            <Cut name="globe-glass" float className="globe" />
            {LANGUAGES.map((l, i) => (
              <a key={l.code} href={l.href} lang={l.lang} className="orb" style={{ ['--a' as string]: `${i * 45}deg` }}>
                <b>{l.glyph}</b>
                <span className="s">{l.name.length > 9 ? l.code.toUpperCase() : l.name}</span>
                <span className="f">{l.name}</span>
              </a>
            ))}
          </div>
          <div className="btns center"><Link to="/languages" className="btn ghost"><span>Choose your language</span></Link></div>
        </div>
      </section>

      {/* 7 · DOWNLOAD */}
      <section className="dusk closing">
        <div className="wrap closing-grid">
          <Cut name="open-door-light" float speed={20} className="books door" />
          <Reveal>
            <span className="eyebrow">Spare some minutes</span>
            <h2>Truth is a door. Walk through.</h2>
            <p>Read it online, or take a free PDF in seven languages. Share, print and pass it on — the author asks only that the content stays unchanged.</p>
            <div className="btns">
              <a href={READ.en} className="btn"><span>Begin the letter</span></a>
              <Link to="/download" className="btn ghost"><span>Free PDF</span></Link>
              <Link to="/contact" className="btn ghost"><span>Write to the author</span></Link>
            </div>
          </Reveal>
        </div>
        <Cut name="hills-foot" className="hills" />
      </section>
    </>
  );
}
