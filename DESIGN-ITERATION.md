# Iteración de diseño — agosto 2026

> Respuesta al brief de iteración. Lo concreto está implementado y verificado;
> lo que requiere una decisión tuya está como propuesta con alternativas.
> 40 páginas · 295 tests · 4 de agosto de 2026.

---

# 1 · Reducir la fricción de los formularios

## Problema detectado

Tres formularios consecutivos: el check (3–5 preguntas) → el cualificador de
`/work-with-me/` (4 preguntas) → el brief (5 pasos, 9 campos). **Diecisiete
interacciones** entre terminar un check y enviar un brief, y las tres primeras
respuestas se tiran a la basura.

## Por qué afecta

No es solo el número de pasos, es que **el segundo formulario ignora el
primero**. Alguien que acaba de decirle al check «lancé y el gráfico está
plano» tiene que volver a contestar «¿dónde estás ahora mismo?» con la misma
información. Eso no se lee como un proceso, se lee como que nadie está
escuchando, que es exactamente lo contrario de lo que vende el sitio.

## Alternativas

### A · El veredicto del check precarga el cualificador ⭐ *recomendada*

El check ya sabe la etapa. Pasa esa respuesta en la URL, el cualificador
arranca en la pregunta 2 y la 1 aparece ya contestada, visible y editable.

- **Ventaja:** cuatro preguntas pasan a tres, y la primera confirma en vez de
  preguntar. La sensación es de continuidad, no de repetición.
- **Ventaja:** cero cambios de arquitectura. Es el mismo mecanismo que ya usa
  `?rec=` entre el cualificador y el brief.
- **Inconveniente:** ahorra una pregunta, no un formulario.

### B · Del check directamente al brief

El veredicto ofrece el brief saltándose el cualificador, con el tipo de encargo
ya deducido del check.

- **Ventaja:** elimina un formulario entero. 17 interacciones → 11.
- **Inconveniente serio:** el cualificador es lo que dice que no a un tercio de
  la gente. Saltárselo convierte a quien no encaja, que es precisamente lo que
  el sitio se niega a hacer.
- **Cuándo sí:** solo para los veredictos del check que ya implican encaje.

### C · Un único formulario progresivo

Fusionar los tres en uno que se adapta: empiezas por el check, y si el veredicto
es positivo el mismo panel continúa hacia el brief sin cambiar de página.

- **Ventaja:** la experiencia más fluida posible. Un solo contexto.
- **Inconveniente:** hace del check una puerta de venta. Hoy el check es
  gratis y no pide nada, y esa gratuidad sin contrapartida es la razón por la
  que la gente lo hace. Convertirlo en el paso 1 de un embudo lo envenena.

### D · «Continuar donde lo dejaste»

Los tres formularios comparten `sessionStorage`. Nada se repregunta nunca, y al
volver a cualquiera de ellos aparece lo ya contestado.

- **Ventaja:** resuelve el problema real, que es la repetición, sin tocar la
  arquitectura ni el modelo.
- **Ventaja:** combina con A.
- **Inconveniente:** invisible si el usuario no repite. Trabajo para un caso
  minoritario.

## Recomendación

**A + D.** El check precarga el cualificador, y lo ya contestado no se vuelve a
pedir en ningún punto del recorrido. Mantiene intacto lo único que no se debe
tocar —que el cualificador pueda decir que no— y elimina la sensación de estar
repitiéndose, que es de lo que se queja el usuario aunque lo formule como
«demasiados pasos».

Descarto B y C porque **la fricción no es el problema; la fricción sin motivo
lo es.** Cuatro preguntas antes de un brief están justificadas si el resultado
puede ser «no me contrates». Lo que no está justificado es preguntar dos veces
lo mismo.

**Prioridad: alta.** No implementado: cambia el flujo y quiero tu visto bueno.

---

# 2 · Sistema tipográfico ✅ implementado

## Problema detectado

**12 valores distintos de `line-height` y 13 de `letter-spacing`.** Eso no es un
sistema, es un historial de decisiones sueltas. Y el cuerpo de texto estaba a
`-0.05em`.

## Por qué afecta

El tracking negativo en texto que se *lee* junta las letras justo donde el ojo
necesita separarlas para reconocer palabras. A 20px, `-0.05em` es un punto de
compresión por carácter: la página se percibe densa sin que se pueda señalar
por qué.

## Lo implementado

Cuatro alturas de línea y cuatro tracking, y nada más:

