export type WorkshopCaseImage = {
  src: string;
  alt: string;
  label: string;
  caption: string;
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
      src: "/images/tours/sobre_las_nubes/20260311_100314.jpg",
      alt: "Dos motos detenidas en una ruta de altura de Salta y Jujuy.",
      label: "Buscando alternativas",
      caption:
        "Queríamos escapar del clásico viaje por Salta y Jujuy donde domina el asfalto.",
    },
    images: [
      {
        src: "/images/tours/sobre_las_nubes/sobre_las_nubes_1_color.jpg",
        alt: "Montañas sobre un mar de nubes en Salta.",
        label: "Tres viajes, épocas descartadas",
        caption: "Entre 2021 y 2022 fuimos tres veces.",
      },
      {
        src: "/images/tours/sobre_las_nubes/Fondo.jpg",
        alt: "Camino de ripio entre cerros del norte argentino.",
        label: "Versión final: un viaje que desafía",
        caption: "Lo fácil hubiera sido evitar los caminos secundarios de tierra, arena y ripio.",
      },
      {
        src: "/images/tours/sobre_las_nubes/20260402_180621.jpg",
        alt: "Ruta de montaña al atardecer en el norte argentino.",
        label: "Abra del Acay",
        caption: "La mejor versión es entrando por el sur: más progresivo, más épico.",
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
      intro: "Priorizamos el paso por las Yungas y la transición espectacular entre selva, montaña y altura.",
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
      src: "/images/tours/gigantes_del_oeste/gigantes_del_oeste_1_color.jpg",
      alt: "Riders detenidos en una ruta de alta montaña del oeste argentino.",
      label: "El Cuyo que no se conoce",
      caption: "Queríamos un viaje que no fuera la típica vuelta por una sola provincia.",
    },
    images: [
      {
        src: "/images/tours/gigantes_del_oeste/20231105_141145.jpg",
        alt: "Dos motos frente a una quebrada de montaña en Cuyo.",
        label: "Aventura, historia y silencio",
        caption: "365 curvas, una por cada día del año.",
      },
      {
        src: "/images/tours/gigantes_del_oeste/20231107_162749.jpg",
        alt: "Camino de montaña con motos avanzando en el oeste argentino.",
        label: "Unificar rutas",
        caption: "El desafío fue armar un viaje que tomará lo mejor de cada provincia.",
      },
      {
        src: "/images/tours/gigantes_del_oeste/IMG-20260421-WA0103.jpg",
        alt: "Moto en ripio de altura durante una prueba de ruta.",
        label: "Versión final",
        caption: "Terminamos el viaje cansados, felices… y con ganas de volver a hacerlo.",
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
        body: "Un paso fronterizo espectacular, pero demasiado impredecible: viento blanco, cierres repentinos de frontera y riesgo alto para grupos. Lo probamos, pero no garantiza continuidad ni seguridad. Quedó afuera.",
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
      src: "/images/tours/volcanes_del_norte/volcanes_del_norte_1_color.jpg",
      alt: "Riders avanzando por ripio en una ruta volcánica de Catamarca.",
      label: "La Primera Idea",
      caption: "Todo empezó con un punto en el mapa: Antofagasta de la Sierra.",
    },
    images: [
      {
        src: "/images/tours/volcanes_del_norte/1.jpg",
        alt: "Riders en una planicie de ripio de la Puna catamarqueña.",
        label: "Cuatro viajes",
        caption: "Entre 2021 y 2023 recorrimos Catamarca en diferentes estaciones.",
      },
      {
        src: "/images/tours/volcanes_del_norte/5.png",
        alt: "Camino ancho de altura en Catamarca.",
        label: "Ruta equilibrada",
        caption: "El tour necesitaba contraste.",
      },
      {
        src: "/images/tours/volcanes_del_norte/11.jpeg",
        alt: "Riders junto a una moto en la montaña nevada de Catamarca.",
        label: "Ajustes",
        caption: "Recorrimos variantes, invertimos etapas y ajustamos el recorrido hasta encontrar el equilibrio correcto.",
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
    quote: "Lo que se queda es lo que aguanta el viento.",
    fieldNote:
      "Patagonia obligó a elegir: frontera, ferry, ripio, distancia, luz y viento. El recorrido final es el que mantiene el viaje vivo sin romper el grupo.",
    hero: {
      src: "/images/tours/cruces_del_sur/1.jpg",
      alt: "Ruta patagónica con cielo de tormenta y bandera argentina.",
      label: "Paso probado",
      caption: "El cruce a Chile tenía que sumar paisaje, no perder ritmo.",
    },
    images: [
      {
        src: "/images/tours/cruces_del_sur/cruces_del_sur_1_color.jpeg",
        alt: "Riders avanzando por ripio en Patagonia.",
        label: "Ruta final",
        caption: "La Austral se gana por ripio, viento y días largos.",
      },
      {
        src: "/images/tours/cruces_del_sur/2.jpg",
        alt: "Lago patagónico junto a una ruta de ripio.",
        label: "Alternativa",
        caption: "Algunos desvíos daban paisaje, pero rompían el regreso.",
      },
      {
        src: "/images/tours/cruces_del_sur/5.png",
        alt: "Mapa de ruta patagónica con lagos y cordillera.",
        label: "Track",
        caption: "El mapa sirve cuando ya volvió cubierto de correcciones.",
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

export function getWorkshopCase(slug: string): WorkshopCase | null {
  return WORKSHOP_CASES[slug] ?? null;
}

export function listWorkshopCases(slugs: string[]): WorkshopCase[] {
  return slugs
    .map((slug) => WORKSHOP_CASES[slug])
    .filter((item): item is WorkshopCase => Boolean(item));
}
