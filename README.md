# Portafolio de Identidad Digital Estratégica

Sitio web estático (una sola página) para presentar tu **Portafolio de Identidad Digital
Estratégica** como futuro/a educador/a. Construido con HTML, CSS y JavaScript puro — sin
dependencias ni build. Paleta lavanda.

## Estructura

```
portafolio-identidad-digital/
├── index.html      ← todo el contenido (editás acá)
├── styles.css      ← estilos y paleta de colores
├── script.js       ← menú, scroll-spy y animaciones
├── assets/         ← tu foto, CV, QR y capturas de perfiles (ver assets/README.txt)
└── .nojekyll       ← necesario para GitHub Pages
```

## Cómo personalizarlo (2 pasos)

### 1. Reemplazá los textos

Abrí `index.html` y buscá los marcadores entre corchetes `[...]` y los comentarios
`<!-- REEMPLAZAR -->`. Cambiá cada uno por tu contenido real:

- Tu **nombre**, rol y mención (AB02 o AC02).
- Tu **frase / misión** personal.
- Los **enlaces** de tus perfiles (LinkedIn, ResearchGate, Academia.edu, ORCID, Instagram) y tu **correo** (reemplazá los `href="#"` y `tucorreo@ejemplo.com`).
- Las **5 secciones** del portafolio (reflexión, análisis de perfiles, video+CV, estrategia, conclusiones).
- El **video**: en la sección "Video de Presentación", cambiá el `src` del `<iframe>` por el enlace de tu video de YouTube (`https://www.youtube.com/embed/ID`) o Drive (`https://drive.google.com/file/d/ID/preview`). **Sin esto el jurado no puede reproducir el video.**

### 2. Subí tus archivos a `assets/`

Mirá `assets/README.txt`: poné tu `foto-perfil.jpg`, `cv.pdf`, `qr-video.png` y las capturas
de tus perfiles. Los nombres deben coincidir exactamente.

## Ver el sitio en tu computadora

Abrí `index.html` con doble clic, o levantá un servidor local:

```bash
cd portafolio-identidad-digital
python3 -m http.server 8000
# luego abrí http://localhost:8000
```

## Publicar / actualizar (GitHub Pages)

El sitio se publica en GitHub Pages. Después de editar, para actualizar la versión pública:

```bash
git add .
git commit -m "Actualizo mi contenido"
git push
```

Los cambios aparecen en la URL pública en ~1 minuto.