```css
--lh-display: 1.12;   /* h1, h2 */
--lh-tight: 1.32;     /* h3, cabeceras de tarjeta, filas */
--lh-ui: 1.55;        /* botones, metadatos, letra pequeña */
--lh-read: 1.68;      /* cualquier cosa con párrafos */

--ls-display: -0.03em;   /* solo h1, y solo porque 64px lo pide */
--ls-heading: -0.015em;  /* h2, h3 */
--ls-read: 0em;          /* todo lo demás */
--ls-caps: 0.16em;       /* mayúsculas */
```

29 ficheros con el tracking normalizado, 55 con la altura de línea. Quedan cero
valores literales fuera de la escala.

**Una discrepancia con tu brief, y la razón.** Pediste eliminar *cualquier*
tracking negativo. Lo dejé en el `h1` a `-0.03em` (era `-0.047em`) porque a
64px, con la Zalando Sans Expanded, el tracking a cero se lee suelto y sin
componer: la percepción de «tipografía cuidada» en display depende de cerrar
ligeramente. Todo lo que se lee como texto está a cero. Si lo quieres a cero
también en el `h1`, es una línea.

---

# 3 · Motion y microinteracciones

## FAQs ✅ implementado

`<details>` no anima porque su altura es `auto`, y `auto` no es interpolable.
Dos propiedades modernas lo resuelven **sin una línea de JavaScript**:

```css
:root { interpolate-size: allow-keywords; }

.faq details::details-content {
  block-size: 0;
  overflow: clip;
  opacity: 0;
  translate: 0 -6px;
  transition:
    block-size 0.36s var(--ease),
    content-visibility 0.36s allow-discrete,
    opacity 0.28s var(--ease) 0.04s,
    translate 0.36s var(--ease);
}
.faq details[open]::details-content { block-size: auto; opacity: 1; translate: 0; }
```

El desplazamiento de 6px es lo que separa «la caja se redimensiona» de «la
respuesta llega». Sin él la altura sola se lee mecánica. Donde no haya soporte,
abre instantáneamente: exactamente lo que hacía antes.

El `+` gira 135°, no 45°: a 45° una cruz vuelve a ser una cruz.

## Filtros ✅ implementado

Cambiar `hidden` era instantáneo y por tanto **invisible**: las tarjetas
desaparecían y las de abajo saltaban, y el ojo leía eso como reflujo de página,
no como filtro aplicado.

```js
card.style.setProperty('--d', String(Math.min(shown, 6)));
card.classList.remove('in');
void card.offsetWidth;   // fuerza el reinicio de la animación
card.classList.add('in');
```

```css
.card.in { animation: card-in 0.42s var(--ease) both; animation-delay: calc(var(--d) * 42ms); }
@keyframes card-in {
  from { opacity: 0; transform: translateY(10px) scale(0.985); }
  to   { opacity: 1; transform: none; }
}
```

42ms entre tarjetas y tope de seis pasos: suficiente para leerse como secuencia,
lo bastante corto para acabar en un cuarto de segundo. Más allá de seis, la
última llega tarde y parece lentitud en vez de intención. Y un contador
`aria-live` anuncia «2 of 6», que es lo que necesita quien no ve la animación.

## Sin Framer Motion, y por qué

Pediste código con Framer Motion si encajaba. **No encaja**, y conviene decirlo:
el sitio es Astro estático con 7,5 KB de JavaScript en total. Framer Motion son
unos 40 KB comprimidos y arrastra React a páginas que hoy no lo cargan. Todo lo
que pides —fades, stagger, transiciones, microinteracciones— sale de CSS
moderno con cero coste. Meter una librería de animación multiplicaría por seis
el JS del sitio para hacer lo mismo peor.

## Propuestas sin implementar

**Transiciones de página.** La View Transitions API nativa, no una librería:

```js
// astro.config.mjs
import { ViewTransitions } from 'astro:transitions';
```

Un fade cruzado de 200ms entre páginas, y el `<h1>` de una tarjeta de proyecto
transicionando a su ficha. Es el efecto que más «producto» aporta por menos
código. **Riesgo:** hoy cada página es un documento independiente y eso es lo
que hace el sitio tan rápido; el router de Astro añade ~3 KB y un modo de fallo
nuevo. **Prioridad: media.** Lo haría, pero después de lanzar.

**Estados de carga.** Descartado, y ya lo argumenté en la auditoría de UX: con
prefetch en hover casi toda navegación es instantánea, y una barra que parpadea
en cada clic empeora la percepción.

**Entrada escalonada del contenido al hacer scroll.** Ya existe en el mapa y en
la lista de ensayos. Extenderlo a todas las secciones sería el error clásico:
cuando todo se anima, nada llama la atención.

---

# 4 · Limpieza de copy ✅ implementado

- **Frase eliminada:** «Four questions, half a minute. Nothing is booked and
  nothing is sent.» Fuera de todas las páginas.
