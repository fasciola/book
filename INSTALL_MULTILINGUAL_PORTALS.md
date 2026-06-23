# Install the multilingual book portals

Copy the contents of this package into the root folder of the existing website repository and allow `index.html` to be replaced.

This adds French, German, Russian, Chinese, Dutch and Swahili portals plus their dedicated readers:

- `index-fr.html` / `read-fr.html`
- `index-de.html` / `read-de.html`
- `index-ru.html` / `read-ru.html`
- `index-zh.html` / `read-zh.html`
- `index-nl.html` / `read-nl.html`
- `index-sw.html` / `read-sw.html`

The original DOCX files are preserved byte-for-byte in `assets/books/*.docx.b64`. The reader decodes those original documents only for download. The online reader uses a browser-rendered PDF generated from the same document source, so book body text is not rewritten into HTML.

## One Vite build adjustment

If the site is deployed with `npm run build`, add these entries inside `build.rollupOptions.input` in `vite.config.ts`:

```ts
indexFr: path.resolve(__dirname, 'index-fr.html'),
indexDe: path.resolve(__dirname, 'index-de.html'),
indexRu: path.resolve(__dirname, 'index-ru.html'),
indexZh: path.resolve(__dirname, 'index-zh.html'),
indexNl: path.resolve(__dirname, 'index-nl.html'),
indexSw: path.resolve(__dirname, 'index-sw.html'),
readFr: path.resolve(__dirname, 'read-fr.html'),
readDe: path.resolve(__dirname, 'read-de.html'),
readRu: path.resolve(__dirname, 'read-ru.html'),
readZh: path.resolve(__dirname, 'read-zh.html'),
readNl: path.resolve(__dirname, 'read-nl.html'),
readSw: path.resolve(__dirname, 'read-sw.html'),
```

## Commit and push

```bash
git add .
git commit -m "Add multilingual book portals and readers"
git push
```
