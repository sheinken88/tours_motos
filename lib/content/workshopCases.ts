import type { Locale } from "@/lib/i18n/config";

export type WorkshopCaseImage = {
  src: string;
  alt: string;
  label: string;
  caption: string;
  objectPosition?: string;
};

export type WorkshopDecision = {
  label: string;
  body: string;
  kind?: "in" | "out" | "adjust";
};

export type WorkshopStat = {
  value: string;
  label: string;
};

export type WorkshopDecisionSection = {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: WorkshopCaseImage;
};

export type WorkshopCase = {
  slug: string;
  tourSlug: string;
  routeName: string;
  region: string;
  kicker: string;
  quote: string;
  fieldNote: string;
  hero: WorkshopCaseImage;
  images: WorkshopCaseImage[];
  stats: WorkshopStat[];
  decisions: WorkshopDecision[];
  decisionSection?: WorkshopDecisionSection;
};

const WORKSHOP_TRANSLATIONS: Record<string, { en: string; pt: string }> = {
  "Salta y Jujuy": {
    en: "Salta and Jujuy",
    pt: "Salta e Jujuy",
  },
  "Tres viajes, épocas descartadas.": {
    en: "Three scouting trips, discarded seasons.",
    pt: "Três viagens, épocas descartadas.",
  },
  "Tres viajes, épocas descartadas": {
    en: "Three scouting trips, discarded seasons",
    pt: "Três viagens, épocas descartadas",
  },
  "El punto más alto de toda la Ruta 40 no podía faltar en este viaje.": {
    en: "The highest point on all of Route 40 had to be part of this trip.",
    pt: "O ponto mais alto de toda a Ruta 40 tinha que entrar nessa viagem.",
  },
  "Buscamos escapar del clásico viaje por Salta y Jujuy donde domina el asfalto y mostrar los pueblos más pequeños, adentrados en la montaña.":
    {
      en: "We wanted to escape the classic asphalt-heavy Salta and Jujuy trip and show the smaller villages tucked into the mountains.",
      pt: "Buscamos fugir da viagem clássica por Salta e Jujuy dominada pelo asfalto e mostrar povoados menores, mais metidos na montanha.",
    },
  "Piloto y moto en sombra frente a un paredón rural durante el armado de Sobre las Nubes.": {
    en: "Rider and motorcycle in shadow facing a rural wall while building Sobre las Nubes.",
    pt: "Piloto e moto na sombra diante de um paredão rural durante a montagem de Sobre las Nubes.",
  },
  "La primera idea": {
    en: "The first idea",
    pt: "A primeira ideia",
  },
  "La Primera Idea": {
    en: "The First Idea",
    pt: "A Primeira Ideia",
  },
  "Escapar del circuito clásico y entrar a pueblos más chicos, más metidos en la montaña.": {
    en: "Escape the classic loop and enter smaller villages deeper in the mountains.",
    pt: "Escapar do circuito clássico e entrar em povoados menores, mais metidos na montanha.",
  },
  "Equipo reparando una moto en una ladera seca durante una exploración de Salta y Jujuy.": {
    en: "Team repairing a motorcycle on a dry slope during a Salta and Jujuy scouting ride.",
    pt: "Equipe consertando uma moto em uma encosta seca durante uma exploração de Salta e Jujuy.",
  },
  "Entre 2021 y 2022 volvimos tres veces para medir clima, asistencia y ritmo real.": {
    en: "Between 2021 and 2022 we returned three times to measure weather, support, and real pace.",
    pt: "Entre 2021 e 2022 voltamos três vezes para medir clima, apoio e ritmo real.",
  },
  "Moto cargada avanzando entre cerros de Salta durante una prueba de camino.": {
    en: "Loaded motorcycle moving between Salta hills during a road test.",
    pt: "Moto carregada avançando entre cerros de Salta durante um teste de caminho.",
  },
  "Variantes de altura": {
    en: "High-altitude variants",
    pt: "Variantes de altitude",
  },
  "Probamos desvíos, combustible y cortes de jornada antes de fijar el track.": {
    en: "We tested detours, fuel, and day breaks before fixing the track.",
    pt: "Testamos desvios, combustível e cortes de jornada antes de fixar o track.",
  },
  "Camino de montaña con ripio y curvas durante el armado de Sobre las Nubes.": {
    en: "Mountain road with gravel and curves during the build of Sobre las Nubes.",
    pt: "Caminho de montanha com terra e curvas durante a montagem de Sobre las Nubes.",
  },
  "La mejor versión es entrando por el sur: más progresivo, más épico.": {
    en: "The best version enters from the south: more progressive, more epic.",
    pt: "A melhor versão entra pelo sul: mais progressiva, mais épica.",
  },
  "Piloto y moto detenidos en una quebrada de altura del norte argentino.": {
    en: "Rider and motorcycle stopped in a high northern Argentine gorge.",
    pt: "Piloto e moto parados em uma quebrada de altitude do norte argentino.",
  },
  "Volvimos y ajustamos": {
    en: "We returned and adjusted",
    pt: "Voltamos e ajustamos",
  },
  "El recorrido quedó cuando el desafío, la seguridad y el paisaje empezaron a calzar.": {
    en: "The route stayed when challenge, safety, and landscape began to fit.",
    pt: "O percurso ficou quando desafio, segurança e paisagem começaram a encaixar.",
  },
  "viajes de exploración": {
    en: "scouting trips",
    pt: "viagens de exploração",
  },
  "variantes probadas": {
    en: "variants tested",
    pt: "variantes testadas",
  },
  "variante probadas": {
    en: "variant tested",
    pt: "variante testada",
  },
  "test runs": {
    en: "test runs",
    pt: "test runs",
  },
  ajustes: {
    en: "adjustments",
    pt: "ajustes",
  },
  "ajustes de ruta": {
    en: "route adjustments",
    pt: "ajustes de rota",
  },
  "circuitos descartados": {
    en: "discarded loops",
    pt: "circuitos descartados",
  },
  "tramos descartados": {
    en: "discarded sections",
    pt: "trechos descartados",
  },
  "versión final que nos dejó orgullosos": {
    en: "final version that made us proud",
    pt: "versão final que nos deixou orgulhosos",
  },
  "Tramos descartados": {
    en: "Discarded sections",
    pt: "Trechos descartados",
  },
  "TRAMOS DESCARTADOS": {
    en: "DISCARDED SECTIONS",
    pt: "TRECHOS DESCARTADOS",
  },
  "Tramos que descartamos": {
    en: "Sections we discarded",
    pt: "Trechos que descartamos",
  },
  "TRAMOS QUE DESCARTAMOS": {
    en: "SECTIONS WE DISCARDED",
    pt: "TRECHOS QUE DESCARTAMOS",
  },
  "Priorizamos el paso por las Yungas y la transición espectacular entre selva, montaña y altura.":
    {
      en: "We prioritized the passage through the Yungas and the stark transition between jungle, mountains, and altitude.",
      pt: "Priorizamos a passagem pelas Yungas e a transição forte entre selva, montanha e altitude.",
    },
  "Piloto cruzando agua entre vegetación cerrada durante el armado de Sobre las Nubes.": {
    en: "Rider crossing water through dense vegetation while building Sobre las Nubes.",
    pt: "Piloto cruzando água entre vegetação fechada durante a montagem de Sobre las Nubes.",
  },
  Yungas: {
    en: "Yungas",
    pt: "Yungas",
  },
  "La transición entre selva, montaña y altura definió qué tramos valían quedarse.": {
    en: "The transition between jungle, mountains, and altitude defined which sections were worth keeping.",
    pt: "A transição entre selva, montanha e altitude definiu quais trechos valiam ficar.",
  },
  "Decidimos dejar Iruya fuera del recorrido no por su dificultad, sino porque requería una jornada dedicada exclusivamente a ese destino. Priorizamos el paso por las Yungas y la transición espectacular entre selva, montaña y altura.":
    {
      en: "We left Iruya out not because of difficulty, but because it needed a full day dedicated only to that destination. We prioritized the Yungas and the transition between jungle, mountains, and altitude.",
      pt: "Decidimos deixar Iruya fora do percurso não pela dificuldade, mas porque exigia uma jornada dedicada só a esse destino. Priorizamos as Yungas e a transição entre selva, montanha e altitude.",
    },
  "Derrumbes frecuentes en la zona del Abra de la Cruz y sectores cercanos, que pueden cortar el camino sin aviso. Crecida repentina de ríos, especialmente después de lluvias en altura, lo que vuelve imposible el cruce incluso para motos livianas.":
    {
      en: "Frequent landslides around Abra de la Cruz and nearby sectors can cut the road without warning. Rivers rise suddenly, especially after high-altitude rain, making crossings impossible even for light motorcycles.",
      pt: "Deslizamentos frequentes na zona do Abra de la Cruz e setores próximos podem cortar o caminho sem aviso. Rios sobem de repente, especialmente depois de chuvas em altitude, tornando a travessia impossível até para motos leves.",
    },
  "Mendoza a La Rioja": {
    en: "Mendoza to La Rioja",
    pt: "Mendoza a La Rioja",
  },
  "El Cuyo que no se conoce.": {
    en: "The Cuyo most people do not know.",
    pt: "O Cuyo que pouca gente conhece.",
  },
  "El Cuyo que no se conoce": {
    en: "The Cuyo most people do not know",
    pt: "O Cuyo que pouca gente conhece",
  },
  "Cada tramo quedó elegido por una razón: seguridad, fluidez, vistas y emoción.": {
    en: "Every section was chosen for a reason: safety, flow, views, and emotion.",
    pt: "Cada trecho foi escolhido por uma razão: segurança, fluidez, vistas e emoção.",
  },
  "Cada tramo quedó elegido por seguridad, fluidez, vistas y emoción.": {
    en: "Every section was chosen for safety, flow, views, and emotion.",
    pt: "Cada trecho foi escolhido por segurança, fluidez, vistas e emoção.",
  },
  "Mendoza, San Juan y La Rioja tienen rutas increíbles. Nosotros queríamos unir caminos que casi nadie combina.":
    {
      en: "Mendoza, San Juan, and La Rioja have incredible routes. We wanted to connect roads almost nobody combines.",
      pt: "Mendoza, San Juan e La Rioja têm rotas incríveis. Queríamos unir caminhos que quase ninguém combina.",
    },
  "Camino de ripio abriéndose entre cerros durante el armado de Gigantes del Oeste.": {
    en: "Gravel road opening between hills during the build of Gigantes del Oeste.",
    pt: "Caminho de terra se abrindo entre cerros durante a montagem de Gigantes del Oeste.",
  },
  "Queríamos un viaje que no fuera la típica vuelta por una sola provincia.": {
    en: "We wanted a trip that was not the typical loop through one province.",
    pt: "Queríamos uma viagem que não fosse a típica volta por uma só província.",
  },
  "Camino de montaña cortando un valle árido de Cuyo durante una prueba de ruta.": {
    en: "Mountain road cutting across an arid Cuyo valley during a route test.",
    pt: "Caminho de montanha cortando um vale árido de Cuyo durante um teste de rota.",
  },
  "Aventura, historia y silencio": {
    en: "Adventure, history, and silence",
    pt: "Aventura, história e silêncio",
  },
  "365 curvas, una por cada día del año.": {
    en: "365 curves, one for every day of the year.",
    pt: "365 curvas, uma para cada dia do ano.",
  },
  "Ruta de altura en Mendoza y San Juan con cerros al fondo.": {
    en: "High-altitude route in Mendoza and San Juan with hills in the background.",
    pt: "Rota de altitude em Mendoza e San Juan com cerros ao fundo.",
  },
  "Unificar rutas": {
    en: "Unify routes",
    pt: "Unificar rotas",
  },
  "El desafío fue armar un viaje que tomará lo mejor de cada provincia.": {
    en: "The challenge was building a trip that took the best of each province.",
    pt: "O desafio foi montar uma viagem que pegasse o melhor de cada província.",
  },
  "Camino de ripio atravesando un paisaje de alta montaña del oeste argentino.": {
    en: "Gravel road crossing a high-mountain landscape in western Argentina.",
    pt: "Caminho de terra atravessando uma paisagem de alta montanha do oeste argentino.",
  },
  "Versión final": {
    en: "Final version",
    pt: "Versão final",
  },
  "Terminamos el viaje cansados, felices… y con ganas de volver a hacerlo.": {
    en: "We finished the trip tired, happy, and wanting to ride it again.",
    pt: "Terminamos a viagem cansados, felizes e com vontade de fazer de novo.",
  },
  "Camino ancho en la cordillera durante un test de Gigantes del Oeste.": {
    en: "Wide road in the Andes during a Gigantes del Oeste test ride.",
    pt: "Caminho largo na cordilheira durante um teste de Gigantes del Oeste.",
  },
  "Ajuste de ritmo": {
    en: "Pace adjustment",
    pt: "Ajuste de ritmo",
  },
  "Un paso fronterizo espectacular, pero demasiado impredecible: condiciones blancas, cierres repentinos de frontera y riesgo alto para grupos. Lo probamos, pero no garantiza continuidad ni seguridad. Quedó afuera.":
    {
      en: "A spectacular border pass, but too unpredictable: whiteout conditions, sudden border closures, and high group risk. We tested it, but it does not guarantee continuity or safety. It stayed out.",
      pt: "Um passo de fronteira espetacular, mas imprevisível demais: condições brancas, fechamentos repentinos e risco alto para grupos. Testamos, mas não garante continuidade nem segurança. Ficou fora.",
    },
  "El camino es más técnico, más expuesto y con zonas de arena profunda. Para un tour de viaje —no de enduro— no suma. Optamos por hacer el recorrido de Laguna Brava, la variante: más progresiva y más disfrutable.":
    {
      en: "The road is more technical, more exposed, and has deep sand zones. For a travel tour, not an enduro ride, it does not add. We chose the Laguna Brava route instead: more progressive and more enjoyable.",
      pt: "O caminho é mais técnico, mais exposto e tem zonas de areia profunda. Para um tour de viagem, não de enduro, não soma. Optamos pelo percurso de Laguna Brava: mais progressivo e mais aproveitável.",
    },
  "Una variante en el tramo del día de Laguna Brava, era un antiguo tramo que corría el Dakar. Hermoso circuito internado en el antiguo lecho del río, pero presenta barro y condiciones de manejo avanzado, optamos por la variable más tranquila.":
    {
      en: "A variant on the Laguna Brava day, once used by the Dakar. Beautiful circuit inside the old riverbed, but it brings mud and advanced riding conditions, so we chose the calmer variant.",
      pt: "Uma variante no dia de Laguna Brava, antigo trecho do Dakar. Circuito lindo no antigo leito do rio, mas com barro e condições de pilotagem avançada; escolhemos a variante mais tranquila.",
    },
  "Ruta 153, San Juan": {
    en: "Route 153, San Juan",
    pt: "Ruta 153, San Juan",
  },
  "Ruta muy trabada debido a que ya no la mantienen, divertido para hacer un enduro suave, pero se desviaba del track original y no valia la pena debido a que era muy trabada.":
    {
      en: "A very blocked-up road because it is no longer maintained. Fun for light enduro, but it pulled us away from the original track and was too choked to be worth it.",
      pt: "Rota muito travada porque já não recebe manutenção. Divertida para um enduro leve, mas desviava do track original e era travada demais para valer a pena.",
    },
  Catamarca: {
    en: "Catamarca",
    pt: "Catamarca",
  },
  "Cuatro viajes, distintas respuestas.": {
    en: "Four trips, different answers.",
    pt: "Quatro viagens, respostas diferentes.",
  },
  "Las rutas tienen un sentido.": {
    en: "Routes have a direction.",
    pt: "As rotas têm um sentido.",
  },
  "Pruebas en campo reales, notas sobre la ruta y meses de planificación, dieron lugar a la versión final.":
    {
      en: "Real field tests, route notes, and months of planning led to the final version.",
      pt: "Testes reais em campo, notas sobre a rota e meses de planejamento deram lugar à versão final.",
    },
  "Campo de altura en Catamarca con una persona caminando hacia la montaña.": {
    en: "High-altitude field in Catamarca with a person walking toward the mountain.",
    pt: "Campo de altitude em Catamarca com uma pessoa caminhando em direção à montanha.",
  },
  "Todo empezó con un punto en el mapa: Antofagasta de la Sierra.": {
    en: "It all started with one point on the map: Antofagasta de la Sierra.",
    pt: "Tudo começou com um ponto no mapa: Antofagasta de la Sierra.",
  },
  "Equipo detenido junto a un cruce de agua en una quebrada de Catamarca.": {
    en: "Team stopped beside a water crossing in a Catamarca gorge.",
    pt: "Equipe parada junto a uma travessia de água em uma quebrada de Catamarca.",
  },
  "Cuatro viajes": {
    en: "Four trips",
    pt: "Quatro viagens",
  },
  "Entre 2021 y 2023 recorrimos Catamarca en diferentes estaciones.": {
    en: "Between 2021 and 2023 we rode Catamarca in different seasons.",
    pt: "Entre 2021 e 2023 rodamos Catamarca em diferentes estações.",
  },
  "Piloto en moto cruzando terreno volcánico durante una prueba en Catamarca.": {
    en: "Rider crossing volcanic terrain during a Catamarca test ride.",
    pt: "Piloto de moto cruzando terreno vulcânico durante um teste em Catamarca.",
  },
  "Antes de lanzar Catamarca": {
    en: "Before launching Catamarca",
    pt: "Antes de lançar Catamarca",
  },
  "Campamento de motos en un arenal entre paredes rocosas de Catamarca.": {
    en: "Motorcycle camp in a sand field between Catamarca rock walls.",
    pt: "Acampamento de motos em um areal entre paredes rochosas de Catamarca.",
  },
  "Ruta equilibrada": {
    en: "Balanced route",
    pt: "Rota equilibrada",
  },
  "El tour necesitaba ripio, asfalto, cruces de altura y jornadas que el grupo pudiera sostener.": {
    en: "The tour needed gravel, asphalt, high-altitude crossings, and days the group could sustain.",
    pt: "O tour precisava de terra, asfalto, travessias de altitude e jornadas que o grupo pudesse sustentar.",
  },
  "Moto detenida en un camino arenoso bajo nubes de tormenta en Catamarca.": {
    en: "Motorcycle stopped on a sandy road under storm clouds in Catamarca.",
    pt: "Moto parada em um caminho arenoso sob nuvens de tempestade em Catamarca.",
  },
  "Volvimos, ajustamos, mejoramos": {
    en: "We returned, adjusted, improved",
    pt: "Voltamos, ajustamos, melhoramos",
  },
  "Recorrimos variantes, invertimos etapas y ajustamos el recorrido hasta encontrar el equilibrio correcto.":
    {
      en: "We rode variants, inverted stages, and adjusted the route until we found the right balance.",
      pt: "Rodamos variantes, invertemos etapas e ajustamos o percurso até encontrar o equilíbrio certo.",
    },
  "Preferimos priorizar el ritmo general del viaje y el disfrute del recorrido.": {
    en: "We chose to prioritize the overall pace of the trip and enjoyment of the route.",
    pt: "Preferimos priorizar o ritmo geral da viagem e o aproveitamento do percurso.",
  },
  "Campo de Piedra Pómez por Las Papas durante una exploración de ruta.": {
    en: "Campo de Piedra Pomez through Las Papas during route scouting.",
    pt: "Campo de Pedra Pómez por Las Papas durante uma exploração de rota.",
  },
  "Las Papas": {
    en: "Las Papas",
    pt: "Las Papas",
  },
  "Una variante espectacular que no siempre suma al ritmo de un grupo.": {
    en: "A spectacular variant that does not always add to a group pace.",
    pt: "Uma variante espetacular que nem sempre soma ao ritmo de um grupo.",
  },
  "Campo de piedra Pómez via arenales de las papas": {
    en: "Campo de Piedra Pomez via the Las Papas sand fields",
    pt: "Campo de Pedra Pómez pelos areais de Las Papas",
  },
  "Una de las variantes más espectaculares para llegar a Campo de Piedra Pómez. Durante la temporada de lluvias, el acceso por Las Papas puede quedar intransitable y los largos arenales requieren experiencia real de manejo. Descartada por dificultad técnica.":
    {
      en: "One of the most spectacular variants to reach Campo de Piedra Pomez. During the rainy season, access through Las Papas can become impassable, and the long sand fields require real riding experience. Cut for technical difficulty.",
      pt: "Uma das variantes mais espetaculares para chegar ao Campo de Pedra Pómez. Na temporada de chuvas, o acesso por Las Papas pode ficar intransitável e os longos areais exigem experiência real de pilotagem. Descartada por dificuldade técnica.",
    },
  "Volcan Peinado": {
    en: "Volcan Peinado",
    pt: "Vulcão Peinado",
  },
  "De lo más impactante de Catamarca, descartado por las condiciones extremas. Aislación absoluta, gran altitud y una jornada de 11 hs de manejo por todo tipo de camino.":
    {
      en: "One of Catamarca's most powerful places, cut for extreme conditions: total isolation, high altitude, and an 11-hour riding day over every kind of road.",
      pt: "Um dos pontos mais impactantes de Catamarca, descartado pelas condições extremas: isolamento absoluto, grande altitude e uma jornada de 11 h por todo tipo de caminho.",
    },
  "Laguna verde": {
    en: "Laguna Verde",
    pt: "Laguna Verde",
  },
  "Descartamos esa variante ya que la jornada sería demasiado larga y físicamente exigente.": {
    en: "We cut that variant because the day would be too long and physically demanding.",
    pt: "Descartamos essa variante porque a jornada seria longa demais e fisicamente exigente.",
  },
  "Cuesta de zapata": {
    en: "Cuesta de Zapata",
    pt: "Cuesta de Zapata",
  },
  "Sección que une Tinogasta con Belén por un camino entretenido de manejar. Destinado a ser el tercer día del tour, fue descartado ya que priorizamos un día de manejo de recuperación de los pilotos.":
    {
      en: "A section connecting Tinogasta with Belen on a road that is fun to ride. It was intended as the third day of the tour, but we cut it to prioritize a recovery riding day for the riders.",
      pt: "Seção que une Tinogasta a Belén por um caminho divertido de pilotar. Pensada para o terceiro dia do tour, foi descartada porque priorizamos um dia de recuperação para os pilotos.",
    },
  "Volcan Galan": {
    en: "Volcan Galan",
    pt: "Vulcão Galán",
  },
  "La sensación de manejar la moto por el interior del volcán es algo único. Aunque exploramos incorporarlo a este recorrido, finalmente quedó afuera por su dificultad técnica y exigencia física.":
    {
      en: "Riding inside the volcano is a unique feeling. We explored adding it to this route, but it ultimately stayed out because of technical difficulty and physical demand.",
      pt: "A sensação de pilotar a moto por dentro do vulcão é única. Exploramos incorporar ao percurso, mas ficou fora pela dificuldade técnica e exigência física.",
    },
  "Carretera Austral y Patagonia": {
    en: "Carretera Austral and Patagonia",
    pt: "Carretera Austral e Patagônia",
  },
  "Cuatro pasos probados antes de quedarnos con Futaleufú.": {
    en: "Four passes tested before we kept Futaleufu.",
    pt: "Quatro passos testados antes de ficarmos com Futaleufú.",
  },
  "Queda lo que sostiene el viaje.": {
    en: "What sustains the trip stays.",
    pt: "Fica o que sustenta a viagem.",
  },
  "Patagonia obligó a elegir: frontera, ferry, ripio, distancia y luz. El recorrido final mantiene el viaje vivo sin romper el grupo.":
    {
      en: "Patagonia forced choices: border, ferry, gravel, distance, and daylight. The final route keeps the trip alive without breaking the group.",
      pt: "A Patagônia obrigou a escolher: fronteira, balsa, terra, distância e luz. O percurso final mantém a viagem viva sem quebrar o grupo.",
    },
  "Piloto cruzando agua sobre una moto durante el armado de Cruces del Sur.": {
    en: "Rider crossing water on a motorcycle during the build of Cruces del Sur.",
    pt: "Piloto cruzando água de moto durante a montagem de Cruces del Sur.",
  },
  "Cruce probado": {
    en: "Tested crossing",
    pt: "Travessia testada",
  },
  "El paso a Chile tenía que aguantar agua, ripio y ritmo de grupo.": {
    en: "The pass into Chile had to hold water, gravel, and group pace.",
    pt: "O passo para o Chile tinha que aguentar água, terra e ritmo de grupo.",
  },
  "Formaciones rocosas patagónicas recorridas durante el armado de Cruces del Sur.": {
    en: "Patagonian rock formations ridden during the build of Cruces del Sur.",
    pt: "Formações rochosas patagônicas percorridas durante a montagem de Cruces del Sur.",
  },
  "Terreno elegido": {
    en: "Chosen terrain",
    pt: "Terreno escolhido",
  },
  "Cada paisaje entra cuando también cierra la logística del día.": {
    en: "A landscape enters only when the day's logistics also close.",
    pt: "Cada paisagem entra quando a logística do dia também fecha.",
  },
  "Pilotos junto a motos cargadas en un camino de ripio durante Cruces del Sur.": {
    en: "Riders beside loaded motorcycles on a gravel road during Cruces del Sur.",
    pt: "Pilotos junto a motos carregadas em um caminho de terra durante Cruces del Sur.",
  },
  "Ritmo real": {
    en: "Real pace",
    pt: "Ritmo real",
  },
  "Probamos paradas, tiempos y dificultad con motos cargadas.": {
    en: "We tested stops, timing, and difficulty with loaded bikes.",
    pt: "Testamos paradas, tempos e dificuldade com motos carregadas.",
  },
  "Motos avanzando por ruta patagónica durante una exploración de Cruces del Sur.": {
    en: "Motorcycles moving along a Patagonian route during Cruces del Sur scouting.",
    pt: "Motos avançando por rota patagônica durante uma exploração de Cruces del Sur.",
  },
  "Ruta final": {
    en: "Final route",
    pt: "Rota final",
  },
  "La Austral se gana por ripio, ritmo y días largos.": {
    en: "The Austral is earned through gravel, pace, and long days.",
    pt: "A Austral se ganha por terra, ritmo e dias longos.",
  },
  "Campamento de motos junto a un lago patagónico.": {
    en: "Motorcycle camp beside a Patagonian lake.",
    pt: "Acampamento de motos junto a um lago patagônico.",
  },
  Alternativa: {
    en: "Alternative",
    pt: "Alternativa",
  },
  "Algunos desvíos daban paisaje, pero rompían el regreso.": {
    en: "Some detours gave landscape, but broke the return.",
    pt: "Alguns desvios davam paisagem, mas quebravam a volta.",
  },
  "Piloto atravesando un camino de ripio entre montañas de Patagonia.": {
    en: "Rider crossing a gravel road between Patagonian mountains.",
    pt: "Piloto atravessando um caminho de terra entre montanhas da Patagônia.",
  },
  Track: {
    en: "Track",
    pt: "Track",
  },
  "El mapa sirve cuando ya volvió cubierto de correcciones.": {
    en: "The map works when it has already come back covered in corrections.",
    pt: "O mapa serve quando já voltou coberto de correções.",
  },
  "Moto caída sobre nieve durante una prueba de condiciones patagónicas.": {
    en: "Motorcycle down on snow during a Patagonian conditions test.",
    pt: "Moto caída sobre neve durante um teste de condições patagônicas.",
  },
  "Condición real": {
    en: "Real condition",
    pt: "Condição real",
  },
  "También medimos dónde una variante deja de sumar y empieza a romper el viaje.": {
    en: "We also measured where a variant stops adding and starts breaking the trip.",
    pt: "Também medimos onde uma variante deixa de somar e começa a quebrar a viagem.",
  },
  "pasos probados": {
    en: "passes tested",
    pt: "passos testados",
  },
  "km finales": {
    en: "final km",
    pt: "km finais",
  },
  ripio: {
    en: "gravel",
    pt: "terra",
  },
  días: {
    en: "days",
    pt: "dias",
  },
  Entró: {
    en: "In",
    pt: "Entrou",
  },
  "Futaleufú, porque empalma directo con el corazón de la Austral.": {
    en: "Futaleufu, because it connects directly with the heart of the Austral.",
    pt: "Futaleufú, porque conecta direto com o coração da Austral.",
  },
  Salió: {
    en: "Out",
    pt: "Saiu",
  },
  "Caleta Tortel como cierre: hermoso, pero castigaba la vuelta.": {
    en: "Caleta Tortel as the close: beautiful, but it punished the return.",
    pt: "Caleta Tortel como fechamento: lindo, mas castigava a volta.",
  },
  Ajustamos: {
    en: "Adjusted",
    pt: "Ajustamos",
  },
  "Los Alerces quedó con paradas medidas para llegar con luz.": {
    en: "Los Alerces stayed with measured stops so the group arrives with daylight.",
    pt: "Los Alerces ficou com paradas medidas para chegar com luz.",
  },
  "Dos pilotos detenidos junto a un cartel de desvío durante una exploración de ruta.": {
    en: "Two riders stopped beside a detour sign during route scouting.",
    pt: "Dois pilotos parados junto a uma placa de desvio durante uma exploração de rota.",
  },
  "Horas de exploración": {
    en: "Hours of scouting",
    pt: "Horas de exploração",
  },
  "Cada desvío se prueba antes de entrar a un itinerario.": {
    en: "Every detour is tested before it enters an itinerary.",
    pt: "Cada desvio é testado antes de entrar em um itinerário.",
  },
  "Pilotos y motos detenidos junto a una construcción rural durante una prueba de ruta.": {
    en: "Riders and motorcycles stopped beside a rural building during a route test.",
    pt: "Pilotos e motos parados junto a uma construção rural durante um teste de rota.",
  },
  "Salida de prueba": {
    en: "Test run",
    pt: "Saída de teste",
  },
  "Cada recorrido empieza con kilómetros reales, no con una línea dibujada.": {
    en: "Every route starts with real kilometers, not a drawn line.",
    pt: "Cada percurso começa com quilômetros reais, não com uma linha desenhada.",
  },
  "Motos y carpas junto a un lago durante una exploración de ruta.": {
    en: "Motorcycles and tents beside a lake during route scouting.",
    pt: "Motos e barracas junto a um lago durante uma exploração de rota.",
  },
  "Noche medida": {
    en: "Measured night",
    pt: "Noite medida",
  },
  "Probamos dónde conviene cortar el día y cómo responde el grupo.": {
    en: "We test where the day should stop and how the group responds.",
    pt: "Testamos onde convém cortar o dia e como o grupo responde.",
  },
  "Formaciones rocosas altas en una quebrada recorrida durante el armado de ruta.": {
    en: "Tall rock formations in a quebrada ridden while building the route.",
    pt: "Formações rochosas altas em uma quebrada percorrida durante a montagem da rota.",
  },
  "Medimos paradas, tiempos y dificultad con motos cargadas.": {
    en: "We measure stops, timing, and difficulty with loaded motorcycles.",
    pt: "Medimos paradas, tempos e dificuldade com motos carregadas.",
  },
  "Pilotos junto a motos cargadas en un camino de ripio de montaña.": {
    en: "Riders beside loaded motorcycles on a mountain gravel road.",
    pt: "Pilotos junto a motos carregadas em um caminho de ripio de montanha.",
  },
  "Piloto en moto pasando un cartel naranja en un camino de montaña.": {
    en: "Rider passing an orange sign on a mountain road.",
    pt: "Piloto de moto passando por uma placa laranja em um caminho de montanha.",
  },
  "Camino revisado": {
    en: "Reviewed road",
    pt: "Caminho revisado",
  },
  "Volvemos al terreno hasta saber qué tramo aguanta.": {
    en: "We return to the terrain until we know which section holds.",
    pt: "Voltamos ao terreno até saber qual trecho aguenta.",
  },
  "Piloto cruzando agua sobre una moto durante un testeo de ruta.": {
    en: "Rider crossing water on a motorcycle during a route test.",
    pt: "Piloto cruzando água de moto durante um teste de rota.",
  },
  "Hay horas de testeo antes de abrir cupos.": {
    en: "There are hours of testing before we open spots.",
    pt: "Há horas de teste antes de abrir vagas.",
  },
  "Moto avanzando por barro y nieve durante una exploración de montaña.": {
    en: "Motorcycle moving through mud and snow during mountain scouting.",
    pt: "Moto avançando por barro e neve durante uma exploração de montanha.",
  },
  "Barro y nieve": {
    en: "Mud and snow",
    pt: "Barro e neve",
  },
  "El mapa no cuenta cómo cambia el terreno bajo la rueda.": {
    en: "The map does not show how the ground changes under the wheel.",
    pt: "O mapa não conta como o terreno muda debaixo da roda.",
  },
  "Piloto en moto atravesando una ladera nevada en alta montaña.": {
    en: "Rider crossing a snowy high-mountain slope by motorcycle.",
    pt: "Piloto de moto atravessando uma encosta nevada em alta montanha.",
  },
  "Altura testeada": {
    en: "Tested altitude",
    pt: "Altitude testada",
  },
  "Probamos dificultad real, no dificultad imaginada.": {
    en: "We test real difficulty, not imagined difficulty.",
    pt: "Testamos dificuldade real, não dificuldade imaginada.",
  },
  "Valle de alta montaña con nieve durante una exploración de ruta.": {
    en: "High-mountain valley with snow during route scouting.",
    pt: "Vale de alta montanha com neve durante uma exploração de rota.",
  },
  "Ventana de clima": {
    en: "Weather window",
    pt: "Janela de clima",
  },
  "Las estaciones cambian el viaje; por eso volvemos.": {
    en: "Seasons change the trip, so we return.",
    pt: "As estações mudam a viagem; por isso voltamos.",
  },
  "Moto caída en un camino nevado durante una prueba de condiciones reales.": {
    en: "Motorcycle down on a snowy road during a real-conditions test.",
    pt: "Moto caída em um caminho nevado durante um teste de condições reais.",
  },
  "También medimos dónde el viaje deja de sumar y empieza a romper el ritmo.": {
    en: "We also measure where the trip stops adding and starts breaking the rhythm.",
    pt: "Também medimos onde a viagem deixa de somar e começa a quebrar o ritmo.",
  },
};

