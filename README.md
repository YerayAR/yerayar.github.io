# Yeray Alonso Reyes · Portfolio

Portafolio profesional orientado a automatización con Python, desarrollo web accesible y analítica de datos. El proyecto está estructurado en componentes reutilizables y se compila a HTML estático, listo para desplegarse en GitHub Pages o Vercel sin dependencias complejas.

## 🧱 Estructura del proyecto

```
├── components/         # Fragmentos HTML comentados para cada sección del sitio
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx
│   ├── Articles.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── pages/
│   └── index.html      # Plantilla principal con marcadores {{Componente}}
├── styles/
│   └── main.css        # Hoja de estilos unificada y documentada
├── scripts/
│   └── main.js         # Lógica ligera (tema, menú, formulario)
├── assets/
│   ├── documents/      # CV y otros PDF
│   ├── icons/          # Favicon y pictogramas
│   └── images/         # Imágenes optimizadas para el sitio
├── build.mjs           # Script que ensambla los componentes en index.html
├── index.html          # Salida compilada lista para producción
├── LICENSE             # Licencia MIT
└── package.json        # Scripts de automatización
```

## 🚀 Uso rápido

1. **Instalar dependencias** (solo necesitas Node.js ≥ 18):
   ```bash
   npm install
   ```
2. **Generar la versión estática**:
   ```bash
    npm run build
   ```
   Esto toma `pages/index.html`, inserta los componentes desde `components/` y escribe el resultado en `index.html`.
3. **Previsualizar localmente** (opcional):
   ```bash
   npx serve .
   ```
   Luego abre `http://localhost:3000`.

## 🧩 Personalización

- Edita cualquier componente en `components/*.jsx`. Cada bloque incluye comentarios describiendo su propósito.
- Ajusta estilos globales en `styles/main.css`, donde cada sección está documentada con comentarios `/* ... */`.
- El script `scripts/main.js` controla el menú móvil, el selector de tema y el formulario; todos los bloques están comentados.

Tras realizar cambios, ejecuta `npm run build` para regenerar `index.html`.

## 📦 Despliegue en GitHub Pages

1. Asegúrate de que `index.html`, `assets/`, `styles/` y `scripts/` estén versionados.
2. Ejecuta `npm run build` antes de hacer commit.
3. Sube la rama a GitHub y habilita Pages desde `Settings → Pages`, apuntando a la rama principal (carpeta `/`).

## 📄 Licencia

Código disponible bajo licencia [MIT](./LICENSE). Puedes usarlo y adaptarlo, manteniendo el aviso de copyright.

---

**Autor:** Yeray Alonso Reyes — Automatización, desarrollo web y analítica de datos. Detalles de contacto y CV en [index.html](./index.html). 
