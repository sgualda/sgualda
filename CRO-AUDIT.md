# Auditoría de conversión — modelo contactless

> El objetivo es convertir visitantes cualificados en solicitudes de contacto **asíncronas**.
> Sin llamadas, sin reuniones, sin calendarios, sin chat. El contacto lo inicia Sergio después.
> 3 de agosto de 2026.
>
> **Método.** Se recorrió el embudo completo con Playwright, contando interacciones
> reales desde la home hasta el envío, midiendo campos por paso, y extrayendo las
> salidas (`.btn`) del `<main>` de cada tipo de página para ver cuáles ofrecen la
> acción de conversión y cuáles no. Se buscó en las 37 páginas construidas toda
> mención a *call*, *meeting*, *book*, *schedule*, *calendar* y *session* para
> detectar restos del modelo síncrono. Se revisó el endpoint PHP y el correo de
> confirmación que realmente se envía.

---

## El embudo, medido

```
Home  →  «Hire me»  →  /work-with-me/  →  4 preguntas  →  veredicto
                                                            ↓
                                    /work-with-me/brief/?rec=…
                                                            ↓
                          step 0 (contexto)  →  5 pasos  →  Send
                                                            ↓
                                            /work-with-me/brief/sent/
```

**13 interacciones mínimas** desde la home hasta el envío. **9 campos** en el brief,
repartidos en 5 pasos (1 · 2 · 1 · 3 · 2). Un solo camino, sin bifurcaciones.

---

## Hallazgos

