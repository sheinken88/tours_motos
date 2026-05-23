import {
  type Departure,
  type GalleryImage,
  type ItineraryDay,
  type Tour,
  type TourSection,
} from "./schemas";

/**
 * Mock data used when GOOGLE_SHEETS_CREDENTIALS is missing or set to the
 * placeholder value. It mirrors the Google Sheets CMS schema so page work can
 * be built and tested before the client-owned Sheet is connected.
 */

const t = (es: string) => ({
  es,
  en: `[NEEDS_TRANSLATION] ${es}`,
  pt: `[NEEDS_TRANSLATION] ${es}`,
});

const empty = { es: "", en: "", pt: "" };

export const MOCK_TOURS: Tour[] = [
  {
    slug: "gigantes-del-oeste",
    sort_order: 1,
    title: t("Gigantes del Oeste"),
    slugs: {
      es: "gigantes-del-oeste",
      en: "gigantes-del-oeste",
      pt: "gigantes-del-oeste",
    },
    region: t("Mendoza a La Rioja"),
    difficulty: "moderate",
    duration_days: 8,
    distance_km: 2400,
    ripio_percent: 30,
    max_altitude_m: 4600,
    base_price_usd: 0,
    currency: "USD",
    hero_image: "/images/tours/gigantes_del_oeste/gigantes_del_oeste_1_halftone.png",
    hero_image_color: "/images/tours/gigantes_del_oeste/gigantes_del_oeste_1_color.jpg",
    hero_image_drive_id: "",
    hero_image_color_drive_id: "",
    hero_image_alt: t("Moto de aventura cruzando el oeste argentino"),
    summary: t(
      "Ocho días desde Mendoza hasta La Rioja. 2400 km de cordillera, parques nacionales, rutas de alta montaña y pueblos que se ganan con horas de manejo.",
    ),
    tagline: t("2400 km. Ocho días. La cordillera se cruza arriba de la moto."),
    seo_title: empty,
    seo_description: t(
      "Ocho días de moto por Mendoza, San Juan y La Rioja. 2400 km, ripio, cordillera y parques nacionales con Moto On/Off.",
    ),
    published: true,
  },
  {
    slug: "sobre-las-nubes",
    sort_order: 2,
    title: t("Sobre las Nubes"),
    slugs: {
      es: "sobre-las-nubes",
      en: "sobre-las-nubes",
      pt: "sobre-las-nubes",
    },
    region: t("Salta y Jujuy"),
    difficulty: "moderate",
    duration_days: 7,
    distance_km: 1712,
    ripio_percent: 50,
    max_altitude_m: 4895,
    base_price_usd: 0,
    currency: "USD",
    hero_image: "/images/tours/sobre_las_nubes/sobre_las_nubes_1_halftone.png",
    hero_image_color: "/images/tours/sobre_las_nubes/sobre_las_nubes_1_color.jpg",
    hero_image_drive_id: "",
    hero_image_color_drive_id: "",
    hero_image_alt: t("Ruta de montaña en Salta y Jujuy"),
    summary: t(
      "Siete días cruzando Salta y Jujuy. Asfalto, ripio, altura, selva y pueblos andinos. El Abra del Acay marca la vara: 4895 msnm, una ruta que se gana kilómetro a kilómetro.",
    ),
    tagline: t("1712 km. 4895 msnm. Siete días sobre las nubes."),
    seo_title: empty,
    seo_description: t(
      "Siete días por Salta y Jujuy. 1712 km, 50% ripio y Abra del Acay a 4895 msnm con Moto On/Off.",
    ),
    published: true,
  },
  {
    slug: "volcanes-del-norte",
    sort_order: 3,
    title: t("Volcanes del Norte"),
    slugs: {
      es: "volcanes-del-norte",
      en: "volcanes-del-norte",
      pt: "volcanes-del-norte",
    },
    region: t("Catamarca"),
    difficulty: "hard",
    duration_days: 7,
    distance_km: 1917,
    ripio_percent: 50,
    max_altitude_m: 4550,
    base_price_usd: 0,
    currency: "USD",
    hero_image: "/images/tours/volcanes_del_norte/volcanes_del_norte_1_halftone.png",
    hero_image_color: "/images/tours/volcanes_del_norte/volcanes_del_norte_1_color.jpg",
    hero_image_drive_id: "",
    hero_image_color_drive_id: "",
    hero_image_alt: t("Paisaje volcánico de Catamarca"),
    summary: t(
      "Catamarca en siete días: cuestas, seismiles, salares, puna y volcanes. Una ruta de altura que alterna ripio, asfalto y jornadas largas para riders que ya saben lo que buscan.",
    ),
    tagline: t("Siete días entre volcanes, puna y caminos que ponen a prueba."),
    seo_title: empty,
    seo_description: t(
      "Tour de moto por Catamarca. Siete días, 50% ripio, volcanes, salares y altura con Moto On/Off.",
    ),
    published: true,
  },
  {
    slug: "cruces-del-sur",
    sort_order: 4,
    title: t("Cruces del Sur"),
    slugs: {
      es: "cruces-del-sur",
      en: "cruces-del-sur",
      pt: "cruces-del-sur",
    },
    region: t("Carretera Austral y Patagonia"),
    difficulty: "moderate",
    duration_days: 7,
    distance_km: 2321,
    ripio_percent: 45,
    max_altitude_m: null,
    base_price_usd: 0,
    currency: "USD",
    hero_image: "/images/halftone/cruces-del-sur-hero.png",
    hero_image_color: "",
    hero_image_drive_id: "",
    hero_image_color_drive_id: "",
    hero_image_alt: t("Ruta de ripio patagónica"),
    summary: t(
      "Carretera Austral, pasos fronterizos y ripio patagónico. 2321 km para cruzar bosques, lagos, viento y rutas que se recuerdan por lo que exigieron.",
    ),
    tagline: t("2321 km de Patagonia, viento y ripio ganado."),
    seo_title: empty,
    seo_description: t(
      "Tour de moto por Carretera Austral y Patagonia. Siete días, 2321 km y 45% ripio con Moto On/Off.",
    ),
    published: true,
  },
];

