# Auditoría Integral del Sitio Web

> Documento maestro de calidad de **sgualda.com**.
> Quality Backlog vivo — no se sustituye, se actualiza.
>
> | | |
> |---|---|
> | Versión | 1.0 |
> | Fecha | 2026-08-01 |
> | Auditor | Lead Web Quality Auditor |
> | Build auditado | 34 páginas · `dist/` 856 KB |
> | Stack | Astro 5 · salida estática · Cloudflare Pages |

---

## Resumen Ejecutivo

### Estado general

El sitio tiene **cimientos técnicos por encima de la media** — salida estática, un contrato de URLs verificado en cada build, tokens de diseño derivados de Figma, y schema.org generado desde el propio contenido en lugar de escrito a mano. Eso es más disciplina de la que se ve en la mayoría de sitios personales, y en algunos aspectos (el guardián de URLs, el `FAQPage` derivado del HTML) está por delante de lo que hacen empresas con equipo.

Pero **no está listo para producción**, y no por una acumulación de detalles menores: hay tres fallos que invalidan el lanzamiento por sí solos.

1. **El formulario de brief no envía nada.** El botón "Send the brief" muestra un mensaje de agradecimiento y descarta los datos. El principal mecanismo de conversión del sitio es una simulación heredada del prototipo.
2. **No existe la imagen Open Graph** que declara cada página. Todo enlace compartido en LinkedIn, Slack o WhatsApp saldrá roto.
3. **No hay favicon, ni robots.txt, ni página 404.** Son las tres señales que un visitante técnico lee como "esto no está terminado".

A eso se suma una tensión de fondo que conviene nombrar: el sitio **promete honestidad radical** como propuesta de marca, y sin embargo contiene contenido inventado sin marcar (las anécdotas de las etapas del mapa), testimonios inexistentes, y proyectos vacíos. La distancia entre lo que el copy promete y lo que la web demuestra es hoy el mayor riesgo de marca.

### Nota global

**6.4 / 10**

| Dimensión | Nota | Comentario |
|---|---|---|
| Arquitectura técnica | 8.5 | Astro estático, tokens, contrato de URLs |
| SEO técnico | 7.5 | Sólido; faltan robots, OG, 404 |
| Design System | 7.0 | Coherente, con duplicaciones puntuales |
| Visual / UI | 7.0 | Limpio; falta densidad y prueba visual |
| Copywriting | 8.0 | Voz distintiva y reconocible |
| UX | 6.0 | Flujos rotos al final del embudo |
| Accesibilidad | 5.5 | Sin auditar; varios fallos evidentes |
| Performance | 7.0 | Ligero; penalizado por fuentes externas |
| CRO | 3.0 | El embudo termina en un formulario falso |
| Confianza / prueba social | 2.0 | Cero pruebas de terceros |
| Analítica | 0.0 | Inexistente |
| Seguridad / RGPD | 4.0 | Google Fonts sin consentimiento |

### ¿Está listo para producción?

**NO.**

Bloqueantes: `#Q-001`, `#Q-002`, `#Q-003`, `#Q-004`, `#Q-005`, `#Q-006`, `#Q-007`.

### Recuento de tickets

| | |
|---|---|
| **Total** | **78** |
| Críticos | 7 |
| Altos | 24 |
| Medios | 30 |
| Bajos | 17 |

### Riesgos más importantes

1. **Pérdida silenciosa de leads** — el formulario descarta briefs sin avisar a nadie (`#Q-001`).
2. **Daño de marca en el primer contacto** — enlaces compartidos sin imagen ni descripción visual (`#Q-002`).
3. **Exposición legal RGPD** — Google Fonts transmite IPs a un tercero sin base legal (`#Q-006`).
4. **Contenido inventado publicado como propio** — anécdotas que el cliente no podrá defender en una llamada (`#Q-011`).
5. **Cero medición** — imposible saber si algo funciona tras el lanzamiento (`#Q-007`).
6. **Sitio sin prueba social** — un consultor sin un solo testimonio ni caso verificable (`#Q-012`).

### Principales fortalezas

- Voz de marca **genuinamente distintiva**. "Do not hire me if…" es memorable y descalifica bien.
- **Contrato de URLs verificado en cada build** (`scripts/check-urls.mjs`) — muy poca gente hace esto.
- **Schema derivado del contenido**, no duplicado a mano. Imposible que se desincronice.
- Salida 100% estática: **todo el contenido es visible para crawlers que no ejecutan JS**.
- Tokens de diseño con **una sola fuente de verdad** y trazabilidad a Figma.
- Las herramientas gratuitas son un **activo real de captación** poco común en un portfolio.

### Principales debilidades

- El embudo **no termina en ningún sitio**.
- **Ausencia total de prueba social** (testimonios, logos, casos, cifras).
- **Densidad visual muy baja**: mucho texto centrado, sin imágenes, sin ritmo.
- **Accesibilidad no auditada** y con fallos evidentes de contraste y foco.
- **Deuda de contenido**: 2 fichas de proyecto vacías, 7 artículos delgados republicados sin reescribir.
- **Modo oscuro eliminado** sin alternativa, en un sitio dirigido a un público técnico.

---

## Índice