export const WORKSHOP_CASES: Record<string, WorkshopCase> = {
  "armar-sobre-las-nubes": {
    slug: "armar-sobre-las-nubes",
    tourSlug: "sobre-las-nubes",
    routeName: "Sobre las Nubes",
    region: "Salta y Jujuy",
    kicker: "Tres viajes, épocas descartadas.",
    quote: "El punto más alto de toda la Ruta 40 no podía faltar en este viaje.",
    fieldNote:
      "Buscamos escapar del clásico viaje por Salta y Jujuy donde domina el asfalto y mostrar los pueblos más pequeños, adentrados en la montaña.",
    hero: {
      src: "/images/optimized/workshop/armar-sobre-las-nubes.jpg",
      alt: "Piloto y moto en sombra frente a un paredón rural durante el armado de Sobre las Nubes.",
      label: "La primera idea",
      caption:
        "Escapar del circuito clásico y entrar a pueblos más chicos, más metidos en la montaña.",
    },
    images: [
      {
        src: "/images/taller_de_rutas/sobre-las-nubes/1.jpeg",
        alt: "Equipo reparando una moto en una ladera seca durante una exploración de Salta y Jujuy.",
        label: "Tres viajes, épocas descartadas",
        caption: "Entre 2021 y 2022 volvimos tres veces para medir clima, asistencia y ritmo real.",
      },
      {
        src: "/images/taller_de_rutas/sobre-las-nubes/2.jpeg",
        alt: "Moto cargada avanzando entre cerros de Salta durante una prueba de camino.",
        label: "Variantes de altura",
        caption: "Probamos desvíos, combustible y cortes de jornada antes de fijar el track.",
      },
      {
        src: "/images/taller_de_rutas/sobre-las-nubes/5.jpeg",
        alt: "Camino de montaña con ripio y curvas durante el armado de Sobre las Nubes.",
        label: "Abra del Acay",
        caption: "La mejor versión es entrando por el sur: más progresivo, más épico.",
      },
      {
        src: "/images/taller_de_rutas/sobre-las-nubes/4.jpeg",
        alt: "Piloto y moto detenidos en una quebrada de altura del norte argentino.",
        label: "Volvimos y ajustamos",
        caption:
          "El recorrido quedó cuando el desafío, la seguridad y el paisaje empezaron a calzar.",
      },
    ],
    stats: [
      { value: "3", label: "viajes de exploración" },
      { value: "2", label: "variantes probadas" },
      { value: "2", label: "test runs" },
      { value: "3", label: "ajustes" },
      { value: "3", label: "circuitos descartados" },
    ],
    decisionSection: {
      eyebrow: "Tramos descartados",
      title: "TRAMOS DESCARTADOS",
      intro:
        "Priorizamos el paso por las Yungas y la transición espectacular entre selva, montaña y altura.",
      image: {
        src: "/images/taller_de_rutas/sobre-las-nubes/3.jpeg",
        alt: "Piloto cruzando agua entre vegetación cerrada durante el armado de Sobre las Nubes.",
        label: "Yungas",
        caption: "La transición entre selva, montaña y altura definió qué tramos valían quedarse.",
      },
    },
    decisions: [
      {
        label: "Iruya",
        body: "Decidimos dejar Iruya fuera del recorrido no por su dificultad, sino porque requería una jornada dedicada exclusivamente a ese destino. Priorizamos el paso por las Yungas y la transición espectacular entre selva, montaña y altura.",
        kind: "out",
      },
      {
        label: "Nazareno",
        body: "Derrumbes frecuentes en la zona del Abra de la Cruz y sectores cercanos, que pueden cortar el camino sin aviso. Crecida repentina de ríos, especialmente después de lluvias en altura, lo que vuelve imposible el cruce incluso para motos livianas.",
        kind: "out",
      },
    ],
  },
  "armar-gigantes-del-oeste": {
    slug: "armar-gigantes-del-oeste",
    tourSlug: "gigantes-del-oeste",
    routeName: "Gigantes del Oeste",
    region: "Mendoza a La Rioja",
    kicker: "El Cuyo que no se conoce.",
    quote: "Cada tramo quedó elegido por una razón: seguridad, fluidez, vistas y emoción.",
    fieldNote:
      "Mendoza, San Juan y La Rioja tienen rutas increíbles. Nosotros queríamos unir caminos que casi nadie combina.",
    hero: {
      src: "/images/optimized/workshop/armar-gigantes-del-oeste.jpg",
      alt: "Camino de ripio abriéndose entre cerros durante el armado de Gigantes del Oeste.",
      label: "El Cuyo que no se conoce",
      caption: "Queríamos un viaje que no fuera la típica vuelta por una sola provincia.",
    },
    images: [
      {
        src: "/images/taller_de_rutas/gigantes-del-oeste/20260422_135440.jpg",
        alt: "Camino de montaña cortando un valle árido de Cuyo durante una prueba de ruta.",
        label: "Aventura, historia y silencio",
        caption: "365 curvas, una por cada día del año.",
      },
      {
        src: "/images/taller_de_rutas/gigantes-del-oeste/20260422_141845.jpg",
        alt: "Ruta de altura en Mendoza y San Juan con cerros al fondo.",
        label: "Unificar rutas",
        caption: "El desafío fue armar un viaje que tomará lo mejor de cada provincia.",
      },
      {
        src: "/images/taller_de_rutas/gigantes-del-oeste/20260422_173156.jpg",
        alt: "Camino de ripio atravesando un paisaje de alta montaña del oeste argentino.",
        label: "Versión final",
        caption: "Terminamos el viaje cansados, felices… y con ganas de volver a hacerlo.",
      },
      {
        src: "/images/taller_de_rutas/gigantes-del-oeste/10.jpg",
        alt: "Camino ancho en la cordillera durante un test de Gigantes del Oeste.",
        label: "Ajuste de ritmo",
        caption: "Cada tramo quedó elegido por seguridad, fluidez, vistas y emoción.",
      },
    ],
    stats: [
      { value: "4", label: "viajes de exploración" },
      { value: "1", label: "variante probadas" },
      { value: "2", label: "ajustes de ruta" },
      { value: "2", label: "tramos descartados" },
      { value: "1", label: "versión final que nos dejó orgullosos" },
    ],
    decisionSection: {
      eyebrow: "Tramos que descartamos",
      title: "TRAMOS QUE DESCARTAMOS",
      intro: "Cada tramo quedó elegido por una razón: seguridad, fluidez, vistas y emoción.",
    },
    decisions: [
      {
        label: "Paso Agua Negra",
        body: "Un paso fronterizo espectacular, pero demasiado impredecible: condiciones blancas, cierres repentinos de frontera y riesgo alto para grupos. Lo probamos, pero no garantiza continuidad ni seguridad. Quedó afuera.",
        kind: "out",
      },
      {
        label: "Corona del Inca",
        body: "El camino es más técnico, más expuesto y con zonas de arena profunda. Para un tour de viaje —no de enduro— no suma. Optamos por hacer el recorrido de Laguna Brava, la variante: más progresiva y más disfrutable.",
        kind: "out",
      },
      {
        label: "Quebrada del Yeso",
        body: "Una variante en el tramo del día de Laguna Brava, era un antiguo tramo que corría el Dakar. Hermoso circuito internado en el antiguo lecho del río, pero presenta barro y condiciones de manejo avanzado, optamos por la variable más tranquila.",
        kind: "out",
      },
      {
        label: "Ruta 153, San Juan",
        body: "Ruta muy trabada debido a que ya no la mantienen, divertido para hacer un enduro suave, pero se desviaba del track original y no valia la pena debido a que era muy trabada.",
        kind: "out",
      },
    ],
  },
  "armar-volcanes-del-norte": {
    slug: "armar-volcanes-del-norte",
    tourSlug: "volcanes-del-norte",
    routeName: "Volcanes del Norte",
    region: "Catamarca",
    kicker: "Cuatro viajes, distintas respuestas.",
    quote: "Las rutas tienen un sentido.",
    fieldNote:
      "Pruebas en campo reales, notas sobre la ruta y meses de planificación, dieron lugar a la versión final.",
    hero: {
      src: "/images/optimized/workshop/armar-volcanes-del-norte.jpg",
      alt: "Campo de altura en Catamarca con una persona caminando hacia la montaña.",
      label: "La Primera Idea",
      caption: "Todo empezó con un punto en el mapa: Antofagasta de la Sierra.",
    },
    images: [
      {
        src: "/images/taller_de_rutas/volcanes-norte/cuatro viajes, distintas respuestas.jpeg",
        alt: "Equipo detenido junto a un cruce de agua en una quebrada de Catamarca.",
        label: "Cuatro viajes",
        caption: "Entre 2021 y 2023 recorrimos Catamarca en diferentes estaciones.",
      },
      {
        src: "/images/taller_de_rutas/volcanes-norte/Antes de Lanzar Catamarca.png",
        alt: "Piloto en moto cruzando terreno volcánico durante una prueba en Catamarca.",
        label: "Antes de lanzar Catamarca",
        caption: "Probamos variantes, distancias, tiempos y puntos clave de abastecimiento.",
      },
      {
        src: "/images/taller_de_rutas/volcanes-norte/Ruta Equilibrada.jpg",
        alt: "Campamento de motos en un arenal entre paredes rocosas de Catamarca.",
        label: "Ruta equilibrada",
        caption:
          "El tour necesitaba ripio, asfalto, cruces de altura y jornadas que el grupo pudiera sostener.",
      },
      {
        src: "/images/taller_de_rutas/volcanes-norte/Volvimos, ajustamos, mejoramos.jpg",
        alt: "Moto detenida en un camino arenoso bajo nubes de tormenta en Catamarca.",
        label: "Volvimos, ajustamos, mejoramos",
        caption:
          "Recorrimos variantes, invertimos etapas y ajustamos el recorrido hasta encontrar el equilibrio correcto.",
      },
    ],
    stats: [
      { value: "4", label: "viajes de exploración" },
      { value: "5", label: "variantes probadas" },
      { value: "2", label: "test runs" },
      { value: "4", label: "ajustes" },
      { value: "2", label: "circuitos descartados" },
    ],
    decisionSection: {
      eyebrow: "Tramos que descartamos",
      title: "TRAMOS QUE DESCARTAMOS",
      intro: "Preferimos priorizar el ritmo general del viaje y el disfrute del recorrido.",
      image: {
        src: "/images/taller_de_rutas/volcanes-norte/Campo de Piedra Pomez via las Papas 2.jpg",
        alt: "Campo de Piedra Pómez por Las Papas durante una exploración de ruta.",
        label: "Las Papas",
        caption: "Una variante espectacular que no siempre suma al ritmo de un grupo.",
      },
    },
    decisions: [
      {
        label: "Campo de piedra Pómez via arenales de las papas",
        body: "Una de las variantes más espectaculares para llegar a Campo de Piedra Pómez. Durante la temporada de lluvias, el acceso por Las Papas puede quedar intransitable y los largos arenales requieren experiencia real de manejo. Descartada por dificultad técnica.",
        kind: "out",
      },
      {
        label: "Volcan Peinado",
        body: "De lo más impactante de Catamarca, descartado por las condiciones extremas. Aislación absoluta, gran altitud y una jornada de 11 hs de manejo por todo tipo de camino.",
        kind: "out",
      },
      {
        label: "Laguna verde",
        body: "Descartamos esa variante ya que la jornada sería demasiado larga y físicamente exigente.",
        kind: "out",
      },
      {
        label: "Cuesta de zapata",
        body: "Sección que une Tinogasta con Belén por un camino entretenido de manejar. Destinado a ser el tercer día del tour, fue descartado ya que priorizamos un día de manejo de recuperación de los pilotos.",
        kind: "out",
      },
      {
        label: "Volcan Galan",
        body: "La sensación de manejar la moto por el interior del volcán es algo único. Aunque exploramos incorporarlo a este recorrido, finalmente quedó afuera por su dificultad técnica y exigencia física.",
        kind: "out",
      },
    ],
  },
  "armar-cruces-del-sur": {
    slug: "armar-cruces-del-sur",
    tourSlug: "cruces-del-sur",
    routeName: "Cruces del Sur",
    region: "Carretera Austral y Patagonia",
    kicker: "Cuatro pasos probados antes de quedarnos con Futaleufú.",
    quote: "Queda lo que sostiene el viaje.",
    fieldNote:
      "Patagonia obligó a elegir: frontera, ferry, ripio, distancia y luz. El recorrido final mantiene el viaje vivo sin romper el grupo.",
    hero: {
      src: "/images/optimized/workshop/armar-cruces-del-sur.jpg",
      alt: "Piloto cruzando agua sobre una moto durante el armado de Cruces del Sur.",
      label: "Cruce probado",
      caption: "El paso a Chile tenía que aguantar agua, ripio y ritmo de grupo.",
    },
    images: [
      {
        src: "/images/taller_de_rutas/cruces-del-sur/DSC04474.jpg",
        alt: "Formaciones rocosas patagónicas recorridas durante el armado de Cruces del Sur.",
        label: "Terreno elegido",
        caption: "Cada paisaje entra cuando también cierra la logística del día.",
      },
      {
        src: "/images/taller_de_rutas/cruces-del-sur/DSC04536.jpg",
        alt: "Pilotos junto a motos cargadas en un camino de ripio durante Cruces del Sur.",
        label: "Ritmo real",
        caption: "Probamos paradas, tiempos y dificultad con motos cargadas.",
      },
      {
        src: "/images/taller_de_rutas/cruces-del-sur/DSC04248.jpg",
        alt: "Motos avanzando por ruta patagónica durante una exploración de Cruces del Sur.",
        label: "Ruta final",
        caption: "La Austral se gana por ripio, ritmo y días largos.",
      },
      {
        src: "/images/taller_de_rutas/cruces-del-sur/DSC04356.jpg",
        alt: "Campamento de motos junto a un lago patagónico.",
        label: "Alternativa",
        caption: "Algunos desvíos daban paisaje, pero rompían el regreso.",
      },
      {
        src: "/images/taller_de_rutas/cruces-del-sur/DSC04649.jpg",
        alt: "Piloto atravesando un camino de ripio entre montañas de Patagonia.",
        label: "Track",
        caption: "El mapa sirve cuando ya volvió cubierto de correcciones.",
      },
      {
        src: "/images/taller_de_rutas/cruces-del-sur/caida 1.png",
        alt: "Moto caída sobre nieve durante una prueba de condiciones patagónicas.",
        label: "Condición real",
        caption: "También medimos dónde una variante deja de sumar y empieza a romper el viaje.",
      },
    ],
    stats: [
      { value: "4", label: "pasos probados" },
      { value: "2321", label: "km finales" },
      { value: "45%", label: "ripio" },
      { value: "7", label: "días" },
    ],
    decisions: [
      {
        label: "Entró",
        body: "Futaleufú, porque empalma directo con el corazón de la Austral.",
      },
      {
        label: "Salió",
        body: "Caleta Tortel como cierre: hermoso, pero castigaba la vuelta.",
      },
      {
        label: "Ajustamos",
        body: "Los Alerces quedó con paradas medidas para llegar con luz.",
      },
    ],
  },
};

