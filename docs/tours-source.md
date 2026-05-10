# Tours — Source of truth

> Client-provided itineraries (delivered 2026-05-10). This file is the **source** for the four launch tours. The Sheets `Tours` tab, `MOCK_TOURS` in `lib/sheets/mock.ts`, and the per-tour MDX in `/content/tours/` all derive from here.
>
> When the client revises an itinerary, update this file in the same PR as the downstream changes. Anything ambiguous or unresolved gets flagged inline so we don't silently invent numbers.

---

## Locked launch list

| # | Slug | Title | Region | Days | Km | Ripio % | Difficulty | Max altitude (m) |
|---|---|---|---|---|---|---|---|---|
| 1 | `sobre-las-nubes` | Sobre las Nubes | Salta y Jujuy | 7 | 1712 | 50% | Intermedio | 4895 |
| 2 | `gigantes-del-oeste` | Gigantes del Oeste | Mendoza a La Rioja | 8 | 2400 | 30% | Intermedio | 4600 |
| 3 | `volcanes-del-norte` | Volcanes del Norte | Catamarca | 7 | n/a (TBD) | 50% | Intermedio + | 4550 |
| 4 | `cruces-del-sur` | Cruces del Sur | Carretera Austral y Patagonia | 7 | 2321 | 45% | Intermedio | 1300 |

> **Open questions for client:**
> - Pricing (`base_price_usd`) — pending. All four currently set to `0` and `published=false` until provided.
> - Total km for Volcanes del Norte — sum of day-tramos pending verification.
> - Hero image filenames — placeholder paths land at `/images/halftone/{slug}-hero.png` (Phase 10).
> - Departure dates per tour — pending. Calendar shows empty state until the client adds rows in Sheets.

---

## Brand claim block (shared)

These are the short claim/sello phrases the client wants surfaced as you scroll, not as a paragraph. Each tour page can reuse them. Final placement is a Phase 12 motion task.

- **Diseñamos rutas que no se ven en el mapa.**
- **Recorridos diseñados y testeados.**
- **Ritmo respaldado para cada terreno.**
- **Los kilómetros, las paradas y los tiempos, fueron preparados para que lo vivas con Libertad.**
- *Sellos cortos:* "Rutas diseñadas y testeadas" · "Ritmo y tiempos reales."

---

## 1 · Sobre las Nubes

> 7 días, 6 noches · 1712 km · 50% ripio · Nivel: Intermedio · Altura máxima: 4895 m s.n.m.

### Día 1 — Salta Capital → Cabra Corral → Cuesta del Obispo → Cachi
70% asfalto · 270 km · 3300 m s.n.m.

El primer día combina en pocos kilómetros agua, selva, altura, montaña y pueblos andinos. Partimos desde Salta Capital rumbo al Embalse Cabra Corral, donde almorzamos con vistas al lago. Continuamos hacia la Cuesta del Obispo. Curvas, cardones y nubes marcan esta etapa hasta la llegada a Cachi, uno de los pueblos más lindos que nos ofrece Salta. Ya en Cachi nos organizamos para una visita.

**Destacados:** Embalse Cabra Corral · Parque Nacional Los Cardones · Cuesta del Obispo · Recta del Tintín.

**Tramos:**
1. Salta Capital → Cabra Corral · 92 km
2. Cabra Corral → Cachi · 178 km

### Día 2 — Cachi → Quebrada de las Flechas → Cafayate → El Carril
80% asfalto · 308 km

Un recorrido pensado para disfrutar arriba de la moto. Curvas entretenidas, cambios de ritmo y una paleta de colores en todo el trayecto. Atravesando la Quebrada de las Flechas, para llegar a Cafayate. Recorremos el pueblo, almorzamos y visitamos sus clásicas bodegas, perfecto para una pausa antes de seguir viaje. El tramo por la Quebrada de las Conchas, con paradas icónicas como el Anfiteatro, la Garganta del Diablo y El Sapo hacen de este tramo una experiencia inolvidable.

