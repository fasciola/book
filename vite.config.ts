import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': path.resolve(__dirname, '.'), }, },
    server: { hmr: process.env.DISABLE_HMR !== 'true', watch: process.env.DISABLE_HMR === 'true' ? null : {}, },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          indexAr: path.resolve(__dirname, 'index-ar.html'),
          indexEn: path.resolve(__dirname, 'index-en.html'),
          indexFr: path.resolve(__dirname, 'index-fr.html'),
          indexDe: path.resolve(__dirname, 'index-de.html'),
          indexRu: path.resolve(__dirname, 'index-ru.html'),
          indexZh: path.resolve(__dirname, 'index-zh.html'),
          indexNl: path.resolve(__dirname, 'index-nl.html'),
          indexSw: path.resolve(__dirname, 'index-sw.html'),
          read: path.resolve(__dirname, 'read.html'),
          readAr: path.resolve(__dirname, 'read-ar.html'),
          readFr: path.resolve(__dirname, 'read-fr.html'),
          readDe: path.resolve(__dirname, 'read-de.html'),
          readRu: path.resolve(__dirname, 'read-ru.html'),
          readZh: path.resolve(__dirname, 'read-zh.html'),
          readNl: path.resolve(__dirname, 'read-nl.html'),
          readSw: path.resolve(__dirname, 'read-sw.html'),
          chapters: path.resolve(__dirname, 'chapters.html'),
          about: path.resolve(__dirname, 'about.html'),
          author: path.resolve(__dirname, 'author.html'),
          download: path.resolve(__dirname, 'download.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        }
      }
    }
  };
});