export const MOCK_ITINERARY: ItineraryDay[] = [
  {
    tour_slug: "sobre-las-nubes",
    day_number: 1,
    title: t("Salta Capital → Cabra Corral → Cuesta del Obispo → Cachi"),
    route_from: "Salta Capital",
    route_to: "Cachi",
    distance_km: 270,
    surface: t("70% asfalto"),
    max_altitude_m: 3300,
    body: t(
      "El primer día combina agua, selva, altura, montaña y pueblos andinos. Partimos desde Salta Capital rumbo al Embalse Cabra Corral, almorzamos con vistas al lago y seguimos hacia la Cuesta del Obispo. Curvas, cardones y nubes marcan la entrada a Cachi.",
    ),
    highlights: {
      es: [
        "Embalse Cabra Corral",
        "Parque Nacional Los Cardones",
        "Cuesta del Obispo",
        "Recta del Tintín",
      ],
      en: [
        "[NEEDS_TRANSLATION] Embalse Cabra Corral",
        "[NEEDS_TRANSLATION] Parque Nacional Los Cardones",
        "[NEEDS_TRANSLATION] Cuesta del Obispo",
        "[NEEDS_TRANSLATION] Recta del Tintín",
      ],
      pt: [
        "[NEEDS_TRANSLATION] Embalse Cabra Corral",
        "[NEEDS_TRANSLATION] Parque Nacional Los Cardones",
        "[NEEDS_TRANSLATION] Cuesta del Obispo",
        "[NEEDS_TRANSLATION] Recta del Tintín",
      ],
    },
  },
  {
    tour_slug: "sobre-las-nubes",
    day_number: 2,
    title: t("Cachi → Quebrada de las Flechas → Cafayate → El Carril"),
    route_from: "Cachi",
    route_to: "El Carril",
    distance_km: 308,
    surface: t("80% asfalto"),
    max_altitude_m: null,
    body: t(
      "Un recorrido pensado para disfrutar arriba de la moto. Curvas entretenidas, cambios de ritmo y una paleta de colores en todo el trayecto. Atravesamos la Quebrada de las Flechas, almorzamos en Cafayate y rodamos la Quebrada de las Conchas hasta El Carril.",
    ),
    highlights: {
      es: [
        "Quebrada de las Flechas",
        "Anfiteatro",
        "Quebrada de las Conchas",
        "Garganta del Diablo",
      ],
      en: [
        "[NEEDS_TRANSLATION] Quebrada de las Flechas",
        "[NEEDS_TRANSLATION] Anfiteatro",
        "[NEEDS_TRANSLATION] Quebrada de las Conchas",
        "[NEEDS_TRANSLATION] Garganta del Diablo",
      ],
      pt: [
        "[NEEDS_TRANSLATION] Quebrada de las Flechas",
        "[NEEDS_TRANSLATION] Anfiteatro",
        "[NEEDS_TRANSLATION] Quebrada de las Conchas",
        "[NEEDS_TRANSLATION] Garganta del Diablo",
      ],
    },
  },
  {
    tour_slug: "sobre-las-nubes",
    day_number: 3,
    title: t("El Carril → Abra del Acay → San Antonio de los Cobres"),
    route_from: "El Carril",
    route_to: "San Antonio de los Cobres",
    distance_km: null,
    surface: t("20% asfalto"),
    max_altitude_m: 4895,
    body: t(
      "El Abra del Acay es el tramo más emblemático de la Ruta 40: el punto más alto de esa ruta y de cualquier ruta nacional de América. La subida entrega color, acantilados y una montaña que exige atención. La bajada hacia San Antonio de los Cobres abre el paisaje y afloja el ritmo.",
    ),
    highlights: {
      es: ["Abra del Acay"],
      en: ["[NEEDS_TRANSLATION] Abra del Acay"],
      pt: ["[NEEDS_TRANSLATION] Abra del Acay"],
    },
  },
  {
    tour_slug: "sobre-las-nubes",
    day_number: 4,
    title: t("S.A. Cobres → Viaducto la Polvorilla → Tilcara"),
    route_from: "San Antonio de los Cobres",
    route_to: "Tilcara",
    distance_km: 293,
    surface: t("80% asfalto"),
    max_altitude_m: 3890,
    body: t(
      "Salimos rumbo al Viaducto La Polvorilla, pasando por La Juguetería y sus rocas inmensas. Seguimos hacia Salinas Grandes. En el descenso a Purmamarca aparecen curvas más marcadas, cerros de colores y la llegada al corazón de la quebrada.",
    ),
    highlights: {
      es: ["Viaducto la Polvorilla", "La Juguetería", "Salinas Grandes", "Cerro de los 7 colores"],
      en: [
        "[NEEDS_TRANSLATION] Viaducto la Polvorilla",
        "[NEEDS_TRANSLATION] La Juguetería",
        "[NEEDS_TRANSLATION] Salinas Grandes",
        "[NEEDS_TRANSLATION] Cerro de los 7 colores",
      ],
      pt: [
        "[NEEDS_TRANSLATION] Viaducto la Polvorilla",
        "[NEEDS_TRANSLATION] La Juguetería",
        "[NEEDS_TRANSLATION] Salinas Grandes",
        "[NEEDS_TRANSLATION] Cerro de los 7 colores",
      ],
    },
  },
  {
    tour_slug: "sobre-las-nubes",
    day_number: 5,
    title: t("Tilcara → Santa Ana"),
    route_from: "Tilcara",
    route_to: "Santa Ana",
    distance_km: 140,
    surface: t("20% asfalto"),
    max_altitude_m: 4550,
    body: t(
      "Día de conducción y entorno más que velocidad. Curvas cerradas, rectas con acantilados y caminos de altura poco transitados. Más que conducir la moto, se rueda flotando sobre las nubes.",
    ),
    highlights: {
      es: ["Hornocal", "Abra Azul", "Caspala"],
      en: [
        "[NEEDS_TRANSLATION] Hornocal",
        "[NEEDS_TRANSLATION] Abra Azul",
        "[NEEDS_TRANSLATION] Caspala",
      ],
      pt: [
        "[NEEDS_TRANSLATION] Hornocal",
        "[NEEDS_TRANSLATION] Abra Azul",
        "[NEEDS_TRANSLATION] Caspala",
      ],
    },
  },
  {
    tour_slug: "sobre-las-nubes",
    day_number: 6,
    title: t("Santa Ana → Parque Nacional Calilegua → Perico"),
    route_from: "Santa Ana",
    route_to: "Perico",
    distance_km: 205,
    surface: t("50% asfalto"),
    max_altitude_m: null,
    body: t(
      "El paisaje cambia por completo: de caminos de altura y pueblos aislados empezás a descender hacia la selva de las Yungas. La ruta se vuelve verde, húmeda, cerrada. Una transición ganada entre montaña árida y selva viva.",
    ),
    highlights: {
      es: ["Parque Nacional Calilegua"],
      en: ["[NEEDS_TRANSLATION] Parque Nacional Calilegua"],
      pt: ["[NEEDS_TRANSLATION] Parque Nacional Calilegua"],
    },
  },
  {
    tour_slug: "sobre-las-nubes",
    day_number: 7,
    title: t("Perico → Termas de Reyes → Salta Capital"),
    route_from: "Perico",
    route_to: "Salta Capital",
    distance_km: 143,
    surface: t("80% asfalto"),
    max_altitude_m: null,
    body: t(
      "Una jornada tranquila para cerrar la ruta. Ripio hasta Termas de Reyes, almuerzo junto al Dique La Ciénaga y unas dos horas finales de asfalto y curvas hasta volver a Salta Capital.",
    ),
    highlights: {
      es: ["Termas de Reyes", "Dique La Ciénaga", "Embalse Las Maderas"],
      en: [
        "[NEEDS_TRANSLATION] Termas de Reyes",
        "[NEEDS_TRANSLATION] Dique La Ciénaga",
        "[NEEDS_TRANSLATION] Embalse Las Maderas",
      ],
      pt: [
        "[NEEDS_TRANSLATION] Termas de Reyes",
        "[NEEDS_TRANSLATION] Dique La Ciénaga",
        "[NEEDS_TRANSLATION] Embalse Las Maderas",
      ],
    },
  },
];

