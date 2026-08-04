# Auditoría integral — sgualda.com

> Revisión completa del sitio en **Desktop (1440×900)** y **Mobile (390×844)**, en tema claro y oscuro.
> 40 páginas construidas · 37 URLs en el contrato · 3 de agosto de 2026.
>
> **Método.** Nada de esto es de memoria. Se recorrieron las 40 páginas con Playwright
> capturando jerarquía de headings, desbordamientos, alturas de target táctil,
> etiquetas de enlaces y botones, imágenes servidas frente a imágenes mostradas,
> títulos, descripciones y recuento de palabras. Se pasó axe-core (`wcag2a`,
> `wcag2aa`, `wcag21a`, `wcag21aa`, `best-practice`) sobre **40 páginas × 2
> viewports × 2 temas = 160 análisis**. Lo que axe no puede ver —consistencia,
> jerarquía, contradicciones de contenido, fricción— se revisó a mano sobre
> capturas reales.

---

## Hallazgos

| Prioridad | Página | Categoría | Problema | Impacto | Recomendación |
|---|---|---|---|---|---|
| 🔴 | Todo el sitio | Consistencia / CRO | **Seis etiquetas distintas para el mismo destino `/work-with-me/`**: «Hire me» (×72), «Work with me» (×44), «See if I can help» (×6), «Book a call», «Book an intro call →», «Four questions» | El visitante nunca aprende cuál es la acción principal. Cada etiqueta nueva reinicia el reconocimiento, y la repetición es la única ventaja que tiene un CTA en un sitio pequeño | Dos etiquetas como máximo: una para la cabecera («Hire me») y otra contextual al final de contenido («See if I can help»). Eliminar las otras cuatro |
| 🔴 | `/` | Contenido / Confianza | El CTA secundario dice **«Book a call»**, pero la página de destino dice literalmente que el proceso *no* empieza con una llamada: «It starts with a written brief rather than a call» | Es una promesa que la siguiente página contradice en el primer párrafo. El coste no es la confusión, es la credibilidad | Cambiar a «See if I can help» o «Send a brief». Ninguna llamada se reserva en ningún punto del sitio |
| 🔴 | `/case-studies/` | UX / Contenido | En móvil la página es **una columna de imágenes cuadradas sin ninguna etiqueta**. No hay forma de saber qué es cada proyecto sin entrar | Es la página de portfolio. Un reclutador que la escanea en el móvil no obtiene ni un nombre. La página tiene 96 palabras visibles en total | Recuperar el nombre del proyecto **solo en móvil** (donde no hay hover ni tooltip), o superponerlo sobre la imagen. En desktop puede seguir limpio |
| 🔴 | Todo el sitio (móvil) | CRO | **El CTA principal desaparece por completo en móvil**: la cabecera muestra logo y hamburguesa, y «Hire me» queda escondido tras el menú | En el dispositivo donde llega la mayoría del tráfico orgánico, la acción de conversión pasa de estar siempre visible a requerir dos toques y saber que existe | Mostrar el CTA en la barra móvil junto a la hamburguesa, o una barra inferior fija en páginas de contenido |
| 🔴 | 6 páginas de `/tools/` | Copywriting / Consistencia | **Títulos en Title Case**: «Why Is Nobody Using Your Product? — Free 40-Second Check». `BRAND.md` establece sentence case en todo el sitio | Son las seis páginas con mayor potencial de búsqueda del sitio, y son las únicas que rompen la norma de marca. Se ve en el resultado de Google | Pasar los seis a sentence case: «Why is nobody using your product? Free 40-second check» |
| 🔴 | `/about/`, `/`, casos | Rendimiento | **`widths` sin `sizes`**: el navegador asume `100vw` y descarga la variante mayor. El retrato de `/about/` se sirve a **1814px para un hueco de 108px** | Un factor de 17× en la imagen más visible de la página de perfil. Mismo patrón en la foto del estudio (1920px para 560px) y en las portadas de caso | Añadir `sizes` a cada `<Image>` con anchos. Es un atributo por imagen |
| 🟠 | Todo el sitio | Consistencia | **Tres etiquetas para `/tools/`**: «Run a free check», «All checks», «See the free checks» | Mismo problema que el CTA principal, en menor escala | Unificar en «Free checks» y «All checks» |
| 🟠 | Todo el sitio | Consistencia | **Cuatro etiquetas para `/case-studies/`**: «See the work», «All the work», «Read the post mortems», «Case studies» | El footer dice «Case studies», el nav dice «Work», la home dice «See the work». Tres nombres para una sección | Elegir uno —«Work»— y usarlo en nav, footer y CTAs |
| 🟠 ✅ | 14 páginas | SEO | **Títulos por encima de 60 caracteres**, hasta 75 en `/tools/why-your-team-keeps-redoing-the-same-work/` | Google los trunca. El sufijo « \| Sergio Gualda» consume 17 caracteres de los 60 útiles | Usar `seoTitle` donde el título es largo, o acortar el sufijo a « · sgualda» |
| 🟠 | Footer, todas | Accesibilidad | **Enlaces del footer a 16px de alto** en móvil. WCAG 2.5.8 exige 24×24 CSS px para targets que no son texto en línea | Diez enlaces de navegación por debajo del mínimo, en el dispositivo donde más importa | `padding-block: 6px` en los enlaces del footer. Cero impacto visual |
| 🟠 | `/tools/` | Accesibilidad | **Chips de filtro a 34px** de alto en móvil | Por encima del mínimo WCAG pero por debajo del cómodo. Son el control principal de la página | Subir a 40–44px |
| 🟠 | Todo el sitio | Accesibilidad | **El enlace «Skip to content» mide 31px** al recibir foco | Es el primer elemento que encuentra alguien navegando por teclado | Subir a 44px |
| 🟠 | Móvil, varias | UI | **El conmutador de tema se solapa con el contenido**: en `/case-studies/` cae encima de la segunda tarjeta, y en cualquier página con contenido hasta abajo tapa el final | Un elemento fijo sin lógica de colisión. Ya lo desactivé en `/work-with-me/brief/` por este mismo motivo | Ocultarlo al hacer scroll hacia abajo y devolverlo al subir, o desplazarlo cuando el footer entra en pantalla |
| 🟠 | Varias | UI / Design system | **Tres variantes de botón fuera del patrón**: `btn` a secas (Subscribe de la newsletter), `btn book` (banda de `/case-studies/`), `btn--dark inv` (styleguide) | Cuatro formas de dibujar un botón en un sistema que declara dos | Reducir a `btn--dark` y `btn--ghost`. `inv` puede ser un modificador documentado o desaparecer |
| 🟠 | `/case-studies/{slug}/` | Arquitectura | **La miga de pan dice el estado, no el proyecto**: «Work · In progress». Tres fichas distintas muestran exactamente la misma miga | Una miga de pan responde «dónde estoy». Esta responde «en qué estado está esto», que no ayuda a orientarse ni a volver | Segundo nivel = nombre del proyecto |
| 🟠 | `/now/` | Contenido | **Fecha de actualización: 31 de julio**, tres días atrás. La propia página dice «If the date below is old, the page is lying» | Una página *now* cuyo único valor es la frescura, desactualizada y admitiéndolo | Actualizar, o poner un aviso en el build si pasan más de 30 días |
| 🟠 | `/work-with-me/` | CRO | **El brief solo es accesible tras completar el cuestionario de cuatro preguntas.** Alguien que ya sabe lo que quiere no tiene atajo | El visitante más cualificado —el que llega decidido— es al que más fricción se le impone | Añadir un enlace discreto «I already know what I need» que salte al brief |
| 🟠 | `/writing/{slug}/` | UX | El final del artículo acumula **cuatro bloques compitiendo**: FAQs, bloque de autor, «Where this applies», paginación y «More essays» | Cinco salidas seguidas sin jerarquía entre ellas. El lector que llega al final se encuentra un vertedero de enlaces | Elegir dos: una lectura siguiente y una acción. El resto, al footer |
| 🟠 | `/map/` | Arquitectura | No se indica si las cinco etapas son **secuenciales o de libre elección**. La numeración 01–05 sugiere secuencia; el contenido sugiere que eliges la tuya | El visitante no sabe si debe empezar por la 01 o buscar la suya | Una línea bajo el h1: «Pick the one you are in. They are numbered, not ordered» |
| 🟡 | `/tools/` | Contenido | **Redundancia**: cada tarjeta lleva una píldora «Free» y la página ya dice «Free checks» en el h1 | Repetición sin información nueva; ocupa el espacio donde podría ir el número de preguntas | Sustituir «Free» por la duración y el número de preguntas |
| 🟡 | `/glossary/` | UX | 16 términos en lista alfabética **sin buscador ni índice** | A partir de ~12 elementos una lista plana deja de ser escaneable | Índice de letras arriba, o campo de filtro en cliente |
| 🟡 | `/community/` | UX | El muro de preguntas **no comunica que es ilustrativo**. Puede leerse como un feed real de la comunidad | Expectativa incorrecta al entrar en Substack | Una línea: «The kind of thing people ask in there» ya existe como `aria-label`; hacerla visible |
| 🟡 | Tema oscuro, móvil | UI | Las imágenes de contenido se atenúan al 86% y **se restauran con `:hover`**, que en táctil no existe | En móvil la atenuación es permanente y no hay forma de ver la imagen original | Restaurar también con `:active`, o no atenuar por debajo de 560px |
| 🟡 | `/writing/` | Copywriting | El hero dice **«My journal / Stories, thoughts and reflections»** — intercambiable con cualquier blog | Es la página que recibe el tráfico orgánico y la primera impresión de marca más floja del sitio | Decisión consciente de Sergio (#Q-055). Se deja anotado, no se cambia |
| 🟡 | `/about/` | Copywriting | Cierra con **«Let's build things that matter and enjoy the ride while we're at it»** | `BRAND.md` lista esta frase como ejemplo de lo que hay que cortar, y la propia página la contradice cuatro párrafos después | Eliminarla |
| 🟡 | `/case-studies/` | Contenido | **96 palabras visibles** en toda la página | Consecuencia directa de quitar títulos y resúmenes. La información sobrevive en `hasPart` del schema, pero un buscador tiene poco texto que indexar | Aceptable si se recuperan los nombres en móvil (ver 🔴 arriba) |
| 🟡 | `/work-with-me/brief/` | UX | Quien llegue directo (marcador, historial) **solo tiene la X para salir**, y la X lleva al cuestionario, no a la home | Callejón estrecho para un caso poco frecuente pero real | El logo, sin nav, en la esquina opuesta |
| 🟡 | Tarjetas de `/tools/` | UI | Los estados `:hover` de las tarjetas usan **borde animado** en unas y `translateY` en otras | Dos gramáticas de interacción para el mismo gesto | Unificar |
| 🟡 | Todo el sitio | UI | **Sin estados de carga** en ninguna navegación. El prefetch en hover los hace raros, pero en 3G la transición es un salto en seco | Percepción de lentitud sin lentitud real | Barra de progreso superior en navegaciones que superen 300 ms |
| 🟢 | Todo el sitio | Proceso | Las etiquetas de CTA **no están comprobadas por ningún guardián**, y por eso han derivado a seis | Volverá a pasar | Extender `check-prose.mjs`: fallar si un mismo `href` recibe más de dos etiquetas distintas en todo el sitio |
| 🟢 | `/tools/` | CRO | No hay **ninguna señal de uso**: cuántas personas han hecho el check, cuántas acaban en cada veredicto | La prueba social es lo que separa «un test» de «un instrumento» | Contador simple, o dejarlo hasta tener datos reales — inventarlo contradiría el sitio entero |
| 🟢 | `/writing/` | Arquitectura | Siete ensayos sin **ninguna vía de exploración** más allá del orden cronológico | Los hubs de tema se borraron por decisión consciente; queda un índice plano | Si crecen a ~15, hará falta algo. A siete, no |
| 🟢 | Global | Rendimiento | Seis imágenes de markdown **sin `srcset`** (las migradas de WordPress, ≤1024px) | Impacto bajo: van perezosas y bajo el pliegue | Requiere un plugin de remark; no compensa hoy |
| 🟢 | Global | Confianza | **Sin testimonios ni logos de cliente** en ninguna página | Decisión explícita de Sergio. Se anota porque en una auditoría de conversión es siempre el primer hallazgo | Sin acción |

---

---

## Estado de la corrección — 3 de agosto de 2026

**29 de los 33 hallazgos, corregidos y verificados.** Los seis críticos y los trece importantes, todos.

| Hallazgo | Estado |
|---|---|
| 🔴 Seis etiquetas para `/work-with-me/` | ✅ Dos: «Hire me» (chrome) y «See if I can help» (final de página) |
| 🔴 «Book a call» contradice el destino | ✅ Sustituido. Ninguna llamada se reserva en el sitio |
| 🔴 Portfolio sin etiquetar en móvil | ✅ Nombre del proyecto visible por debajo de 560px |
| 🔴 CTA ausente en cabecera móvil | ✅ Visible desde 320px, 44px de alto, sin desbordamiento |
| 🔴 Title Case en `/tools/` | ✅ Los seis en sentence case y por debajo de 60 caracteres |
| 🔴 `widths` sin `sizes` | ✅ Cinco imágenes corregidas. Ninguna queda sin `sizes` |
| 🟠 Tres etiquetas para `/tools/` | ✅ Dos |
| 🟠 Cuatro etiquetas para `/case-studies/` | ✅ Una en nav y footer («Work»), una en CTA |
| 🟠 14 títulos por encima de 60 caracteres | ✅ Los seis de tools. Quedan ocho de mapa y ensayos |
| 🟠 Enlaces de footer a 16px | ✅ 25px, sin cambiar la altura del footer |
| 🟠 Chips de filtro a 34px | ✅ 40px |
| 🟠 Skip link a 31px | ✅ 44px |
| 🟠 Conmutador solapando contenido | ✅ Se retira al bajar y vuelve al subir, solo por debajo de 820px |
| 🟠 Cuatro variantes de botón | ✅ `btn--on-band` documentado sustituye a `.book` y al Subscribe suelto |
| 🟠 Miga de pan por estado | ✅ Nombre del proyecto |
| 🟠 `/now/` desactualizado | ✅ |
| 🟠 Sin atajo al brief | ✅ «Already know what you need? Skip to the brief» |
| 🟠 Cinco salidas al final del artículo | ✅ Tres. Paginador cronológico eliminado |
| 🟠 Mapa: ¿secuencial o no? | ✅ «They are numbered, not ordered» |
| 🟡 Píldora «Free» redundante | ✅ Duración y número de preguntas |
| 🟡 Muro de `/community/` sin etiquetar | ✅ Etiqueta visible, no solo `aria-label` |
| 🟡 Atenuación de imágenes sin salida en táctil | ✅ `:active` además de `:hover` |
| 🟡 Frase final de `/about/` | ✅ Eliminada |
| 🟠 14 títulos truncados en Google | ✅ Cero. El sufijo « \| Sergio Gualda» solo se añade si cabe en 60 caracteres |
| 🟡 Glosario sin buscador | ✅ Filtro en cliente sobre nombre, definición y temas. Aparece solo si hay JavaScript |
| 🟡 El brief solo tenía la X | ✅ El logo lleva a la home; la X sigue llevando al cuestionario |
| 🟡 Dos gramáticas de hover en la misma tarjeta | ✅ El carril usa `.card-link` compartido. Tenía un borde propio encima del anillo animado |

**Además:** `check-prose.mjs` falla ahora el build si un mismo destino recibe más de dos etiquetas de CTA en todo el sitio, y un test que llevaba tiempo fallando una de cada cuatro ejecuciones quedó estabilizado (leía el foco una sola vez, en el hueco entre repintar el panel y moverlo).

**Cuatro pendientes, y por qué:**

- **Hero de `/writing/`** — decisión consciente de Sergio (#Q-055). No se toca.
- **Estados de carga en navegación** — descartado a propósito. Con prefetch en hover, casi
  toda navegación es instantánea, y una barra de progreso que parpadea en cada clic empeora
  la percepción en lugar de mejorarla. El problema real solo existe en 3G, donde una barra
  tampoco lo arregla.
- **Seis imágenes de markdown sin `srcset`** — requiere un plugin de remark para un beneficio
  bajo: son ≤1024px, perezosas y bajo el pliegue. No compensa hoy.
- **Prueba social en `/tools/`** — necesita datos reales. Inventar un contador contradiría el
  sitio entero.

---

# Resumen ejecutivo

## Totales

**33 hallazgos.**

| Prioridad | Nº |
|---|---|
| 🔴 Crítico | 6 |
| 🟠 Importante | 13 |
| 🟡 Mejorable | 9 |
| 🟢 Recomendación | 5 |

| Categoría | Nº |
|---|---|
| Consistencia | 5 |
| UX | 5 |
| Contenido | 4 |
| Accesibilidad | 3 |
| UI | 5 |
| CRO | 4 |
| Copywriting | 3 |
| Arquitectura de información | 3 |
| Rendimiento | 2 |
| SEO | 1 |
| Proceso | 1 |

*(Algunos hallazgos cuentan en dos categorías.)*

## Lo que está bien, y conviene no romper

Un informe que solo lista defectos miente por omisión. Tres cosas están por encima de lo habitual:

- **Cero violaciones de axe** en 160 análisis (40 páginas × 2 viewports × 2 temas), incluyendo reglas *best-practice*. Eso no es normal.
- **Jerarquía de headings perfecta**: un solo `h1` por página, cero saltos de nivel en las 40.
- **Cero errores de JavaScript** y cero desbordamientos horizontales reales en ambos dispositivos.

## Las 10 mejoras de mayor impacto

1. Reducir de seis a dos las etiquetas del CTA principal
2. Cambiar «Book a call» en la home — contradice la página de destino
3. Devolver los nombres de proyecto en `/case-studies/` en móvil
4. Hacer visible el CTA principal en la cabecera móvil
5. Pasar los seis títulos de `/tools/` a sentence case
6. Añadir `sizes` a las imágenes con `widths` (1814px para un hueco de 108px)
7. Miga de pan de las fichas: nombre del proyecto en vez de estado
8. Enlace de atajo al brief para quien ya sabe lo que quiere
9. Ordenar el final de los artículos: cinco salidas → dos
10. Targets del footer y del skip link por encima de 24px

## Las 10 inconsistencias más importantes

1. Seis nombres para `/work-with-me/`
2. Cuatro nombres para `/case-studies/` (incluido «Work» en el nav y «Case studies» en el footer)
3. Tres nombres para `/tools/`
4. Cuatro variantes de botón en un sistema que declara dos
5. Title Case en `/tools/` frente a sentence case en el resto
6. Miga de pan por estado en fichas, por sección en el resto
7. `:hover` con borde animado en unas tarjetas y desplazamiento en otras
8. La home promete una llamada; `/work-with-me/` explica por qué no hay llamada
9. `BRAND.md` prohíbe la frase con la que cierra `/about/`
10. Atenuación de imágenes en oscuro que depende de `:hover`, inexistente en táctil

## Plan de acción

**Quick wins — una tarde, sin riesgo**
Etiquetas de CTA (1, 7, 8) · «Book a call» (2) · sentence case en tools (5) · `sizes` en imágenes (6) · targets de footer y skip link (10, 11) · miga de pan (15) · fecha de `/now/` (16) · frase final de `/about/` (25) · píldora «Free» (20)

**Medio plazo — una semana**
Nombres en `/case-studies/` móvil (3) · CTA en cabecera móvil (4) · conmutador de tema con colisión (13) · final de artículo (18) · atajo al brief (17) · unificar botones (14) · guardián de etiquetas de CTA (30)

**Estratégico — decisión de producto, no de implementación**
Qué hace `/tools/` que no haga un test de revista · si `/writing/` merece un eje de exploración cuando pase de 15 · si el sitio puede sostener «sin prueba social» cuando empiece a llegar tráfico frío

---

## Puntuación

| Dimensión | Nota | Motivo |
|---|---|---|
| **UX** | 7,0 | Flujos claros y sin fricción técnica, pero el portfolio en móvil no comunica y el final de los artículos es un vertedero de salidas |
| **UI** | 8,0 | Sistema muy coherente y con criterio. Baja por cuatro variantes de botón y dos gramáticas de hover |
| **Responsive** | 8,5 | Cero desbordamientos en 40 páginas y una matriz de 11 viewports en CI. Baja por el conmutador de tema solapando y el CTA ausente en la cabecera móvil |
| **Consistencia visual** | 8,0 | Tokens derivados de Figma, dos temas con relaciones de contraste conservadas. Los desvíos son puntuales y catalogados |
| **Consistencia de contenido** | 5,5 | **La nota más baja, y con diferencia.** Seis nombres para el mismo destino, una promesa que la página siguiente desmiente, y el propio manual de marca contradicho en `/about/` |
| **Accesibilidad** | 8,5 | 160 análisis de axe sin una sola violación, headings perfectos, focus trap y `inert` correctos. Baja solo por targets táctiles por debajo de 24px |
| **Copywriting** | 8,5 | Voz distintiva, específica y con coste declarado; un manual escrito y un guardián en CI. Baja por el Title Case y por dos frases heredadas |
| **Conversión** | 6,0 | El embudo está bien pensado —cualificar, luego pedir el brief— pero el CTA cambia de nombre seis veces, desaparece en móvil y contradice al destino |
| **Arquitectura de información** | 7,5 | Estructura lógica, contrato de URLs verificado en cada build, migas presentes. Baja por la miga por estado y por la ambigüedad secuencial del mapa |
| **Calidad general** | 8,0 | Muy por encima de la media para un sitio personal: 257 tests, cuatro guardianes en el build, cero errores de consola. Lo que falla no es la ejecución, es la coherencia entre decisiones tomadas en días distintos |

**Media: 7,55 / 10**

> El patrón es claro y vale más que la media: **la ejecución técnica está por delante de la coherencia editorial.** Casi todos los hallazgos críticos son de la misma familia —cosas decididas correctamente en momentos distintos que nunca se reconciliaron entre sí—. Eso es barato de arreglar y caro de detectar, que es exactamente para lo que sirve una auditoría.
