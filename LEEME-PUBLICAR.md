# Arquitecto Financiero — Guía para publicar

Contenido de la carpeta (todo va junto, en la raíz del sitio):

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La landing page completa |
| `politica-de-datos.html` | Política de datos (enlazada desde el pie de página) |
| `404.html` | Página de error con la marca |
| `assets/og.jpg` | Imagen que aparece al compartir el enlace en WhatsApp, LinkedIn, etc. |
| `assets/apple-touch-icon.png`, `assets/favicon-32.png`, `favicon.ico` | Íconos del sitio |
| `robots.txt`, `sitemap.xml` | Para Google |
| `.htaccess` | Solo Hostinger: HTTPS, caché, seguridad |
| `firebase.json` | Solo Firebase Hosting |

## Antes de publicar (5 minutos)

1. **Dominio.** Todo está escrito para `https://elarquitectofinanciero.com`. Si tu dominio es otro, reemplázalo en: `index.html` (busca `elarquitectofinanciero.com`), `politica-de-datos.html`, `robots.txt`, `sitemap.xml` y `.htaccess`.
2. **Analítica (opcional).** En `index.html`, busca `ANALITICA (pendiente)` y pega ahí el código de Google Analytics 4 o Plausible.
3. **Política de datos.** Es un texto base según la Ley 1581 de 2012. Revísala con tu abogado y agrega, si quieres, un correo o dirección de contacto.

## Opción A — Hostinger

1. Entra a hPanel → tu sitio web → **Archivos → Administrador de archivos**.
2. Abre la carpeta `public_html` y borra el contenido que traiga por defecto.
3. Sube el archivo `arquitecto-financiero-sitio.zip` a `public_html` y usa **Extraer**. Verifica que `index.html` quede directamente dentro de `public_html`, no dentro de otra carpeta.
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
- Nota técnica: el sitio carga la tipografía Public Sans desde Google Fonts. Si no carga, usa la del sistema y sigue viéndose bien.