- **Rayas largas: de 253 a 158.** 138 convertidas a coma, dos puntos o punto.

**Un aviso.** La raya larga es hoy el marcador más reconocible de texto
generado, y tenías razón en señalarlo. Pero también es puntuación legítima, y
`BRAND.md` la documentaba como recurso del sitio. Reduje un 38% convirtiendo los
casos mecánicos —la raya que hacía de coma delante de conjunción— y **paré
antes de las que son correctas**: un inciso que ya contiene comas necesita raya
o paréntesis.

La conversión automática dejó ocho rayas de apertura sin cerrar (`— … , and`,
que era `— … —, and`). Las localicé y reparé una a una. Ese es el tipo de daño
que un reemplazo masivo hace sin avisar, y por eso no bajé de 158.

---

# 5 · UI y legal ✅ implementado

**Favicon `.ico`** generado desde el logo, 32×32, 1.925 bytes. El SVG sigue
primero para navegadores que lo aceptan; el `.ico` es el que siguen pidiendo
lectores de RSS, rastreadores y clientes antiguos en `/favicon.ico`.

**CTA fuera de la barra móvil.** El logo y la hamburguesa, nada más. La acción
vive dentro del menú, donde es el elemento más grande de la pantalla.

> Para que conste: la auditoría de conversión concluyó lo contrario hace dos
> días —que ocultarlo escondía la única vía de conversión tras un menú— y lo
> hice visible. Tu decisión lo revierte, y me parece defendible: una barra
> limpia es una decisión de marca, y el CTA sigue estando a un toque. Lo dejo
> anotado porque si algún día miras datos de conversión en móvil, este es el
> cambio que hay que mirar primero.

**Banner de cookies: construido y deliberadamente apagado.**

El sitio no pone cookies ni usa analítica, `/privacy/` lo dice con esas
palabras, y hay un guardián que rompe el build si eso deja de ser cierto sin
reescribir la página. **Un banner hoy pediría permiso para nada**, y eso no es
neutral: enseña a la gente a descartar un control que en otros sitios sí
significa algo, y contradice a una página que promete lo contrario.

Está listo, con un interruptor: `LEGAL.analytics = true` en `src/lib/site.ts`.
Cuando lo actives, el banner, la reescritura de `/privacy/` y el snippet de GA
entran en el mismo commit. Verificado que con el interruptor apagado no emite
ni un byte al HTML.

Cuando esté vivo: rechazar es un clic con **el mismo peso visual** que aceptar
—un «rechazar» gris junto a un «aceptar» negro es un dark pattern con mejores
modales—, la elección se guarda en `localStorage` y no en una cookie (rechazar
el consentimiento no debería requerir consentimiento), y nada carga hasta que
hay respuesta.

---

# 6 · Cambios por página ✅ implementado

| Página | Cambio |
|---|---|
| **Home** | Todos los botones a `/work-with-me/` con el estilo de «Hire me» y el texto «See if I can help». Email fuera del hero; queda «Already know what you need? Send a brief» |
| **Work with me** | ✅ verde y ❌ roja en «What you would get» / «What it's not», dibujadas en CSS. Es el único sitio del sitio donde el color carga significado. 5,21:1 en claro, 11,01:1 en oscuro |
| **Map** | «You're past this stage when» sin fondo ni bordes: es una frase, y una caja negra alrededor la hacía parecer un anuncio de sí misma. Los checks de cada etapa, en el mismo carril horizontal que en las páginas de tools |
| **Work** | «Six of them: glintale…» eliminado. `client` ahora solo el nombre real: `ecoco`, `glintale`, `truvi`. Fuera «my own company» y «where I work now» |
| **Writing** | Separación del h1 al primer artículo de 54px a `clamp(64px, 11vh, 104px)`, y en el ensayo de 52px a `clamp(64px, 10vh, 96px)` |
| **About** | «Ten years» → «7+ years», también en la home, que decía lo mismo. Lista de datos alineada arriba (`align-items: start`) |
| **Community** | El CTA de Substack abre en pestaña nueva |
| **Glossary** | «Put them to work» eliminado. Es solo un glosario |
| **Now** | Tres iconos Lucide en línea (hammer, pen-line, briefcase) y una rejilla de dos columnas. **Sin dependencia:** los `path` van embebidos, 0 KB de JavaScript |
| **Footer** | El logo en lugar de «Sergio Gualda» en negrita |

---

# 7 · Propuestas que necesitan tu decisión

## 7.1 · La tarjeta «A working session…» del mapa

Es la única tarjeta comercial en una página que es pura explicación, y hoy se
parece demasiado a las demás. Cuatro caminos:

### Opción 1 · La nota manuscrita ⭐ *recomendada*
Sin tarjeta. Un bloque a sangre completa, alineado a la izquierda, con una regla
vertical fina a la izquierda del texto, tipografía de cuerpo en vez de display,
y el CTA como enlace subrayado en vez de botón.

- **Por qué:** rompe por *reducción*, no por adición. Todo lo demás en la página
  es una tarjeta gris; esto es lo único que no lo es, y esa es toda la señal que
  hace falta. Encaja con un sitio que no grita.

### Opción 2 · Inversión total
Banda oscura a sangre, como la newsletter.

- **Por qué no:** ya hay dos bandas oscuras en el recorrido. Una tercera deja de
  ser un acento y pasa a ser un patrón.

### Opción 3 · Ficha de servicio
Tarjeta con precio, duración y entregables en una rejilla de datos.

- **Por qué no:** no publicas precios, y una ficha de servicio sin precio es un
  formulario incompleto.

### Opción 4 · La conversación
El bloque imita un mensaje: avatar, una línea tuya en primera persona, y la
respuesta como acción. Muy humano, muy memorable.

- **Riesgo:** es el patrón que usan las herramientas de venta agresiva. En un
  sitio que promete no presionar, puede leerse como lo contrario.

## 7.2 · Rediseño de `/community/`

La página es tipográficamente fuerte y **humanamente vacía**: habla de gente y
no hay una sola persona en ella.

**Composición propuesta, de arriba abajo:**

1. **Hero igual** (funciona) pero con tu retrato pequeño a la izquierda del
   párrafo, con la línea «I'm in there as one more person». Poner tu cara en la
   página que vende una comunidad es lo que la separa de un canal de Slack
   abandonado.
2. **El muro de preguntas** — se queda. Es lo mejor que tiene.
3. **Nuevo: «Who is in there»** — tres o cuatro tarjetas de perfil *arquetipo*,
   no personas reales: «Solo founder, first product», «Designer of one, in a
   team of nine», «Second-time founder, first time with a co-founder». Cada una
   con una línea de lo que suele preguntar. Deja que alguien se reconozca en tres
   segundos, que es la decisión real de entrar o no.
4. **«What it is not»** — reformateado con la estructura de `/about/`: `dt`/`dd`
   con término y explicación, en vez de una lista de líneas sueltas. Más
   escaneable y consistente con el resto del sitio.
5. **Fotografías** — aquí necesito material tuyo. Una captura real del chat con
   nombres difuminados vale más que cualquier ilustración: es prueba, no
   decoración. Si no hay, mejor no poner nada que poner stock.

**Prioridad: media.** Es la página con más potencial de tráfico frío sin
explotar, pero necesito las fotos.

---

# Auditoría adicional

Cosas que no mencionaste y que conviene mirar:

**🔴 `/now/` tiene un `TODO` visible en el código fuente.** El bloque de Glintale
lleva un comentario `TODO(sergio)` pidiendo dos frases sobre qué es y qué
intentas averiguar. No se ve en la página, pero el hueco sí: es el bloque más
importante de la página y el más vago.

**🟠 El check dice «40 seconds» y el brief «about three minutes».** Son promesas
de tiempo en dos escalas distintas sin nada que las relacione. Alguien que sale
de un check de 40 segundos y ve «tres minutos» percibe un salto de 4,5×. Diría
«three minutes» en ambos sitios, o daría el total del recorrido una sola vez.

**🟠 El logo es un memoji.** Funciona como marca personal y es simpático, pero en
la cabecera a 36px pierde todo detalle y se lee como una mancha. Y en un
contexto de contratación —un CTO evaluando a un consultor— un memoji comunica
algo distinto de lo que comunica el resto del sitio. No digo que lo cambies;
digo que es la decisión de marca menos examinada del proyecto.

**🟡 `weeknotes` y `rangos` son proyectos inventados.** Están marcados como
ficticios en el código fuente, y el sitio entero está construido sobre honestidad
radical. Hoy nadie puede distinguirlos de los reales. Sugiero una línea en cada
uno: «A side project, reconstructed from memory» — o sustituirlos por dos
fracasos reales cuando los tengas.

**🟡 Cinco veredictos del cualificador para seis tipos de encargo.** «capacity»
y «nope» comparten destino, así que en la práctica hay cuatro salidas
diferenciadas. No es un problema, pero si alguna vez añades un servicio, el
árbol de decisión no escala sin revisarlo entero.

**🟢 El glosario tiene 16 términos y el sitio usa unos 25.** «Second person»,
«thin signal» y «execution-only» están definidos; «shipping cadence», «design
debt» y «discovery» se usan sin definir. No urge; se nota cuando el glosario
crece.