export const MOCK_TOUR_SECTIONS: TourSection[] = [
  "Seis noches de alojamiento en hospedajes seleccionados",
  "Vehículo de apoyo con mecánico durante toda la ruta",
  "Combustible para todo el trayecto",
  "Comidas y desayunos del itinerario",
  "Guía rider con experiencia probada en el norte",
  "Seguro básico de moto",
].map((text, index) => ({
  tour_slug: "sobre-las-nubes",
  type: "included",
  sort_order: index + 1,
  text: t(text),
}));

MOCK_TOUR_SECTIONS.push(
  ...[
    "Pasajes aéreos hasta Salta y desde Salta",
    "Bebidas alcohólicas y comidas fuera del itinerario",
    "Seguro de viajero con cobertura de moto",
    "Alquiler de moto si no traés la tuya",
  ].map((text, index) => ({
    tour_slug: "sobre-las-nubes",
    type: "not_included" as const,
    sort_order: index + 1,
    text: t(text),
  })),
  {
    tour_slug: "sobre-las-nubes",
    type: "need_to_know",
    sort_order: 1,
    text: t("Cupo limitado por travesía. Para reservar tu lugar, escribinos."),
  },
);

export const MOCK_GALLERY: GalleryImage[] = [
  {
    tour_slug: "sobre-las-nubes",
    sort_order: 1,
    image_url: "/images/tours/sobre_las_nubes/sobre_las_nubes_1_halftone.png",
    image_drive_id: "",
    alt: t("Camino de montaña de la ruta Sobre las Nubes"),
    caption: empty,
    featured: true,
  },
];

export const MOCK_DEPARTURES: Departure[] = [];