**Destacados:** Quebrada de las Flechas · Anfiteatro · Quebrada de las Conchas · Garganta del Diablo.

**Tramos:**
1. Cachi → Cafayate · 156 km
2. Cafayate → El Carril · 152 km

### Día 3 — El Carril → Abra del Acay → San Antonio de los Cobres
20% asfalto (6 km) · 4895 m s.n.m.

El paso por el Abra del Acay, es el tramo más emblemático de la Ruta 40, el punto más alto de la misma y el punto más alto de una ruta nacional de toda América. El camino nos regala intensos colores, vistas abiertas y una ruta interminable sobre la montaña. Acantilados y un paisaje imponente a medida que se asciende a lo más alto de la montaña. El camino hacia San Antonio de los Cobres baja en dificultad y nos da vistas abiertas y una conducción más relajada, la llegada al pueblo marca el cierre del día.

**Destacados:** Abra del Acay.

**Tramos:**
1. El Carril → La Poma · 156 km
2. La Poma → Abra del Acay · 45 km
3. Abra del Acay → S.A. Cobres · 45 km

### Día 4 — S.A. Cobres → Viaducto la Polvorilla → Tilcara
80% asfalto · 293 km · 3890 m s.n.m.

Salimos de San Antonio de los Cobres rumbo al Viaducto La Polvorilla, pasando por debajo del mismo con un recorrido de 45 minutos por La Juguetería y sus inmensas rocas. Seguimos rumbo hacia las Salinas Grandes, y su contraste con el cielo y las montañas que la rodean. Con el descenso hacia Purmamarca aparecen curvas más marcadas y los cerros de colores, hasta la llegada al pueblo.

**Destacados:** Viaducto la Polvorilla · La Juguetería · Salinas Grandes · Cerro de los 7 colores.

**Tramos:**
1. S.A. Cobres → La Juguetería · 26 km
2. La Juguetería → Salinas Grandes · 86 km
3. Salinas Grandes → Tilcara · 121 km

### Día 5 — Tilcara → Santa Ana
20% asfalto · 140 km · 4550 m s.n.m.

Día pensado para disfrutar la conducción y el entorno más que la velocidad. Entre curvas cerradas y rectas con acantilados. Más que conducir la moto se va flotando sobre las nubes. La sensación es la de estar cruzando por el auténtico norte, poco transitado y profundamente ligado a la montaña, una sucesión constante de paisajes que invitan a parar, mirar y seguir.

**Destacados:** Hornocal · Abra Azul · Caspala.

**Tramos:**
1. Tilcara → Hornocal · 68 km
2. Hornocal → Abra Azul · 35 km
3. Abra Azul → Santa Ana · 38 km

### Día 6 — Santa Ana → Parque Nacional Calilegua → Perico
50% asfalto · 205 km

Un día que cambia completamente de escenario: desde los caminos de altura y pueblos aislados, empezás a descender hacia la selva de las Yungas, atravesando el Parque Nacional Calilegua. La ruta se vuelve totalmente verde, más húmeda y cerrada, con curvas entre vegetación densa y un clima totalmente distinto. Una transición única: de la montaña árida a la selva viva, terminando en Perico con sensación de haber cruzado dos mundos en un solo día.

**Destacados:** Parque Nacional Calilegua.

**Tramos:**
1. Santa Ana → San Francisco · 70 km
2. San Francisco → Calilegua · 48 km
3. Calilegua → Perico · 38 km

### Día 7 — Perico → Termas de Reyes → Salta Capital
80% asfalto · 143 km

Un día tranquilo. Una primera parte de ripio hasta Termas de Reyes. Parada a almorzar en el Dique La Ciénaga con vistas al Embalse Las Maderas, ideal para recuperar energías. Luego unas 2 horas de manejo y unas 100 curvas por asfalto hasta llegar al hotel en Salta.

**Recorrido en mapa:** `https://maps.mMEDc2st48kkfm7` *(client-provided link — verify before launch).*

---

## 2 · Gigantes del Oeste

> 8 días, 7 noches · 2400 km · 30% ripio · Nivel: Intermedio · Altura máxima: 4600 m s.n.m.