| Prioridad | Página / punto | Categoría | Problema | Impacto en conversión | Recomendación |
|---|---|---|---|---|---|
| 🔴 | `/case-studies/` | Contradicción con el modelo | Bajo el CTA sigue la letra pequeña **«First call is 20 minutes»** | Contradice frontalmente el modelo contactless en la página de portfolio, que es la que más visita un cliente potencial. El visitante que teme una llamada de ventas acaba de leer que hay una | Sustituir por **«A written reply within a day. No call.»** |
| 🔴 | `/about/` | Embudo | **Cero CTAs en toda la página.** No hay un solo botón | Es la página donde alguien decide si le caes bien, y termina en un callejón. Quien acaba de leer «what I'm good at… and what I'm not» está en el punto de máxima confianza del sitio, y no se le ofrece nada | Un bloque final: «Think we would work well together?» + «See if I can help» |
| 🔴 | `/writing/{slug}/` × 7 | Embudo | El final del ensayo ofrece **un `mailto:` y «More essays»**. Ninguna ruta a la conversión | Los ensayos son la principal puerta de entrada orgánica. Siete páginas de 1.000+ palabras que demuestran criterio y no proponen el siguiente paso. El `mailto:` además abre un cliente de correo, que en móvil es de las peores fricciones que existen | Mantener «Tell me why» y añadir «See if I can help». El `mailto:` como enlace de texto, no como botón principal |
| 🟠 | `/tools/{slug}/` | Embudo | La ruta a conversión **solo existe dentro del veredicto**, después de completar el check | Quien lee la página sin hacer el check —la mayoría— solo encuentra «All checks» al final. La página tiene FAQs, explica el problema y no propone nada | Un bloque de conversión al final de la página, independiente del veredicto |
| 🟠 | `/glossary/`, `/community/` | Embudo | Ninguna ruta a conversión | Dos páginas escritas para atraer tráfico frío que no conducen a ningún sitio | En el glosario ya encaja: «These are the decisions I get hired to help with» |
| 🟠 | Home | Fricción | **El atajo al brief solo existe en `/work-with-me/`**, y por debajo del panel | Quien llega decidido —el visitante más valioso— tiene que atravesar cuatro preguntas o encontrar una línea de letra pequeña. La fricción es máxima justo donde debería ser mínima | Enlace discreto bajo los CTAs de la home: «Already know what you need? Send a brief» |
| 🟠 | Brief, paso 4 | Formulario | **«A few specifics» pide 3 campos**, el paso más pesado, y llega en el momento de menor compromiso restante | Es el paso con más probabilidad de abandono: ya has invertido tres pasos y todavía te quedan dos. Ninguno de los tres es imprescindible para responder | Marcarlos como opcionales de forma explícita: «Optional — they make my reply more specific» |
| 🟠 | Brief | Confianza | **No se dice en ningún punto qué pasa con los datos** ni se enlaza la política de privacidad | Pedir email sin decir qué se hará con él es la objeción silenciosa más común en un formulario. `/privacy/` responde muy bien a esto y nadie que rellene el brief la verá | Una línea bajo el último paso: «Your email is used to reply to you and nothing else. [What I do with it]» |
| 🟠 | `/work-with-me/` | Objeciones | Las FAQs responden **qué incluye cada servicio**, pero no las objeciones de contactar: «¿me van a insistir?», «¿esto me compromete?», «¿y si no tengo presupuesto?» | Las objeciones del servicio se resuelven después de contactar. Las de contactar son las que impiden contactar | Tres FAQs nuevas: «What happens after I send a brief?», «Am I committing to anything?», «What if I am not ready to hire anyone?» |
| 🟡 | Verdicto del cualificador | Copy | El CTA dice **«Send a tailored brief»**. «Tailored» describe la mecánica interna, no el beneficio | Añade una palabra sin añadir motivo. El visitante no sabe qué significa que sea *tailored* | «Send a brief» a secas, o «Tell me what is stuck» |
| 🟡 | Brief, paso 0 | Fricción percibida | Dice «about three minutes» — honesto, pero **no dice que se puede abandonar y que nada se envía hasta el final** | «Tres minutos» suena a compromiso. La tranquilidad de poder salir es lo que reduce el coste percibido de empezar | «Nothing is sent until the last step, and you can close this at any point» |
| 🟡 | `/work-with-me/brief/sent/` | Post-conversión | Dice «within a day» pero **no dice desde cuándo**, ni qué hacer si no llega | La promesa es buena; le falta el borde. Sin fecha concreta, «un día» es elástico | «Within a day — so by [fecha]. If nothing arrives, check spam or reply to the confirmation» |
| 🟡 | Correo de confirmación | Post-conversión | Repite lo que ya dice la página de éxito y **no incluye copia de lo enviado** | Es la única prueba que le queda al visitante de lo que escribió, y no la tiene. Devolver el brief crea confianza y da algo a lo que responder | Incluir el resumen del brief en el correo |
| 🟡 | Brief | Fricción | **Sin autoguardado.** Cerrar la pestaña en el paso 4 pierde todo | Las respuestas ya sobreviven a ir atrás; no sobreviven a un cierre accidental o a una llamada entrante en el móvil | `sessionStorage` en cada cambio. Cero riesgo de privacidad: no sale del navegador |
| 🟡 | Global | Confianza | **Ninguna señal de volumen o de respuesta real**: cuántos briefs llegan, en cuánto se responde de verdad | «Within a day» es una promesa; «I have replied to 100% of them within a day» es una prueba. Sin datos no se puede afirmar | Cuando haya histórico. Inventarlo contradiría el sitio entero |
| 🟢 | Cualificador | Modelo | El veredicto «capacity» y «nope» **redirigen a `/tools/` y `/writing/`** en vez de al brief | Correcto y deliberado: decir que no es parte de la propuesta. Se anota para que no se «optimice» sin querer | Sin acción. No convertir a quien no encaja **es** la estrategia |
| 🟢 | Servicios | Modelo | Los servicios incluyen sesiones de 90 minutos y llamadas de seguimiento | **No es una violación del modelo.** La restricción es sobre el mecanismo de conversión, no sobre la entrega. Ninguna llamada ocurre antes del brief | Sin acción |

---

---

## Estado de la corrección — 3 de agosto de 2026

