export type WorkshopCaseImage = {
  src: string;
  alt: string;
  label: string;
  caption: string;
};

export type WorkshopDecision = {
  label: string;
  body: string;
};

export type WorkshopStat = {
  value: string;
  label: string;
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
};

export const WORKSHOP_CASES: Record<string, WorkshopCase> = {
  "armar-sobre-las-nubes": {
    slug: "armar-sobre-las-nubes",
    tourSlug: "sobre-las-nubes",
    routeName: "Sobre las Nubes",
    region: "Salta y Jujuy",
    kicker: "Cuatro vueltas antes de dejar el Acay como vara.",
    quote: "Si la ruta no se rodó cuatro veces, no es una ruta. Es una idea.",
    fieldNote:
      "El norte cambió cuando dejamos de pensar en un circuito lindo y empezamos a medir altura, sueño, combustible y margen real para un grupo.",
    hero: {
      src: "/images/tours/sobre_las_nubes/20260311_100314.jpg",
      alt: "Dos motos detenidas en una ruta de altura de Salta y Jujuy.",
      label: "Prueba de altura",
      caption: "El día de altura tenía que correrse entero, no en tramos sueltos.",
    },
    images: [
      {
        src: "/images/tours/sobre_las_nubes/sobre_las_nubes_1_color.jpg",
        alt: "Montañas sobre un mar de nubes en Salta.",
        label: "4895 msnm",
        caption: "El Abra del Acay quedó como el punto que ordena la ruta.",
      },
      {
        src: "/images/tours/sobre_las_nubes/Fondo.jpg",
        alt: "Camino de ripio entre cerros del norte argentino.",
        label: "Variante probada",
        caption: "Cada sentido cambia la llegada, el cansancio y la luz.",
      },
      {
        src: "/images/tours/sobre_las_nubes/20260402_180621.jpg",
        alt: "Ruta de montaña al atardecer en el norte argentino.",
        label: "Cierre del día",
        caption: "La logística se gana cuando todavía queda sol.",
      },
    ],
    stats: [
      { value: "4", label: "viajes de prueba" },
      { value: "1712", label: "km finales" },
      { value: "4895", label: "msnm" },
      { value: "50%", label: "ripio" },
    ],
    decisions: [
      {
        label: "Entró",
        body: "Abra del Acay al tercer día, cuando el cuerpo ya viene aclimatado.",
      },
      {
        label: "Salió",
        body: "Dormir en La Poma: buen pueblo, logística floja para seis motos.",
      },
      {
        label: "Ajustamos",
        body: "Hornocal y Caspala quedaron juntos para que el día tenga sentido completo.",
      },
    ],
  },
  "armar-gigantes-del-oeste": {
    slug: "armar-gigantes-del-oeste",
    tourSlug: "gigantes-del-oeste",
    routeName: "Gigantes del Oeste",
    region: "Mendoza a La Rioja",
    kicker: "Tres temporadas para entender cuándo la cordillera deja pasar.",
    quote: "La fecha no la elige el calendario. La elige Laguna Brava.",
    fieldNote:
      "Gigantes se armó midiendo ventanas: nieve, viento, cierres de paso, horarios de frontera y el cansancio que llega antes de Vinchina.",
    hero: {
      src: "/images/tours/gigantes_del_oeste/gigantes_del_oeste_1_color.jpg",
      alt: "Riders detenidos en una ruta de alta montaña del oeste argentino.",
      label: "Ruta probada",
      caption: "Laguna Brava fijó la temporada y el ritmo del viaje.",
    },
    images: [
      {
        src: "/images/tours/gigantes_del_oeste/20231105_141145.jpg",
        alt: "Dos motos frente a una quebrada de montaña en Cuyo.",
        label: "Vuelta de scouting",
        caption: "Volver sin llegar también deja información.",
      },
      {
        src: "/images/tours/gigantes_del_oeste/20231107_162749.jpg",
        alt: "Camino de montaña con motos avanzando en el oeste argentino.",
        label: "Mina La Mejicana",
        caption: "El tramo que separa la ruta de un paseo turístico.",
      },
      {
        src: "/images/tours/gigantes_del_oeste/IMG-20260421-WA0103.jpg",
        alt: "Moto en ripio de altura durante una prueba de ruta.",
        label: "Día largo",
        caption: "La altura se mide en kilómetros y en paciencia.",
      },
    ],
    stats: [
      { value: "3", label: "temporadas" },
      { value: "2400", label: "km finales" },
      { value: "4600", label: "msnm" },
      { value: "30%", label: "ripio" },
    ],
    decisions: [
      {
        label: "Entró",
        body: "Laguna Brava cuando la ventana de clima empezó a ser consistente.",
      },
      {
        label: "Salió",
        body: "Paso de Agua Negra: el horario de cierre nos comía la jornada.",
      },
      {
        label: "Ajustamos",
        body: "Talampaya volvió partido en dos para sostener ritmo y descanso.",
      },
    ],
  },
  "armar-volcanes-del-norte": {
    slug: "armar-volcanes-del-norte",
    tourSlug: "volcanes-del-norte",
    routeName: "Volcanes del Norte",
    region: "Catamarca",
    kicker: "Seis viajes para separar una ruta de una idea.",
    quote: "La Puna no premia al apurado. Te deja pasar cuando volvés mejor.",
    fieldNote:
      "Catamarca pidió volver: cambiar meses, invertir sentidos, probar riders de distinto nivel y aceptar que algunas rutas merecen su propio viaje.",
    hero: {
      src: "/images/tours/volcanes_del_norte/volcanes_del_norte_1_color.jpg",
      alt: "Riders avanzando por ripio en una ruta volcánica de Catamarca.",
      label: "Ruta final",
      caption: "El ripio, la altura y el clima eligieron qué se quedaba.",
    },
    images: [
      {
        src: "/images/tours/volcanes_del_norte/1.jpg",
        alt: "Riders en una planicie de ripio de la Puna catamarqueña.",
        label: "Campo de prueba",
        caption: "La distancia parece simple hasta que cambia el viento.",
      },
      {
        src: "/images/tours/volcanes_del_norte/5.png",
        alt: "Camino ancho de altura en Catamarca.",
        label: "Variante",
        caption: "Algunas rutas parecen perfectas en el mapa y se rompen en el terreno.",
      },
      {
        src: "/images/tours/volcanes_del_norte/11.jpeg",
        alt: "Riders junto a una moto en la montaña nevada de Catamarca.",
        label: "Equipo",
        caption: "Probamos con riders distintos para medir cómo pega cada etapa.",
      },
    ],
    stats: [
      { value: "6", label: "viajes de exploración" },
      { value: "1917", label: "km finales" },
      { value: "4550", label: "msnm" },
      { value: "50%", label: "ripio" },
    ],
    decisions: [
      {
        label: "Entró",
        body: "Dunas de Tatón, porque el día necesitaba contraste.",
      },
      {
        label: "Salió",
        body: "Volcán Galán: demasiado largo, demasiado aislado, otro viaje.",
      },
      {
        label: "Ajustamos",
        body: "Capillitas quedó como cierre porque la ruta necesitaba ganar el final.",
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