### Día 1 — Mendoza Capital → Potrerillos → Villavicencio → Uspallata
80% asfalto · 218 km

Partimos desde Mendoza Capital rumbo a Potrerillos donde el camino se entremezcla con túneles, curvas y embalses. Luego seguimos rumbo a la Reserva Natural de Villavicencio: un recorrido de ripio con 365 curvas, para llegar al histórico Hotel Villavicencio. Por la tarde regresamos a Uspallata, donde pasamos la primera noche y nos preparamos para el gran desafío del día siguiente: el Cruce de los Andes.

**Destacados:** Embalse Potrerillos · Reserva Natural Villavicencio.

**Tramos:**
1. Mendoza → Potrerillos · 69 km
2. Potrerillos → Villavicencio · 119 km
3. Villavicencio → Uspallata · 57 km

### Día 2 — Uspallata → Paso Los Libertadores → Uspallata
90% asfalto · 313 km · 3854 m s.n.m.

El Paso Internacional Los Libertadores es, sin duda, uno de los más espectaculares de los Andes. Una jornada completa en la cual atravesamos la cordillera por el corazón de la misma. Con vistas al Aconcagua, cruce de túneles de alta montaña y una bajada memorable hacia Chile por los famosos Caracoles, una de las secciones más icónicas del camino. Llegamos al pueblo Los Andes disfrutando cada kilómetro recorrido. Luego de recargar energías emprendemos la vuelta hacia Uspallata con una parada en el Cristo Redentor.

**Destacados:** Puente del Inca · Aconcagua · Cristo Redentor · Cuesta Caracoles.

**Tramos:**
1. Uspallata → Puente del Inca · 72 km
2. Puente del Inca → Los Andes · 86 km
3. Los Andes → Uspallata · 156 km

### Día 3 — Pampa del Leoncito → Laguna Blanca → Calingasta
80% asfalto · 290 km

Dejamos atrás el valle mendocino para internarnos en paisajes de planicies infinitas y caminos solitarios, atravesando el imponente Pampa del Leoncito, un escenario abierto donde el horizonte parece no tener fin, rodeado de cadenas montañosas. Un día que combina internarse en las montañas, visitar bodegas, para finalizar con el camino a la Laguna Blanca y atardeceres increíbles.

**Destacados:** Pampa Leoncito · Laguna Blanca.

**Tramos:**
1. Uspallata → Pampa del Leoncito · 93 km
2. Pampa del Leoncito → Barreal · 22 km
3. Barreal → Laguna Blanca · 130 km

### Día 4 — Barreal → Rodeo → Jáchal → Huaco → Villa Unión
100% asfalto · 437 km

La travesía más escénica del tour, conecta valles, diques, quebradas y zonas áridas riojanas. El trayecto nos da un cambio de paisajes constante y muy marcado. Parada a almorzar en Rodeo y la Cuesta del Viento, el paisaje cambia notablemente con colores y curvas. La Cuesta del Viento, La Ciénaga y la Cuesta de Huaco son lugares icónicos de San Juan: el camino se transforma en curvas cerradas que desembocan en un mirador de los valles sanjuaninos.

**Destacados:** Cuesta del Viento · Quebrada de Jáchal · Cuesta de Huaco.

**Tramos:**
1. Barreal → Rodeo · 246 km
2. Rodeo → Huaco · 98 km
3. Huaco → Villa Unión · 118 km

### Día 5 — Villa Unión → Laguna Brava → Volcancito de Troya → Villa Unión
40% asfalto · 370 km · 4300 m s.n.m.

El ascenso a Laguna Brava es uno de los secretos mejor guardados de La Rioja. Una laguna de alta montaña, ubicada a 4300 msnm, donde descansa el fuselaje de un avión, custodiado por flamencos y el silencio del altiplano. La jornada combina rectas infinitas asfaltadas con paisajes imponentes y, en contraste, el ripio y curvas de la Quebrada de la Troya y La Herradura, atravesando montañas de colores irreales. A lo largo del recorrido emergen antiguos refugios de piedra construidos en 1862 por Domingo Faustino Sarmiento para las primeras travesías andinas.

