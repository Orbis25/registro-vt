# Reglas de Proyecto - Registro Virtual

Este archivo contiene reglas y directrices que todos los agentes de Inteligencia Artificial (como Antigravity) deben seguir al trabajar en este repositorio.

## Directrices de Comportamiento del Agente
- **Perfil de Usuario**: El usuario de este proyecto no es desarrollador. Explica los conceptos de manera sencilla, sin tecnicismos ni jerga de código. No le pidas que edite archivos de código manualmente ni que use la terminal.
- **Gestión de Git**: A petición del usuario, debes proponer y ejecutar de forma proactiva todos los comandos de Git para guardar cambios (`git commit`) y subirlos (`git push`).
- **Seguridad (.env)**: Bajo ninguna circunstancia debes incluir el archivo `.env` en los commits ni eliminarlo de `.gitignore`.
- **Arquitectura de Software**: Mantener el uso de React con Vite, estilos CSS nativos en `src/index.css` (sin Tailwind), y Cloud Firestore como base de datos en tiempo real.
- **Verificación**: Antes de confirmar cualquier cambio al usuario, ejecuta `npm run build` localmente para validar que el proyecto compila sin errores.
