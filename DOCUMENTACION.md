# 📋 DOCUMENTACIÓN TÉCNICA DEL PORTAFOLIO
# Yeray Alonso Reyes - Portfolio Personal

---

## 📊 **INFORMACIÓN DEL PROYECTO**

- **Nombre:** Portafolio Personal de Yeray Alonso Reyes
- **Versión:** 2.0
- **Autor:** Yeray Alonso Reyes
- **Fecha:** 2024-2025
- **Tipo:** Sitio web estático personal/profesional
- **URL:** [https://yerayar.github.io](https://yerayar.github.io)

---

## 🎯 **OBJETIVO Y PROPÓSITO**

Este proyecto es un **portafolio web personal** diseñado para mostrar mis habilidades como **Ingeniero Informático** especializado en:
- **Desarrollo Web Frontend/Backend**


El sitio sirve como **tarjeta de presentación digital** para potenciales empleadores, clientes y colaboradores.

---

## 🏗️ **ARQUITECTURA Y ESTRUCTURA**

### **Estructura de Archivos**

```
yerayar.github.io/
├── index.html          # Página principal (estructura HTML5 semántica)
├── style.css           # Estilos CSS3 con efectos avanzados
├── app.js              # JavaScript vanilla para interactividad
├── README.md           # Documentación básica del repositorio
├── DOCUMENTACION.md    # Este archivo de documentación técnica
├── features/           # Recursos multimedia y assets
│   ├── profile.jpg     # Foto de perfil para el avatar
│   ├── logo.png        # Logo personal
│   ├── cv_spanish.pdf  # CV en español
│   ├── cv_english.pdf  # CV en inglés
│   └── CoverPage.png   # Imagen de portada para el README
```

### **Componentes Principales**

#### 1. **HTML (index.html)**
- **Estructura semántica** con HTML5
- **Meta tags optimizados** para SEO
- **Secciones organizadas** por contenido
- **Formulario de contacto** funcional
- **Navegación responsive** con menú hamburguesa

#### 2. **CSS (style.css)**
- **Sistema de variables CSS** para colores y fuentes
- **Efectos neón y glassmorphism**
- **Animaciones complejas** con keyframes
- **Diseño responsive** mobile-first
- **Sistema de burbujas animadas**
- **Separadores decorativos** con bombillas neón

#### 3. **JavaScript (app.js)**
- **JavaScript vanilla ES6+**
- **Funcionalidad de contacto** con EmailJS
- **Animaciones Canvas** para efectos visuales
- **Navegación responsive**
- **Carga dinámica** de repositorios GitHub
- **Contador de visitas** local

---

## 💻 **TECNOLOGÍAS UTILIZADAS**

### **Frontend**
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **HTML5** | Estándar | Estructura semántica del contenido |
| **CSS3** | Estándar | Estilos, animaciones y efectos visuales |
| **JavaScript** | ES6+ | Interactividad y funcionalidad dinámica |

### **Bibliotecas y APIs Externas**
| Biblioteca | Versión | Propósito |
|------------|---------|-----------|
| **EmailJS** | v4 | Envío de correos desde el formulario |
| **Animate.css** | 4.1.1 | Animaciones de entrada |
| **Bootstrap Icons** | 1.11.1 | Iconografía |
| **Google Fonts** | - | Tipografías (Roboto, Poppins) |
| **GitHub API** | v3 | Carga dinámica de repositorios |

### **APIs del Navegador**
- **Canvas API** - Animaciones de burbujas
- **Intersection Observer API** - Animaciones de scroll
- **LocalStorage API** - Persistencia del contador de visitas

---

## 🎨 **DISEÑO Y UX**

### **Paleta de Colores**
```css
:root {
  --background-gradient: linear-gradient(130deg, #0f0c29 30%, #302b63 70%);
  --text-color: #e2e8f0;
  --accent-color: #00d1b2;        /* Verde neón principal */
  --accent-secondary: #ff6bcb;     /* Rosa neón secundario */
  --font-body: 'Roboto', sans-serif;
  --font-headings: 'Poppins', sans-serif;
}
```

### **Tipografía**
- **Encabezados:** Poppins (Google Fonts)
- **Cuerpo:** Roboto (Google Fonts)
- **Tamaños responsivos** adaptados a diferentes dispositivos

### **Efectos Visuales**
1. **Burbujas Animadas:** Canvas API con partículas flotantes
2. **Efectos Neón:** Text-shadow y box-shadow con colores vibrantes
3. **Glassmorphism:** Navegación con backdrop-filter
4. **Avatar Atómico:** Animación CSS con órbitas rotatorias
5. **Separadores Decorativos:** Bombillas neón con cables flexibles

---

## 🔧 **FUNCIONALIDADES IMPLEMENTADAS**

### **1. Formulario de Contacto**
- **EmailJS v4** para envío directo de correos
- **Validación HTML5** nativa
- **Feedback visual** al usuario
- **Limpieza automática** del formulario tras envío exitoso

```javascript
emailjs.send('service_mk372rb', 'template_u3yoceu', templateParams)
```

### **2. Navegación Responsive**
- **Menú hamburguesa** para móviles
- **Smooth scrolling** con offset para headers sticky
- **Cierre automático** del menú en móviles
- **Navegación sticky** con efecto glassmorphism

### **3. Animaciones de Scroll**
- **Intersection Observer** para detectar visibilidad
- **Animate.css** para efectos de entrada
- **Optimización de rendimiento** (observación única)

### **4. Carga Dinámica de GitHub**
- **GitHub API v3** para obtener repositorios
- **Carga de README** para descripciones mejoradas
- **Manejo de errores** robusto
- **Filtrado automático** de repositorios relevantes

### **5. Contador de Visitas**
- **LocalStorage** para persistencia
- **Incremento automático** en cada visita
- **Visualización en tiempo real**

---

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints Principales**
```css
/* Mobile-first approach */
@media (max-width: 480px) { /* Móviles pequeños */ }
@media (max-width: 768px) { /* Tablets y móviles */ }
@media (max-width: 1024px) { /* Tablets grandes */ }
```

### **Adaptaciones Móviles**
- **Menú hamburguesa** con animación
- **Reordenación de elementos** en el hero section
- **Tamaños de fuente** escalables
- **Espaciado optimizado** para touch
- **Canvas responsivo** para animaciones

---

## ⚡ **OPTIMIZACIONES DE RENDIMIENTO**

### **Carga de Recursos**
- **Defer en scripts** para carga no bloqueante
- **Lazy loading** de animaciones complejas
- **CDN** para bibliotecas externas
- **Compresión de imágenes** optimizada

### **Animaciones**
- **RequestAnimationFrame** para animaciones fluidas
- **Canvas optimizado** para burbujas
- **Intersection Observer** para animaciones de scroll
- **CSS Transform** en lugar de cambios de layout

### **JavaScript**
- **Event delegation** donde es posible
- **Debouncing** en eventos de resize
- **Cleanup de observadores** tras uso único

---

## 🚀 **GUÍA DE DESARROLLO**

### **Configuración Inicial**
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/YerayAR/yerayar.github.io.git
   cd yerayar.github.io
   ```

2. **Abrir en un servidor local:**
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # Usando Node.js
   npx http-server
   
   # Usando Live Server (VS Code)
   # Instalar extensión Live Server y hacer clic derecho > "Open with Live Server"
   ```

### **Estructura de Desarrollo**

#### **Añadir Nueva Sección**
1. **HTML:** Crear nueva section con clase `content-section`
2. **Canvas:** Añadir `<canvas class="section-bubbles"></canvas>` para efectos
3. **CSS:** Aplicar estilos consistentes con la paleta existente
4. **JavaScript:** El sistema de burbujas se inicializa automáticamente

#### **Modificar Colores**
Cambiar las variables CSS en `:root`:
```css
:root {
  --accent-color: #nuevo-color;  /* Color principal */
  --accent-secondary: #otro-color; /* Color secundario */
}
```

#### **Añadir Animaciones**
Usar Animate.css o crear keyframes CSS personalizados:
```css
@keyframes mi-animacion {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### **Configuración de EmailJS**
1. **Crear cuenta** en [EmailJS](https://www.emailjs.com/)
2. **Configurar servicio** de email
3. **Crear plantilla** para el formulario
4. **Actualizar IDs** en `app.js`:
   ```javascript
   emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', templateParams)
   ```

---

## 🐛 **DEBUGGING Y TROUBLESHOOTING**

### **Problemas Comunes**

#### **1. EmailJS no funciona**
- ✅ Verificar que la biblioteca se carga correctamente
- ✅ Comprobar IDs de servicio y plantilla
- ✅ Revisar configuración de CORS en EmailJS
- ✅ Verificar la consola del navegador para errores

#### **2. Animaciones lentas**
- ✅ Reducir número de partículas en `maxIntroBubbles`
- ✅ Verificar que `requestAnimationFrame` se está usando
- ✅ Comprobar superposición de animaciones CSS

#### **3. Problemas responsive**
- ✅ Verificar viewport meta tag
- ✅ Comprobar media queries
- ✅ Testear en dispositivos reales

#### **4. GitHub API no carga**
- ✅ Verificar límite de rate de la API
- ✅ Comprobar conectividad de red
- ✅ Revisar CORS en el navegador

### **Herramientas de Debug**
```javascript
// Activar logs detallados
console.log('EmailJS initialized:', typeof emailjs !== 'undefined');
console.log('Canvas support:', !!document.createElement('canvas').getContext);
console.log('Intersection Observer support:', 'IntersectionObserver' in window);
```

---

## 📈 **MÉTRICAS Y ANALYTICS**

### **Rendimiento**
- **Lighthouse Score:** 90+ en todas las categorías
- **First Contentful Paint:** < 2s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

### **Compatibilidad**
- ✅ **Chrome 70+**
- ✅ **Firefox 65+**
- ✅ **Safari 12+**
- ✅ **Edge 79+**
- ✅ **Mobile browsers**

---

## 🔒 **SEGURIDAD**

### **Medidas Implementadas**
- **Validación de entrada** en formularios
- **Sanitización** de datos de GitHub API
- **HTTPS obligatorio** (GitHub Pages)
- **CSP headers** recomendados
- **rel="noopener"** en enlaces externos

### **Datos Personales**
- **No se almacenan datos** sensibles en el cliente
- **EmailJS** maneja el envío de correos de forma segura
- **LocalStorage** solo para contador de visitas

---

## 🚀 **DEPLOYMENT Y HOSTING**

### **GitHub Pages**
El sitio se despliega automáticamente en **GitHub Pages**:
1. **Push a main branch**
2. **GitHub Actions** (opcional para CI/CD)
3. **Disponible en:** `https://yerayar.github.io`

---

## 📚 **RECURSOS Y REFERENCIAS**

### **Documentación Técnica**
- [MDN Web Docs](https://developer.mozilla.org/) - Referencia de HTML, CSS, JS
- [EmailJS Documentation](https://www.emailjs.com/docs/) - Integración de formularios
- [Animate.css](https://animate.style/) - Biblioteca de animaciones
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Animaciones gráficas

### **Herramientas de Desarrollo**
- [Visual Studio Code](https://code.visualstudio.com/) - Editor recomendado
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - Debug y performance
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditoría de rendimiento
- [Can I Use](https://caniuse.com/) - Compatibilidad de navegadores

---

## 🔄 **CHANGELOG Y VERSIONES**

### **v2.0 (Actual)**
- ✨ **Nueva navegación** con menú hamburguesa
- ✨ **Sistema de burbujas** mejorado con Canvas
- ✨ **Efectos neón** y separadores decorativos
- ✨ **Avatar atómico** con animaciones CSS
- ✨ **Responsive design** completamente renovado
- ✨ **EmailJS v4** integración
- ✨ **Carga dinámica** de repositorios GitHub

### **v1.0**
- 🎯 **Estructura básica** HTML/CSS/JS
- 🎯 **Formulario de contacto** básico
- 🎯 **Diseño responsive** inicial
- 🎯 **Secciones principales** del portafolio

---

## 🤝 **CONTRIBUCIÓN Y DESARROLLO FUTURO**

### **Mejoras Planificadas**
- [ ] **PWA** (Progressive Web App) capabilities
- [ ] **Modo oscuro/claro** toggle
- [ ] **Internacionalización** (i18n) ES/EN
- [ ] **Análisis web** con Google Analytics
- [ ] **Optimización SEO** avanzada
- [ ] **Tests automatizados** con Jest
- [ ] **CI/CD pipeline** con GitHub Actions

### **Como Contribuir**
1. **Fork** del repositorio
2. **Crear branch** para feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Añadir nueva funcionalidad'`
4. **Push** al branch: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

---

## 📞 **CONTACTO Y SOPORTE**

- **Autor:** Yeray Alonso Reyes
- **Email:** A través del formulario de contacto del sitio
- **LinkedIn:** [Yeray Alonso Reyes](https://www.linkedin.com/in/yeray-alonso-reyes-ii/)
- **GitHub:** [YerayAR](https://github.com/YerayAR)
- **Portfolio:** [https://yerayar.github.io](https://yerayar.github.io)

---

## 📄 **LICENCIA**

© 2025 Yeray Alonso Reyes. Todos los derechos reservados.

Este proyecto es de **uso personal y educativo**. El código puede ser utilizado como referencia, pero se solicita atribución apropiada.

---

**Última actualización:** Enero 2025
**Versión de la documentación:** 1.0