**Destacados:** Laguna Brava · Volcancito de Troya · Quebrada de la Troya · La Herradura.

**Tramos:**
1. Villa Unión → Vinchina · 70 km
2. Vinchina → Laguna Brava · 114 km
3. Laguna Brava → Villa Unión · 184 km

### Día 6 — Villa Unión → Talampaya → Valle de la Luna → Chilecito
90% asfalto · 386 km

El Talampaya nos da un paisaje de paredones rojizos y cañones que reflejan millones de años de historia geológica. El recorrido continúa por el Valle de la Luna, con sus formas erosionadas y tonos ocres que evocan un escenario lunar. La etapa se completa con el ascenso por la Cuesta de Miranda, un camino de curvas y vistas abiertas que combinan los colores verde y rojo. Finalizamos en Chilecito, cuna del cable carril y la mina La Mejicana, uno de los emprendimientos mineros más ambiciosos y relevantes de Argentina a principios del siglo XX.

**Destacados:** Talampaya · Valle de la Luna · Cuesta de Miranda.

**Tramos:**
1. Villa Unión → Talampaya → Valle de la Luna · *(distance pending — split in source)*
2. Valle de la Luna → Chilecito · 206 km

### Día 7 — Chilecito → Cañón del Ocre → Mina La Mejicana → Chilecito
20% asfalto · 240 km · 4600 m s.n.m.

El recorrido desde Chilecito hasta la Mina La Mejicana es un ascenso de montaña corto en kilómetros pero intenso en paisaje e historia. Uno de los caminos más desafiantes de toda La Rioja, ícono de cualquier motero. El Cañón del Ocre y los Pesebres son paradas obligadas del día. Ascendiendo, la vegetación desaparece por completo y aparecen ríos anaranjados a lo largo del trayecto. El silencio es absoluto. En este último tramo aparecen estructuras abandonadas, rieles, vagonetas y ruinas que anuncian la llegada al complejo minero. El lugar transmite una mezcla de hazaña humana y aislamiento extremo.

**Destacados:** Cañón del Ocre · Mina la Mejicana · Los Pesebres.

**Tramos:**
1. Chilecito → Cañón del Ocre → Mina la Mejicana · 84 km
2. Mina la Mejicana → Chilecito · 84 km

### Día 8 — Chilecito → Termas de Santa Teresita → La Rioja
100% asfalto

Para finalizar el viaje agarramos la Ruta 40 camino a Las Termas de Santa Teresita, donde nos tomamos un día completo de descanso antes del retorno a La Rioja.

**Destacados:** Termas de Santa Teresita.

**Tramos:**
1. Chilecito → Termas de Santa Teresita · 205 km
2. Termas de Santa Teresita → La Rioja · 106 km

**Recorrido en mapa:** `https://maps.app.goo.gl/BWWYQYYWhBNAmj6U9`.

---

## 3 · Volcanes del Norte

> 7 días, 6 noches · 50% ripio · Nivel: Intermedio + · Altura máxima: 4550 m s.n.m.

> *Total km pending — sum across day tramos.*

### Día 1 — San Fernando → Fiambalá
325 km · 100% asfalto

100% asfalto con paradas cortas, sin exigencia física. Atravesamos la Ruta del Adobe que conecta Tinogasta y Fiambalá. La ruta recorre pueblos pequeños para dar llegada a Fiambalá. Llegada a la cabaña, descanso y partida para las emblemáticas Termas de Fiambalá en plena precordillera andina, en un entorno árido, silencioso y totalmente natural.

**Alojamiento:** Viñedos de la Luna.
**Destacados:** Ruta del Adobe · Termas de Fiambalá.

**Tramos:**
1. San Fernando → Aimogasta · 162 km
2. Aimogasta → Tinogasta · 112 km
3. Tinogasta → Fiambalá · 50 km

