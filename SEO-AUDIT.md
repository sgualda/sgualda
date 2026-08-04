# Auditoría SEO y LLMO — sgualda.com

> SEO técnico, on-page, semántico, arquitectura, enlazado interno, EEAT y
> optimización para motores de respuesta. 37 URLs indexables · 3 de agosto de 2026.
>
> **Método.** Se rastrearon las 37 páginas con Playwright extrayendo título,
> meta description, canonical, meta robots, Open Graph, Twitter Card, jerarquía
> completa de encabezados, tipos de schema, recuento de palabras, tablas, listas,
> bloques de FAQ, citas externas y **todos los enlaces internos con su anchor
> text**. Con eso se construyó el grafo de enlaces para medir profundidad de
> clic, enlaces entrantes contextuales y páginas huérfanas. Se revisaron
> `robots.txt`, `sitemap-0.xml`, `llms.txt`, `llms-full.txt` y las 24 reglas de
> redirección.
>
> Complementa a [`SEO.md`](./SEO.md), que es el mapa de keywords y no se repite aquí.

---

## Hallazgos

| Prioridad | Página | Categoría | Problema | Impacto SEO/LLM | Recomendación |
|---|---|---|---|---|---|
| 🔴 | `/work-with-me/brief/` | Técnico | **Está en el sitemap y a la vez lleva `noindex, nofollow`** | Dos señales contradictorias sobre la misma URL. El sitemap dice «indexa esto» y la etiqueta dice lo contrario; Google gasta rastreo en resolver la contradicción y puede desconfiar del sitemap entero | Excluirla del sitemap. El filtro ya excluye `/draft/` y `/styleguide/`; añadir las páginas con `noindex` |
| 🔴 | Sitemap | Técnico | **Cero de las 38 URLs llevan `lastmod`** | `lastmod` es de las pocas señales que le dicen a un rastreador qué ha cambiado desde su última visita. Sin él, un sitio de 37 páginas que se actualiza a menudo se rastrea como si fuera estático | Emitir `lastmod` desde `updated`/`published` de cada colección. Para páginas sin fecha, la del build |
| 🔴 | Global | LLMO / EEAT | **32 de 37 páginas no citan ninguna fuente externa** | Es la debilidad más grande de cara a motores de respuesta. Un LLM prefiere citar contenido que a su vez cita: la verificabilidad es lo que separa «una opinión» de «una fuente». Los ensayos afirman cifras («80% → 50%», «cuatro meses») sin nada que las sitúe | No inventar fuentes. Sí enlazar lo que ya se menciona: HEART, NPS, Savoia, Design Sprint, WCAG. Y marcar explícitamente qué cifras son experiencia propia — eso es citable como testimonio de primera mano |
| 🟠 | `/community/`, `/now/`, `/legal/` | Enlazado | **Cero enlaces contextuales entrantes.** Solo se alcanzan desde el footer | El footer transmite muy poco valor y sitúa a estas páginas en el nivel más bajo del grafo interno. `/community/` es la que más lo sufre: acaba de reescribirse para posicionar y nada apunta a ella | Enlazar `/community/` desde `/about/`, desde el final de los ensayos y desde `/writing/`. `/now/` desde `/about/`. `/legal/` puede quedarse en el footer |
| 🟠 | `/writing/heart-framework-vs-nps-user-experience/` | Enlazado | **Un solo enlace contextual entrante**, y `SEO.md` la señala como el activo más defendible del sitio | La página con mayor probabilidad de rankear es de las peor enlazadas internamente. El PageRank interno no llega donde más rendiría | Enlazarla desde `/map/nobody-came/`, desde el check de feedback y desde `/glossary/#thin-signal` |
| 🟠 | `/case-studies/weeknotes/`, `/rangos/` | Enlazado | **Un enlace entrante cada una** | Las dos fichas «enterradas» son el diferencial narrativo del portfolio —lo que nadie más publica— y son las más aisladas | Enlazarlas desde los ensayos que cuentan la misma historia: `learning-to-let-go-an-idea` habla literalmente del proyecto de weeknotes |
| 🟠 | Global | Semántico | **Ninguna página de caso tiene FAQ.** Diez páginas con más de 300 palabras no tienen bloque de preguntas: las 6 fichas, las 5 etapas y `/glossary/` | Las FAQs son el formato que más directamente alimenta *People Also Ask*, *AI Overviews* y las citas de LLM. Los ensayos y los checks ya lo tienen; las fichas y las etapas dejan ese formato sin usar | Tres preguntas por etapa del mapa («¿Cómo sé que estoy en esta etapa?», «¿Cuánto suele durar?», «¿Qué es lo primero que hay que hacer?»). Las fichas de caso pueden vivir sin ellas |
| 🟠 | `/map/*` | On-page | **Los cinco títulos comparten el patrón «Stage 0N: … — building a product»** | Cinco páginas compitiendo con la misma cola de título y sin una keyword propia. «Stage 03» no lo busca nadie | Reescribir en torno a la intención real: «Launched and nobody came: what to check first», «What to put in a first version» |
| 🟠 | `/glossary/` | On-page | **Un solo `h2` para 16 términos**; cada término es un `dt`, no un encabezado | La jerarquía impide que un buscador extraiga un término suelto como respuesta. `DefinedTerm` está bien puesto, pero el HTML no acompaña | Cada término como `h2` o `h3` dentro de su bloque, manteniendo `dl` para la semántica de definición |
| 🟠 | `/case-studies/` | Contenido | **96 palabras visibles.** La página de portfolio es una rejilla de imágenes | Un buscador tiene casi nada que indexar en la página que debería rankear para «product design case study». Los títulos sobreviven en `hasPart`, que es una señal más débil que el texto | Un párrafo de contexto por proyecto, o una sección de introducción con los nombres en texto |
| 🟠 | `/tools/*` vs `/map/*` | Canibalización | **`/map/worth-building/` y `/tools/is-this-feature-worth-building/` comparten «worth building»** en título y H1 | Dos URLs propias compitiendo por la misma consulta. `SEO.md` ya identificó el solapamiento entre `/map/nobody-came/` y su check | Diferenciar la intención en el título: la etapa es explicativa («what makes an idea worth building»), el check es diagnóstico («is *this* feature worth building») |
| 🟠 | Global | EEAT | **No hay página de autor ni `author` visible en los ensayos más allá del bloque de firma** | El `Person` con `sameAs` está bien construido, pero un lector —y un LLM— no encuentra en un solo sitio la trayectoria, los años de experiencia y la prueba | `/about/` puede hacer de página de autor si declara `ProfilePage` y enlaza explícitamente desde cada `BlogPosting` con un `author` visible |
| 🟡 | Sitemap | Técnico | **15 de 38 URLs llevan `priority`, 23 no** | Google ignora `priority` desde hace años, pero la inconsistencia sugiere un sitemap generado a medias | Quitarlo de todas, o ponerlo en todas. Preferible quitarlo |
| 🟡 | `/glossary/` | LLMO | **Sin FAQ y sin ninguna definición marcada como respuesta directa** | Un glosario es el formato más citable que existe y este no aprovecha el bloque de pregunta directa («What is a polite no?») | Añadir 4–5 preguntas del tipo «What does X mean in product design?» con `FAQPage` |
| 🟡 | Fichas de caso | Semántico | Usan `CreativeWork`, que es genérico | `CreativeWork` no dice a un buscador qué clase de cosa es. Existe `Article` con `about` apuntando a la entidad del producto | Cambiar a `Article` + `about: {'@type': 'SoftwareApplication', name}` para las que describen software |
| 🟡 | `/tools/*` | Semántico | `WebApplication` sin `applicationCategory`, sin `offers` ni `featureList` | El tipo es correcto pero está a medio rellenar; los campos que producen rich results están vacíos | Añadir `applicationCategory: 'BusinessApplication'`, `offers` con precio 0 y `isAccessibleForFree: true` |
| 🟡 | Ensayos | On-page | **Ningún ensayo enlaza a `/community/`** pese a tratar exactamente sus temas | Cluster temático incompleto: el contenido y el destino natural del lector no están conectados | Un enlace al final del bloque de firma |
| 🟡 | `/about/` | Cobertura | No responde preguntas que la gente escribe: «¿dónde está?», «¿con qué tipo de empresas trabaja?», «¿cuántos años lleva?» | Son consultas navegacionales de marca con intención comercial, y son las que un LLM necesita para presentar a alguien | Tres frases con datos concretos, no una FAQ |
| 🟡 | Global | Rendimiento | **No se han medido Core Web Vitals reales.** Lo medible en local: JS 7,5 KB, CSS 32 KB, HTML 36,8 KB, fuentes 120,8 KB, cero errores de consola | El presupuesto está muy por debajo de cualquier umbral, pero LCP e INP dependen de red y dispositivo real. Sin datos de campo es especulación | Verificar en Search Console (Core Web Vitals) tras el lanzamiento. El candidato a LCP es la primera imagen de cada plantilla; ya llevan `loading="eager"` donde toca |
| 🟡 | `/writing/` | On-page | El H1 «My journal» **no contiene ninguna keyword** y el subtítulo tampoco | Es la página hub del contenido y no declara de qué trata | Decisión consciente de Sergio (#Q-055). Se anota como coste aceptado |
| 🟢 | Global | Técnico | **`hreflang` ausente** | Correcto: el sitio es monolingüe en inglés | Solo aplicaría si se publica una versión en español |
| 🟢 | Global | Arquitectura | **Profundidad máxima: 2 clics desde la home.** Ninguna página a 3 o más | Estructura plana ideal para un sitio de este tamaño | Sin acción. Vigilar al pasar de ~60 páginas |
| 🟢 | Global | LLMO | `llms.txt` (1.838 palabras) y `llms-full.txt` (13.562) generados desde las colecciones | Muy por delante de lo habitual. Ninguno de los competidores directos lo tendrá | Mantenerlos sincronizados; ya se generan en el build |
| 🟢 | Global | Contenido | Solo **2 tablas comparativas** en todo el sitio, ambas en ensayos | Las tablas son el formato que más se extrae en AI Overviews para consultas de comparación | Una tabla en `/tools/` comparando los seis checks; una en `/map/` comparando las cinco etapas |

---

---

## Estado de la corrección — 3 de agosto de 2026

**21 de las 23 incidencias, corregidas y verificadas.** Las tres críticas y las nueve altas, todas.

| Incidencia | Estado |
|---|---|
| 🔴 `/brief/` en el sitemap con `noindex` | ✅ Fuera. 36 URLs, ninguna con `noindex` |
| 🔴 Cero `lastmod` | ✅ 36 de 36, con las fechas reales del contenido — no la del build |
| 🔴 Sin citas externas | ✅ Enlazadas las que ya se mencionaban (Savoia, Design Sprint, Figma) y declaradas como `citation` en el schema. **No se inventó ninguna fuente** |
| 🟠 `/community/` sin enlaces contextuales | ✅ De 0 a 15 páginas |
| 🟠 `heart-framework-vs-nps` con un solo enlace | ✅ Enlazado desde el ensayo de escalabilidad |
| 🟠 weeknotes y rangos aisladas | ✅ Enlazadas desde el ensayo que cuenta literalmente su historia |
| 🟠 Sin FAQs en las etapas del mapa | ✅ Tres por etapa, visibles y como `FAQPage`. De 15 a 21 páginas con FAQ |
| 🟠 Glosario: un `h2` para 16 términos | ✅ 16 `h3`, manteniendo el `dl` |
| 🟠 `/case-studies/` con 96 palabras | ✅ 126. Una línea en prosa con los seis proyectos, sin devolver los títulos a las tarjetas |
| 🟡 `priority` en 15 de 38 | ✅ Eliminado de todas |
| 🟡 Fichas con `CreativeWork` genérico | ✅ `Article` + `about: SoftwareApplication` + `datePublished` + `publisher` |
| 🟡 `WebApplication` a medias | ✅ `applicationCategory`, `operatingSystem`, `offers` a 0 € y `isAccessibleForFree` |
| 🟡 Ensayos sin enlace a `/community/` | ✅ Vía el bloque de cierre |
| 🟠 Cinco títulos clonados en `/map/` | ✅ Un `seoTitle` por etapa, escrito hacia la consulta real, los cinco por debajo de 60 caracteres |
| 🟠 Canibalización etapa ↔ check | ✅ La etapa explica, el check diagnostica: «How to know if an idea is worth building» frente a «Is this feature worth building?» |
| 🟠 Sin página de autor | ✅ `ProfilePage` en `/about/`, que es el tipo que Google documenta para esto. `AboutPage` describe una organización |
| 🟡 `/about/` no responde las preguntas básicas | ✅ Cinco hechos —dónde, cuánto tiempo, con quién, qué trabajo, idiomas— reunidos en un solo sitio. Todos ya estaban dispersos por la web |

**Un fallo que apareció por el camino:** el `FAQPage` de `/work-with-me/` estaba **vacío**
desde siempre. La regex que genera el schema desde el HTML buscaba `<span class="pm">` y el
marcado lleva `aria-hidden`, así que las diez preguntas de la página nunca llegaron al
schema. Ahora son trece.

**Siete tests nuevos** vigilan el sitemap (que no anuncie páginas `noindex`, que todas
lleven `lastmod`, que las fechas no sean todas la del build) y que las cinco etapas
respondan tres preguntas.

**Un tropiezo del que merece la pena dejar constancia.** Al reescribir los cinco títulos
del mapa creé una colisión nueva: la etapa 04 quedó llamándose exactamente igual que su
check («Why your team keeps redoing the same work»). Lo detecté al comparar las dos
familias, no al escribirlas. Ahora hay un test que verifica que **ningún título es igual
ni contiene a otro**, que es como dos páginas acaban en el mismo resultado repartiéndose
los clics.

**Dos pendientes, y por qué:**

- **FAQ en el glosario** — descartado a propósito. Los 16 términos ya *son* respuestas
  directas y ahora son encabezados; añadir preguntas encima duplicaría el mismo contenido
  en dos formatos dentro de la misma página, que es exactamente lo que no conviene.
- **Core Web Vitals** — no se pueden medir sin tráfico real. Verificar en Search Console
  tras el lanzamiento. Lo medible en local está muy por debajo de cualquier umbral.

---

# Resumen ejecutivo

## Totales

**23 incidencias.**

| Prioridad | Nº |
|---|---|
| 🔴 Crítico | 3 |
| 🟠 Alto | 9 |
| 🟡 Medio | 7 |
| 🟢 Bajo | 4 |

| Categoría | Nº |
|---|---|
| Enlazado interno | 4 |
| Técnico | 4 |
| Semántico / Schema | 4 |
| On-page | 4 |
| LLMO | 3 |
| Contenido / cobertura | 3 |
| EEAT | 1 |
| Canibalización | 1 |
| Arquitectura | 1 |
| Rendimiento | 1 |

## Lo que ya está por encima de la media

Conviene decirlo porque condiciona las prioridades:

- **Canonical en las 37 páginas**, `og:image` en las 37, `twitter:card` en las 37. Cero excepciones.
- **Schema en cada página**, con `Person` y `WebSite` globales y tipos específicos por plantilla: `FAQPage` en 15 páginas, `BreadcrumbList` en 17, `BlogPosting` en 7, `DefinedTermSet` en 2.
- **Cero anchors genéricos.** Ni un «click here», ni un «read more», ni un «learn more» en todo el sitio.
- **Cero cadenas de redirección** en 24 reglas.
- **`robots.txt` que permite explícitamente GPTBot, ClaudeBot, PerplexityBot y Google-Extended**, con el motivo escrito.
- **Profundidad máxima de 2 clics** y ninguna página inalcanzable.
- **Cero títulos truncados** y cero descripciones duplicadas.

## Las 20 mejoras de mayor impacto

1. Sacar `/work-with-me/brief/` del sitemap (contradice su propio `noindex`)
2. Emitir `lastmod` en el sitemap
3. Enlazar fuentes externas en lo que ya se menciona (HEART, NPS, Savoia, Design Sprint)
4. Enlazar `/community/` desde `/about/`, `/writing/` y el pie de los ensayos
5. Enlazar `heart-framework-vs-nps` desde las tres páginas que tratan su tema
6. FAQs en las cinco etapas del mapa
7. Reescribir los cinco títulos de `/map/` en torno a la intención real
8. Cada término del glosario como encabezado
9. Texto real en `/case-studies/`
10. Separar la intención entre `/map/worth-building/` y su check homónimo
11. `ProfilePage` en `/about/` y `author` visible en cada ensayo
12. Enlazar weeknotes y rangos desde los ensayos que cuentan su historia
13. FAQ en `/glossary/`
14. `Article` + `about` en las fichas de caso, en vez de `CreativeWork`
15. Completar `WebApplication` en los seis checks
16. Tabla comparativa en `/tools/` y en `/map/`
17. Datos concretos en `/about/` (dónde, con quién, cuánto tiempo)
18. Quitar `priority` del sitemap
19. Verificar Core Web Vitals en Search Console tras el lanzamiento
20. Search Console por DNS **antes** de migrar, para tener línea base

## Quick wins — menos de una hora cada uno

Sitemap: excluir `noindex`, añadir `lastmod`, quitar `priority` · glosario a encabezados · `applicationCategory` y `isAccessibleForFree` en los checks · `Article` en las fichas · enlaces a `/community/` · enlaces a `heart-framework-vs-nps` · enlaces a weeknotes y rangos

## Corto plazo — una o dos sesiones

FAQs de las etapas · títulos de `/map/` · texto en `/case-studies/` · fuentes externas en los ensayos · `ProfilePage` · tablas comparativas · FAQ del glosario

## Estratégico

Autoridad temática alrededor de «por qué no crece un producto», que es donde el sitio ya tiene los mejores activos · una decisión sobre si `/tools/` genera contenido único o solo lo empaqueta · Search Console y datos reales antes de seguir optimizando a ciegas

## Riesgos para el posicionamiento

**El riesgo real no es técnico.** La base está limpia; lo que puede frenar el crecimiento es:

1. **Sin datos.** No hay Search Console ni analítica, así que todo lo de arriba —incluido `SEO.md`— son hipótesis razonadas, no medidas. Es el riesgo más grande y el más barato de eliminar.
2. **Poca superficie.** 37 páginas y 7 ensayos es poco para construir autoridad temática. La calidad por página es alta; la cantidad no.
3. **Contradicción de señales en el sitemap.** Si Google encuentra una URL con `noindex` anunciada en el sitemap, es razonable que rastree el resto con menos confianza.
4. **Ausencia de citas.** Es el factor donde el sitio queda peor frente a motores de respuesta, y el único donde va por detrás de blogs claramente inferiores.
5. **Migración.** 24 redirecciones, ninguna cadena, contrato verificado en cada build. Bien preparado, pero es el momento de mayor riesgo del proyecto y conviene tener la línea base antes.

---

## Puntuación

| Dimensión | Nota | Motivo |
|---|---|---|
| **SEO Técnico** | 8,5 | Canonical, OG y Twitter en las 37; cero cadenas de redirección; robots explícito con bots de IA; contrato de URLs verificado en cada build. Baja por el sitemap: sin `lastmod`, con `priority` a medias y anunciando una URL `noindex` |
| **SEO On-Page** | 8,0 | Un `h1` por página, cero saltos de nivel, cero títulos truncados, cero descripciones duplicadas, cero anchors genéricos. Baja por los cinco títulos clonados de `/map/` y el H1 sin keyword de `/writing/` |
| **SEO Semántico** | 7,5 | Schema en todas las páginas y entidades propias definidas en `/glossary/` con `@id` estables. Baja porque `CreativeWork` y `WebApplication` están a medio rellenar y el glosario no usa encabezados |
| **Calidad del contenido** | 8,5 | Siete ensayos de 1.000+ palabras, cada uno con un incidente propio y una cifra. Es contenido que no se puede copiar, que es la definición de original. Baja solo por `/case-studies/` con 96 palabras |
| **Arquitectura** | 8,5 | Máximo 2 clics, ninguna huérfana real, migas en 17 páginas, URLs limpias y estables. Baja por el solapamiento mapa/checks |
| **Enlazado interno** | 6,5 | **La nota más baja.** Cero anchors genéricos y buena distribución en el núcleo, pero `/community/`, `/now/` y `/legal/` no tienen ni un enlace contextual, y la página más prometedora del sitio tiene uno |
| **EEAT** | 7,5 | Experiencia de primera mano en cada pieza, contacto, privacidad, aviso legal, `sameAs` con tres perfiles y proyectos fallidos publicados —que es prueba de honestidad difícil de fingir—. Baja por la ausencia de fuentes y de página de autor formal |
| **Cobertura temática** | 7,0 | El cluster «por qué no crece un producto» está bien cubierto desde tres ángulos: mapa, checks y ensayos. Baja porque faltan FAQs en 10 páginas largas y comparativas donde la consulta es comparativa |
| **Optimización para LLMs** | 8,5 | `llms.txt` y `llms-full.txt` generados desde las colecciones, FAQs en 15 páginas, glosario con `DefinedTerm` y `@id` estables, terminología consistente vigilada por un guardián en CI. Baja por la falta de citas verificables |
| **Preparación para AI Overviews** | 7,5 | 15 páginas con `FAQPage`, respuestas autocontenidas, fechas de actualización visibles. Baja por las dos únicas tablas del sitio y por las 10 páginas largas sin bloque de pregunta |
| **Potencial de crecimiento orgánico** | 8,0 | Consultas de problema con competencia floja, contenido irreplicable y una base técnica sin deuda. El techo lo pone la superficie —37 páginas— y la ausencia de datos, no la calidad |

**Media: 7,82 / 10**

> El patrón es el inverso del habitual: **la mayoría de los sitios tienen contenido decente sobre una base técnica rota; este tiene una base técnica casi impecable y le falta superficie y conexiones.** Nada de lo crítico requiere reescribir nada — son señales contradictorias en el sitemap, enlaces que no existen y citas que no se han puesto. Lo que de verdad limita el crecimiento no aparece en esta tabla: **no hay datos**, y hasta que Search Console lleve cuatro semanas recogiendo, todo lo de aquí arriba es criterio, no medición.