**14 de las 15 incidencias accionables, corregidas y verificadas.** Las tres críticas y las seis altas, todas.

| Incidencia | Estado |
|---|---|
| 🔴 «First call is 20 minutes» en `/case-studies/` | ✅ «A written reply within a day. No call.» |
| 🔴 `/about/` sin ningún CTA | ✅ «Think we would work well together?» |
| 🔴 Ensayos sin ruta a conversión | ✅ Los siete. El `mailto:` baja a enlace de texto |
| 🟠 Checks sin ruta fuera del veredicto | ✅ Bloque al final de las seis páginas |
| 🟠 Glosario y comunidad sin ruta | ✅ Ambos |
| 🟠 Atajo al brief solo en `/work-with-me/` | ✅ También en la home, bajo los CTAs |
| 🟠 Paso 4 con tres campos obligatorios en apariencia | ✅ «All optional. Skipping them costs you nothing» |
| 🟠 Sin línea de privacidad donde se pide el email | ✅ Con enlace a `/privacy/` |
| 🟠 Sin FAQs sobre las objeciones de contactar | ✅ Tres: qué pasa después, si compromete a algo, y si aún no estás listo |
| 🟡 «Send a tailored brief» | ✅ «Send a brief» |
| 🟡 Step 0 sin decir que se puede abandonar | ✅ «Nothing is sent until the last step» |
| 🟡 Página de éxito sin fecha concreta | ✅ Día y hora en la zona horaria del lector, más qué hacer si no llega |
| 🟡 Correo de confirmación sin copia del brief | ✅ Incluida, y dice explícitamente que no hay nada que agendar |
| 🟡 Sin autoguardado | ✅ `sessionStorage`, muere con la pestaña |
| 🟡 Sin datos de volumen ni de respuesta real | ⏸ Necesita histórico. Inventarlo contradiría el sitio |

**Un fallo que apareció al hacerlo:** el `FAQPage` de `/work-with-me/` estaba **vacío**.
La regex que genera el schema desde el HTML buscaba `<span class="pm">` y el marcado
lleva `<span class="pm" aria-hidden="true">`, así que las diez preguntas de la página
no llegaban al schema. Ahora son trece.

**Diez tests nuevos** fijan el embudo: que las siete puertas de entrada ofrecen ruta al
brief, que ninguna página promete una llamada, que el borrador sobrevive a una recarga,
y que la página de éxito se compromete a una fecha.

---

# Resumen ejecutivo

## Totales

**17 incidencias.** 3 críticas, 6 altas, 6 medias, 2 confirmaciones de que algo está bien.

| Categoría | Nº |
|---|---|
| Embudo / rutas ausentes | 5 |
| Fricción | 4 |
| Confianza y post-conversión | 4 |
| Contradicción con el modelo | 1 |
| Objeciones | 1 |
| Copy | 1 |
| Confirmaciones (sin acción) | 2 |

## El diagnóstico en una frase

**El embudo está bien diseñado y mal conectado.** El camino existente —cualificar,
luego pedir el brief— es exactamente el correcto para un modelo asíncrono, y el
formulario es más ligero de lo habitual. El problema es que **cinco de los siete
tipos de página no conducen a él**: los ensayos, `/about/`, el glosario, la
comunidad y las páginas de check antes de completarlo. Son precisamente las
páginas que reciben tráfico frío.

Dicho de otro modo: el sitio convence muy bien y remata muy poco.

## Lo que ya está bien y no conviene tocar

- **El modelo asíncrono está bien ejecutado.** «It starts with a written brief rather than a call, because a brief takes you three minutes and a call takes us both an hour» es la mejor frase del sitio sobre esto.
- **Nueve campos en cinco pasos** es ligero. Un formulario de contacto de consultoría típico pide más.
- **Las respuestas sobreviven a ir atrás**, y cada paso se valida al salir de él, así que nadie llega al final para descubrir un error de tres pasos antes.
- **Se promete «within a day» en cinco sitios distintos**, incluida la gente a la que se rechaza.
- **Decir que no está integrado en el producto.** Dos de los siete veredictos no llevan al brief a propósito. Eso es lo que hace creíble al resto.
- **El correo de confirmación existe y se envía de verdad**, y su fallo no se le comunica al remitente como si el brief se hubiera perdido.

