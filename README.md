# 👋 Hola, soy Yeray Alonso Reyes
### 💻 Ingeniero Informático | Automatización, Web & Datos

[![CoverPage](./features/CoverPage.png)](https://yerayar.github.io)

> Portfolio interactivo con chat CV inteligente, visualización de algoritmos Python y sistema multiidioma.

---

## 🧑‍💻 Sobre mí
Ingeniero Informático graduado en la UOC, especializado en crear soluciones prácticas que optimizan flujos de trabajo.

- 🐍 **Python**: automatización, ETL, análisis de datos con pandas/SQL
- 🌐 **Web moderna**: HTML5, CSS3, JavaScript, React, SvelteKit
- 📊 **Visualización**: dashboards interactivos y KPIs medibles
- 🤖 **Integración**: APIs REST, OCR, scraping, pipelines de datos
- 🚀 **Metodología**: entregas iterativas, feedback temprano, documentación concisa

---

## 🛠️ Stack Tecnológico

**Frontend & UI**
- JavaScript (vanilla + frameworks modernos)
- HTML5 semántico / CSS3 con animaciones avanzadas
- React, SvelteKit, Next.js
- Bootstrap Icons, Animate.css, Three.js

**Backend & Datos**
- Python (pandas, automatización, scraping)
- SQL (MySQL, PostgreSQL, Firestore)
- ETL, pipelines de datos, OCR
- EmailJS, integración con APIs REST

**DevOps & Herramientas**
- Git & GitHub (versionado, CI/CD)
- Docker (contenedores)
- Vercel, Netlify (despliegues)
- Jekyll (generación de sitios estáticos)
- Playwright (testing automatizado)

---

## ✨ Características del Portfolio

### 🤖 Chat CV Inteligente
Sistema de preguntas y respuestas automático con:
- Base de conocimiento expandida
- Soporte bilingüe (ES/EN)
- Respuestas contextuales sobre experiencia, stack, metodología, disponibilidad

### 🎨 Interfaz Moderna
- **Tema dual**: modo claro/oscuro con persistencia
- **Multiidioma**: español e inglés con traducciones completas
- **Animaciones**: Matrix rain effect, spotlight interactivo, Three.js 3D
- **Responsivo**: diseño adaptativo mobile-first

### 📊 Visualización Interactiva Python
Comparador de algoritmos de búsqueda con:
- Visualización en tiempo real de BFS, DFS, A*
- Métricas de rendimiento (nodos explorados, tiempo, camino)
- Interfaz educativa e interactiva

### 🎯 Secciones Principales
- Sobre mí con timeline de experiencia
- Tecnologías con categorías organizadas
- Proyectos destacados con enlaces directos
- Estadísticas en tiempo real (GitHub API)
- Formulario de contacto con validación

---

## 🚩 Proyectos Destacados

### 🛡️ ShieldLink
App móvil contra el bullying con recomendaciones personalizadas.
- **Tech**: Android, Firebase, Java
- **Logros**: sistema de evaluación anónima, algoritmo de recomendaciones
- **Impacto**: proyecto académico que reforzó mis habilidades en desarrollo móvil

### 🤖 Automatización de Facturación
Pipeline ETL completo para procesamiento de facturas.
- **Tech**: Python, OCR, SQL Server, pandas
- **Logros**: extracción automática de datos, validación, almacenamiento
- **Impacto**: reducción significativa de tiempo en procesos administrativos

### 📊 Portfolio Interactivo
Este mismo sitio web con funcionalidades avanzadas.
- **Tech**: HTML5, CSS3, JavaScript, Jekyll, Three.js, Playwright
- **Features**: chat CV, visualización Python, PWA, multiidioma, tema dual
- **Testing**: suite automatizada con Playwright

---

## 🌍 Sitios Web Desplegados

| Proyecto | Stack | URL |
|----------|-------|-----|
| **Personal Dashboard** | SvelteKit, Vercel | https://pd-findash.vercel.app |
| **NeonBytes Newsletter** | Next.js, Vercel | https://neon-bytes.vercel.app |
| **Portfolio Profesional** | Jekyll, GitHub Pages | https://yerayar.github.io |

---

## 📁 Estructura del Proyecto

```
yerayar.github.io/
├── _includes/          # Componentes modulares Jekyll
│   ├── header.html    # Navegación y controles
│   ├── footer.html    # Pie de página
│   └── sections/      # Secciones reutilizables
│       ├── intro.html
│       ├── about.html
│       ├── experience.html
│       ├── technologies.html
│       ├── services.html
│       ├── projects.html
│       ├── stats.html
│       ├── contact.html
│       ├── ai-chat.html
│       ├── cv.html
│       └── python-viz.html
├── js/                 # Scripts organizados por funcionalidad
│   ├── chat.js        # Sistema de chat CV
│   ├── language.js    # Multiidioma
│   ├── theme.js       # Tema claro/oscuro
│   ├── python-viz.js  # Visualización de algoritmos
│   ├── contact.js     # Formulario con EmailJS
│   ├── repos.js       # GitHub API integration
│   ├── stats.js       # Contador de estadísticas
│   ├── matrix.js      # Efecto Matrix rain
│   ├── three.js       # Gráficos 3D
│   ├── nav.js         # Navegación responsive
│   └── spotlight.js   # Efecto spotlight cursor
├── tests/             # Suite de testing con Playwright
│   ├── chat.test.js
│   └── python-viz.test.js
├── features/          # Assets (imágenes, iconos)
├── translations.js    # Diccionario de traducciones ES/EN
├── qa.js              # Base de conocimiento del chat (15+ temas)
├── manifest.json      # Configuración PWA
├── _config.yml        # Configuración Jekyll
├── Gemfile            # Dependencias Ruby
└── style.css          # Estilos centralizados
```

### 🧩 Modularización con Jekyll/Ruby

El proyecto utiliza **Jekyll** para modularizar el HTML mediante includes de Ruby, lo que permite:

**Ventajas de la arquitectura modular:**
- ✅ **Reutilización**: cada sección es un componente independiente
- ✅ **Mantenibilidad**: cambios aislados sin afectar otras partes
- ✅ **Escalabilidad**: fácil añadir/eliminar secciones
- ✅ **Organización**: estructura clara y jerárquica

**Sintaxis Jekyll en index.html:**
```html
<!-- Componentes principales -->
{% include header.html %}
{% include footer.html %}

<!-- Secciones modulares -->
{% include sections/intro.html %}
{% include sections/about.html %}
{% include sections/experience.html %}
{% include sections/technologies.html %}
{% include sections/services.html %}
{% include sections/projects.html %}
{% include sections/stats.html %}
{% include sections/contact.html %}
{% include sections/ai-chat.html %}
{% include sections/cv.html %}
{% include sections/python-viz.html %}
```

**Proceso de build:**
1. Jekyll procesa los `{% include %}` directives
2. Compila todos los componentes en un HTML estático único
3. Genera el sitio final en `_site/`
4. GitHub Pages despliega automáticamente

**Configuración (_config.yml):**
```yaml
source: .
destination: _site
exclude:
  - node_modules
  - tests
  - package.json
  - README.md
```

Esta arquitectura permite desarrollar cada sección por separado y mantener un `index.html` limpio y legible que actúa como orquestador de componentes.

---

## 🚀 Desarrollo & Despliegue

**Instalación local**
```bash
# Clonar repositorio
git clone https://github.com/YerayAR/yerayar.github.io.git
cd yerayar.github.io

# Instalar dependencias (opcional, para testing)
npm install

# Construir sitio Jekyll
bundle exec jekyll build

# Servir localmente
bundle exec jekyll serve
```

**Testing**
```bash
# Ejecutar tests automatizados
npm test
```

**Despliegue**
- Automático vía GitHub Pages
- Cada push a `main` despliega la última versión
- URL: https://yerayar.github.io

---

## 📬 Contacto

- 💼 **LinkedIn**: [Yeray Alonso Reyes](https://www.linkedin.com/in/yeray-alonso-reyes-ii/)
- 🐱 **GitHub**: [@YerayAR](https://github.com/YerayAR)
- 🌐 **Portfolio**: [yerayar.github.io](https://yerayar.github.io)
- 📧 **Email**: Disponible en el formulario de contacto del portfolio

---

## 📄 Licencia

Este proyecto es de código abierto para fines educativos. El contenido y diseño son propiedad de Yeray Alonso Reyes.

---

¡Gracias por visitar mi perfil! Estoy abierto a colaboraciones, proyectos freelance y oportunidades remotas. **¡Hablemos de proyectos!** 🚀
