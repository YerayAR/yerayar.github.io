/**
 * build.mjs
 * ---------------------------------------------------------------------------
 * Ensambla la página principal a partir de los componentes definidos en /components.
 *  1. Lee la plantilla base en /pages/index.html.
 *  2. Sustituye cada marcador {{Nombre}} con el contenido del componente.
 *  3. Escribe el resultado final en la raíz como index.html, listo para GitHub Pages.
 * Puedes ejecutar este script con `node build.mjs` o mediante `npm run build`.
 * ---------------------------------------------------------------------------
 */

import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Orden en el que se insertarán los componentes definidos en la plantilla.
const components = [
  'Header',
  'Hero',
  'About',
  'Skills',
  'Projects',
  'Articles',
  'Contact',
  'Footer'
];

async function build() {
  const templatePath = path.join(__dirname, 'pages', 'index.html');
  let html = await readFile(templatePath, 'utf8');

  for (const name of components) {
    const componentPath = path.join(__dirname, 'components', `${name}.jsx`);
    const markup = await readFile(componentPath, 'utf8');
    html = html.replace(`{{${name}}}`, markup);
  }

  const outputPath = path.join(__dirname, 'index.html');
  await writeFile(outputPath, html, 'utf8');

  console.log(`✓ index.html generado correctamente (${components.length} componentes inyectados).`);
}

build().catch((error) => {
  console.error('Error durante la compilación de componentes:', error);
  process.exit(1);
});