## Las 10 mejoras de mayor impacto

1. Quitar «First call is 20 minutes» de `/case-studies/` — contradice el modelo entero
2. Bloque de conversión al final de los siete ensayos
3. Bloque de conversión al final de `/about/`
4. Bloque de conversión en las páginas de check, fuera del veredicto
5. Atajo «Already know what you need?» en la home
6. Tres FAQs sobre las objeciones de *contactar*, no de contratar
7. Marcar como opcionales los tres campos del paso 4
8. Línea de privacidad en el último paso del brief
9. Fecha concreta en la página de éxito, y qué hacer si no llega nada
10. Copia del brief en el correo de confirmación

## Quick wins — menos de una hora

1, 5, 7, 8, 9, 10, y el cambio de «Send a tailored brief» a «Send a brief»

## Corto plazo

2, 3, 4, 6 · autoguardado en `sessionStorage` · la línea de «nothing is sent until the last step»

## Estratégico

Cuando haya histórico, sustituir las promesas por datos: «he respondido al 100% en menos de 24 h» convierte mucho mejor que «within a day», y solo se puede decir cuando es verdad.

---

## Puntuación

| Dimensión | Nota | Motivo |
|---|---|---|
| **Coherencia con el modelo contactless** | 8,5 | Ninguna llamada es requisito en ningún punto, y el sitio argumenta por qué. Baja solo por «First call is 20 minutes» en `/case-studies/` |
| **Claridad del siguiente paso** | 6,0 | Evidente en la home, el mapa y las fichas. Inexistente en los ensayos, `/about/`, el glosario y la comunidad |
| **Fricción del formulario** | 8,0 | 9 campos en 5 pasos, con estado que sobrevive a ir atrás y validación en el paso correcto. Baja por el paso 4 y por la ausencia de autoguardado |
| **Manejo de objeciones** | 7,0 | «Do not hire me if…» es excelente y resuelve las objeciones de contratar. No hay ninguna que resuelva las de contactar |
| **Confianza antes de convertir** | 7,5 | Proyectos fallidos publicados, precios explicados sin publicarse, y un rechazo declarado de un tercio. Falta la línea de privacidad justo donde se pide el email |
| **Experiencia post-conversión** | 7,5 | Confeti, página propia, promesa clara y correo real. Falta fecha concreta, copia de lo enviado y qué hacer si no llega |
| **Esfuerzo percibido** | 7,0 | «Three minutes» es honesto pero suena a compromiso, y no se dice que se pueda abandonar sin enviar nada |
| **Ausencia de presión comercial** | 9,5 | Lo mejor del sitio con diferencia. Rechaza clientes por escrito, no publica precios para no presionar y redirige a contenido gratuito a quien no encaja |
| **Cualificación del visitante** | 8,5 | Cuatro preguntas que enrutan a cinco veredictos distintos, dos de los cuales no llevan al brief. Muy pocos sitios se atreven |
| **Conversión global** | 7,0 | Todo lo difícil está resuelto —el modelo, el tono, el formulario, la honestidad— y falta lo fácil: poner el enlace donde la gente termina de leer |

**Media: 7,65 / 10**

> Es un embudo con la parte difícil hecha. Convencer a alguien de que contactar
> no le va a costar una llamada de ventas es el problema caro, y está resuelto
> con argumentos y no con adjetivos. Lo que falta es mecánico: **cinco tipos de
> página terminan sin ofrecer nada**, y son las que reciben a los desconocidos.
> Ninguna de las diez mejoras principales requiere rediseñar nada.
