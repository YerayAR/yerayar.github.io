# Hola, mi nombre es Yeray 👋
### Computer Engineer
[![Borcelle-digital](./features/Borcelle-digital.png)](https://yerayar.github.io)

¡Hola! Mi nombre es Yeray. Actualmente, estoy en las etapas finales de mi grado en Ingeniería Informática, con un enfoque en la programación. Estoy completando mi Trabajo de Fin de Grado, que consiste en desarrollar una aplicación móvil utilizando Android Studio. A pesar de esto, también he adquirido experiencia en desarrollo web a través de proyectos académicos y personales.

He desarrollado proyectos en PHP y he practicado HTML, CSS y JavaScript, incluyendo el uso del framework React. El próximo año, completaré asignaturas relacionadas con el desarrollo de proyectos en grupo y realizaré prácticas en empresa, lo que creo que me proporcionará una valiosa experiencia práctica para aplicar mis estudios en un entorno profesional.

Estoy muy entusiasmado por la posibilidad de aplicar mis conocimientos en un contexto laboral real y seguir creciendo como desarrollador. Espero con interés nuevas oportunidades para aportar mis habilidades y contribuir al éxito de proyectos innovadores.

# Visualiza mi Portfolio
[![yellow-arrow](./features/yellow-arrow.png)](https://yerayar.github.io) 💻

## Backend de contacto

El proyecto incluye un servidor Express situado en `server/` encargado de recibir las peticiones del formulario de contacto. Los mensajes se validan y se guardan mediante un driver configurable.

### Uso
1. Instala las dependencias con `npm install`.
2. Ejecuta el servidor con `npm start`.

El driver de almacenamiento se selecciona mediante la variable de entorno `DB_DRIVER` (`json` por defecto). Es posible añadir nuevos drivers en `server/db/` para conectarse a cualquier base de datos. Opcionalmente pueden configurarse variables SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, etc.) para enviar notificaciones por correo cuando se reciba un mensaje.