### Día 2 — Fiambalá → Balcón del Pissis → Fiambalá
280 km · 70% asfalto / 30% ripio · 4500 m s.n.m.

La Ruta de los Seismiles, una de las más impactantes, rodeada de montañas y volcanes. El camino se interna en la Quebrada de las Angosturas, un tramo estrecho serpenteante, donde la ruta avanza entre paredones de roca volcánica. De manera repentina, se ingresa en un amplio valle, el camino continúa ganando altura hasta alcanzar el Balcón del Pissis, un mirador natural desde el cual se obtiene una vista directa y monumental del Volcán Pissis. Con acceso a la Laguna Verde y a la Laguna Azul.

**Destacados:** Balcón de Pissis · Quebrada de las Angosturas · Ruta de los Seismiles · Laguna Verde, Azul y Negra.

**Tramos:**
1. Fiambalá → Cortaderas · 97 km
2. Cortaderas → Balcón de Pissis · 62 km
3. Balcón de Pissis → Fiambalá · 155 km

### Día 3 — Fiambalá → Belén
287 km · 100% asfalto

Partimos al norte rumbo a las impresionantes Dunas de Tatón. Conforman uno de los campos de arena más extensos y aislados de Catamarca, con decenas de kilómetros cuadrados de dunas altas. Seguimos rumbo a Tinogasta, con parada y recorrido en la bodega Veralma. Pasando por el icónico km 4040 de la Ruta 40 camino a Belén.

**Destacados:** Dunas de Tatón · Km 4040 · Belén.

**Tramos:**
1. Fiambalá → Dunas de Tatón · 42 km
2. Dunas de Tatón → Tinogasta · 90 km
3. Tinogasta → Belén · 152 km

### Día 4 — Belén → Antofagasta de la Sierra
259 km · 90% asfalto / 10% ripio · 3500 m s.n.m.

La ruta hasta Antofagasta de la Sierra combina montaña, quebradas y la inmensidad absoluta de la Puna, con un fuerte carácter aventurero. Al superar la cuesta, el paisaje se abre de golpe y aparece la inmensidad de la Puna: rectas interminables, silencio absoluto. La llegada a Antofagasta nos regala vistas a más de 4 volcanes y al campo de lava del Volcán Alumbrera, un lugar único en Argentina. Coladas de lava solidificada y conos volcánicos, como si se ingresara a otro planeta.

**Alojamiento:** Hospedaje El Sendero.
**Destacados:** Cuesta de Randolfo · Pucará la Alumbrera · Campos de lava.

**Tramos:**
1. Belén → Cuesta de Randolfo · 106 km
2. Cuesta de Randolfo → El Peñón · 93 km
3. El Peñón → Antofagasta de la Sierra · 60 km

### Día 5 — Antofagasta de la Sierra → Campo de Piedra Pómez
200 km · 30% asfalto / 70% ripio · 3500 m s.n.m.

La travesía atraviesa un entorno volcánico extremo. El terreno se vuelve claro y ondulado hasta ingresar al Campo de Piedra Pómez, formación única en el mundo. Sigue el viaje hacia la Laguna Carachi Pampa. La inmensidad de la Puna domina la escena: una gran laguna de altura rodeada de planicies volcánicas, donde el agua refleja el cielo y los cerros, ofreciendo uno de los paisajes más impactantes y solitarios de la travesía. Un tramo corto en kilómetros, pero enorme en experiencia.

**Alojamiento:** Hospedaje El Sendero.
**Destacados:** Campo de Piedra Pómez · Laguna Carachi Pampa · Volcán Carachi Pampa.

**Tramos:**
1. Antofagasta de la Sierra → Campo de Piedra Pómez · 120 km
2. Campo de Piedra Pómez → Laguna Carachi Pampa · 105 km
3. Laguna Carachi Pampa → Antofagasta de la Sierra · 40 km

### Día 6 — El Peñón → Andalgalá
340 km · 50% asfalto / 50% ripio

