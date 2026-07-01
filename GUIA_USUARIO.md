# 📘 Guía de Inicio: Trabajar en Registro Virtual con Antigravity

¡Bienvenido! Este proyecto es un **Registro Digital Académico** que realiza un control automatizado de asistencia y calificaciones en tiempo real, guardando todo de forma segura en la nube usando **Firebase**.

Como este proyecto lo desarrollarás junto a **Antigravity** (tu asistente de Inteligencia Artificial para programación), no necesitas saber escribir código. Sin embargo, hay algunos conceptos clave e instrucciones de seguridad que debes comprender para que el trabajo sea exitoso y seguro.

---

## ⚠️ 1. Regla de Oro de Seguridad: El Archivo `.env`
En la carpeta raíz de este proyecto hay un archivo llamado **`.env`** (de *environment*, o variables de entorno).

* **¿Qué contiene?**: Tus llaves privadas y credenciales de acceso a tu base de datos de Firebase.
* **REGLA ABSOLUTA**: **Nunca, bajo ninguna circunstancia, debes subir, compartir, o publicar el archivo `.env`.**
* **¿Por qué?**: Si se sube a internet (por ejemplo, a un repositorio público de GitHub), cualquier persona podría tener acceso total a tu base de datos y borrar o alterar tu información.
* **Nota**: Este archivo ya está configurado para ser ignorado automáticamente por Git (el sistema de versiones), por lo que no se subirá por accidente. Si en algún momento cambias de computadora o reinstalas el proyecto, tendrás que pedirle a Antigravity que cree uno nuevo con tus credenciales.

---

## 🌿 2. ¿Qué es Git y GitHub de manera sencilla?
Imagínalo como una **máquina del tiempo** y un **respaldo en la nube** para tu proyecto:

1. **Git (Local)**: Es el sistema que saca "fotografías" (llamados *commits*) de tu proyecto cada vez que haces un cambio importante. Si algo sale mal, puedes regresar a una fotografía anterior en el tiempo.
2. **GitHub (Nube)**: Es el sitio web donde se almacena una copia de seguridad de esas fotografías para que no se pierdan si se daña tu computadora. También se usa para el "Despliegue" (publicar el sitio en internet).

### Tu rol con Git:
**Tú no tienes que usar la consola ni escribir comandos de Git.** Antigravity se encargará de todo. Solo debes pedirle las cosas con palabras naturales.

* **Ejemplo de lo que puedes decirle a Antigravity**:
  > *"Antigravity, guarda los cambios de hoy y súbelos a GitHub"*
  > *(Él se encargará de crear el commit y hacer el `git push` de forma segura)*

---

## 🚀 3. ¿Cómo pedirle cambios a Antigravity?
Antigravity entiende el lenguaje natural de forma clara. Aquí tienes ejemplos de cómo interactuar para realizar tareas cotidianas:

### Para modificar la apariencia o diseño:
* *"Antigravity, haz que los botones de eliminar se vean de color rojo suave y tengan un icono de basura"*
* *"Antigravity, cambia el color de fondo del tema oscuro a uno azul marino profundo"*

### Para agregar nuevas funciones:
* *"Antigravity, agrega una pestaña extra en el detalle de la asignatura para registrar notas de comportamiento"*
* *"Antigravity, cambia la fórmula de la nota final: ahora la asistencia debe valer el 10% de la calificación final de la materia"*

### Para verificar y publicar:
* *"Antigravity, haz un build de prueba para ver si el código compila bien"*
* *"Antigravity, sube todo a producción en Firebase Hosting"*

---

## 📁 4. Estructura básica del proyecto (Por si tienes curiosidad)
Si necesitas buscar dónde está algo, aquí tienes el mapa básico del proyecto:

* **`.env`**: Archivo confidencial con las llaves de Firebase.
* **`index.html`**: La página web base que carga la aplicación.
* **`src/`**: La carpeta de código fuente.
  * **`src/App.jsx`**: El cerebro de la aplicación. Aquí se controla la sincronización en tiempo real y la lógica de Firebase.
  * **`src/index.css`**: Las reglas de diseño, colores, fuentes y apariencia visual.
  * **`src/components/`**: Los módulos individuales de la app:
    * `Dashboard.jsx`: El panel principal con las asignaturas y estadísticas globales.
    * `SubjectDetail.jsx`: La barra de navegación por pestañas de cada asignatura.
    * `RosterManager.jsx`: La lista de alumnos.
    * `AttendanceRegister.jsx`: La tabla de asistencias.
    * `GradebookRegister.jsx`: El cuaderno de calificaciones automatizado.
    * `AnalyticsView.jsx`: Los gráficos circulares y métricas.