export function localizeWorkshopText(locale: Locale, value: string): string {
  if (locale === "es") return value;
  return WORKSHOP_TRANSLATIONS[value]?.[locale] ?? value;
}

export function localizeWorkshopImage(image: WorkshopCaseImage, locale: Locale): WorkshopCaseImage {
  return {
    ...image,
    alt: localizeWorkshopText(locale, image.alt),
    label: localizeWorkshopText(locale, image.label),
    caption: localizeWorkshopText(locale, image.caption),
  };
}

function localizeWorkshopCase(item: WorkshopCase, locale: Locale): WorkshopCase {
  if (locale === "es") return item;

  return {
    ...item,
    region: localizeWorkshopText(locale, item.region),
    kicker: localizeWorkshopText(locale, item.kicker),
    quote: localizeWorkshopText(locale, item.quote),
    fieldNote: localizeWorkshopText(locale, item.fieldNote),
    hero: localizeWorkshopImage(item.hero, locale),
    images: item.images.map((image) => localizeWorkshopImage(image, locale)),
    stats: item.stats.map((stat) => ({
      ...stat,
      label: localizeWorkshopText(locale, stat.label),
    })),
    decisions: item.decisions.map((decision) => ({
      ...decision,
      label: localizeWorkshopText(locale, decision.label),
      body: localizeWorkshopText(locale, decision.body),
    })),
    decisionSection: item.decisionSection
      ? {
          ...item.decisionSection,
          eyebrow: localizeWorkshopText(locale, item.decisionSection.eyebrow),
          title: localizeWorkshopText(locale, item.decisionSection.title),
          intro: item.decisionSection.intro
            ? localizeWorkshopText(locale, item.decisionSection.intro)
            : undefined,
          image: item.decisionSection.image
            ? localizeWorkshopImage(item.decisionSection.image, locale)
            : undefined,
        }
      : undefined,
  };
}

export function getWorkshopCase(slug: string, locale: Locale = "es"): WorkshopCase | null {
  const item = WORKSHOP_CASES[slug];
  return item ? localizeWorkshopCase(item, locale) : null;
}

export function listWorkshopCases(slugs: string[], locale: Locale = "es"): WorkshopCase[] {
  return slugs
    .map((slug) => WORKSHOP_CASES[slug])
    .filter((item): item is WorkshopCase => Boolean(item))
    .map((item) => localizeWorkshopCase(item, locale));
}
