import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Author from './pages/Author';
import Chapters from './pages/Chapters';
import Contact from './pages/Contact';
import Download from './pages/Download';
import Home from './pages/Home';
import Languages from './pages/Languages';

/** HashRouter: works on any static host with no server rewrite rules. */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="languages" element={<Languages />} />
          <Route path="chapters" element={<Chapters />} />
          <Route path="about" element={<About />} />
          <Route path="author" element={<Author />} />
          <Route path="download" element={<Download />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