Saliendo desde El Peñón el paisaje árido y volcánico da paso a caminos de montaña cada vez más escénicos. Un día a puro ripio, pasando por la Cuesta de Capillitas, la cuesta más larga de Sudamérica. Visitando el Refugio del Minero para finalizar el día en Andalgalá.

**Destacados:** Cuesta Minas Capillitas · Refugio del Minero.

**Tramos:**
1. Antofagasta de la Sierra / El Peñón → Cuesta de Randolfo · 93 km
2. Cuesta de Randolfo → Punta de Balasto · 145 km
3. Punta de Balasto → Andalgalá · 114 km

### Día 7 — Andalgalá → San Fernando
226 km · 70% asfalto / 30% ripio

Partiendo desde Andalgalá, a medida que se gana altura el paisaje se transforma: aparecen cursos de agua, vegetación densa y selva de montaña, marcando un contraste total con la aridez de días anteriores. El paso por el Parque Nacional Aconquija es uno de los grandes momentos del día. El camino atraviesa bosques de yungas, con curvas constantes, miradores naturales y un entorno fresco y vivo, donde la montaña se siente cercana y dominante. Es un tramo muy escénico, ideal para disfrutar del manejo y del cambio de clima y paisaje.

**Destacados:** Cuesta la Chilca · Loma Larga.

**Tramos:**
1. Andalgalá → Buena Vista · 54 km
2. Buena Vista → Los Varela · 74 km
3. Los Varela → La Quebrada · 98 km

**Recorrido en mapa:** `https://maps.app.goo.gl/NLtJ8B4giCKQFE8o8`.

---

## 4 · Cruces del Sur

> 7 días, 6 noches · 2321 km · 45% ripio · Nivel: Intermedio · Altura máxima: 1300 m s.n.m.

### Día 1 — Bariloche → Trevelin
306 km · 30% ripio

Combinación de asfalto y ripio, sin exigencia física. Día ideal para entrar en ritmo. Salimos desde Bariloche bajando por la Ruta 40, uno de los tramos más clásicos e icónicos de la Patagonia. Desvío en Cholila, donde comienza el Parque Nacional Los Alerces, alternando asfalto y ripio, bordeando ríos, lagos y atravesando bosque cerrado. La llegada a Trevelin marca el final del primer día.

**Destacados:** El Bolsón · Lago Puelo · Parque Nacional Los Alerces · Lago Rivadavia y Futalaufquen.

**Tramos:**
1. Bariloche → Lago Puelo · 134 km
2. Lago Puelo → Cholila · 77 km
3. Cholila → Trevelin · *(distance pending — source truncated).*

### Día 2 — Trevelin → Paso Futaleufú → Puerto Cisnes
325 km · 20% ripio

Visitamos el campo de tulipanes, único en el sur. Seguimos en dirección al paso fronterizo Futaleufú, un tramo corto pero hermoso en paisajes, colores y ríos. Con la Carretera Austral, comienza un recorrido más salvaje, con tramos de ripio y curvas constantes. Atravesamos bosque cerrado, ríos y zonas de montaña hasta llegar a Puyuhuapi, y desde allí continuamos por la misma ruta en dirección a Puerto Cisnes. La llegada marca el final de un día clave, donde dejamos atrás Argentina para entrar de lleno en la Carretera Austral.

**Destacados:** Campo de Tulipanes · Paso Futaleufú · Termas Ventisquero · Puerto Cisnes.

**Tramos:**
1. Trevelin → Futaleufú · 49 km
2. Futaleufú → La Junta · 144 km
3. La Junta → Termas Ventisquero · 52 km
4. Termas Ventisquero → Puerto Cisnes · 80 km

### Día 3 — Puerto Cisnes → Puerto Ingeniero Ibáñez → Chile Chico
322 km · 20% ripio

Desde Puerto Cisnes, recorriendo un camino escénico con montaña y fiordos, alternando asfalto y ripio. A medida que seguimos hacia el sur, el paisaje combina montaña y vegetación cerrada. La llegada a Puerto Ingeniero Ibáñez marca el final de una etapa escénica dentro de la Carretera Austral, aguardando a subir a la barcaza para cruzar el lago General Carrera rumbo a Chile Chico, dejando atrás la última parte constante de asfalto.

