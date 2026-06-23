(() => {
  // Each translated edition is a standalone static reader page.
  // Keep its URL intact instead of redirecting it to the dynamic DOCX loader.
  document.querySelectorAll('video source[src="back.mp4"]').forEach((source) => {
    source.setAttribute('src', 'videos/back.mp4');
    source.parentElement?.load();
  });
})();
