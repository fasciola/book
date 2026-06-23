(() => {
  const readerPaths = { 'read-fr.html': 'reader.html?lang=fr', 'read-de.html': 'reader.html?lang=de', 'read-ru.html': 'reader.html?lang=ru', 'read-zh.html': 'reader.html?lang=zh', 'read-nl.html': 'reader.html?lang=nl', 'read-sw.html': 'reader.html?lang=sw' };
  const fileName = location.pathname.split('/').pop();
  if (readerPaths[fileName]) { location.replace(readerPaths[fileName]); return; }
  document.querySelectorAll('a[href]').forEach((link) => { const href = link.getAttribute('href'); if (readerPaths[href]) link.setAttribute('href', readerPaths[href]); });
  document.querySelectorAll('video source[src="back.mp4"]').forEach((source) => { source.setAttribute('src', 'videos/back.mp4'); source.parentElement?.load(); });
})();
