---
name: registro-virtual
description: Guía de trabajo para el proyecto de Registro Virtual escolar sincronizado con Firebase Firestore. Se activa para gestionar este proyecto con un usuario no-desarrollador.
---

# Skill: Registro Virtual - Guía de Agente

Este skill le indica a Antigravity las reglas de comportamiento, arquitectura y seguridad específicas para trabajar en este proyecto de Registro Virtual.

## ⚠️ Regla de Oro de Seguridad (.env)
- **NUNCA** debes incluir el archivo `.env` en ningún commit, ni subirlo a GitHub.
- El archivo `.env` contiene credenciales confidenciales de Firebase (API Key, Project ID, etc.).
- Asegúrate de que `.env` se mantenga en el `.gitignore`.

## 🧑‍💻 El Usuario es No-Desarrollador
- El usuario actual **no sabe programar ni escribir código**.
- Todas las interacciones de Git (commits, push, ramas, configuración) deben ser explicadas de forma sencilla y ejecutadas de forma proactiva por ti (proponiendo los comandos correspondientes de Git) a petición del usuario.
- Explica los cambios en términos de comportamiento visual o lógica funcional de la escuela (ej. "registro de notas", "porcentaje de asistencia"), no en términos de infraestructura o sintaxis de React.

## 🏗️ Arquitectura y Tecnologías del Proyecto
- **Frontend**: React (Vite) en JavaScript.
- **Estilos**: Vanilla CSS (`src/index.css`) con variables personalizadas. No uses Tailwindcss.
- **Base de Datos**: Firebase Cloud Firestore.
- **Sincronización**: Uso de `onSnapshot` en `src/App.jsx` para actualizaciones en tiempo real.
- **Compilación en CI**: Configurado en `.github/workflows/` para inyectar variables de entorno y construir el bundle con `npm run build` en GitHub Actions antes del despliegue.

## 🛠️ Reglas del Proyecto para el Agente
1. **Compilación Previa al Commit/Deploy**: Siempre ejecuta `npm run build` antes de realizar un commit o proponer un deploy a producción, para asegurar que no hay errores lógicos o de sintaxis que rompan la compilación en GitHub Actions.
2. **Fórmulas de Cálculo Escolar**:
   - **Asistencia %**: `(Presentes + Tardes * 0.5) / Total * 100`.
   - **Calificaciones**: Suma ponderada en base 100 de las actividades en `evaluations`. Promedio proyectado ajustado a los pesos completados para evitar notas bajas prematuras.
   - **Estatus**: Aprobado (&ge; 70), Recuperación (50-69), Reprobado (< 50).