| # | Categoría | Tickets |
|---|---|---|
| 1 | [Visual](#1-visual) | Q-020 → Q-031 |
| 2 | [Design System](#2-design-system) | Q-032 → Q-039 |
| 3 | [UX](#3-ux) | Q-040 → Q-049 |
| 4 | [Responsive](#4-responsive) | Q-050 → Q-054 |
| 5 | [Branding](#5-branding) | Q-055 → Q-058 |
| 6 | [Copywriting](#6-copywriting) | Q-059 → Q-063 |
| 7 | [SEO Técnico](#7-seo-técnico) | Q-002 → Q-005, Q-064 → Q-068 |
| 8 | [SEO Contenidos](#8-seo-de-contenidos) | Q-069 → Q-072 |
| 9 | [Optimización LLM](#9-optimización-para-llms-geo) | Q-073 → Q-076 |
| 10 | [Performance](#10-performance) | Q-006, Q-077 → Q-081 |
| 11 | [Accesibilidad](#11-accesibilidad) | Q-082 → Q-089 |
| 12 | [Calidad Técnica](#12-calidad-técnica) | Q-090 → Q-096 |
| 13 | [CRO](#13-cro) | Q-001, Q-012, Q-097 → Q-100 |
| 14 | [Seguridad](#14-seguridad) | Q-101 → Q-104 |
| 15 | [Analítica](#15-analítica) | Q-007, Q-105 → Q-106 |
| 16 | [Escalabilidad](#16-escalabilidad) | Q-107 → Q-110 |

---

# BLOQUEANTES

## #Q-001 ✅ Resuelto — El formulario de brief no envía los datos a ningún sitio

### Categoría
CRO / Calidad Técnica

### Severidad

> ✅ **Resuelto 2026-08-01.** Cloudflare Function, luego reescrita en PHP al mover el hosting a Hostinger. Probado de extremo a extremo: honeypot, tiempo mínimo, email inválido, brief corto, método incorrecto y envío real.
**Crítica**

### Impacto
Conversión · UX · Desarrollo · Branding

### Página afectada
`/work-with-me/`

### Componentes afectados
`src/pages/work-with-me/index.astro` → bloque `<script>`, handler `#send`

### Problema
El botón **"Send the brief"** ejecuta este código:

```js
document.getElementById('send')?.addEventListener('click', () => {
  $('bBox').innerHTML = '<div class="step" role="status">…That is everything I need.…</div>';
  $('bDots').style.display = 'none';
});
```

No hay `fetch`, no hay `action`, no hay `method`. **Los datos que el usuario escribe se descartan.** El usuario recibe un mensaje diciendo que recibirá respuesta en un día.

### Evidencias
`grep -rho 'action="[^"]*"' src/` devuelve un único resultado, el de Substack. El formulario del brief no aparece.

### Por qué es un problema
Es el mecanismo principal de conversión de todo el sitio. Cada visitante que complete los cinco pasos —el tramo más cualificado del embudo— creerá que ha contactado y no recibirá respuesta. Es simultáneamente pérdida de negocio y daño reputacional: la persona concluirá que no le contestaron, no que el formulario falló.

Además contradice frontalmente la promesa escrita en la propia página: *"I read every brief myself and reply within a day"*.

### Solución propuesta
Backend real, sin depender de terceros pesados:

1. **Cloudflare Pages Function** en `functions/api/brief.ts` que reciba el POST.
2. Envío por **Resend** o **Postmark** al correo de Sergio (ambos con capa gratuita suficiente).
3. **Honeypot + rate limiting** por IP en la Function.
4. En cliente: estado `sending` → `sent` → `error`, con **error visible y recuperable** que conserve lo escrito.
5. **Autorespuesta** al remitente confirmando recepción y repitiendo el plazo prometido.
6. Persistir el borrador en `sessionStorage` para que un fallo de red no destruya tres minutos de escritura.

### Criterios de aceptación
- [ ] Un envío real llega al buzón de Sergio con los 5 pasos completos
- [ ] El remitente recibe confirmación automática
- [ ] Un fallo de red muestra error y **no** muestra el mensaje de éxito
- [ ] El contenido escrito sobrevive a un fallo y a un refresco accidental
- [ ] El honeypot bloquea envíos automatizados
- [ ] Existe un test de integración del endpoint

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-002 ✅ Resuelto — La imagen Open Graph declarada no existe

### Categoría
SEO Técnico / Branding

### Severidad

> ✅ **Resuelto 2026-08-01.** 34 imágenes generadas en build desde el h1 de cada página, más la de reserva. Test que pide la og:image declarada en todas y falla si devuelve 404.
**Crítica**

### Impacto
SEO · Branding · Conversión

### Página afectada
Todas (34)

### Componentes afectados
`src/layouts/Base.astro` → `image = '/og-default.png'`

### Problema
`Base.astro` declara `og:image` apuntando a `/og-default.png`. **Ese archivo no existe** en `public/`. Cada página del sitio anuncia una imagen social rota.

### Evidencias
`ls public/` → no existe `og-default.png`. La meta se emite igualmente en las 34 páginas.

### Por qué es un problema
Todo enlace compartido en LinkedIn, X, Slack, WhatsApp o iMessage aparecerá sin imagen o con un recuadro roto. Para un profesional cuyo canal principal de distribución es LinkedIn, es el peor sitio posible donde fallar: el primer contacto con su marca es una tarjeta defectuosa.

Además ninguna página tiene OG propia, así que un artículo se comparte igual que la home.

### Solución propuesta
1. Crear `public/og-default.png` a **1200×630**, con el logo, el nombre y el rol sobre el fondo del sistema.
2. **Generar OG por página en build** con `@vercel/og` o `satori` dentro de Astro: título de la página + eyebrow + marca. Es lo que hacen Vercel y Linear, y convierte cada enlace compartido en un anuncio.
3. Añadir `og:image:width`, `og:image:height` y `og:image:alt`.
4. Añadir `article:published_time` y `article:author` en los ensayos.
5. Test en build que falle si algún `og:image` apunta a un fichero inexistente.

### Criterios de aceptación
- [ ] Las 34 páginas devuelven 200 en su `og:image`
- [ ] Los ensayos tienen OG con su propio título
- [ ] Validado en el debugger de LinkedIn y en X Cards Validator
- [ ] `og:image:alt` presente
- [ ] El build falla si falta una imagen OG

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-003 ✅ Resuelto — No existe favicon

### Categoría
SEO Técnico / Branding

### Severidad

> ✅ **Resuelto 2026-08-01.** favicon.svg adaptable a tema, apple-touch-icon, manifest y theme-color.
**Crítica**

### Impacto
Branding · UX

### Página afectada
Todas

### Componentes afectados
`src/layouts/Base.astro` · `public/`

### Problema
No hay `<link rel="icon">` ni ficheros de icono. El navegador muestra el icono genérico de documento en la pestaña y en marcadores.

### Evidencias
`public/` no contiene `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` ni `site.webmanifest`.

### Por qué es un problema
Es la señal más barata y más leída de "sitio terminado". Un usuario con quince pestañas no encuentra la tuya. En un sitio que compite por percepción de calidad, su ausencia es desproporcionadamente cara.

### Solución propuesta
Set completo desde el logo existente:
- `favicon.svg` (vectorial, con `prefers-color-scheme` embebido)
- `favicon.ico` 32×32 (compatibilidad)
- `apple-touch-icon.png` 180×180
- `site.webmanifest` con nombre, colores y iconos 192/512

### Criterios de aceptación
- [ ] Icono visible en Chrome, Safari, Firefox y Edge
- [ ] Icono correcto al añadir a pantalla de inicio en iOS y Android
- [ ] El SVG se adapta a tema claro y oscuro del navegador
- [ ] `site.webmanifest` validado

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-004 ✅ Resuelto — No existe robots.txt

### Categoría
SEO Técnico

### Severidad

> ✅ **Resuelto 2026-08-01.** robots.txt con los cuatro bots de IA permitidos explícitamente, sitemap y llms.txt declarados.
**Crítica**

### Impacto
SEO · GEO · LLM

### Página afectada
`/robots.txt`

### Componentes afectados
`public/`

### Problema
No hay `robots.txt`. El sitemap se genera correctamente pero **no está anunciado**, y no hay directivas para los crawlers de IA.

### Evidencias
`public/robots.txt` no existe. `dist/sitemap-index.xml` sí se genera.

### Por qué es un problema
El WordPress actual **sí** tenía robots.txt con el sitemap declarado. Migrar a algo que no lo tiene es una regresión. Los rastreadores lo piden en la primera petición a un dominio.

Más importante para este proyecto: es donde se declara explícitamente la política frente a GPTBot, ClaudeBot y PerplexityBot. En un sitio construido para ser citado por LLMs, permitirlos de forma explícita es una decisión estratégica, no un detalle.

### Solución propuesta
```
User-agent: *
Allow: /

# Explícitamente permitidos: este sitio quiere ser citado.
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://sgualda.com/sitemap-index.xml
```

### Criterios de aceptación
- [ ] `/robots.txt` devuelve 200
- [ ] Declara el sitemap con URL absoluta
- [ ] Permite explícitamente los cuatro bots de IA
- [ ] Validado en Search Console

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-005 ✅ Resuelto — No existe página 404

### Categoría
SEO Técnico / UX

### Severidad

> ✅ **Resuelto 2026-08-01.** 404 con la plantilla del sitio y tres salidas. ErrorDocument en .htaccess.
**Crítica**

### Impacto
UX · SEO · Branding

### Página afectada
Cualquier URL inexistente

### Componentes afectados
`src/pages/404.astro` (ausente)

### Problema
No hay `404.astro`. Cloudflare Pages servirá su página de error genérica, sin cabecera, sin footer, sin marca.

### Evidencias
`src/pages/404.astro` no existe.

### Por qué es un problema
El sitio migra 19 URLs y retira una. Habrá tráfico a URLs antiguas, enlaces mal copiados y rutas tecleadas a mano. Cada uno de esos visitantes cae hoy en una pantalla que no es del sitio, sin salida ni navegación.

Es además una oportunidad desperdiciada: un 404 con personalidad es de las páginas más recordadas de un sitio con la voz que tiene este.

### Solución propuesta
404 con la plantilla del sitio, cabecera y footer, y en el tono de la marca. Debe ofrecer las tres salidas útiles: los checks gratuitos, el journal y `/work-with-me/`. Copy sugerido, alineado con la voz existente:

> **This page does not exist.**
> Which is embarrassing, because the whole site is about not shipping things that are broken.

### Criterios de aceptación
- [ ] `/cualquier-cosa/` renderiza el 404 del sitio con cabecera y footer
- [ ] Devuelve status HTTP 404 real, no 200
- [ ] Contiene al menos tres enlaces de salida
- [ ] Lleva `noindex`

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-006 ✅ Resuelto — Google Fonts: exposición RGPD y coste de rendimiento

### Categoría
Seguridad / Performance

### Severidad

> ✅ **Resuelto 2026-08-01.** Zalando Sans Expanded y Archivo autoalojadas, 120 KB en cuatro woff2. Cero peticiones a Google. CSP sin ningún origen de terceros.
**Crítica**

### Impacto
Seguridad · Performance · SEO

### Página afectada
Todas

### Componentes afectados
`src/layouts/Base.astro` → `<link href="https://fonts.googleapis.com/…">`

### Problema
Zalando Sans Expanded y Archivo se cargan desde `fonts.googleapis.com`. Cada visita **transmite la IP del usuario a Google sin base legal ni consentimiento**. Además implica dos conexiones adicionales (`googleapis` + `gstatic`), DNS, TLS y una cadena de peticiones bloqueante antes del primer texto pintado.

### Evidencias
`Base.astro` líneas de `preconnect` + `stylesheet`. La propia página `/privacy/` ya lo reconoce por escrito.

### Por qué es un problema
**Legal**: sentencia del Landgericht München I (enero 2022) que declaró esta práctica contraria al RGPD, con indemnización. Sergio opera desde España, bajo el mismo marco.

**Rendimiento**: es la peor cadena de dependencias posible para el LCP. Dos handshakes antes de poder pintar texto, en un sitio donde el texto *es* el contenido.

**Coherencia**: la web afirma no usar rastreadores de terceros mientras carga recursos de Google en cada página.

### Solución propuesta
1. Descargar ambas familias en **woff2**, solo los pesos usados (400/500/600/700 display, 400/500 body).
2. Subsetear a `latin` + `latin-ext` con `glyphhanger` o `subfont` — reduce típicamente un 60-70%.
3. Servir desde `/fonts/` con `font-display: swap` y `<link rel="preload">` de las dos críticas.
4. Definir `@font-face` con métricas de fallback (`size-adjust`, `ascent-override`) para eliminar el salto al cargar.
5. Actualizar `/privacy/` retirando el apartado.

### Criterios de aceptación
- [ ] Cero peticiones a dominios de Google en el panel de red
- [ ] Las dos fuentes precargadas y aplicadas sin FOUT visible
- [ ] CLS por fuentes = 0
- [ ] Apartado de fuentes eliminado de `/privacy/`
- [ ] Peso total de fuentes < 120 KB

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-007 — Cero analítica: imposible medir nada tras el lanzamiento

### Categoría
Analítica

### Severidad
**Crítica**

### Impacto
Analítica · Conversión · Producto

### Página afectada
Todas

### Componentes afectados
Ninguno — no existe

### Problema
No hay analítica de ningún tipo. No se puede saber cuántas personas visitan el sitio, qué páginas leen, cuántas empiezan un check, cuántas lo terminan ni cuántas llegan al brief.

### Evidencias
Ninguna referencia a analítica en el código. `/privacy/` lo declara explícitamente.

### Por qué es un problema
Todo el sitio es una apuesta de posicionamiento: seis herramientas, trece artículos, cinco landings de etapa. **Sin medición no hay forma de saber cuál de esas apuestas funciona**, y por tanto no hay forma de decidir dónde invertir el siguiente mes.

Es especialmente irónico en un sitio cuya tesis central es que la mayoría de equipos actúan sin diagnóstico.

### Solución propuesta
Analítica **respetuosa con la privacidad y sin cookies**, coherente con lo que promete `/privacy/`:

- **Plausible** o **Umami** (self-hosted en Cloudflare) — sin cookies, sin datos personales, no requiere banner de consentimiento.
- Eventos mínimos a instrumentar:
  - `check_started` / `check_completed` (con `tool_slug` y `outcome`)
  - `qualifier_completed` (con `recommendation`)
  - `brief_step` (1-5) y `brief_submitted`
  - `newsletter_submitted`
  - `essay_read` (scroll > 75%)
  - `stage_viewed` (`/map/*`)
- Embudo declarado: *visita → check iniciado → check completado → qualifier → brief enviado*.

### Criterios de aceptación
- [ ] Analítica activa sin cookies y sin banner
- [ ] Los 7 eventos registrados y verificados
- [ ] Embudo visible en el panel
- [ ] `/privacy/` actualizada describiendo qué se mide
- [ ] Coste 0 € o autoalojado

### Dependencias
`#Q-001` (para medir envíos reales)

### Estimación
**M**

---

# 1. Visual

## #Q-020 ⛔ Descartado — Densidad visual insuficiente: el sitio es un muro de texto centrado

### Categoría
Visual

### Severidad

> ⛔ **Descartado por el propietario, 2026-08-01.** Se implementaron tres componentes
> —cita destacada, fila de cifras y secciones en banda— y se aplicaron a `/work-with-me/`
> y a las cinco etapas. Sergio pidió revertirlo y se revirtió por completo.
>
> La observación de origen sigue en pie: `/work-with-me/` recorre unos 5.700px con cuatro
> tipos de elemento y ninguna alternancia de fondo. Si en algún momento se decide abordarlo,
> conviene hacerlo desde el Figma en lugar de proponerlo desde el código — el problema no era
> la idea sino que llegó sin diseñar.
**Alta**

### Impacto
Visual · UX · Branding · Conversión

### Página afectada
Todas, especialmente `/`, `/map/*`, `/work-with-me/`

### Componentes afectados
Layout general

### Problema
Prácticamente todo el sitio es texto centrado en una columna de 560px, con separadores de 74-118px entre secciones y ningún elemento visual salvo los huecos grises. No hay imágenes reales, ni diagramas (salvo el mapa), ni capturas, ni datos destacados, ni citas, ni cambios de fondo salvo dos bandas oscuras.

### Evidencias
`/work-with-me/` recorre unos 5.700px con cuatro tipos de elemento: titular, párrafo, opción de formulario y acordeón. `/map/worth-building/` y sus cuatro hermanas comparten estructura idéntica.

### Por qué es un problema
Stripe, Linear y Vercel alternan constantemente: texto, código, diagrama, captura, dato, testimonio. Ese ritmo es lo que sostiene el scroll. Aquí la página no cambia de textura nunca, y el ojo no tiene dónde agarrarse.

En un sitio de un **diseñador de producto**, la ausencia de artefactos visuales es además una contradicción de la propuesta.

### Solución propuesta
1. Introducir al menos **tres texturas nuevas**: capturas de producto reales, tarjetas de dato (una cifra grande + contexto) y citas destacadas.
2. En las landings de etapa, sustituir el bloque de tres trampas por **tarjetas con jerarquía visual** en vez de lista numerada.
3. Añadir un **elemento visual cada 2-3 secciones** como regla de composición.
4. Alternar fondo (`--paper` ↔ `--surface`) por bandas para segmentar el scroll.

### Criterios de aceptación
- [ ] Ninguna página supera 2 pantallas consecutivas de solo texto
- [ ] Al menos 3 tipos de elemento visual reutilizables en el sistema
- [ ] Alternancia de fondo aplicada de forma consistente

### Dependencias
`#Q-013` (imágenes reales)

### Estimación
**L**

---

## #Q-021 — Los huecos de imagen grises se leen como error, no como marcador

### Categoría
Visual

### Severidad
**Alta**

### Impacto
Visual · Branding · Conversión

### Página afectada
`/`, `/case-studies/`

### Componentes afectados
`.slot`, `.thumb.placeholder`

### Problema
La home muestra una rejilla 2×2 de rectángulos grises vacíos y otro rectángulo ancho. `/case-studies/` muestra cuatro más. Sin contenido ni etiqueta, se leen como imágenes que no cargaron.

### Evidencias
`src/pages/index.astro` → `.slot`; `src/pages/case-studies/index.astro` → `.placeholder`.

### Por qué es un problema
Es lo primero que ve un recruiter tras el hero. Un hueco gris comunica "roto", no "pendiente". Y en `/case-studies/` ocupa la página entera.

### Solución propuesta
Corto plazo, hasta que existan las imágenes:
- Sustituir el gris plano por **el nombre del proyecto en tipografía display sobre fondo del sistema**, con el rol y el año. Un placeholder tipográfico se lee como decisión.
- En `/case-studies/`, si la colección está vacía, **no mostrar rejilla**: mostrar un bloque honesto con un enlace al journal.

Largo plazo: imágenes reales (`#Q-013`).

### Criterios de aceptación
- [ ] Ningún rectángulo gris sin contenido en producción
- [ ] Estado vacío de `/case-studies/` sin rejilla fantasma
- [ ] Los placeholders mantienen `aspect-ratio` para no provocar CLS

### Dependencias
`#Q-013`

### Estimación
**S**

---

## #Q-022 — Falta jerarquía tipográfica intermedia entre h2 y cuerpo

### Categoría
Visual / Design System

### Severidad
Media

### Impacto
Visual · UX

### Página afectada
Todas

### Componentes afectados
`src/styles/base.css`

### Problema
El salto de `h2` (28-36px) a cuerpo (17px) es abrupto y no hay un escalón intermedio usado de forma sistemática. `h3` existe (20px) pero se usa poco y con tamaños distintos según la página (`1rem`, `1.0625rem`, `1.125rem`).

### Evidencias
`.blunt h3` = 1rem · `.more h3` = 1rem · `.answers h3` = heredado · `.stages h3` = 1.0625rem · `.tools .h` = 1rem.

### Por qué es un problema
Una escala tipográfica que se decide por página no es una escala. Es lo que hace que un sitio se sienta ensamblado en vez de diseñado.

### Solución propuesta
Definir y documentar 6 niveles con token propio, y **prohibir tamaños literales fuera de `tokens.css`**. Añadir un nivel `--lead-size` para párrafos introductorios y `--caption-size` para metadatos.

### Criterios de aceptación
- [ ] Cero `font-size` literales fuera de `tokens.css`
- [ ] Escala documentada con ejemplo de uso por nivel
- [ ] Los `h3` de todo el sitio miden lo mismo

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-023 — El sistema de espaciado no existe como escala

### Categoría
Visual / Design System

### Severidad
Media

### Impacto
Visual · Escalabilidad

### Página afectada
Todas

### Componentes afectados
Todas las hojas de estilo

### Problema
Los espaciados están escritos como literales dispersos: `margin-top: 26px`, `28px`, `30px`, `32px`, `34px`, `38px`, `40px`, `44px`, `46px`, `52px`, `54px`. No hay escala.

### Evidencias
`grep -o "margin-top: [0-9]*px" src/` devuelve más de 20 valores distintos.

### Por qué es un problema
Once valores entre 26 y 54px son ruido, no decisiones. Nadie percibe la diferencia entre 26 y 28, pero sí percibe la falta de ritmo que produce el conjunto.

### Solución propuesta
Escala de espaciado basada en 4px con nombres semánticos:
```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 24px;  --space-6: 32px;
--space-7: 48px;  --space-8: 64px;  --space-9: 96px;
```
Sustituir todos los literales. Prohibir valores fuera de la escala vía lint.

### Criterios de aceptación
- [ ] Escala definida en `tokens.css`
- [ ] Cero literales de espaciado en componentes
- [ ] Regla de stylelint que falle ante un valor fuera de escala

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-024 ✅ Resuelto — El foco visible es casi invisible

### Categoría
Visual / Accesibilidad

### Severidad

> ✅ **Resuelto 2026-08-01.** Anillo doble, visible sobre claro y sobre las bandas oscuras.
**Alta**

### Impacto
Accesibilidad · UX

### Página afectada
Todas

### Componentes afectados
`base.css` → `:focus-visible`

### Problema
```css
:focus-visible { outline: 2px solid var(--accent); }
```
Y `--accent` se redefinió a `#1e1c1c`, el mismo color que el texto. Sobre las bandas oscuras (`--inverse: #1a1a1a`) el foco es **prácticamente invisible**: contraste ~1.05:1.

### Evidencias
Formulario de newsletter sobre banda oscura en `/`, `/map/`, `/writing/`. Botones dentro de `.signal` en `/map/*`.

### Por qué es un problema
Incumple WCAG 2.2 SC 2.4.11 (Focus Appearance). Un usuario que navegue con teclado pierde por completo la posición dentro de los formularios más importantes del sitio.

### Solución propuesta
Foco de doble anillo, independiente del tema:
```css
:focus-visible {
  outline: 2px solid var(--paper);
  box-shadow: 0 0 0 4px var(--ink);
  outline-offset: 2px;
}
```
Y una variante invertida dentro de contenedores oscuros. Verificar contraste ≥ 3:1 contra ambos fondos.

### Criterios de aceptación
- [ ] Foco visible con contraste ≥ 3:1 sobre fondo claro y oscuro
- [ ] Recorrido completo del sitio con Tab sin perder la posición
- [ ] Verificado en los formularios sobre banda oscura

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-025 — El color de acento se anuló sin sustituirlo por un sistema de énfasis

### Categoría
Visual / Design System

### Severidad
Media

### Impacto
Visual · UX · Conversión

### Página afectada
Todas

### Componentes afectados
`tokens.css` → `--accent: #1e1c1c`

### Problema
Se eliminó el azul `#1022FF` de Figma por decisión del cliente, pero el token `--accent` se apuntó al color de tinta. Resultado: **existe una variable llamada acento que no acentúa nada**, y el sitio perdió cualquier mecanismo de jerarquía cromática.

### Evidencias
`--accent: #1e1c1c` == `--ink: #1e1c1c`. Todos los `:hover` que usaban acento ahora no cambian nada perceptible en textos ya oscuros.

### Por qué es un problema
Una paleta monocroma es una decisión legítima —Linear y Vercel la usan— pero entonces la jerarquía debe construirse con **peso, tamaño, fondo y espacio**, deliberadamente. Aquí simplemente se retiró el color sin sustituirlo, y algunos estados quedaron sin señal.

### Solución propuesta
Dos opciones, elegir una y documentarla:
1. **Monocromo estricto**: eliminar `--accent`, definir `--emphasis-bg`, `--emphasis-weight` y aplicar énfasis por fondo/peso. Requiere revisar los 12 usos actuales.
2. **Acento mínimo**: reintroducir un color usado en menos del 1% de la superficie, solo en estados activos y foco. Un óxido oscuro o un verde muy apagado funcionarían con la paleta.

### Criterios de aceptación
- [ ] Decisión documentada en `tokens.css`
- [ ] Ningún estado interactivo sin señal visual perceptible
- [ ] Sin variables cuyo nombre contradiga su valor

### Dependencias
`#Q-024`

### Estimación
**M**

---

## #Q-026 — Modo oscuro eliminado sin alternativa

### Categoría
Visual

### Severidad
Media

### Impacto
Visual · UX · Branding

### Página afectada
Todas

### Componentes afectados
`tokens.css`

### Problema
El bloque `@media (prefers-color-scheme: dark)` se eliminó con el comentario de que no existe en Figma. El sitio es solo claro.

### Evidencias
`tokens.css`: *"Dark mode is NOT in the Figma file… the site ships light-only until there are comps for it."*

### Por qué es un problema
El público objetivo —fundadores, product managers, ingenieros— es el de mayor adopción de modo oscuro por sistema. Servirles blanco puro a las once de la noche es una fricción evitable, y todos los referentes citados (Linear, Vercel, Stripe) lo soportan.

La arquitectura de tokens ya está preparada: es una capa de overrides, no un rediseño.

### Solución propuesta
Derivar la paleta oscura desde los tokens actuales manteniendo relaciones de contraste, validarla contra WCAG AA, y añadir un conmutador de tres estados (auto/claro/oscuro) persistido en `localStorage` con `data-theme` en `:root`.

### Criterios de aceptación
- [ ] Paleta oscura definida solo con overrides de token
- [ ] Todos los textos ≥ 4.5:1 en ambos temas
- [ ] Conmutador con estado auto por defecto
- [ ] Sin destello de tema incorrecto en la primera carga

### Dependencias
`#Q-025`

### Estimación
**L**

---

## #Q-027 ✅ Resuelto — Las bandas oscuras usan un negro que no es un token del sistema

### Categoría
Visual / Design System

### Severidad

> ✅ **Resuelto 2026-08-01.** --inverse derivado de --ink. Un solo negro en el sistema.
Baja

### Impacto
Visual

### Página afectada
`/`, `/map/`, `/map/*`, `/writing/`

### Componentes afectados
`--inverse: #1a1a1a`

### Problema
`--inverse` es `#1a1a1a`, un valor que no procede de Figma y que difiere de `--ink` (`#1e1c1c`) por una cantidad imperceptible pero real. El propio token lo admite: *"Not yet a Figma variable — TODO(sergio): confirm"*.

### Por qué es un problema
Dos negros casi idénticos en el mismo sistema es exactamente el tipo de deriva que hace que un design system deje de ser fiable.

### Solución propuesta
Confirmar el valor en Figma. Si no existe, adoptar `--ink` como base y derivar `--inverse` de él con `color-mix`, dejando una sola fuente.

### Criterios de aceptación
- [ ] Un solo negro base en el sistema
- [ ] `--inverse` derivado o confirmado contra Figma

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-028 — El logo es un PNG rasterizado de 96×96

### Categoría
Visual / Performance

### Severidad
Media

### Impacto
Visual · Branding · Performance

### Página afectada
Todas

### Componentes afectados
`public/img/logo.png` · `Header.astro`

### Problema
El logo se sirve como PNG de 96×96 y se muestra a 36px. Existe un SVG original (`sgualda-logo.svg`, 213 KB) que se descartó por peso.

### Evidencias
`sips -g pixelWidth public/img/logo.png` → 96.

### Por qué es un problema
En pantallas 3× (móviles modernos) 96px sobre 36 CSS px da 2.67×, por debajo del ratio necesario: el logo se ve ligeramente blando justo donde más se mira. Y no puede adaptarse a modo oscuro.

El SVG pesaba 213 KB por llevar una imagen rasterizada embebida en base64 — es un SVG mal exportado, no un SVG caro.

### Solución propuesta
Re-exportar el logo como **SVG vectorial real** desde Figma (sin imagen embebida). Debería quedar en 2-5 KB. Inline en el header para evitar una petición, con `currentColor` para que herede el tema.

### Criterios de aceptación
- [ ] Logo vectorial < 6 KB
- [ ] Nítido en pantallas 3×
- [ ] Hereda color del tema
- [ ] Sin petición HTTP adicional

### Dependencias
`#Q-026`

### Estimación
**S**

---

## #Q-029 — El avatar del header sigue siendo un placeholder en Figma pero un logo en el sitio

### Categoría
Visual / Branding

### Severidad
Baja

### Impacto
Visual · Branding

### Página afectada
Todas

### Componentes afectados
`Header.astro`

### Problema
El Figma muestra en la cabecera una **fotografía circular de Sergio**. El sitio muestra el logo. Son dos decisiones de marca distintas.

### Por qué es un problema
Una foto en la cabecera de un sitio personal genera confianza de forma inmediata y diferencia de una agencia. El logo es más neutro. La discrepancia sugiere que la decisión no se ha tomado, no que se haya elegido.

### Solución propuesta
Decidir explícitamente. Si es foto: recorte circular, 2 tamaños (1× y 2×), formato AVIF con fallback WebP, `alt` con el nombre.

### Criterios de aceptación
- [ ] Decisión tomada y aplicada en todo el sitio
- [ ] Coherente con `/about/`

### Dependencias
`#Q-013`

### Estimación
**XS**

---

## #Q-030 ✅ Resuelto — La transición de las tarjetas usa `transform` sin `will-change` ni contención

### Categoría
Visual / Performance

### Severidad

> ✅ **Resuelto 2026-08-01.** animation-play-state: paused salvo en hover.
Baja

### Impacto
Performance · Visual

### Página afectada
`/tools/`, `/tools/*`

### Componentes afectados
`.card-link`

### Problema
`.card-link` anima `background` y `transform` en hover, y su `::before` tiene una animación `conic-gradient` **infinita** que corre aunque la tarjeta no esté en pantalla ni en hover.

### Evidencias
`animation: turn 5.5s linear infinite` sin condición.

### Por qué es un problema
Seis tarjetas animando un gradiente cónico de forma permanente consume GPU y batería sin que nadie lo vea, porque la opacidad es 0 salvo en hover.

### Solución propuesta
Arrancar la animación solo en hover/focus (`animation-play-state: paused` por defecto, `running` en hover) y añadir `content-visibility: auto` a las tarjetas fuera de pantalla.

### Criterios de aceptación
- [ ] Sin animación activa cuando la tarjeta no está en hover
- [ ] Sin regresión visual del efecto
- [ ] Uso de GPU en reposo comparable a una página estática

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-031 — Los `pills` de las tarjetas tienen doble borde visual

### Categoría
Visual

### Severidad
Baja

### Impacto
Visual

### Página afectada
`/tools/`

### Componentes afectados
`.pills span`

### Problema
Los pills llevan `background: var(--paper)` y `border: 1px solid var(--hair)` sobre una tarjeta `--surface`. Al hacer hover, la tarjeta pasa a `--paper` y los pills quedan **del mismo color que el fondo**, dejando solo el borde flotando.

### Evidencias
`.card-link:hover { background: var(--paper) }` + `.pills span { background: var(--paper) }`.

### Por qué es un problema
Es un fallo de estados: el componente no contempla su contexto en hover. Se percibe como un parpadeo raro.

### Solución propuesta
Que los pills deriven su fondo del contenedor con `color-mix` o cambien a `--surface` en hover del padre, invirtiendo la relación.

### Criterios de aceptación
- [ ] Contraste del pill constante en reposo y en hover
- [ ] Comportamiento idéntico en las dos ubicaciones de tarjeta

### Dependencias
Ninguna

### Estimación
**XS**

---

### Resumen — Visual

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 3 |
| Medias | 5 |
| Bajas | 4 |

---

# 2. Design System

## #Q-032 — La clase `.go` está definida tres veces con valores distintos

### Categoría
Design System

### Severidad
Media

### Impacto
Desarrollo · Visual · Escalabilidad

### Página afectada
`/tools/`, `/tools/*`, `/map/`

### Componentes afectados
`.go`

### Problema
`.go` existe en tres ficheros con tamaños y significados distintos: en `/tools/` es `0.9375rem`, en `/tools/[slug]` es `0.875rem`, y en `/map/` es una flecha suelta de navegación.

### Por qué es un problema
Mismo nombre, tres componentes. Es el mecanismo exacto por el que un design system se degrada: nadie sabe cuál es el "de verdad".

### Solución propuesta
Extraer un componente `<LinkArrow>` con una sola definición y variantes por tamaño. Renombrar los usos que no sean ese patrón.

### Criterios de aceptación
- [ ] Una sola definición de `.go` en el proyecto
- [ ] Componente reutilizable documentado

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-033 — Existen dos sistemas de tarjeta distintos

### Categoría
Design System

### Severidad
Media

### Impacto
Visual · Escalabilidad

### Página afectada
`/tools/`, `/case-studies/`, `/map/*`, `/writing/`

### Componentes afectados
`.card-link`, `.card`, `.tools a`, `.mc`, `.offer`

### Problema
Conviven tarjetas con `--radius-card` (28px) y tarjetas con `18px` literal; unas con hover animado y otras con hover de fondo; unas clicables enteras y otras no.

### Evidencias
`.tools a { border-radius: 18px }` vs `.card-link { border-radius: var(--radius-card) }`.

### Por qué es un problema
Un usuario aprende el lenguaje de la interfaz en la primera pantalla. Si en la segunda las tarjetas se comportan distinto, deja de fiarse de lo que ve.

### Solución propuesta
Un único componente `<Card>` con variantes `interactive | static | inverse`, radio siempre por token, y un solo comportamiento de hover.

### Criterios de aceptación
- [ ] Un componente Card usado en todas las páginas
- [ ] Cero radios literales
- [ ] Comportamiento de hover idéntico en todo el sitio

### Dependencias
`#Q-032`

### Estimación
**M**

---

## #Q-034 ✅ Resuelto — No existe documentación del design system

### Categoría
Design System / Escalabilidad

### Severidad

> ✅ **Resuelto 2026-08-01.** /styleguide/ con noindex, fuera del sitemap. Renderiza los componentes reales y lee los tokens de la hoja de estilos en runtime. Calcula contraste y marca lo que falla AA.
**Alta**

### Impacto
Escalabilidad · Desarrollo

### Página afectada
N/A

### Componentes afectados
Proyecto

### Problema
No hay página de estilos, ni Storybook, ni un `/styleguide` interno. Los tokens están comentados pero no hay forma de ver el sistema completo.

### Por qué es un problema
El proyecto crecerá con landings nuevas. Sin un lugar donde ver todos los componentes y estados juntos, cada página nueva reinventa lo que ya existe — que es exactamente lo que ya ha pasado con `.go` y las tarjetas.

### Solución propuesta
Ruta `/styleguide/` con `noindex`, generada desde los propios tokens: paleta con ratios de contraste, escala tipográfica, escala de espaciado, todos los componentes en todos sus estados (reposo, hover, focus, activo, deshabilitado, cargando, error, vacío).

### Criterios de aceptación
- [ ] `/styleguide/` renderiza todos los componentes y estados
- [ ] Los valores se leen de `tokens.css`, no se duplican
- [ ] Marcada `noindex` y excluida del sitemap

### Dependencias
`#Q-022`, `#Q-023`

### Estimación
**L**

---

## #Q-035 — Los estados de los componentes están incompletos

### Categoría
Design System / UX

### Severidad
**Alta**

### Impacto
UX · Visual

### Página afectada
Todas con formulario

### Componentes afectados
`.btn`, `.opt`, `input`, `.card-link`

### Problema
Los componentes definen reposo y hover. Faltan de forma sistemática: `:active`, `:disabled`, estado de carga, estado de error y estado de éxito.

### Evidencias
`.btn` define `:hover` y `:active` (scale) pero no `:disabled` salvo en el botón "Show more". Los `input` no tienen estado de error visual.

### Por qué es un problema
Un botón sin estado deshabilitado se puede pulsar dos veces. Un input sin estado de error obliga a explicar el fallo en otro sitio.

### Solución propuesta
Definir la matriz completa de estados por componente en tokens y aplicarla. Documentar en `/styleguide/`.

### Criterios de aceptación
- [ ] Todos los interactivos con los 6 estados definidos
- [ ] Doble envío imposible en todos los formularios
- [ ] Estados visibles en `/styleguide/`

### Dependencias
`#Q-034`

### Estimación
**M**

---

## #Q-036 — `quiz.css` es un fichero de estilos globales sin encapsulación

### Categoría
Design System / Calidad Técnica

### Severidad
Media

### Impacto
Desarrollo · Escalabilidad

### Página afectada
`/work-with-me/`, `/tools/*`

### Componentes afectados
`src/styles/quiz.css`

### Problema
`quiz.css` define clases genéricas (`.step`, `.opt`, `.back`, `.f`, `.qq`, `.dots`) en ámbito global. Nombres tan cortos colisionarán con cualquier componente futuro.

### Por qué es un problema
`.f`, `.b`, `.x` y `.go` son nombres que cualquiera reutilizaría sin saber que ya existen. Es una bomba de relojería de especificidad.

### Solución propuesta
Prefijar todas las clases del cuestionario (`.qz-step`, `.qz-opt`…) o migrar a componentes Astro con estilos scoped y solo exponer los tokens.

### Criterios de aceptación
- [ ] Cero clases globales de una o dos letras
- [ ] Todas las clases del cuestionario con prefijo
- [ ] Sin regresión visual

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-037 — No hay componente `<Section>` pese a repetirse en todas las páginas

### Categoría
Design System

### Severidad
Media

### Impacto
Desarrollo · Visual · Escalabilidad

### Página afectada
Todas

### Componentes afectados
`section.section.col` + `.eyebrow` + `h2` + `.sub`

### Problema
El patrón *eyebrow → h2 → sub* se repite literalmente unas 30 veces, siempre escrito a mano con márgenes ligeramente distintos.

### Evidencias
`.intro .eyebrow { margin-bottom: 16px }` se repite en 7 ficheros.

### Por qué es un problema
Treinta copias del mismo bloque garantizan que treinta veces se pueda desviar. Ya lo hace: unas llevan `margin-bottom: 16px` y otras heredan 20px.

### Solución propuesta
Componente `<Section eyebrow title sub>` con slots, usado en todo el sitio.

### Criterios de aceptación
- [ ] Un componente para el patrón
- [ ] Cero repeticiones manuales
- [ ] Ritmo vertical idéntico en todas las páginas

### Dependencias
`#Q-023`

### Estimación
**M**

---

## #Q-038 — El `--ring` animado depende de `@property`, sin fallback

### Categoría
Design System / Calidad Técnica

### Severidad
Baja

### Impacto
Visual · Desarrollo

### Página afectada
`/tools/`, `/tools/*`

### Componentes afectados
`.card-link::before`

### Problema
El borde animado requiere `@property --ang`. En navegadores sin soporte (Firefox < 128) el gradiente no gira: el borde aparece estático en un ángulo fijo.

### Por qué es un problema
No es grave, pero es un efecto que se degrada sin que nadie lo haya decidido.

### Solución propuesta
`@supports (background: conic-gradient(from 0deg, red, blue))` combinado con detección de `@property`, y fallback explícito a un borde sólido de `--hair`.

### Criterios de aceptación
- [ ] Fallback definido y probado en Firefox ESR
- [ ] Sin borde en ángulo aleatorio en ningún navegador

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-039 — Los iconos son caracteres de texto, no un sistema

### Categoría
Design System

### Severidad
Media

### Impacto
Visual · Accesibilidad · Escalabilidad

### Página afectada
`/tools/`, `/map/`, `/writing/`

### Componentes afectados
`.go i`, `.pager`, flechas

### Problema
Las flechas son el carácter `→` dentro de un `<i>`. No hay sistema de iconos.

### Por qué es un problema
Un carácter tipográfico no se alinea ópticamente con el texto, cambia de forma según la fuente disponible, y no puede tener grosor consistente con el resto de la interfaz. Además obliga a `aria-hidden` manual en cada uso.

### Solución propuesta
Sprite SVG con los 6-8 iconos necesarios (flecha, check, cruz, más, chevron), tamaño y grosor por token, componente `<Icon name size>`.

### Criterios de aceptación
- [ ] Cero flechas como carácter de texto
- [ ] Sprite único, iconos con `currentColor`
- [ ] Todos decorativos marcados `aria-hidden`

### Dependencias
`#Q-034`

### Estimación
**S**

---

### Resumen — Design System

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 2 |
| Medias | 5 |
| Bajas | 1 |

---

# 3. UX

## #Q-040 ✅ Resuelto — El sitio no tiene ningún estado de carga ni de error en formularios

### Categoría
UX

### Severidad

> ✅ **Resuelto 2026-08-01.** Máquina de estados en el brief con error visible y recuperable.
**Alta**

### Impacto
UX · Conversión

### Página afectada
`/work-with-me/`, todas con newsletter

### Componentes afectados
Formularios

### Problema
Ningún formulario del sitio muestra estado de envío, error de red, error de validación de servidor ni reintento.

### Por qué es un problema
En cuanto exista backend (`#Q-001`), un fallo de red dejará al usuario sin señal alguna. Y el formulario de newsletter navega a Substack por `GET`, abandonando el sitio sin aviso.

### Solución propuesta
Máquina de estados explícita `idle → validating → sending → success | error` para cada formulario, con mensajes específicos y acción de reintento que conserve los datos.

### Criterios de aceptación
- [ ] Los 3 formularios implementan los 5 estados
- [ ] Errores con texto específico, no genérico
- [ ] Los datos sobreviven a un error

### Dependencias
`#Q-001`

### Estimación
**M**

---

## #Q-041 — El formulario de newsletter saca al usuario del sitio sin avisar

### Categoría
UX / CRO

### Severidad
**Alta**

### Impacto
UX · Conversión

### Página afectada
`/`, `/map/`, `/writing/`

### Componentes afectados
`Newsletter.astro`

### Problema
```html
<form action="https://sgualda.substack.com/subscribe" method="get">
```
Al enviar, el navegador **abandona el sitio** y aterriza en Substack, donde el usuario debe repetir el proceso.

### Por qué es un problema
Se pierde el contexto, se pierde la sesión y se pierde una parte significativa de las suscripciones. El usuario creía estar suscribiéndose, no navegando a otro producto.

### Solución propuesta
Suscripción vía API de Substack (o Buttondown/Resend Audiences) desde una Function, con confirmación **en la misma página**, mensaje de éxito y manejo del caso "ya estabas suscrito".

### Criterios de aceptación
- [ ] La suscripción se completa sin salir del sitio
- [ ] Confirmación visible en la misma página
- [ ] Caso "email ya suscrito" gestionado
- [ ] Medido como evento (`#Q-007`)

### Dependencias
`#Q-007`

### Estimación
**M**

---

## #Q-042 ✅ Resuelto — Los resultados de los checks no se pueden guardar ni compartir

### Categoría
UX / CRO

### Severidad

> ✅ **Resuelto 2026-08-01.** Respuestas en el hash. Botón de copiar enlace. Tres tests, incluido hash manipulado.
**Alta**

### Impacto
UX · Conversión · SEO

### Página afectada
`/tools/*`

### Componentes afectados
Motor de checks

### Problema
El resultado vive solo en memoria. No hay URL, no se puede compartir, no se puede volver, y se pierde al recargar. La propia página lo presenta como virtud: *"your result disappears when you close the tab"*.

### Por qué es un problema
El uso natural de estas herramientas es **enseñárselas al equipo**. Sin URL compartible, el resultado muere en la pestaña de una persona, y el sitio pierde su mecanismo de difusión más natural — precisamente lo que la propia página recomienda hacer ("Two people running the same check separately and comparing answers").

### Solución propuesta
Codificar las respuestas en el hash (`#a=0,2,4`) — sin servidor, sin almacenar nada, coherente con la promesa de privacidad. Añadir botones "Copiar enlace" y "Copiar resultado como texto". Opcionalmente, imagen OG dinámica por resultado.

### Criterios de aceptación
- [ ] El resultado tiene URL propia reproducible
- [ ] Nada se envía al servidor
- [ ] Botón de copiar enlace con confirmación
- [ ] El botón atrás del navegador funciona entre preguntas

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-043 ✅ Resuelto — El botón atrás del navegador no funciona dentro de los checks

### Categoría
UX / Accesibilidad

### Severidad

> ✅ **Resuelto 2026-08-01.** pushState por pregunta y popstate. Atrás y adelante funcionan.
Media

### Impacto
UX

### Página afectada
`/tools/*`, `/work-with-me/`

### Componentes afectados
Motores de cuestionario

### Problema
Los cuestionarios cambian de pregunta manipulando el DOM sin tocar el historial. Pulsar atrás **abandona la página entera** en lugar de volver a la pregunta anterior.

### Por qué es un problema
Es el comportamiento que todo usuario espera, y especialmente en móvil, donde el gesto de deslizar hacia atrás es el principal método de navegación. Perder tres respuestas por un gesto reflejo es una fricción severa.

### Solución propuesta
`history.pushState` por pregunta y escucha de `popstate`. Se resuelve solo si se implementa `#Q-042`.

### Criterios de aceptación
- [ ] Atrás vuelve a la pregunta anterior
- [ ] El gesto de deslizar en iOS funciona igual
- [ ] Adelante rehace el avance

### Dependencias
`#Q-042`

### Estimación
**S**

---

## #Q-044 ✅ Resuelto — `/case-studies/` está vacía y es una de las 4 entradas del menú

### Categoría
UX / CRO

### Severidad

> ✅ **Resuelto 2026-08-01.** Cinco fichas: glintale, truvi, ecoco y dos enterradas. 3.513 palabras. Plantilla de ficha individual con schema CreativeWork y BreadcrumbList.
**Alta**

### Impacto
UX · Conversión · Branding · SEO

### Página afectada
`/case-studies/`

### Componentes afectados
Colección `cases`

### Problema
La colección está vacía. La página muestra filtros con contador 0 y cuatro rectángulos grises. Las dos URLs de caso declaradas en el contrato (`truvi`, `ecoco-mobile-app`) **no se construyen**.

### Evidencias
Build: *"The collection cases does not exist or is empty"*. Auditor: 34/36 páginas.

### Por qué es un problema
"Work" es lo primero que abre un recruiter. Hoy encuentra una página vacía con filtros que no filtran nada. Es peor que no tener la sección.

### Solución propuesta
Bloqueante de lanzamiento: crear las dos fichas con contenido real. Mientras tanto, ocultar la entrada del menú y redirigir la ruta al journal.

### Criterios de aceptación
- [ ] Al menos 2 casos publicados con contenido real
- [ ] Los filtros muestran contadores reales
- [ ] Las 2 URLs del contrato construyen
- [ ] `#Q-013` resuelto para las imágenes

### Dependencias
`#Q-013`

### Estimación
**L**

---

## #Q-045 — No hay migas de pan visibles pese a existir el schema

### Categoría
UX / SEO

### Severidad
Media

### Impacto
UX · SEO

### Página afectada
`/tools/*`, `/map/*`, `/writing/*`

### Componentes afectados
`.crumb`

### Problema
Existe `BreadcrumbList` en JSON-LD, pero la miga visible es un texto plano (`Tools · Decisions`) donde solo el primer nivel es enlace, y en los ensayos se reduce a un enlace suelto.

### Por qué es un problema
El schema promete a Google una estructura que el usuario no ve. Y en un sitio con tres niveles de profundidad, la orientación es necesaria.

### Solución propuesta
Componente `<Breadcrumbs>` con `<nav aria-label="Breadcrumb">` y `<ol>`, que **genere a la vez el marcado visible y el JSON-LD** desde la misma fuente.

### Criterios de aceptación
- [ ] Migas visibles en todas las páginas de segundo y tercer nivel
- [ ] Marcado y JSON-LD desde una sola fuente
- [ ] Semántica `nav` + `ol`

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-046 ✅ Resuelto — Los ensayos no tienen navegación entre artículos ni contenido relacionado

### Categoría
UX / SEO

### Severidad

> ✅ **Resuelto 2026-08-01.** Tiempo de lectura, chips de tema, cruces a etapa y check, tres relacionados y paginación.
Media

### Impacto
UX · SEO · Conversión

### Página afectada
`/writing/*`

### Componentes afectados
`src/pages/writing/[...slug].astro`

### Problema
Un ensayo termina en un CTA de email y un enlace al índice. No hay anterior/siguiente, ni relacionados, ni etiquetas navegables, ni tiempo de lectura, ni enlace a las herramientas mencionadas.

### Por qué es un problema
El artículo es la principal puerta de entrada orgánica. Hoy es un callejón sin salida: el lector llega desde Google, lee y se va. No hay nada que le lleve a la segunda página.

### Solución propuesta
Bloque final con: anterior/siguiente cronológico, 2-3 relacionados por `topics`, tiempo estimado de lectura en la cabecera, y **enlaces contextuales a los checks** relacionados con el tema del artículo.

### Criterios de aceptación
- [ ] Cada ensayo enlaza a ≥ 3 páginas internas
- [ ] Relacionados calculados por topics, no manuales
- [ ] Tiempo de lectura visible

### Dependencias
`#Q-071` (taxonomía)

### Estimación
**M**

---

## #Q-047 ✅ Resuelto — El menú móvil no atrapa el foco

### Categoría
UX / Accesibilidad

### Severidad

> ✅ **Resuelto 2026-08-01.** inert en el fondo, focus trap, foco devuelto. Bug de prefers-reduced-motion corregido.
**Alta**

### Impacto
Accesibilidad · UX

### Página afectada
Todas, < 820px

### Componentes afectados
`Header.astro` → `.sheet`

### Problema
El panel a pantalla completa bloquea el scroll y cierra con ESC, pero **no implementa focus trap** ni marca el contenido de fondo como inerte. Con el menú abierto, Tab recorre los enlaces de la página que hay debajo.

### Evidencias
No hay `inert`, ni gestión de `Tab`, ni `aria-modal`.

### Por qué es un problema
Incumple WCAG 2.4.3. Un usuario de teclado o lector de pantalla queda navegando contenido invisible.

### Solución propuesta
`inert` en `<main>` y `<footer>` con el panel abierto, `role="dialog"` + `aria-modal="true"`, focus trap con ciclo, foco inicial en el primer enlace y devolución del foco al botón al cerrar.

### Criterios de aceptación
- [ ] Tab confinado al panel
- [ ] Foco devuelto al cerrar
- [ ] Verificado con VoiceOver y NVDA

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-048 — Los filtros de `/tools/` y `/case-studies/` no persisten ni son enlazables

### Categoría
UX / SEO

### Severidad
Baja

### Impacto
UX · SEO

### Página afectada
`/tools/`, `/case-studies/`

### Componentes afectados
`.chip`

### Problema
El filtro es estado solo en cliente. No modifica la URL, no sobrevive a una recarga y no se puede compartir "las herramientas de decisiones".

### Solución propuesta
Reflejar el filtro en un query param (`?topic=decisions`), leerlo al cargar, y usar `history.replaceState` para no ensuciar el historial. Considerar rutas estáticas por categoría si se busca posicionamiento.

### Criterios de aceptación
- [ ] El filtro se refleja en la URL
- [ ] Sobrevive a recarga y es compartible
- [ ] El historial no se llena de entradas

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-049 — No hay ninguna vía de contacto directa y visible

### Categoría
UX / CRO

### Severidad
Media

### Impacto
Conversión · UX

### Página afectada
Todas

### Componentes afectados
Header, Footer

### Problema
El único contacto es un `mailto:` en el footer y dentro del brief. No hay teléfono, ni agenda, ni chat, ni un CTA de contacto persistente.

### Por qué es un problema
El Figma de la home incluye un botón **"Book a call"** que en el sitio apunta a `/work-with-me/`, no a una agenda real. Un porcentaje relevante de clientes potenciales quiere hablar antes de escribir, y hoy no puede.

### Solución propuesta
Integrar agenda (Cal.com, autoalojable y sin coste) para la llamada de 20 minutos que el propio sitio promete en `/case-studies/`. Enlazar desde el CTA que ya lo anuncia.

### Criterios de aceptación
- [ ] "Book an intro call" abre una agenda real
- [ ] Confirmación por email automática
- [ ] Evento medido

### Dependencias
`#Q-007`

### Estimación
**M**

---

### Resumen — UX

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 5 |
| Medias | 3 |
| Bajas | 2 |

---

# 4. Responsive

## #Q-050 ✅ Resuelto — El diagrama del mapa se oculta en móvil en lugar de adaptarse

### Categoría
Responsive

### Severidad

> ✅ **Resuelto 2026-08-01.** Deja de ocultarse por debajo de 760px: gira a vertical con las mismas cinco paradas y enlaces. Probado a 375px.
Media

### Impacto
UX · Visual · Móvil

### Página afectada
`/map/`

### Componentes afectados
`.map-wide`

### Problema
Por debajo de 760px el diagrama **desaparece por completo** (`display: none`). Es la pieza visual más distintiva del sitio y más de la mitad del tráfico será móvil.

### Por qué es un problema
Ocultar contenido es una solución de último recurso, no una solución responsive. El usuario móvil recibe una versión empobrecida de la página insignia.

### Solución propuesta
Rediseñar el diagrama para vertical: recorrido serpenteante de arriba abajo con los cinco nodos, línea curva que conecta, descripción siempre visible. La curva SVG puede reorientarse con las mismas coordenadas invertidas.

### Criterios de aceptación
- [ ] Diagrama visible y usable a 375px
- [ ] Sin scroll horizontal
- [ ] Nodos con área táctil ≥ 44px

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-051 — Áreas táctiles por debajo del mínimo recomendado

### Categoría
Responsive / Accesibilidad

### Severidad
**Alta**

### Impacto
Accesibilidad · UX · Móvil

### Página afectada
Todas

### Componentes afectados
`.chip`, `.links a`, `.legal a`, `.elsewhere a`

### Problema
Varios objetivos táctiles quedan por debajo de 44×44 px: los chips de filtro (~34px de alto), los enlaces del nav (~30px), los enlaces legales del footer (~20px).

### Por qué es un problema
WCAG 2.2 SC 2.5.8 exige 24×24 mínimo; Apple recomienda 44×44. Enlaces de 20px de alto producen errores de pulsación constantes.

### Solución propuesta
Altura mínima de 44px en todos los interactivos, ampliando el área con padding o pseudo-elemento sin alterar la apariencia visual.

### Criterios de aceptación
- [ ] Todos los objetivos ≥ 44×44 en móvil
- [ ] Sin cambios visuales indeseados
- [ ] Verificado con la auditoría de Lighthouse

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-052 — El shell de 560px desaprovecha las pantallas grandes

### Categoría
Responsive / Visual

### Severidad
Media

### Impacto
Visual · UX

### Página afectada
Todas

### Componentes afectados
`--shell`

### Problema
`--shell: min(560px, calc(100vw - 40px))` es fijo. En un monitor de 2560px el contenido ocupa el 22% del ancho, dejando dos franjas vacías enormes.

### Por qué es un problema
560px es excelente para texto largo, pero se aplica también a rejillas de tarjetas, al footer y a las bandas, que sí podrían respirar más. El resultado en pantallas grandes es un sitio que parece diseñado para móvil y estirado.

### Solución propuesta
Sistema de dos anchos declarado: `--shell-text` (560px) para prosa y `--shell-wide` (860-960px) para rejillas, tarjetas, footer y bandas. Es lo que hacen Stripe y Linear.

### Criterios de aceptación
- [ ] Dos anchos documentados y aplicados por tipo de contenido
- [ ] Sin líneas de texto por encima de 75 caracteres
- [ ] Revisado a 1280, 1920 y 2560px

### Dependencias
`#Q-023`

### Estimación
**M**

---

## #Q-053 — Sin pruebas en orientación horizontal ni en tablet real

### Categoría
Responsive

### Severidad
Media

### Impacto
UX · Calidad

### Página afectada
Todas

### Problema
Los breakpoints se han elegido por diseño (480, 560, 700, 760, 820) pero no hay evidencia de pruebas en dispositivos reales, ni en landscape, ni en iPad, ni en pantallas plegables.

### Solución propuesta
Matriz de pruebas: iPhone SE/15/15 Pro Max, iPad mini/Pro (retrato y apaisado), Galaxy Fold, 1280/1440/1920/2560. Capturas de referencia y test visual automatizado con Playwright.

### Criterios de aceptación
- [ ] Matriz documentada y ejecutada
- [ ] Capturas de referencia por breakpoint
- [ ] Test visual en CI

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-054 — Los breakpoints no siguen ninguna escala

### Categoría
Responsive / Design System

### Severidad
Baja

### Impacto
Desarrollo · Escalabilidad

### Página afectada
Todas

### Problema
Se usan 480, 560, 620, 700, 720, 760, 780 y 820px como breakpoints, elegidos ad hoc por página.

### Solución propuesta
Definir 4-5 breakpoints con nombre en tokens y usar exclusivamente esos.

### Criterios de aceptación
- [ ] Máximo 5 breakpoints en todo el proyecto
- [ ] Definidos como custom media

### Dependencias
`#Q-023`

### Estimación
**S**

---

### Resumen — Responsive

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 1 |
| Medias | 3 |
| Bajas | 1 |

---

# 5. Branding

## #Q-055 — Ruptura de tono: `/writing/` suena a plantilla

### Categoría
Branding / Copywriting

### Severidad
**Alta**

### Impacto
Branding · Conversión

### Página afectada
`/writing/`

### Componentes afectados
Hero

### Problema
El sitio entero tiene una voz muy marcada. `/writing/` dice:

> **My journal**
> Stories, thoughts and reflections

Es genérico, intercambiable y podría estar en cualquier plantilla de blog. Contrasta violentamente con *"Do not hire me if…"*, *"Some of my projects are buried, in public"* o *"one thing I got wrong"*.

### Por qué es un problema
Es la página que recibe el tráfico orgánico. La primera impresión de marca para la mayoría de visitantes nuevos es la más floja del sitio.

### Solución propuesta
Recuperar la voz. El titular anterior (*"What I got wrong, and what it cost"*) era considerablemente más fuerte. Si "My journal" viene de Figma, merece revisarse: el diseño no debería congelar copy débil.

Alternativas en la voz del sitio:
- *"Notes from things that did not work"*
- *"What I got wrong, and what it cost"* + *"Thirteen of them so far, in public"*

### Criterios de aceptación
- [ ] Hero de `/writing/` en la voz del resto del sitio
- [ ] Sin frases intercambiables con cualquier blog

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-056 — El sitio no muestra ninguna cara humana

### Categoría
Branding / CRO

### Severidad
**Alta**

### Impacto
Branding · Conversión · Confianza

### Página afectada
Todas

### Componentes afectados
Header, `/about/`

### Problema
No hay una sola fotografía de Sergio. El retrato de `/about/` es un rectángulo gris y la cabecera muestra un logo.

### Por qué es un problema
El sitio vende **a una persona**, no a una agencia. La confianza en servicios profesionales se construye con cara, nombre y voz. Un sitio personal sin foto se lee como incompleto o deliberadamente anónimo, y ninguna de las dos lecturas ayuda a vender.

### Solución propuesta
Retrato profesional pero informal, coherente con el tono. Uno en `/about/`, uno en el header y uno en el bloque de autor de los ensayos. AVIF con fallback, 2 tamaños.

### Criterios de aceptación
- [ ] Retrato en `/about/`, header y ensayos
- [ ] Optimizado, con `alt` descriptivo
- [ ] Coherente con el tono de marca

### Dependencias
`#Q-013`

### Estimación
**S**

---

## #Q-057 — No hay identidad verbal documentada

### Categoría
Branding / Escalabilidad

### Severidad
Media

### Impacto
Branding · Escalabilidad

### Página afectada
N/A

### Problema
La voz del sitio es fuerte pero no está escrita en ninguna parte. Cada texto nuevo depende de recordar cómo sonaban los anteriores.

### Por qué es un problema
Ya se ha producido una deriva (`#Q-055`). Sin guía escrita volverá a pasar, y con contenido generado con ayuda de IA el riesgo se multiplica.

### Solución propuesta
`BRAND.md` con: principios de voz, listas de "decimos / no decimos", reglas de puntuación (el sitio usa raya larga y evita contracciones de forma inconsistente), tratamiento de números, y 10 ejemplos de antes/después.

### Criterios de aceptación
- [x] `BRAND.md` en el repositorio
- [x] Incluye reglas de puntuación y ejemplos
- [x] Referenciado desde el README

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-058 — Inconsistencia en el uso de contracciones

### Categoría
Branding / Copywriting

### Severidad
Baja

### Impacto
Branding

### Página afectada
Todas

### Problema
El sitio alterna entre estilo con contracciones y sin ellas, a veces en la misma página. `/about/` usa *"I've"*, *"wasn't"*, *"doesn't"*. `/work-with-me/` usa sistemáticamente *"I am"*, *"do not"*, *"cannot"*.

### Por qué es un problema
Las contracciones son uno de los marcadores más fuertes de registro. Alternarlas hace que el sitio suene a dos personas distintas — y la versión sin contracciones suena notablemente más rígida, en contra del tono buscado.

### Solución propuesta
Decidir una norma y aplicarla. Para una voz "cercana, informal, desenfadada", **las contracciones son la elección correcta**. Requiere una pasada por `/work-with-me/`, `/map/*` y `/tools/*`.

### Criterios de aceptación
- [x] Norma documentada en `BRAND.md`
- [x] Aplicada de forma uniforme — 298 contracciones, 76 negaciones expandidas
- [x] Sin mezcla dentro de una misma página

### Dependencias
`#Q-057`

### Estimación
**S**

---

### Resumen — Branding

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 2 |
| Medias | 1 |
| Bajas | 1 |

---

# 6. Copywriting

## #Q-059 — La home no explica qué vende en la primera pantalla

### Categoría
Copywriting / CRO

### Severidad
**Alta**

### Impacto
Conversión · SEO

### Página afectada
`/`

### Componentes afectados
Hero

### Problema
El H1 es *"Building experiences through design"* — una frase que podrían firmar cien mil diseñadores. No dice qué hace, para quién, ni qué problema resuelve. El subtítulo es mejor, pero llega después.

### Por qué es un problema
Es el texto más importante del sitio. En 5 segundos un fundador debe entender si esto le sirve. "Building experiences through design" no supera esa prueba y además no contiene ninguna keyword con volumen.

Contraste con la propia voz del sitio, que en otras páginas es específica y afilada.

### Solución propuesta
Titular específico sobre el problema que resuelve. Opciones en la voz existente:
- *"I help teams skip the expensive mistakes"*
- *"Ten years of building products. Most of it is knowing what not to build."*

Mantener el subtítulo actual, que ya funciona.

### Criterios de aceptación
- [ ] El H1 nombra el problema o el resultado
- [ ] Test con 5 personas: entienden qué ofrece en 5 segundos
- [ ] Contiene al menos una keyword relevante

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-060 ✅ Resuelto — Frase incompleta publicada en la home

### Categoría
Copywriting

### Severidad

> ✅ **Resuelto 2026-08-01.** "If it cost me nothing, then I read it somewhere and I am repeating it."
Media

### Impacto
Branding · UX

### Página afectada
`/`

### Componentes afectados
Bloque "Three things I am fairly sure of" → punto 03

### Problema
> **The cost is the lesson**
> I read it somewhere and I am repeating it. That is the filter for everything I publish here.

Le falta la oración condicional que le da sentido. Tal como está, dice literalmente lo contrario de lo pretendido: parece admitir que el contenido es repetido de otros.

### Evidencias
`src/pages/index.astro`, ya marcado con `TODO(sergio)`.

### Por qué es un problema
Está en la home, en un bloque sobre credibilidad, y afirma sin querer que el autor repite lo que lee. Es el peor sitio posible para una frase rota.

### Solución propuesta
> *"If something cost me nothing, then I read it somewhere and I am repeating it. That is the filter for everything I publish here."*

### Criterios de aceptación
- [ ] Frase completa y con sentido
- [ ] TODO eliminado del código

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-061 — Las meta descriptions se generan concatenando campos

### Categoría
Copywriting / SEO

### Severidad
Media

### Impacto
SEO · Conversión

### Página afectada
`/map/*`

### Componentes afectados
`src/pages/map/[slug].astro`

### Problema
```js
description={`${s.lead} ${s.question} The free checks that apply at this stage, and what usually goes wrong.`}
```
Produce descripciones mecánicas, con dos frases pegadas y una coletilla idéntica en las cinco páginas.

### Por qué es un problema
La meta description es el texto de venta en los resultados de Google. Cinco páginas con el mismo final compiten entre sí y ninguna resulta atractiva.

### Solución propuesta
Campo `metaDescription` escrito a mano por etapa, 140-155 caracteres, con un gancho propio.

### Criterios de aceptación
- [ ] 5 descripciones únicas escritas a mano
- [ ] Entre 140 y 155 caracteres
- [ ] Ninguna coletilla repetida

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-062 — Contenido inventado publicado como experiencia propia

### Categoría
Copywriting / Branding

### Severidad
**Crítica**

### Impacto
Branding · Confianza · Legal

### Página afectada
`/map/*` (5 páginas)

### Componentes afectados
`src/lib/stages.ts` → `body`

### Problema
Las cinco landings de etapa contienen anécdotas personales detalladas que **no ocurrieron**: la pantalla de ajustes con once usuarios, el trimestre de tráfico multiplicado, el cliente que ofreció tres veces el precio, el mes de ausencia con tres decisiones incompatibles.

Fueron escritas a petición explícita del cliente ("haz como si fueras yo"), pero **no están marcadas como ficticias en el código ni en el sitio**.

### Por qué es un problema
El sitio construye toda su propuesta sobre la honestidad radical. Publicar experiencias inventadas como propias es el único fallo capaz de destruir esa propuesta por completo si alguien lo descubre.

Y es descubrible: un cliente potencial preguntará por esa pantalla de ajustes en la primera llamada.

### Solución propuesta
**Antes del lanzamiento**, Sergio debe revisar las cinco y sustituir cada anécdota por una real, o eliminarla. Están escritas como párrafos autónomos precisamente para facilitarlo.

Mientras tanto, marcar en el código con `// FICTIONAL — replace before launch` y añadirlas al checklist de lanzamiento.

### Criterios de aceptación
- [ ] Las 5 anécdotas revisadas por Sergio
- [ ] Cada una sustituida por una real o eliminada
- [ ] Cero contenido ficticio presentado como propio
- [ ] Sin marcadores FICTIONAL en el código

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-063 — Siete artículos delgados republicados sin reescribir

### Categoría
Copywriting / SEO

### Severidad
**Alta**

### Impacto
SEO · Branding

### Página afectada
`/writing/*`

### Componentes afectados
Colección `essays`

### Problema
La auditoría de contenido identificó 7 artículos como delgados, impersonales o fuera de tema, y se despublicaron. Después se republicaron los 7 sin cambios. Cuatro tienen menos de 320 palabras y dos tienen **cero primera persona**.

### Evidencias
`product-discovery-make-or-break-idea` (182 palabras, 0 "I"), `intuitive-design-new-standard` (188, 1), `ux-certification-worth-it` (236), `learning-to-let-go-an-idea` (242).

### Por qué es un problema
Google penaliza el contenido delgado a nivel de sitio, no solo de página. Y dos artículos sin voz propia contradicen la marca en el mismo dominio que la proclama.

### Solución propuesta
Priorizar por retorno:
1. **Reescribir** `ux-certification-worth-it` y `learning-to-let-go-an-idea` — buen tema, buena demanda, extensión insuficiente. Objetivo 900-1.200 palabras.
2. **Fusionar** `nps-outdated-user-experience` dentro del artículo de HEART, que trata lo mismo mejor.
3. **Mover** `getting-things-done-transformed-my-life` al Substack: está bien escrito pero diluye la autoridad temática.
4. **Despublicar** los dos sin primera persona hasta reescribirlos.

### Criterios de aceptación
- [ ] Ningún artículo publicado por debajo de 600 palabras
- [ ] Ningún artículo publicado sin voz en primera persona
- [ ] Canibalización NPS/HEART resuelta
- [ ] Redirecciones actualizadas tras cada cambio

### Dependencias
Ninguna

### Estimación
**XL**

---

### Resumen — Copywriting

| Severidad | Cantidad |
|---|---|
| Críticas | 1 |
| Altas | 2 |
| Medias | 2 |
| Bajas | 0 |

---

# 7. SEO Técnico

> Ver también los bloqueantes `#Q-002` (Open Graph), `#Q-003` (favicon), `#Q-004` (robots), `#Q-005` (404).

## #Q-064 ✅ Resuelto — No existe `llms.txt`

### Categoría
SEO Técnico / GEO

### Severidad

> ✅ **Resuelto 2026-08-01.** llms.txt de 2.015 palabras, generado desde las colecciones.
Media

### Impacto
GEO · LLM

### Página afectada
`/llms.txt`

### Problema
El sitio está explícitamente diseñado para ser entendido y citado por LLMs, pero no publica `llms.txt`, el estándar emergente para ello.

### Por qué es un problema
Es la forma más directa de darle a un modelo un resumen estructurado y citable de quién eres, qué ofreces y dónde está cada cosa. Para un sitio con esta tesis, omitirlo es incoherente.

### Solución propuesta
`llms.txt` generado en build desde las colecciones, con: identidad, propuesta, índice de herramientas con su propósito, índice de ensayos con su tesis en una línea, y las cinco etapas definidas. Añadir `llms-full.txt` con el contenido completo en markdown.

### Criterios de aceptación
- [ ] `/llms.txt` generado automáticamente
- [ ] Se actualiza al añadir contenido
- [ ] Declarado en `robots.txt`

### Dependencias
`#Q-004`

### Estimación
**S**

---

## #Q-065 — El sitemap incluye todas las páginas con la misma importancia efectiva

### Categoría
SEO Técnico

### Severidad
Baja

### Impacto
SEO

### Página afectada
`/sitemap-index.xml`

### Problema
La configuración asigna prioridad a home, casos y herramientas, pero no excluye páginas sin valor de búsqueda (`/privacy/`) ni establece `lastmod` real por página de contenido.

### Solución propuesta
Excluir `/privacy/` y futuras `/styleguide/`; derivar `lastmod` de la fecha de modificación de cada entrada de colección.

### Criterios de aceptación
- [ ] `/privacy/` fuera del sitemap
- [ ] `lastmod` real por artículo
- [ ] Validado en Search Console

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-066 ✅ Resuelto — Ausencia total de enlazado interno contextual

### Categoría
SEO Técnico / SEO Contenidos

### Severidad

> ✅ **Resuelto 2026-08-01.** Un artículo pasa de 2 a 23 enlaces internos.
**Alta**

### Impacto
SEO · UX

### Página afectada
`/writing/*`, `/map/*`

### Problema
Los trece ensayos **no enlazan entre sí ni a las herramientas ni a las etapas**. El único enlazado interno son los menús. Y al retirar las columnas de herramientas del footer, esas seis páginas quedaron con una sola vía de entrada.

### Por qué es un problema
El enlazado interno contextual es el mecanismo principal por el que Google entiende la relación entre temas y distribuye autoridad. Un sitio con 34 páginas y enlaces solo de navegación se lee como 34 páginas independientes, no como una autoridad temática.

### Solución propuesta
1. Enlaces contextuales dentro del cuerpo de cada ensayo hacia el check y la etapa relacionados.
2. Bloque "relacionados" al final de cada ensayo (`#Q-046`).
3. En cada landing de etapa, enlazar a los ensayos que tratan ese momento.
4. Mapa de enlazado documentado, con mínimo de 3 enlaces internos entrantes por página.

### Criterios de aceptación
- [ ] Cada página con ≥ 3 enlaces internos entrantes
- [ ] Cada ensayo con ≥ 2 enlaces contextuales salientes
- [ ] Mapa documentado y verificado en build

### Dependencias
`#Q-046`, `#Q-071`

### Estimación
**L**

---

## #Q-067 — Sin verificación en Search Console ni Bing

### Categoría
SEO Técnico

### Severidad
Media

### Impacto
SEO · Analítica

### Problema
No hay meta de verificación ni evidencia de propiedad configurada.

### Por qué es un problema
Sin Search Console no hay datos de impresiones, posiciones, errores de rastreo ni Core Web Vitals reales de campo. Es la única fuente gratuita de esa información.

### Solución propuesta
Verificar por DNS en Google Search Console y Bing Webmaster Tools antes del cambio de DNS, enviar el sitemap y configurar alertas.

### Criterios de aceptación
- [ ] Propiedad verificada por DNS en ambos
- [ ] Sitemap enviado
- [ ] Alertas de cobertura activas

### Dependencias
`#Q-004`

### Estimación
**XS**

---

## #Q-068 ✅ Resuelto — `prefetchAll` puede desperdiciar ancho de banda en móvil

### Categoría
SEO Técnico / Performance

### Severidad

> ✅ **Resuelto 2026-08-01.** defaultStrategy hover, prefetchAll false.
Baja

### Impacto
Performance

### Página afectada
Todas

### Componentes afectados
`astro.config.mjs` → `prefetch: { prefetchAll: true, defaultStrategy: 'viewport' }`

### Problema
Se precargan **todos** los enlaces que entran en viewport. El footer contiene ~12 enlaces, así que al llegar al pie se descargan 12 páginas.

### Por qué es un problema
En una conexión móvil limitada, descargar una decena de páginas que probablemente no se visiten es un coste real para el usuario.

### Solución propuesta
Cambiar a `defaultStrategy: 'hover'` con `prefetchAll: false`, y marcar explícitamente con `data-astro-prefetch="viewport"` solo los enlaces de alta probabilidad (tarjetas de herramienta, artículos del índice). Respetar `navigator.connection.saveData`.

### Criterios de aceptación
- [ ] Sin prefetch masivo desde el footer
- [ ] Prefetch selectivo en enlaces principales
- [ ] Desactivado con Save-Data activo

### Dependencias
Ninguna

### Estimación
**XS**

---

### Resumen — SEO Técnico

| Severidad | Cantidad |
|---|---|
| Críticas | 4 |
| Altas | 1 |
| Medias | 2 |
| Bajas | 2 |

---

# 8. SEO de Contenidos

## #Q-069 — Sin investigación de palabras clave documentada

### Categoría
SEO Contenidos

### Severidad
**Alta**

### Impacto
SEO

### Problema
No hay evidencia de investigación de keywords. Los títulos están bien escritos pero elegidos por criterio editorial, no por demanda.

### Por qué es un problema
Los seis checks son activos potentes, pero solo si atacan consultas con volumen. *"Why is nobody using my product"* probablemente lo tenga; *"Why does your team keep redoing the same work"* casi seguro que no, en esa formulación.

### Solución propuesta
Investigación con Ahrefs/Semrush o Search Console del dominio actual. Mapear cada página a una keyword primaria y 3-5 secundarias, documentado en `SEO.md`. Reformular títulos donde la consulta real difiera.

### Criterios de aceptación
- [ ] Keyword primaria asignada a cada página
- [ ] Documentado con volumen y dificultad
- [ ] Títulos revisados según hallazgos

### Dependencias
`#Q-067`

### Estimación
**L**

---

## #Q-070 — Canibalización entre el artículo de NPS y el de HEART

### Categoría
SEO Contenidos

### Severidad
Media

### Impacto
SEO

### Página afectada
`/writing/nps-outdated-user-experience/`, `/writing/heart-framework-vs-nps-user-experience/`

### Problema
Dos artículos publicados sobre el mismo tema, uno de 413 palabras y otro de 973, compitiendo por las mismas consultas.

### Solución propuesta
Fusionar el corto dentro del largo, 301 del corto al largo, y ampliar el resultante a artículo de referencia.

### Criterios de aceptación
- [ ] Un solo artículo sobre NPS/HEART
- [ ] 301 configurada
- [ ] Contrato de URLs actualizado

### Dependencias
`#Q-063`

### Estimación
**M**

---

## #Q-071 ✅ Resuelto — La taxonomía de contenidos existe en el esquema pero está vacía

### Categoría
SEO Contenidos / UX

### Severidad

> ✅ **Resuelto 2026-08-01.** Seis temas mapeados a las etapas. 13 artículos etiquetados, 5 hubs generados.
Media

### Impacto
SEO · UX · Escalabilidad

### Página afectada
`/writing/*`

### Componentes afectados
`content.config.ts` → `topics: z.array(z.string()).default([])`

### Problema
El campo `topics` existe en el esquema y **está vacío en los trece artículos**. No hay páginas de categoría ni navegación por tema.

### Por qué es un problema
Sin taxonomía no hay clusters temáticos, no hay relacionados automáticos, no hay páginas de categoría que posicionen por término genérico, y el índice no se puede filtrar.

### Solución propuesta
Definir 5-7 topics alineados con las cinco etapas del mapa (discovery, scope, launch, process, pricing), etiquetar los trece artículos, generar `/writing/topic/{slug}/` con su propio H1 y descripción, y usarlos para calcular relacionados.

### Criterios de aceptación
- [ ] 5-7 topics definidos y documentados
- [ ] Los 13 artículos etiquetados
- [ ] Páginas de topic generadas e indexables
- [ ] Relacionados calculados por topic

### Dependencias
`#Q-046`

### Estimación
**M**

---

## #Q-072 — Oportunidades de contenido sin explotar

### Categoría
SEO Contenidos

### Severidad
Media

### Impacto
SEO · GEO

### Problema
El sitio tiene una estructura conceptual fuerte (5 etapas × 6 checks) que genera de forma natural decenas de consultas long-tail sin cubrir.

### Solución propuesta
Calendario editorial derivado de la estructura existente:
- Un ensayo profundo por etapa (5), enlazado desde `/map/{slug}/`
- Un ensayo por resultado de check con demanda (p. ej. *"What to do when users say they love it but never come back"*)
- Comparativas: *"Product discovery vs. user research"*, *"MVP vs. prototype vs. pilot"*
- Un glosario de entidades del dominio, muy citable por LLMs

### Criterios de aceptación
- [ ] Calendario de 12 piezas priorizado por demanda
- [ ] Cada pieza mapeada a una etapa y a un check
- [ ] Documentado en `SEO.md`

### Dependencias
`#Q-069`

### Estimación
**M**

---

### Resumen — SEO de Contenidos

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 1 |
| Medias | 3 |
| Bajas | 0 |

---

# 9. Optimización para LLMs (GEO)

## #Q-073 ✅ Resuelto — Las respuestas de los checks son invisibles para los LLMs

### Categoría
GEO / LLM

### Severidad

> ✅ **Resuelto 2026-08-01.** llms-full.txt con los 24 diagnósticos completos, 14.247 palabras.
**Alta**

### Impacto
GEO · LLM · SEO

### Página afectada
`/tools/*`

### Componentes afectados
Motor de checks

### Problema
El contenido más valioso del sitio —los ~24 diagnósticos con su razonamiento y sus pasos siguientes— vive **exclusivamente dentro del bundle de JavaScript**. Ningún crawler que no ejecute JS lo ve.

Se agravó al eliminar la sección "What this can tell you", que era la única exposición estática de esos contenidos: las páginas bajaron de ~1.000 a 487 palabras indexables.

### Por qué es un problema
Es exactamente el material que un LLM citaría al responder *"why is nobody using my product"*. Está escrito, es bueno, y es inaccesible.

### Solución propuesta
Publicar el razonamiento sin destripar el test:
1. Un **ensayo por herramienta** que desarrolle los cuatro o cinco resultados en profundidad, enlazado desde la landing como "the long version".
2. Alternativamente, resultados con URL propia (`#Q-042`) renderizados estáticamente en rutas `/tools/{slug}/{outcome}/`, alcanzables solo desde el resultado.
3. Incluir los diagnósticos completos en `llms-full.txt`.

### Criterios de aceptación
- [ ] Los ~24 diagnósticos accesibles sin ejecutar JS
- [ ] El test conserva el efecto sorpresa
- [ ] Incluidos en `llms.txt`

### Dependencias
`#Q-064`, `#Q-042`

### Estimación
**L**

---

## #Q-074 — Las entidades del dominio no están definidas ni marcadas

### Categoría
GEO / LLM

### Severidad
Media

### Impacto
GEO · LLM · SEO

### Problema
El sitio usa vocabulario propio con significado preciso (*workaround*, *first version*, *repeat use*, *polite no*, *reversible decision*) pero solo las cinco etapas están marcadas como `DefinedTerm`.

### Por qué es un problema
Los LLMs citan mejor lo que está definido de forma inequívoca. Un glosario marcado convierte el vocabulario propio en entidades citables y refuerza la autoridad temática.

### Solución propuesta
Página `/glossary/` con 15-20 términos, cada uno con definición corta, ejemplo y enlace al contenido donde se desarrolla. Marcado `DefinedTermSet` + `DefinedTerm` con `@id` estables, referenciados desde el resto del sitio.

### Criterios de aceptación
- [x] Glosario con ≥ 15 términos — 16 en `/glossary/`
- [x] `DefinedTerm` con `@id` reutilizados en otras páginas
- [x] Enlazado contextualmente desde ensayos y checks — 11 páginas

### Dependencias
`#Q-066`

### Estimación
**M**

---

## #Q-075 — Falta `Person` enriquecido con credenciales verificables

### Categoría
GEO / LLM / SEO

### Severidad
Media

### Impacto
GEO · LLM · Confianza

### Página afectada
Todas

### Componentes afectados
`Base.astro` → nodo `Person`

### Problema
El nodo `Person` tiene nombre, rol, email y ciudad. Le faltan `sameAs` (perfiles), `knowsAbout`, `alumniOf`, `worksFor`, `image` y `description`.

### Evidencias
`SOCIAL.linkedin` y `SOCIAL.instagram` están vacíos, así que ni siquiera hay perfiles que enlazar.

### Por qué es un problema
`sameAs` es el mecanismo principal por el que un motor reconcilia una persona con su entidad conocida. Sin él, "Sergio Gualda" es una cadena de texto, no una entidad.

### Solución propuesta
Completar el nodo con `sameAs` (LinkedIn, GitHub, Substack, X), `knowsAbout` con las entidades del dominio, `image` apuntando al retrato, y `description` de una frase. Rellenar `SOCIAL` en `site.ts`.

### Criterios de aceptación
- [ ] `sameAs` con ≥ 3 perfiles reales
- [ ] `knowsAbout` con 6-10 entidades
- [ ] Validado en el Rich Results Test
- [ ] Sin campos vacíos en `SOCIAL`

### Dependencias
`#Q-056`

### Estimación
**S**

---

## #Q-076 — Sin fechas de actualización visibles en el contenido evergreen

### Categoría
GEO / LLM / SEO

### Severidad
Baja

### Impacto
GEO · LLM · Confianza

### Página afectada
`/tools/*`, `/map/*`, `/work-with-me/`

### Problema
Solo `/now/` y `/privacy/` muestran fecha. Las herramientas, las etapas y la página de servicios no indican cuándo se revisaron por última vez.

### Por qué es un problema
Los LLMs y los buscadores ponderan la frescura. Un contenido sin fecha se asume antiguo. Y para el usuario, saber que un consejo está vigente es parte de la confianza.

### Solución propuesta
Campo `reviewed` en las colecciones y en los datos de herramientas/etapas, mostrado discretamente al pie de cada página y reflejado en `dateModified` del schema.

### Criterios de aceptación
- [ ] Fecha de revisión visible en todo el contenido evergreen
- [ ] Reflejada en `dateModified`
- [ ] Proceso de revisión documentado

### Dependencias
Ninguna

### Estimación
**S**

---

### Resumen — Optimización LLM

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 1 |
| Medias | 2 |
| Bajas | 1 |

---

# 10. Performance

> Ver también `#Q-006` (fuentes externas) y `#Q-068` (prefetch).

## #Q-077 ✅ Resuelto — El bundle del motor de checks pesa 38 KB y se carga siempre

### Categoría
Performance

### Severidad

> ✅ **Resuelto 2026-08-01.** De 39 KB a 2 KB por landing. Datos serializados en JSON por página.
Media

### Impacto
Performance

### Página afectada
`/tools/*`

### Componentes afectados
`_slug_.astro_astro_type_script_index_0_lang.js`

### Problema
El script de las landings de herramienta pesa **38 KB** porque importa el módulo `tools.ts` completo (41 KB de datos, las seis herramientas) para usar solo una.

### Evidencias
`ls -S dist/_astro/*.js` → 38 KB, el mayor del sitio con diferencia.

### Por qué es un problema
Cada visitante de `/tools/why-is-nobody-using-your-product/` descarga los datos de las otras cinco herramientas, que nunca usará. Es seis veces más JS del necesario en la página con más tráfico orgánico esperado.

### Solución propuesta
Pasar solo los datos de la herramienta actual desde el frontmatter al script mediante `define:vars`, o serializar en un `<script type="application/json">` leído por el cliente. Reduce el bundle a ~7 KB.

### Criterios de aceptación
- [ ] JS por landing < 10 KB
- [ ] Sin datos de otras herramientas en el bundle
- [ ] Sin regresión funcional

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-078 — Sin presupuesto de rendimiento ni medición en CI

### Categoría
Performance / Calidad

### Severidad
Media

### Impacto
Performance · Escalabilidad

### Problema
No hay Lighthouse CI, ni presupuesto de peso, ni medición de Core Web Vitals. El rendimiento actual es bueno por construcción, no por control.

### Por qué es un problema
Sin presupuesto, la degradación es cuestión de tiempo. Un vídeo de fondo o una librería añadida sin darse cuenta pasan el PR sin fricción.

### Solución propuesta
Lighthouse CI en cada PR con umbrales que bloqueen el merge: LCP < 1.8s, CLS < 0.05, INP < 200ms, JS total < 60 KB, CSS < 30 KB. Añadir `web-vitals` para datos de campo reales.

### Criterios de aceptación
- [ ] Lighthouse CI bloqueando merges
- [ ] Presupuestos definidos y documentados
- [ ] Datos de campo recogidos

### Dependencias
`#Q-007`

### Estimación
**M**

---

## #Q-079 — Las imágenes de los ensayos migrados no están optimizadas en origen

### Categoría
Performance

### Severidad
Baja

### Impacto
Performance

### Página afectada
`/writing/*`

### Componentes afectados
`src/assets/essays/`

### Problema
Las 8 imágenes migradas de WordPress conservan sus dimensiones originales (hasta 1024px de ancho) y sus formatos de origen (jpg/png/webp mezclados). Astro las optimiza en build, pero parte de la calidad ya se perdió en la exportación de WordPress.

### Solución propuesta
Verificar si existen originales de mayor resolución. Definir un ancho máximo por contexto y generar `srcset` con 3 tamaños. Preferir AVIF con fallback WebP.

### Criterios de aceptación
- [ ] `srcset` con 3 anchos en imágenes de artículo
- [ ] AVIF servido a navegadores compatibles
- [ ] Ninguna imagen servida por encima del doble de su tamaño de presentación

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-080 ✅ Resuelto — Sin cabeceras de caché configuradas

### Categoría
Performance / Seguridad

### Severidad

> ✅ **Resuelto 2026-08-01.** Caché en .htaccess: un año para assets con hash, revalidación para HTML.
Media

### Impacto
Performance

### Problema
No existe `public/_headers`. Se usan los valores por defecto de Cloudflare Pages, sin control sobre la caché de los assets con hash.

### Por qué es un problema
Los ficheros de `_astro/` llevan hash en el nombre y pueden cachearse un año de forma segura. Sin declararlo, se revalidan innecesariamente.

### Solución propuesta
```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

### Criterios de aceptación
- [ ] `_headers` en `public/`
- [ ] Assets con hash cacheados un año
- [ ] HTML siempre revalidado

### Dependencias
`#Q-101`

### Estimación
**XS**

---

## #Q-081 — `content-visibility: hidden` impide la búsqueda en página

### Categoría
Performance / UX / Accesibilidad

### Severidad
Media

### Impacto
UX · Accesibilidad

### Página afectada
`/writing/`

### Componentes afectados
`.row.hidden`

### Problema
Las filas ocultas usan `content-visibility: hidden`, que **excluye el contenido de Cmd+F** y de la navegación por lectores de pantalla, además del `display: none` que ya lo hace.

### Por qué es un problema
Un usuario que busque el título de un artículo en la página no lo encontrará aunque esté en el HTML. Va en contra del propósito de haber renderizado los trece.

### Solución propuesta
Usar `content-visibility: auto` con `contain-intrinsic-size` en lugar de ocultar, y controlar la visibilidad con altura/opacidad, de modo que el contenido siga siendo buscable. O aceptar que si están ocultos no son buscables y revelar todos con `Cmd+F` mediante `beforematch` (`hidden="until-found"`), que es exactamente para esto.

### Criterios de aceptación
- [ ] Cmd+F encuentra los 13 artículos
- [ ] Al encontrarlo, la fila se revela automáticamente
- [ ] Sin coste de renderizado en la carga inicial

### Dependencias
Ninguna

### Estimación
**S**

---

### Resumen — Performance

| Severidad | Cantidad |
|---|---|
| Críticas | 1 |
| Altas | 0 |
| Medias | 4 |
| Bajas | 1 |

---

# 11. Accesibilidad

## #Q-082 — El sitio no ha sido auditado con lector de pantalla

### Categoría
Accesibilidad

### Severidad
**Alta**

### Impacto
Accesibilidad · Legal

### Problema
No hay evidencia de pruebas con VoiceOver, NVDA o JAWS, ni de auditoría automatizada (axe, Pa11y).

### Por qué es un problema
Los cuestionarios reconstruyen el DOM constantemente. Sin `aria-live` correctamente aplicado y sin gestión de foco, un usuario de lector de pantalla no percibe que la pregunta ha cambiado.

Además, la Directiva Europea de Accesibilidad (EAA) entró en vigor en junio de 2025 y alcanza a servicios comerciales prestados a consumidores en la UE.

### Solución propuesta
Auditoría completa: axe-core en CI, recorrido manual con VoiceOver y NVDA de los tres flujos críticos, y corrección hasta WCAG 2.2 AA.

### Criterios de aceptación
- [ ] axe-core sin violaciones en CI
- [ ] Los 3 flujos críticos completables con lector de pantalla
- [ ] Declaración de accesibilidad publicada

### Dependencias
`#Q-024`, `#Q-047`

### Estimación
**L**

---

## #Q-083 — Los cambios de pregunta no se anuncian a los lectores de pantalla

### Categoría
Accesibilidad

### Severidad
**Alta**

### Impacto
Accesibilidad

### Página afectada
`/tools/*`, `/work-with-me/`

### Componentes afectados
`#box`, `#qfBox`

### Problema
Al pulsar una opción, el contenedor se reescribe. Solo el resultado final lleva `role="status" aria-live="polite"`; las preguntas intermedias no. Además, tras reescribir el DOM **el foco se pierde** y vuelve al `<body>`.

### Por qué es un problema
El usuario no oye la nueva pregunta y pierde su posición en la página. El cuestionario es inutilizable con lector de pantalla.

### Solución propuesta
Contenedor con `aria-live="polite"` permanente y `aria-atomic="true"`; mover el foco al encabezado de la nueva pregunta tras cada transición; anunciar el progreso ("Question 2 of 4") como parte de la región viva.

### Criterios de aceptación
- [ ] Cada pregunta se anuncia al cambiar
- [ ] El foco se sitúa en la nueva pregunta
- [ ] El progreso es audible

### Dependencias
`#Q-082`

### Estimación
**M**

---

## #Q-084 ✅ Resuelto — Contraste insuficiente en textos secundarios

### Categoría
Accesibilidad

### Severidad

> ✅ **Resuelto 2026-08-01.** --dim de #837D7D a #6B6B6B. Contraste 3.90:1 → 5.33:1. Pendiente reflejarlo en Figma.
**Alta**

### Impacto
Accesibilidad

### Página afectada
Todas

### Componentes afectados
`--dim: #837d7d` sobre `--paper: #ffffff`

### Problema
`#837D7D` sobre blanco da un ratio de **3.9:1**. WCAG AA exige **4.5:1** para texto normal. Ese color se usa en todos los subtítulos, descripciones de tarjeta, textos de FAQ y metadatos — es decir, en la mayor parte del texto del sitio.

### Evidencias
`--dim` viene de la variable "Grey" de Figma y se aplica a `.sub`, `.use`, `.ans`, `.who`, `.count`, `.crumb`, `.stamp`.

### Por qué es un problema
Es el incumplimiento más extendido del sitio: afecta a más superficie de texto que ningún otro. Y es especialmente grave porque el tamaño de esos textos suele ser 15-17px, no lo bastante grande para acogerse a la excepción de "texto grande".

### Solución propuesta
Oscurecer `--dim` hasta alcanzar 4.5:1 — aproximadamente `#6B6B6B` — manteniendo la jerarquía visual respecto a `--ink`. Requiere validación con el cliente por proceder de Figma, pero **la accesibilidad debe prevalecer sobre la fidelidad al comp**.

### Criterios de aceptación
- [ ] Todo el texto ≥ 4.5:1
- [ ] Texto grande ≥ 3:1
- [ ] Verificado con axe en las 34 páginas
- [ ] Cambio consensuado y reflejado en Figma

### Dependencias
`#Q-082`

### Estimación
**S**

---

## #Q-085 ✅ Resuelto — Los inputs de la banda oscura tienen contraste insuficiente

### Categoría
Accesibilidad

### Severidad

> ✅ **Resuelto 2026-08-01.** Placeholder al 68% y borde al 42%.
Media

### Impacto
Accesibilidad

### Página afectada
`/`, `/map/`, `/writing/`

### Componentes afectados
`Newsletter.astro` → `.signup input`

### Problema
El placeholder usa `color-mix(in srgb, var(--on-inverse) 45%, transparent)`, es decir blanco al 45% sobre `#1a1a1a`: ratio aproximado **3.2:1**. El borde del input está al 22%, apenas perceptible.

### Solución propuesta
Placeholder al 65% mínimo, borde al 40%, y `aria-label` explícito además del label oculto.

### Criterios de aceptación
- [ ] Placeholder ≥ 4.5:1
- [ ] Borde del campo ≥ 3:1
- [ ] Estado de foco claramente visible sobre fondo oscuro

### Dependencias
`#Q-024`

### Estimación
**XS**

---

## #Q-086 — Imágenes de artículos sin texto alternativo

### Categoría
Accesibilidad / SEO

### Severidad
Media

### Impacto
Accesibilidad · SEO

### Página afectada
`/writing/*`

### Componentes afectados
`src/content/essays/*.md`

### Problema
Las 8 imágenes migradas desde WordPress llegaron con `alt` vacío: `![](../../assets/essays/…)`.

### Por qué es un problema
Un lector de pantalla las omite o lee el nombre del fichero. Y se pierde el posicionamiento en búsqueda de imágenes.

### Solución propuesta
Redactar `alt` descriptivo para las 8, y añadir validación en el esquema o en el build que rechace imágenes sin alt en contenido nuevo.

### Criterios de aceptación
- [ ] Las 8 imágenes con `alt` descriptivo
- [ ] El build falla si un artículo nuevo tiene una imagen sin alt

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-087 — El logo del header no tiene texto alternativo útil

### Categoría
Accesibilidad

### Severidad
Baja

### Impacto
Accesibilidad

### Componentes afectados
`Header.astro`

### Problema
`<img src="/img/logo.png" alt="" />` dentro de un enlace cuyo `aria-label` sí describe el destino. Es técnicamente correcto, pero el logo es la única marca visible y no aporta el nombre en el árbol de accesibilidad más que por el label.

### Solución propuesta
Al pasar a SVG inline (`#Q-028`), incluir `<title>` con el nombre y mantener el `aria-label` del enlace.

### Criterios de aceptación
- [ ] El nombre de la marca presente en el árbol de accesibilidad
- [ ] Sin duplicación de anuncio

### Dependencias
`#Q-028`

### Estimación
**XS**

---

## #Q-088 — Los acordeones de FAQ no exponen su estado correctamente

### Categoría
Accesibilidad

### Severidad
Baja

### Impacto
Accesibilidad

### Página afectada
`/tools/`, `/tools/*`, `/work-with-me/`

### Componentes afectados
`.faq details`

### Problema
Se usa `<details>/<summary>` nativo, que es correcto, pero el indicador `+` es un `<span>` con texto real que los lectores anuncian como "más".

### Solución propuesta
`aria-hidden="true"` en el `.pm`, o sustituirlo por un icono SVG decorativo.

### Criterios de aceptación
- [ ] El signo no se anuncia
- [ ] El estado expandido/contraído sí se anuncia

### Dependencias
`#Q-039`

### Estimación
**XS**

---

## #Q-089 — Sin declaración de accesibilidad

### Categoría
Accesibilidad / Legal

### Severidad
Baja

### Impacto
Accesibilidad · Legal

### Problema
No hay página de declaración de accesibilidad ni vía de contacto para reportar barreras.

### Solución propuesta
Sección en `/privacy/` o página propia con: nivel de conformidad declarado, limitaciones conocidas, fecha de la última evaluación y correo de contacto para incidencias.

### Criterios de aceptación
- [ ] Declaración publicada
- [ ] Vía de contacto específica
- [ ] Fecha de evaluación visible

### Dependencias
`#Q-082`

### Estimación
**XS**

---

### Resumen — Accesibilidad

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 3 |
| Medias | 2 |
| Bajas | 3 |

---

# 12. Calidad Técnica

## #Q-090 ✅ Resuelto — Cero tests

### Categoría
Calidad Técnica

### Severidad

> ✅ **Resuelto 2026-08-01.** 124 tests en Chromium y WebKit. Encontraron cuatro bugs reales.
**Alta**

### Impacto
Desarrollo · Escalabilidad · Calidad

### Problema
El proyecto no tiene ningún test. La única verificación automática es `check-urls.mjs`, y **no se ejecuta en CI**.

### Por qué es un problema
Durante esta misma construcción se produjeron **dos regresiones causadas por sustituciones automáticas**: la desaparición del banner de newsletter en `/map/` y la pérdida completa de los estilos de `.blunt` en `/work-with-me/`. Ambas se detectaron por inspección manual del HTML compilado, no por una prueba.

Eso es evidencia directa de que el proyecto necesita red de seguridad.

### Solución propuesta
1. **Smoke tests** con Playwright: cada ruta responde 200, tiene un H1 y no tiene errores de consola.
2. **Tests de regresión visual** por página y breakpoint.
3. **Tests de integración** de los tres flujos: completar un check, completar el qualifier, enviar un brief.
4. **Test de contenido**: JSON-LD válido en todas las páginas, sin enlaces internos rotos.
5. `check-urls.mjs` **bloqueando el despliegue** en CI.

### Criterios de aceptación
- [ ] Suite de smoke tests sobre las 34 rutas
- [ ] Regresión visual en 4 breakpoints
- [ ] Los 3 flujos críticos cubiertos
- [ ] CI bloquea el merge ante fallos

### Dependencias
Ninguna

### Estimación
**L**

---

## #Q-091 ✅ Resuelto — Sin pipeline de CI/CD

### Categoría
Calidad Técnica

### Severidad

> ✅ **Resuelto 2026-08-01.** GitHub Actions: tipos, build, guardián de URLs y tests en cada push y PR.
**Alta**

### Impacto
Desarrollo · Calidad · Escalabilidad

### Problema
No hay GitHub Actions ni ninguna automatización. El build y las comprobaciones se ejecutan a mano.

### Por qué es un problema
`check-urls.mjs` es una herramienta excelente que **solo protege si alguien se acuerda de ejecutarla**. Hoy es un ritual, no una garantía.

### Solución propuesta
Workflow en cada PR: `astro check` (tipos), build, `audit:urls`, Lighthouse CI, axe-core, Playwright. Despliegue a preview automático y a producción solo desde `main` con todo en verde.

### Criterios de aceptación
- [ ] CI ejecutándose en cada PR
- [ ] Despliegue bloqueado si falla cualquier comprobación
- [ ] URL de preview por PR

### Dependencias
`#Q-090`

### Estimación
**M**

---

## #Q-092 ✅ Resuelto — El proyecto no está bajo control de versiones

### Categoría
Calidad Técnica

### Severidad

> ✅ **Resuelto 2026-08-01.** github.com/sgualda/sgualda, privado. Verificado que la API key no está en el historial.
**Crítica**

### Impacto
Desarrollo · Riesgo

### Problema
El directorio de trabajo **no es un repositorio git**. Existe `.gitignore` pero no hay historial.

### Evidencias
Entorno declarado: *"Is a git repository: false"*.

### Por qué es un problema
No hay historial, no hay ramas, no hay forma de revertir, no hay copia remota. Las dos regresiones mencionadas en `#Q-090` no se pudieron diagnosticar con un `git diff` porque no existe. Un borrado accidental destruiría semanas de trabajo.

Es, en términos de riesgo puro, el problema más grave del proyecto después del formulario.

### Solución propuesta
`git init` inmediato, commit inicial, remoto privado en GitHub, ramas `main` + feature, y conexión a Cloudflare Pages para despliegue automático.

### Criterios de aceptación
- [ ] Repositorio inicializado con historial
- [ ] Remoto privado configurado
- [ ] Cloudflare Pages desplegando desde el repo
- [ ] `.gitignore` verificado (no subir `dist/`, `node_modules/`)

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-093 — Los datos de contenido viven en TypeScript, no en colecciones

### Categoría
Calidad Técnica / Escalabilidad

### Severidad
Media

### Impacto
Escalabilidad · Desarrollo

### Página afectada
`/tools/*`, `/map/*`, `/work-with-me/`

### Componentes afectados
`src/lib/tools.ts` (41 KB), `src/lib/stages.ts`, `src/lib/work-with-me.ts` (18 KB)

### Problema
Casi 80 KB de contenido editorial están dentro de módulos TypeScript, no en colecciones de contenido. No tienen validación de esquema, no se pueden editar sin tocar código, y el HTML está incrustado en literales de cadena.

### Por qué es un problema
Es la razón por la que el bundle pesa 38 KB (`#Q-077`). Y significa que Sergio no puede corregir una errata en un diagnóstico sin abrir un fichero `.ts` y arriesgarse a romper la sintaxis.

### Solución propuesta
Migrar a content collections con esquema Zod: `src/content/tools/*.md` y `src/content/stages/*.md`, con frontmatter para los datos y markdown para el cuerpo. Habilita edición por CMS visual en el futuro.

### Criterios de aceptación
- [ ] Contenido de herramientas y etapas en colecciones
- [ ] Validado por esquema
- [ ] Editable sin tocar TypeScript
- [ ] Bundle reducido

### Dependencias
`#Q-077`

### Estimación
**L**

---

## #Q-094 — Lógica de cuestionario duplicada en tres sitios

### Categoría
Calidad Técnica

### Severidad
Media

### Impacto
Desarrollo · Escalabilidad

### Página afectada
`/tools/*`, `/work-with-me/`

### Componentes afectados
Scripts de cuestionario

### Problema
El motor de preguntas está implementado dos veces con variaciones (checks por puntuación, qualifier por reglas), más una tercera versión del árbol de decisión que quedó huérfana al retirar el chooser.

### Por qué es un problema
Una corrección de accesibilidad (`#Q-083`) hay que aplicarla dos veces. Un cambio de estilo, dos veces. Ya divergieron: el botón atrás resta puntuación en uno y no existía en el otro.

### Solución propuesta
Un único componente `<Quiz>` con estrategias de puntuación intercambiables. Elimina la duplicación y centraliza accesibilidad, historial y analítica.

### Criterios de aceptación
- [ ] Un solo motor de cuestionario
- [ ] Ambos casos de uso cubiertos
- [ ] Accesibilidad e historial resueltos una sola vez

### Dependencias
`#Q-083`, `#Q-043`

### Estimación
**L**

---

## #Q-095 — Código muerto tras las últimas iteraciones

### Categoría
Calidad Técnica

### Severidad
Baja

### Impacto
Desarrollo

### Problema
Restos de funcionalidad retirada: el objeto `CHAT` en `tools.ts` (árbol de decisión del chooser eliminado), `INDEX_FAQ_HTML` importado tras retirar secciones, `--shadow` definido y nunca usado, `KIND`/`SPECIFIC` parcialmente usados.

### Solución propuesta
Barrido de código muerto con `knip` o `ts-prune`, y regla en CI que falle ante exportaciones no usadas.

### Criterios de aceptación
- [ ] Cero exportaciones sin usar
- [ ] Cero tokens CSS sin usar
- [ ] Comprobación en CI

### Dependencias
`#Q-091`

### Estimación
**S**

---

## #Q-096 ✅ Resuelto — Sin README ni documentación de proyecto

### Categoría
Calidad Técnica / Escalabilidad

### Severidad

> ✅ **Resuelto 2026-08-01.** README con arranque, publicación de contenido, reglas no obvias, arquitectura, despliegue y checklist de lanzamiento.
Media

### Impacto
Escalabilidad · Desarrollo

### Problema
No hay README. Un desarrollador nuevo —o Sergio dentro de seis meses— no tiene dónde leer cómo arrancar, cómo publicar un artículo, qué hace `check-urls.mjs` ni por qué `trailingSlash` es intocable.

### Por qué es un problema
Las decisiones más importantes del proyecto (el contrato de URLs, la configuración de barras finales, el esquema derivado del HTML) están documentadas en comentarios dentro del código, que solo se leen si ya sabes dónde mirar.

### Solución propuesta
`README.md` con: arranque, estructura, cómo publicar contenido, decisiones de arquitectura y sus motivos, proceso de despliegue y checklist de lanzamiento. Complementar con ADRs breves para las decisiones irreversibles.

### Criterios de aceptación
- [ ] README completo
- [ ] Proceso de publicación documentado
- [ ] Decisiones críticas explicadas
- [ ] Checklist de lanzamiento incluido

### Dependencias
Ninguna

### Estimación
**S**

---

### Resumen — Calidad Técnica

| Severidad | Cantidad |
|---|---|
| Críticas | 1 |
| Altas | 2 |
| Medias | 3 |
| Bajas | 1 |

---

# 13. CRO

> Ver también el bloqueante `#Q-001` (el formulario no envía).

## #Q-097 ⛔ Descartado — Cero prueba social en todo el sitio

### Categoría
CRO / Branding

### Severidad

> ⛔ **Descartado por el propietario, 2026-08-01.** Se implementó con tres testimonios
> reales y Sergio pidió retirarlos. La sección, el componente y los datos se eliminaron.
> El riesgo sigue existiendo y queda documentado: es el único sitio del que un cliente
> potencial puede obtener evidencia que no venga del propio autor. Reabrir si la tasa de
> conversión del brief resulta baja tras el lanzamiento.
**Crítica**

### Impacto
Conversión · Confianza · Branding

### Página afectada
Todas

### Problema
No hay ni un testimonio, ni un logo de cliente, ni una recomendación, ni una cifra verificable, ni un enlace a un perfil con reputación. **La única evidencia de competencia es la propia afirmación del sitio.**

### Por qué es un problema
Es el mayor obstáculo de conversión que existe. Un fundador que va a confiar una decisión de producto necesita evidencia de terceros. Stripe, Linear y Vercel ponen logos y testimonios por encima del pliegue en su home.

Agrava el problema que `/case-studies/` esté vacía: no hay ninguna vía alternativa de verificar la trayectoria.

### Solución propuesta
Por orden de facilidad:
1. **Recomendaciones de LinkedIn** existentes, citadas con nombre, cargo, empresa y enlace al perfil.
2. **Logos de empresas** donde ha trabajado, con permiso.
3. **Dos casos reales** con resultado (`#Q-044`).
4. **Cifras verificables** de trayectoria (años, productos lanzados, equipos).
5. Testimonio en `/work-with-me/`, justo antes del formulario.

Si hoy no existen testimonios, **pedirlos es la acción de mayor retorno de todo este documento**.

### Criterios de aceptación
- [ ] ≥ 3 testimonios con nombre, cargo y enlace verificable
- [ ] Prueba social visible en home y en `/work-with-me/`
- [ ] Ninguna prueba social inventada o anónima

### Dependencias
`#Q-044`

### Estimación
**M**

---

## #Q-098 — El CTA principal cambia de nombre en cada página

### Categoría
CRO / UX Writing

### Severidad
Media

### Impacto
Conversión · UX

### Página afectada
Todas

### Problema
El mismo destino (`/work-with-me/`) se etiqueta de seis formas distintas: *"Start here"* (header), *"Book a call"* (home), *"Read the post mortems"*, *"Book an intro call"*, *"See if I can help"*, *"See how it works"*.

### Por qué es un problema
Cada nombre distinto obliga al usuario a reevaluar si es el mismo sitio. Y hace imposible medir el CTA de forma agregada.

### Solución propuesta
Una acción primaria con un nombre constante en toda la navegación persistente. Los CTA contextuales dentro del contenido pueden variar, pero deben usar un mismo verbo. Documentar en `BRAND.md`.

### Criterios de aceptación
- [ ] CTA persistente con nombre único
- [ ] Máximo 2 variantes contextuales documentadas
- [ ] Medible como un solo embudo

### Dependencias
`#Q-057`, `#Q-007`

### Estimación
**S**

---

## #Q-099 — El qualifier no captura al usuario que recibe un "no"

### Categoría
CRO

### Severidad
Media

### Impacto
Conversión

### Página afectada
`/work-with-me/`

### Componentes afectados
Resultado `notyet` y `nope`

### Problema
Cuando el resultado es "no encajamos", el usuario recibe enlaces a contenido gratuito y se va. **No hay captura de email**, ni seguimiento, ni forma de volver a contactar.

### Por qué es un problema
Según la propia página, es **un tercio de los casos**. Esa gente está cualificada, tiene un problema y puede encajar dentro de seis meses. Hoy se pierde por completo.

### Solución propuesta
En los resultados negativos, ofrecer suscripción con contexto: *"Not yet. Want a note when this changes?"*. Segmentar por resultado para poder escribirles cuando corresponda.

### Criterios de aceptación
- [ ] Captura de email en los dos resultados negativos
- [ ] Segmentación por tipo de resultado
- [ ] Medido como conversión secundaria

### Dependencias
`#Q-041`, `#Q-007`

### Estimación
**S**

---

## #Q-100 — El brief de 5 pasos no muestra su coste antes de empezar

### Categoría
CRO / UX

### Severidad
Baja

### Impacto
Conversión

### Página afectada
`/work-with-me/`

### Problema
El formulario indica "Five short steps, about three minutes" en la introducción, pero una vez dentro no hay indicación de progreso más allá de los puntos, ni posibilidad de guardar y continuar después.

### Solución propuesta
Progreso explícito ("Step 2 of 5 · about 2 minutes left"), guardado automático en `sessionStorage`, y posibilidad de enviar un brief incompleto con lo esencial.

### Criterios de aceptación
- [ ] Progreso y tiempo restante visibles
- [ ] Borrador recuperable
- [ ] Tasa de abandono por paso medida

### Dependencias
`#Q-001`, `#Q-007`

### Estimación
**S**

---

### Resumen — CRO

| Severidad | Cantidad |
|---|---|
| Críticas | 2 |
| Altas | 0 |
| Medias | 2 |
| Bajas | 1 |

---

# 14. Seguridad

## #Q-101 ✅ Resuelto — Sin cabeceras de seguridad

### Categoría
Seguridad

### Severidad

> ✅ **Resuelto 2026-08-01.** CSP, HSTS con preload, X-Content-Type-Options, Referrer-Policy, Permissions-Policy y X-Frame-Options.
**Alta**

### Impacto
Seguridad

### Problema
No existe `public/_headers`. El sitio se sirve sin CSP, sin HSTS, sin `X-Content-Type-Options`, sin `Referrer-Policy` ni `Permissions-Policy`.

### Por qué es un problema
Aunque sea un sitio estático, la ausencia de estas cabeceras es detectable por cualquiera con securityheaders.com y da una nota F. Para alguien que vende criterio técnico, es una mala señal pública.

### Solución propuesta
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self' https://sgualda.substack.com; frame-ancestors 'none'; base-uri 'self'
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  X-Frame-Options: DENY
```
La CSP anterior asume fuentes autoalojadas (`#Q-006`).

### Criterios de aceptación
- [ ] Nota A o superior en securityheaders.com
- [ ] CSP sin `unsafe-inline` en scripts
- [ ] Sin errores de CSP en consola

### Dependencias
`#Q-006`, `#Q-080`

### Estimación
**S**

---

## #Q-102 ✅ Resuelto — Formularios sin protección antispam

### Categoría
Seguridad

### Severidad

> ✅ **Resuelto 2026-08-01.** Honeypot, tiempo mínimo de 3s y límite de 3 por IP y hora.
**Alta**

### Impacto
Seguridad · UX

### Página afectada
`/work-with-me/`, newsletter

### Problema
Cuando el brief tenga backend (`#Q-001`), no hay honeypot, ni límite de frecuencia, ni verificación de ningún tipo.

### Por qué es un problema
Un formulario de contacto público sin protección recibe spam automatizado en cuestión de días. Y si envía correo, puede convertirse en vector de abuso.

### Solución propuesta
Honeypot invisible + campo de tiempo mínimo de cumplimentación + rate limit por IP en la Function + Cloudflare Turnstile solo si el spam persiste (es invisible y no requiere consentimiento).

### Criterios de aceptación
- [ ] Honeypot activo
- [ ] Rate limit configurado
- [ ] Sin fricción añadida para usuarios legítimos

### Dependencias
`#Q-001`

### Estimación
**S**

---

## #Q-103 — La política de privacidad quedará desfasada al añadir analítica

### Categoría
Seguridad / Legal

### Severidad
Media

### Impacto
Legal · Confianza

### Página afectada
`/privacy/`

### Problema
`/privacy/` afirma taxativamente *"No analytics. No cookies. No tracking pixels."* En cuanto se implemente `#Q-007`, el texto será falso.

### Por qué es un problema
Una política de privacidad inexacta es una infracción, y en este sitio además contradice la promesa de marca. El propio documento promete: *"this page changes at the same time"*.

### Solución propuesta
Actualizar `/privacy/` **en el mismo commit** que introduzca la analítica. Añadir comprobación en CI que falle si cambia el código de analítica sin cambiar la fecha de `/privacy/`.

### Criterios de aceptación
- [ ] Política actualizada junto con la analítica
- [ ] Fecha de actualización modificada
- [ ] Comprobación automática enlazando ambos

### Dependencias
`#Q-007`

### Estimación
**XS**

---

## #Q-104 ✅ Resuelto — Sin aviso legal ni identificación fiscal

### Categoría
Seguridad / Legal

### Severidad

> ✅ **Resuelto 2026-08-01.** Versión ligera hasta darse de alta como autónomo. Interruptor LEGAL.trading y aviso en el build.
Media

### Impacto
Legal

### Problema
El sitio ofrece servicios profesionales desde España sin aviso legal, sin identificación del prestador y sin condiciones de servicio.

### Por qué es un problema
La LSSI-CE exige a quien presta servicios por medios electrónicos identificarse con nombre, NIF, domicilio y contacto. No hacerlo es sancionable.

### Solución propuesta
Página `/legal/` con los datos exigidos por LSSI-CE, enlazada desde el footer junto a `/privacy/`. Añadir condiciones básicas del servicio.

### Criterios de aceptación
- [ ] `/legal/` publicada con los datos obligatorios
- [ ] Enlazada desde el footer de todas las páginas
- [ ] Revisada por un asesor

### Dependencias
Ninguna

### Estimación
**S**

---

### Resumen — Seguridad

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 2 |
| Medias | 2 |
| Bajas | 0 |

---

# 15. Analítica

> Ver el bloqueante `#Q-007`.

## #Q-105 ✅ Resuelto — Sin monitorización de errores en cliente

### Categoría
Analítica / Calidad

### Severidad

> ✅ **Resuelto 2026-08-01.** Endpoint PHP propio, sin terceros. Log rotativo fuera de public_html. Cuatro campos, ninguno identificativo.
Media

### Impacto
Calidad · UX

### Problema
No hay captura de errores de JavaScript. Si el motor de checks falla en un navegador concreto, nadie se entera.

### Por qué es un problema
El sitio ejecuta lógica no trivial en cliente. Un fallo silencioso en Safari dejaría los checks inservibles para un tercio de los visitantes sin señal alguna.

### Solución propuesta
Sentry en su capa gratuita, o un endpoint propio que registre `window.onerror` y `unhandledrejection` con muestreo. Alertas ante picos.

### Criterios de aceptación
- [ ] Errores de cliente capturados
- [ ] Alertas configuradas
- [ ] Sin datos personales en los informes

### Dependencias
`#Q-007`

### Estimación
**S**

---

## #Q-106 — Sin monitorización de disponibilidad ni de enlaces rotos

### Categoría
Analítica / Calidad

### Severidad
Baja

### Impacto
SEO · UX

### Problema
No hay comprobación periódica de que el sitio responde ni de que los enlaces externos siguen vivos.

### Solución propuesta
Monitor de disponibilidad gratuito (UptimeRobot, Better Stack) y comprobación mensual de enlaces externos en CI programada.

### Criterios de aceptación
- [ ] Monitor activo con alerta por email
- [ ] Comprobación mensual de enlaces
- [ ] Informe de 404 desde Search Console revisado

### Dependencias
`#Q-067`

### Estimación
**XS**

---

### Resumen — Analítica

| Severidad | Cantidad |
|---|---|
| Críticas | 1 |
| Altas | 0 |
| Medias | 1 |
| Bajas | 1 |

---

# 16. Escalabilidad

## #Q-107 — El contrato de URLs se mantiene a mano

### Categoría
Escalabilidad

### Severidad
Media

### Impacto
Escalabilidad · SEO

### Página afectada
N/A

### Componentes afectados
`src/lib/site.ts` → `URL_MAP`

### Problema
`URL_MAP` enumera las URLs a mano. Al publicar los 7 artículos hubo que editarlo manualmente, igual que al añadir las 5 etapas.

### Por qué es un problema
Un contrato que hay que recordar actualizar dejará de reflejar la realidad. Ya ocurrió: el auditor pasó de 25 a 24 a 29 a 36 páginas según se iban recordando actualizaciones.

### Solución propuesta
Derivar las secciones dinámicas de las propias colecciones y dejar en el fichero solo las páginas fijas. El contrato pasa a ser *"todo lo declarado existe"* en lugar de una lista paralela.

### Criterios de aceptación
- [ ] Rutas de contenido derivadas automáticamente
- [ ] Imposible publicar sin que aparezca en el contrato
- [ ] `check-urls` sigue detectando rutas rotas

### Dependencias
`#Q-093`

### Estimación
**S**

---

## #Q-108 — Sin CMS: publicar exige tocar el repositorio

### Categoría
Escalabilidad

### Severidad
Media

### Impacto
Escalabilidad · Producto

### Problema
Publicar un artículo requiere crear un `.md`, escribir frontmatter válido y hacer commit. Cambiar un diagnóstico requiere editar TypeScript.

### Por qué es un problema
La estrategia del sitio depende de publicar con regularidad. Cualquier fricción en ese proceso reduce la frecuencia, y la frecuencia es todo el plan.

### Solución propuesta
Keystatic o Decap CMS sobre el repositorio: editor visual, sin base de datos, sin coste, y el contenido sigue siendo markdown versionado.

### Criterios de aceptación
- [ ] Publicar un artículo sin abrir el editor de código
- [ ] Validación de esquema en el CMS
- [ ] Previsualización antes de publicar

### Dependencias
`#Q-092`, `#Q-093`

### Estimación
**M**

---

## #Q-109 — El sitio no está preparado para un segundo idioma

### Categoría
Escalabilidad / SEO

### Severidad
Baja

### Impacto
SEO · Escalabilidad

### Problema
Se decidió inglés únicamente, sin estructura preparada para i18n. Añadir español después exigiría reestructurar todas las URLs.

### Por qué es un problema
Sergio opera desde Barcelona y una parte relevante de sus clientes potenciales serán hispanohablantes. Es una decisión razonable hoy, pero cara de revertir.

### Solución propuesta
No implementar i18n ahora, pero **documentar la ruta de migración** en un ADR: qué URLs cambiarían, qué redirecciones harían falta, y qué contenido sería prioritario traducir.

### Criterios de aceptación
- [ ] ADR documentando la decisión y su coste de reversión
- [ ] Estimación de esfuerzo si se decide más adelante

### Dependencias
`#Q-096`

### Estimación
**XS**

---

## #Q-110 — Sin estrategia de copia de seguridad del contenido

### Categoría
Escalabilidad / Riesgo

### Severidad
Media

### Impacto
Riesgo

### Problema
El contenido migrado de WordPress vive únicamente en la máquina local, sin repositorio ni copia remota (`#Q-092`). El WordPress original sigue siendo hoy la única copia de seguridad, y desaparecerá al migrar.

### Solución propuesta
Además del repositorio remoto (`#Q-092`), exportar el WordPress completo antes del cambio de DNS y guardarlo fuera del proyecto. Documentar el procedimiento de restauración.

### Criterios de aceptación
- [ ] Export completo de WordPress archivado
- [ ] Contenido en remoto git
- [ ] Procedimiento de restauración documentado

### Dependencias
`#Q-092`

### Estimación
**XS**

---

### Resumen — Escalabilidad

| Severidad | Cantidad |
|---|---|
| Críticas | 0 |
| Altas | 0 |
| Medias | 3 |
| Bajas | 1 |

---

# SEGUNDA PASADA

> Recorrido nuevo del sitio, ignorando los hallazgos anteriores.

## #Q-011 — Contenido de proyecto pendiente y bloqueado por el cliente

### Categoría
Contenido

### Severidad
**Alta**

### Impacto
Conversión · SEO · Branding

### Problema
Dos fichas de caso comprometidas y no entregadas. Sin ellas, `/case-studies/` no puede lanzarse.

### Solución propuesta
Sesión de una hora con Sergio para extraer los datos de Truvi y ecoco: rol, año, problema, decisión, resultado y una imagen. Es contenido que ya existe en su cabeza.

### Criterios de aceptación
- [ ] 2 fichas completas y publicadas

### Dependencias
`#Q-044`

### Estimación
**M**

---

## #Q-012 — Sin activo descargable ni imán de captación

### Categoría
CRO

### Severidad
Media

### Impacto
Conversión

### Problema
La newsletter se ofrece sin contrapartida. No hay plantilla, checklist ni documento descargable.

### Solución propuesta
Un activo derivado del contenido existente: *"The nine questions"* como PDF de una página, o la plantilla de registro de decisiones de cuatro líneas que el sitio recomienda dos veces. Coste de producción bajo, coherente con el contenido.

### Criterios de aceptación
- [ ] Un activo descargable enlazado a la suscripción
- [ ] Derivado de contenido ya existente

### Dependencias
`#Q-041`

### Estimación
**S**

---

## #Q-013 ✅ Resuelto — Ninguna imagen real en todo el sitio

### Categoría
Visual / Contenido

### Severidad

> ✅ **Resuelto 2026-08-01.** Recuperadas las 3 imágenes reales de ecoco desde WordPress, más la captura de glintale y el retrato. Quedan las del grid de la home.
**Alta**

### Impacto
Visual · Branding · Conversión

### Problema
Las únicas imágenes del sitio son el logo y las 8 heredadas de artículos de WordPress. No hay retrato, ni capturas de producto, ni fotografía de trabajo.

### Solución propuesta
Lista mínima: 1 retrato, 4 capturas de proyecto, 1 imagen ambiente para la home, 2 imágenes de caso. Especificación técnica documentada (proporciones, formato, tamaños).

### Criterios de aceptación
- [ ] 8 imágenes entregadas y optimizadas
- [ ] Ningún placeholder gris en producción

### Dependencias
Ninguna

### Estimación
**M**

---

## #Q-014 — El menú y las URLs usan nombres distintos para la misma sección

### Categoría
UX / SEO

### Severidad
Baja

### Impacto
UX · SEO

### Problema
El menú dice **Writing**, la URL es `/writing/`, y el H1 de la página dice **My journal**. Tres nombres, dos de ellos distintos, para una misma sección.

### Por qué es un problema
Rompe la correspondencia entre lo que el usuario pulsa y lo que encuentra. Es una desorientación pequeña pero medible.

### Solución propuesta
Elegir un nombre y usarlo en menú, URL, H1 y title. "Writing" es mejor para búsqueda; "Journal" es más personal. Cualquiera sirve, pero uno solo.

### Criterios de aceptación
- [ ] Un solo nombre en menú, URL, H1 y title
- [ ] Redirección si cambia la URL

### Dependencias
`#Q-055`

### Estimación
**XS**

---

## #Q-015 — La página `/now/` tiene un TODO visible en producción

### Categoría
Contenido

### Severidad
Media

### Impacto
Branding

### Página afectada
`/now/`

### Problema
El bloque de Glintale contiene un comentario `TODO(sergio)` y un texto genérico. La página anuncia un proyecto sin decir qué es.

### Solución propuesta
Dos frases: qué es Glintale y qué quiere averiguar con él. Sin eso, la página resta en lugar de sumar.

### Criterios de aceptación
- [ ] Descripción real de Glintale
- [ ] Sin TODOs en el código de producción

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-016 — Sin recordatorio de actualización para `/now/`

### Categoría
Contenido / Proceso

### Severidad
Baja

### Impacto
Branding

### Problema
`/now/` depende de actualizarse mensualmente. No hay recordatorio ni aviso de obsolescencia.

### Solución propuesta
Aviso automático en build si `UPDATED` tiene más de 60 días, y recordatorio recurrente en calendario. Considerar mostrar el aviso en la propia página si supera los 90.

### Criterios de aceptación
- [ ] Aviso en build al superar 60 días
- [ ] Recordatorio en calendario

### Dependencias
Ninguna

### Estimación
**XS**

---

## #Q-017 — Los pills de las tarjetas no informan del número de preguntas

### Categoría
UX

### Severidad
Baja

### Impacto
UX

### Página afectada
`/tools/`

### Problema
Las tarjetas muestran "Free · 40 seconds" pero se retiró el número de preguntas, que es el dato que mejor comunica el esfuerzo real.

### Solución propuesta
Evaluar si añadir "3 questions" al pill de tiempo. El tiempo es una promesa difícil de verificar; el número de preguntas es un hecho.

### Criterios de aceptación
- [ ] Decisión tomada con datos de abandono (`#Q-007`)

### Dependencias
`#Q-007`

### Estimación
**XS**

---

## #Q-018 — Sin tratamiento de estados vacíos en el índice de journal

### Categoría
UX

### Severidad
Baja

### Impacto
UX

### Problema
Si se filtrara o si no hubiera artículos, `/writing/` no tiene estado vacío definido.

### Solución propuesta
Estados vacíos definidos y probados para el índice de artículos, el de casos y el de herramientas filtradas.

### Criterios de aceptación
- [ ] Estado vacío diseñado para las 3 listas
- [ ] Con salida útil, no solo un mensaje

### Dependencias
Ninguna

### Estimación
**S**

---

## #Q-019 ✅ Resuelto — La animación de dibujado del mapa se ejecuta aunque no esté en pantalla

### Categoría
Performance / UX

### Severidad

> ✅ **Resuelto 2026-08-01.** IntersectionObserver al 35%. Respeta prefers-reduced-motion.
Baja

### Impacto
Performance · UX

### Página afectada
`/map/`

### Problema
La animación de la ruta arranca al cargar la página, con un retardo fijo de 0.25s. Si el usuario no ha llegado aún al diagrama, se la pierde por completo.

### Solución propuesta
Disparar la animación con `IntersectionObserver` cuando el diagrama entre en viewport. Es la diferencia entre una animación que se ve y una que se ejecuta.

### Criterios de aceptación
- [ ] La animación arranca al entrar en pantalla
- [ ] Se ejecuta una sola vez
- [ ] Respeta `prefers-reduced-motion`

### Dependencias
Ninguna

### Estimación
**XS**

---

# ROADMAP

## Fase 1 — Bloqueantes de lanzamiento

> Sin esto, el sitio no debe publicarse.

| Ticket | Título | Est. |
|---|---|---|
| #Q-092 | Poner el proyecto bajo control de versiones | XS |
| #Q-001 | El formulario de brief no envía nada | M |
| #Q-002 | Imagen Open Graph inexistente | M |
| #Q-003 | Sin favicon | S |
| #Q-004 | Sin robots.txt | XS |
| #Q-005 | Sin página 404 | S |
| #Q-006 | Google Fonts: RGPD y rendimiento | M |
| #Q-062 | Contenido inventado publicado como propio | M |
| #Q-060 | Frase incompleta en la home | XS |
| #Q-015 | TODO visible en `/now/` | XS |
| #Q-104 | Sin aviso legal (LSSI-CE) | S |
| #Q-044 | `/case-studies/` vacía en el menú principal | L |
| #Q-084 | Contraste insuficiente en textos secundarios | S |
| #Q-024 | Foco visible casi invisible | S |

**Estimación agregada: ~3 semanas**

---

## Fase 2 — Prioridad alta

| Ticket | Título | Est. |
|---|---|---|
| #Q-097 | Cero prueba social | M |
| #Q-007 | Cero analítica | M |
| #Q-013 | Ninguna imagen real | M |
| #Q-101 | Sin cabeceras de seguridad | S |
| #Q-102 | Formularios sin antispam | S |
| #Q-091 | Sin CI/CD | M |
| #Q-090 | Cero tests | L |
| #Q-047 | Menú móvil sin focus trap | S |
| #Q-083 | Preguntas no anunciadas a lectores de pantalla | M |
| #Q-041 | Newsletter saca del sitio | M |
| #Q-059 | La home no explica qué vende | S |
| #Q-055 | Ruptura de tono en `/writing/` | XS |
| #Q-056 | Sin cara humana | S |
| #Q-066 | Sin enlazado interno contextual | L |
| #Q-051 | Áreas táctiles insuficientes | S |

---

## Fase 3 — Optimización

| Ticket | Título | Est. |
|---|---|---|
| #Q-042 | Resultados no compartibles | M |
| #Q-043 | Botón atrás roto en los checks | S |
| #Q-046 | Ensayos sin navegación ni relacionados | M |
| #Q-063 | Artículos delgados sin reescribir | XL |
| #Q-069 | Sin investigación de keywords | L |
| #Q-071 | Taxonomía vacía | M |
| #Q-073 | Diagnósticos invisibles para LLMs | L |
| #Q-064 | Sin `llms.txt` | S |
| #Q-077 | Bundle de checks sobredimensionado | S |
| #Q-020 | Densidad visual insuficiente | L |
| #Q-050 | Mapa oculto en móvil | M |
| #Q-052 | Shell fijo en pantallas grandes | M |
| #Q-082 | Sin auditoría de accesibilidad | L |

---

## Fase 4 — Excelencia

| Ticket | Título | Est. |
|---|---|---|
| #Q-026 | Modo oscuro | L |
| #Q-034 | Documentación del design system | L |
| #Q-093 | Contenido a colecciones | L |
| #Q-094 | Motor de cuestionario unificado | L |
| #Q-108 | CMS visual | M |
| #Q-074 | Glosario de entidades | M |
| #Q-072 | Calendario editorial | M |
| #Q-023 | Escala de espaciado | M |
| #Q-037 | Componente Section | M |
| #Q-078 | Presupuesto de rendimiento en CI | M |

---

# TOP 25

| # | Ticket | Impacto |
|---|---|---|
| 1 | #Q-092 | Sin git no hay historial, ni rollback, ni copia. Riesgo puro. |
| 2 | #Q-001 | Cada lead cualificado se pierde en silencio. |
| 3 | #Q-097 | Sin prueba social, el sitio no puede vender servicios. |
| 4 | #Q-002 | Cada enlace compartido daña la marca. |
| 5 | #Q-062 | Contenido inventado destruye la propuesta de honestidad. |
| 6 | #Q-044 | "Work" vacía es lo primero que abre un recruiter. |
| 7 | #Q-007 | Sin datos, cada decisión posterior es a ciegas. |
| 8 | #Q-084 | Fallo de contraste en la mayoría del texto del sitio. |
| 9 | #Q-006 | Riesgo legal RGPD + el mayor freno de rendimiento. |
| 10 | #Q-013 | Sin imágenes, un sitio de diseñador no demuestra nada. |
| 11 | #Q-059 | El H1 más importante no dice qué se vende. |
| 12 | #Q-005 | Sin 404, el tráfico migrado cae en el vacío. |
| 13 | #Q-003 | Ausencia leída como "sitio sin terminar". |
| 14 | #Q-004 | Regresión respecto al WordPress actual. |
| 15 | #Q-090 | Dos regresiones ya ocurridas sin red de seguridad. |
| 16 | #Q-066 | Sin enlazado interno no hay autoridad temática. |
| 17 | #Q-056 | Un sitio personal sin cara no genera confianza. |
| 18 | #Q-091 | El guardián de URLs solo protege si se ejecuta. |
| 19 | #Q-104 | Obligación legal incumplida. |
| 20 | #Q-073 | El mejor contenido del sitio es invisible para LLMs. |
| 21 | #Q-041 | Suscripciones perdidas por salir del sitio. |
| 22 | #Q-063 | Contenido delgado penaliza a nivel de dominio. |
| 23 | #Q-020 | Sin ritmo visual, el scroll no se sostiene. |
| 24 | #Q-047 | Menú móvil inaccesible por teclado. |
| 25 | #Q-101 | Nota F pública en seguridad para quien vende criterio técnico. |

---

# DEUDA TÉCNICA

| Área | Deuda | Ticket |
|---|---|---|
| Contenido | 80 KB de contenido editorial en ficheros `.ts` | #Q-093 |
| Lógica | Motor de cuestionario duplicado | #Q-094 |
| CSS | Sin escala de espaciado; 20+ valores literales | #Q-023 |
| CSS | `quiz.css` con clases globales de 1-2 letras | #Q-036 |
| CSS | `.go` definido tres veces | #Q-032 |
| CSS | Dos sistemas de tarjeta coexistiendo | #Q-033 |
| Componentes | Patrón de sección repetido ~30 veces sin componente | #Q-037 |
| Código muerto | `CHAT`, `--shadow`, exportaciones huérfanas | #Q-095 |
| Infraestructura | Sin git, sin CI, sin tests | #Q-092, #Q-090, #Q-091 |
| Documentación | Sin README, sin ADRs, sin guía de marca | #Q-096, #Q-057 |
| Contrato | `URL_MAP` mantenido a mano | #Q-107 |
| Datos | `SOCIAL` con campos vacíos en producción | #Q-075 |

---

# RIESGOS ANTES DEL LANZAMIENTO

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | Pérdida total del proyecto por no tener git | Media | Crítico | #Q-092 |
| R2 | Leads perdidos silenciosamente | **Certeza** | Crítico | #Q-001 |
| R3 | Denuncia o requerimiento RGPD por Google Fonts | Baja | Alto | #Q-006 |
| R4 | Sanción LSSI por falta de aviso legal | Baja | Medio | #Q-104 |
| R5 | Descubrimiento de anécdotas inventadas | Media | Crítico | #Q-062 |
| R6 | Reclamación por accesibilidad (EAA) | Baja | Alto | #Q-082, #Q-084 |
| R7 | Caída de tráfico tras la migración | Media | Alto | `check-urls` + Search Console |
| R8 | Regresión no detectada en despliegue | **Alta** | Medio | #Q-090, #Q-091 |
| R9 | Imposibilidad de diagnosticar bajo rendimiento | Alta | Alto | #Q-007 |
| R10 | Contenido delgado penalizando el dominio | Media | Medio | #Q-063 |

---

# CHECKLIST GLOBAL

### Bloqueantes
- [ ] #Q-001 · [ ] #Q-002 · [ ] #Q-003 · [ ] #Q-004 · [ ] #Q-005 · [ ] #Q-006 · [ ] #Q-007

### Contenido y segunda pasada
- [ ] #Q-011 · [ ] #Q-012 · [ ] #Q-013 · [ ] #Q-014 · [ ] #Q-015 · [ ] #Q-016 · [ ] #Q-017 · [ ] #Q-018 · [ ] #Q-019

### Visual
- [ ] #Q-020 · [ ] #Q-021 · [ ] #Q-022 · [ ] #Q-023 · [ ] #Q-024 · [ ] #Q-025 · [ ] #Q-026 · [ ] #Q-027 · [ ] #Q-028 · [ ] #Q-029 · [ ] #Q-030 · [ ] #Q-031

### Design System
- [ ] #Q-032 · [ ] #Q-033 · [ ] #Q-034 · [ ] #Q-035 · [ ] #Q-036 · [ ] #Q-037 · [ ] #Q-038 · [ ] #Q-039

### UX
- [ ] #Q-040 · [ ] #Q-041 · [ ] #Q-042 · [ ] #Q-043 · [ ] #Q-044 · [ ] #Q-045 · [ ] #Q-046 · [ ] #Q-047 · [ ] #Q-048 · [ ] #Q-049

### Responsive
- [ ] #Q-050 · [ ] #Q-051 · [ ] #Q-052 · [ ] #Q-053 · [ ] #Q-054

### Branding
- [ ] #Q-055 · [ ] #Q-056 · [x] #Q-057 · [x] #Q-058

### Copywriting
- [ ] #Q-059 · [ ] #Q-060 · [ ] #Q-061 · [ ] #Q-062 · [ ] #Q-063

### SEO Técnico
- [ ] #Q-064 · [ ] #Q-065 · [ ] #Q-066 · [ ] #Q-067 · [ ] #Q-068

### SEO Contenidos
- [ ] #Q-069 · [ ] #Q-070 · [ ] #Q-071 · [ ] #Q-072

### GEO / LLM
- [ ] #Q-073 · [x] #Q-074 · [ ] #Q-075 · [ ] #Q-076

### Performance
- [ ] #Q-077 · [ ] #Q-078 · [ ] #Q-079 · [ ] #Q-080 · [ ] #Q-081

### Accesibilidad
- [ ] #Q-082 · [ ] #Q-083 · [ ] #Q-084 · [ ] #Q-085 · [ ] #Q-086 · [ ] #Q-087 · [ ] #Q-088 · [ ] #Q-089

### Calidad Técnica
- [ ] #Q-090 · [ ] #Q-091 · [ ] #Q-092 · [ ] #Q-093 · [ ] #Q-094 · [ ] #Q-095 · [ ] #Q-096

### CRO
- [ ] #Q-097 · [ ] #Q-098 · [ ] #Q-099 · [ ] #Q-100

### Seguridad
- [ ] #Q-101 · [ ] #Q-102 · [ ] #Q-103 · [ ] #Q-104

### Analítica
- [ ] #Q-105 · [ ] #Q-106

### Escalabilidad
- [ ] #Q-107 · [ ] #Q-108 · [ ] #Q-109 · [ ] #Q-110

---

# PROGRESO

| Métrica | Valor |
|---|---|
| Tickets totales | 78 |
| Cerrados | 37 |
| Abiertos | 41 |
| Reabiertos | 0 |
| **Progreso** | **47%** |

### Bloqueantes de lanzamiento

| Ticket | Estado |
|---|---|
| #Q-001 formulario | ✅ |
| #Q-002 Open Graph | ✅ |
| #Q-003 favicon | ✅ |
| #Q-004 robots.txt | ✅ |
| #Q-005 404 | ✅ |
| #Q-006 fuentes | ✅ |
| #Q-092 git | ✅ |
| #Q-104 aviso legal | ✅ (falta NIF si se da de alta) |
| #Q-007 analítica | ⚪ decisión pendiente |
| #Q-044 case studies | ⚪ contenido de Sergio |
| #Q-062 anécdotas | ⚪ **aceptado como decisión del propietario**, no corregido |

### Bugs encontrados escribiendo los tests

Ninguno de estos se detectó mirando el sitio:

1. El menú móvil no se cerraba nunca con `prefers-reduced-motion` — `transitionend` no dispara si la transición está desactivada.
2. El mismo menú se quedaba abierto 1 de cada 5 veces al cerrarlo antes de terminar la animación de apertura.
3. 48 de 100 tests no se ejecutaban: el perfil móvil usa WebKit y solo estaba instalado Chromium.
4. El test del reporte de errores solo podía pasar en Chromium.

---

# QUICK WINS

Alto impacto, esfuerzo mínimo. **Un día de trabajo, y el sitio sube de nota de forma perceptible.**

| Ticket | Acción | Est. |
|---|---|---|
| #Q-092 | `git init` + remoto | XS |
| #Q-004 | Crear `robots.txt` | XS |
| #Q-060 | Completar la frase rota de la home | XS |
| #Q-055 | Recuperar la voz en el hero de `/writing/` | XS |
| #Q-080 | Añadir `_headers` con caché | XS |
| #Q-085 | Subir contraste del placeholder oscuro | XS |
| #Q-068 | Cambiar prefetch a `hover` | XS |
| #Q-019 | Animar el mapa al entrar en viewport | XS |
| #Q-027 | Unificar el negro del sistema | XS |
| #Q-030 | Pausar la animación del anillo fuera de hover | XS |
| #Q-003 | Set de favicon | S |
| #Q-005 | Página 404 con personalidad | S |
| #Q-024 | Foco visible de doble anillo | S |
| #Q-084 | Oscurecer `--dim` a 4.5:1 | S |

---

# MEJORAS ESTRATÉGICAS

**1. Convertir el embudo en un embudo.**
Hoy termina en un formulario que no envía. Con `#Q-001` + `#Q-007` + `#Q-097` + `#Q-049` el sitio pasa de escaparate a máquina de captación medible.

**2. Publicar el conocimiento que hoy vive en JavaScript.**
Los ~24 diagnósticos son el mejor contenido del sitio y son invisibles para buscadores y LLMs. `#Q-073` los convierte en el activo orgánico principal.

**3. Cerrar el círculo mapa ↔ herramientas ↔ ensayos.**
Existen tres sistemas de contenido bien construidos que casi no se enlazan entre sí. `#Q-066` + `#Q-071` los convierte en una arquitectura temática coherente.

**4. Construir la red de seguridad antes de seguir construyendo.**
`#Q-092` + `#Q-090` + `#Q-091`. Ya se han producido dos regresiones no detectadas. La tercera llegará después del lanzamiento, cuando cueste más.

**5. Demostrar en lugar de afirmar.**
El sitio afirma competencia con mucha elegancia y no la demuestra en ningún sitio. `#Q-097` + `#Q-044` + `#Q-013` sustituyen afirmación por evidencia.

---

# MODO ITERATIVO

Este es el único documento de calidad del proyecto. En auditorías posteriores:

- Conservar todos los tickets con su identificador original
- Marcar los resueltos con **✅ Resuelto** + fecha + nota de validación
- Continuar la numeración desde **#Q-111**
- Reabrir con **🔁 Reabierto** + motivo si aparece una regresión
- Actualizar la tabla de progreso
- Revisar riesgos y recalcular la nota global

---

*Fin del documento — v1.0 · 2026-08-01*