**Destacados:** Reserva Nacional Mañihuales · Reserva Nacional Lago Las Torres · Parque Nacional Cerro Castillo · Ferry Lago General Carrera.

**Tramos:**
1. Puerto Cisnes → Villa Amengual · 62 km
2. Villa Amengual → Coyhaique · 146 km
3. Coyhaique → Puerto Ingeniero Ibáñez · 116 km

### Día 4 — Chile Chico → Cochrane
178 km · 70% ripio

Día a puro ripio, vistas deslumbrantes y paisajes únicos. Salimos desde Chile Chico bordeando el Lago General Carrera, uno de los lagos más grandes de la Patagonia, con vistas abiertas y constantes al agua durante gran parte del recorrido. Es un día de manejo real, donde la moto y el entorno se imponen. La llegada a Cochrane marca el final de una de las etapas más auténticas del viaje dentro de la Carretera Austral.

**Destacados:** Lago General Carrera · Reserva Nacional Lago General Carrera · Lago Cochrane · Lago Bertrand.

**Tramos:**
1. Chile Chico → Puerto Guadal · 105 km
2. Puerto Guadal → Cochrane · 73 km

### Día 5 — Cochrane → Paso Roballos → Perito Moreno
250 km · 80% ripio

El día más impactante de todo el viaje. El Paso Roballos es uno de esos caminos que nunca te olvidás en tu vida. El camino nos regala estepas abiertas con montañas a los costados y aislamiento total. Una vez en lado argentino, el camino va bordeando la cordillera: 2 horas de manejo con vista a los Andes. La llegada a Los Antiguos marca el fin del ripio para dar paso al asfalto y a un camino con vista al lago General Carrera. El día finaliza con la llegada a Perito Moreno.

**Destacados:** Valle Chacabuco · Paso Roballos · Lago Cochrane · Los Antiguos.

**Tramos:**
1. Cochrane → Paso Roballos · 92 km
2. Paso Roballos → Los Antiguos · *(distance pending — source truncated).*
3. Los Antiguos → Perito Moreno · 59 km

### Día 6 — Perito Moreno → Lago Vintter
473 km · 15% ripio

Día de regreso, jornada larga por la Ruta 40, sin exigencia técnica pero con varias horas de manejo. El camino es aislado, con rectas largas asfaltadas hasta la llegada a Gobernador Costa. Ahí salimos de la 40 y tomamos un camino secundario hacia Río Pico y el Lago Vintter, entrando en una Patagonia que casi nadie conoce. Entramos en montaña baja con los Andes de fondo, una alternativa muy atractiva a los tramos desolados de la Ruta 40.

**Destacados:** Río Pico.

**Tramos:**
1. Perito Moreno → Río Mayo · 127 km
2. Río Mayo → Gobernador Costa · 231 km
3. Gobernador Costa → Río Pico · 77 km

### Día 7 — Lago Vintter → Bariloche
467 km · 35% ripio

El tramo Lago Vintter → Trevelin está marcado por bosques bajos y montañas nevadas. Un tramo de ripio, sin tránsito, teniendo el camino solo para nosotros. Atravesando una Patagonia abierta y silenciosa que no aparece en los circuitos tradicionales. Luego de Trevelin empalmamos con una parte de la 40 que no recorrimos para luego adentrarnos en el tradicional recorrido entre El Bolsón y Bariloche, finalizando el tour en un viaje patagónico que pocos conocen.

**Destacados:** Lago Vintter · Lago Palena · Clásicos Ruta 40.

**Tramos:**
1. Río Pico → Corcovado · 94 km
2. Corcovado → Esquel · 92 km
3. Esquel → El Bolsón · 163 km
4. El Bolsón → Bariloche · 121 km

**Recorrido en mapa:** `https://maps.app.goo.gl/3JruHQgzeRTNLJpy7`.

---

_Last updated: 2026-05-10 from client brief. Update this file in the same PR as any tour-data change._
