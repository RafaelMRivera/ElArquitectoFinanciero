# Arquitecto Financiero — Guía para publicar

Contenido de la carpeta (todo va junto, en la raíz del sitio):

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La landing page completa (contenido y estructura) |
| `politica-de-datos.html` | Política de datos (enlazada desde el pie de página) |
| `404.html` | Página de error con la marca |
| `css/styles.css` | Todo el diseño, organizado por capas de Atomic Design (ver abajo) |
| `js/main.js` | Gráficas, animaciones y navegación. El sitio se lee y los enlaces funcionan sin él |
| `assets/images/` | Logotipos y foto de Rafael |
| `assets/og.jpg` | Imagen que aparece al compartir el enlace en WhatsApp, LinkedIn, etc. |
| `assets/apple-touch-icon.png`, `assets/favicon-32.png`, `favicon.ico` | Íconos del sitio |
| `robots.txt`, `sitemap.xml` | Para Google |
| `.htaccess` | Solo Hostinger: HTTPS, caché, seguridad |
| `firebase.json` | Solo Firebase Hosting |

## Cómo está organizado el diseño (Atomic Design)

`css/styles.css` declara sus capas al inicio: `tokens → base → templates → atoms → molecules → organisms → utilities`.
Una capa posterior siempre gana sobre una anterior, sin depender de la especificidad.

- **tokens**: colores, formas, curvas de movimiento y `@keyframes`.
- **base**: reset y elementos HTML sin clase.
- **templates**: el cascarón de cada sección (`.wrap`, `.sec`, `.dark`/`.light`/`.paper`).
- **atoms**: piezas mínimas (`.btn`, `.ic`, `.eyebrow`, `.pill`, `.link`).
- **molecules**: combinaciones de átomos (`.brand`, `.nav`, `.kpi`, `.cell`, `.svc`, `.fase`, `.obt`, `details`).
- **organisms**: secciones completas (`.bar`, `.hero`, `.svc-grid`, `.fases`, `.s360`, `.tablero`, `.foot`, `.doc`, `.notfound`).
- **utilities**: revelado al hacer scroll (`.rv`), titulares partidos y foco de luz.

Para cambiar una pieza, edítala en su capa. Cuando modifiques `css/styles.css` o `js/main.js`, sube el número de versión en el HTML
(`css/styles.css?v=6` → `?v=7`, en `index.html`, `politica-de-datos.html` y `404.html`), porque esos archivos se guardan en caché un año.

## Antes de publicar (5 minutos)

1. **Dominio.** Todo está escrito para `https://elarquitectofinanciero.com`. Si tu dominio es otro, reemplázalo en: `index.html` (busca `elarquitectofinanciero.com`, también dentro de los datos estructurados JSON-LD), `politica-de-datos.html`, `robots.txt`, `sitemap.xml` y `.htaccess`.
2. **Analítica.** Ya está instalada (Firebase Analytics / Google Analytics 4) en las tres páginas. Puedes ver los datos en Firebase Console → Analytics.
3. **Política de datos.** Es un texto base según la Ley 1581 de 2012. Revísala con tu abogado y agrega, si quieres, un correo o dirección de contacto.

## Opción A — Hostinger

1. Entra a hPanel → tu sitio web → **Archivos → Administrador de archivos**.
2. Abre la carpeta `public_html` y borra el contenido que traiga por defecto.
3. Sube el archivo `arquitecto-financiero-sitio.zip` a `public_html` y usa **Extraer**. Verifica que `index.html` quede directamente dentro de `public_html`, no dentro de otra carpeta, y que existan las carpetas `css`, `js` y `assets`.
4. Verifica que se vea el archivo `.htaccess` (activa "mostrar archivos ocultos" en el administrador).
5. En hPanel → **Seguridad → SSL**, activa el certificado gratuito para tu dominio.
6. Abre tu dominio, prueba los botones de WhatsApp y revisa la versión móvil.

## Opción B — Firebase Hosting

1. Instala Node.js y luego, en una terminal: `npm install -g firebase-tools`
2. `firebase login`
3. Entra a la carpeta del sitio y ejecuta `firebase init hosting`. Elige tu proyecto (o crea uno en console.firebase.google.com). Cuando pregunte el directorio público, escribe `.` y responde **No** a "single-page app" y **No** a sobrescribir `index.html` y `404.html`. Si pregunta por `firebase.json`, no lo sobrescribas.
4. `firebase deploy --only hosting`
5. Para tu dominio: consola de Firebase → Hosting → **Agregar dominio personalizado** y copia los registros DNS que te muestra en el panel de tu proveedor de dominio. El HTTPS se activa automático.
6. El archivo `.htaccess` no se usa en Firebase (el `firebase.json` ya lo ignora).

## Después de publicar

- Pega tu enlace en el depurador de Facebook (developers.facebook.com/tools/debug) o en LinkedIn Post Inspector para comprobar que sale la imagen al compartir.
- Registra el sitio en Google Search Console y envía `https://tudominio.com/sitemap.xml`.
- Comprueba los datos estructurados (preguntas frecuentes y servicios) con la Prueba de resultados enriquecidos de Google (search.google.com/test/rich-results).
- Nota técnica: el sitio carga la tipografía Public Sans desde Google Fonts. Si no carga, usa la del sistema y sigue viéndose bien.
