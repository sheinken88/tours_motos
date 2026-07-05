import { type ComponentType } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button, Container, DisplayHeading, Eyebrow, XIcon } from "@/components/primitives";
import { PaperZone, RedZone, RoutePlaceholderPanel, TourImagePoster } from "@/components/surfaces";
import { type Locale } from "@/lib/i18n/config";
import {
  type GalleryImage,
  type ItineraryDay,
  type Tour,
  type TourPageContent,
  type TourSection,
} from "@/lib/sheets/schemas";

type TourCmsContentProps = {
  content: TourPageContent;
  locale: Locale;
};

type TourMdxContentProps = {
  tour: Tour;
  locale: Locale;
  gallery: GalleryImage[];
  MdxBody: ComponentType | null;
};

type StatRow = {
  label: string;
  value: string;
};

type GalleryFrame = {
  key: string;
  imageSrc?: string;
  colorSrc?: string;
  alt?: string;
  caption?: string;
  label?: string;
};

type TourTestimonial = {
  quote: string;
  attribution: string;
};

type RoutePoint = [number, number];

type RouteStop = {
  name: string;
  coords: RoutePoint;
};

type RouteMapText = {
  heading: string;
  body: string;
  frameTitle: string;
  workshopBody: string;
  workshopCta: string;
};

type TourRouteMap = {
  googleMapsUrl: string;
  workshopSlug: string;
  srcDoc: string;
  text: Record<Locale, RouteMapText>;
};

const sectionOrder: TourSection["type"][] = ["included", "not_included", "need_to_know"];

function localizeStatic<T>(value: T): Record<Locale, T> {
  return {
    es: value,
    en: value,
    pt: value,
  };
}

function getRoutePoint(route: RoutePoint[], index: number): RoutePoint {
  const point = route[index];
  if (!point) {
    throw new Error(`Missing route point at index ${index}`);
  }
  return point;
}

function buildRouteMapSrcDoc({
  label,
  route,
  stops,
  osrmCoordinates,
}: {
  label: string;
  route: RoutePoint[];
  stops: RouteStop[];
  osrmCoordinates: string;
}) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""
    />
    <style>
      html,
      body,
      #map {
        height: 100%;
        margin: 0;
      }

      body {
        background: #e8dcc4;
        color: #1f140e;
        font-family: Inter, Arial, sans-serif;
      }

      .leaflet-tile {
        filter: sepia(0.35) saturate(0.72) contrast(1.05);
      }

      .leaflet-container {
        background: #d4c5a8;
      }

      .leaflet-control-zoom,
      .leaflet-control-attribution {
        border-radius: 0 !important;
        border: 2px solid rgba(31, 20, 14, 0.45) !important;
        box-shadow: none !important;
      }

      .leaflet-control-zoom a,
      .leaflet-control-attribution {
        background: #e8dcc4 !important;
        color: #1f140e !important;
      }

      .leaflet-control-zoom a {
        border-radius: 0 !important;
        border-bottom-color: rgba(31, 20, 14, 0.25) !important;
      }

      .leaflet-control-attribution a {
        color: #8a2820 !important;
      }

      .route-label {
        border: 2px solid #1f140e;
        background: #e8dcc4;
        color: #1f140e;
        padding: 4px 7px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        box-shadow: 4px 4px 0 rgba(31, 20, 14, 0.28);
      }
    </style>
  </head>
  <body>
    <div id="map" aria-label="${label}"></div>
    <script
      src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      crossorigin=""
    ><\/script>
    <script>
      const route = ${JSON.stringify(route)};
      const stops = ${JSON.stringify(stops)};

      const map = L.map("map", {
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      const routeStyle = {
        color: "#a8342a",
        weight: 5,
        opacity: 0.95,
        lineJoin: "miter",
      };
      let path = L.polyline(route, routeStyle).addTo(map);

      const markerIcon = L.divIcon({
        className: "",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        html:
          '<span style="display:block;width:14px;height:14px;background:#a8342a;border:2px solid #1f140e;box-shadow:3px 3px 0 rgba(31,20,14,.32);transform:rotate(45deg);"></span>',
      });

      stops.forEach((stop) => {
        L.marker(stop.coords, { icon: markerIcon })
          .addTo(map)
          .bindTooltip(stop.name, {
            permanent: false,
            direction: "top",
            className: "route-label",
            offset: [0, -8],
          });
      });

      map.fitBounds(path.getBounds(), { padding: [28, 28] });

      fetch(
        "https://router.project-osrm.org/route/v1/driving/${osrmCoordinates}?overview=full&geometries=geojson",
      )
        .then((response) => response.json())
        .then((data) => {
          const geometry = data && data.routes && data.routes[0] && data.routes[0].geometry;
          if (!geometry) return;

          map.removeLayer(path);
          path = L.geoJSON(geometry, { style: routeStyle }).addTo(map);
          map.fitBounds(path.getBounds(), { padding: [28, 28] });
        })
        .catch(() => {});
    <\/script>
  </body>
</html>`;
}

const crucesRoute: RoutePoint[] = [
  [-41.1334722, -71.3102778],
  [-43.0888123, -71.4625883],
  [-46.5401253, -71.7229183],
  [-47.2520865, -72.5752373],
  [-47.1603752, -71.8338256],
  [-46.5916181, -70.925584],
  [-43.68483, -71.4113039],
  [-41.1334722, -71.3102778],
];

const sobreLasNubesRoute: RoutePoint[] = [
  [-24.7821269, -65.4231976],
  [-25.283414, -65.342841],
  [-25.169111, -65.844315],
  [-25.120428, -66.165016],
  [-26.073081, -65.976052],
  [-25.074095, -65.490839],
  [-24.722746, -66.200123],
  [-24.386158, -66.239163],
  [-24.218449, -66.318771],
  [-24.203519, -66.412715],
  [-23.711463, -65.471286],
  [-23.578171, -65.39564],
  [-23.199063, -65.052756],
  [-23.339497, -65.09485],
  [-23.908734, -64.888505],
  [-23.745661, -64.849693],
  [-23.806071, -64.788564],
  [-24.377009, -65.205747],
  [-24.7821269, -65.4231976],
];

const gigantesRoute: RoutePoint[] = [
  [-32.8894587, -68.8458386],
  [-32.951352, -69.201432],
  [-32.531955, -69.014142],
  [-32.593133, -69.347289],
  [-32.82542, -69.912308],
  [-32.833799, -70.598271],
  [-32.593133, -69.347289],
  [-31.798144, -69.321341],
  [-31.633333, -69.466667],
  [-30.215611, -69.141327],
  [-30.240711, -68.746166],
  [-30.154472, -68.492236],
  [-29.315889, -68.226972],
  [-28.760391, -68.207739],
  [-28.311883, -68.843853],
  [-29.315889, -68.226972],
  [-29.786114, -67.836155],
  [-30.159067, -67.842102],
  [-29.164868, -67.496824],
  [-29.158303, -67.675668],
  [-29.164868, -67.496824],
  [-29.678716, -67.071513],
  [-29.413454, -66.856458],
];

const volcanesRoute: RoutePoint[] = [
  [-28.469581, -65.7795441],
  [-27.68933, -67.6193274],
  [-27.5609208, -68.1469281],
  [-27.354017, -67.5817336],
  [-26.0595658, -67.4064692],
  [-26.4798033, -67.2657213],
  [-27.3445746, -66.3768598],
  [-27.5827186, -66.3148915],
  [-27.470099, -66.0125499],
  [-28.469581, -65.7795441],
];

const routeMapsByTour: Record<string, TourRouteMap> = {
  "sobre-las-nubes": {
    googleMapsUrl: "https://maps.app.goo.gl/nhtYfD9vhBcC8krb7",
    workshopSlug: "armar-sobre-las-nubes",
    srcDoc: buildRouteMapSrcDoc({
      label: "Mapa del recorrido Sobre las Nubes",
      route: sobreLasNubesRoute,
      stops: [
        { name: "Salta", coords: getRoutePoint(sobreLasNubesRoute, 0) },
        { name: "Cachi", coords: getRoutePoint(sobreLasNubesRoute, 3) },
        { name: "Cafayate", coords: getRoutePoint(sobreLasNubesRoute, 4) },
        { name: "Abra del Acay", coords: getRoutePoint(sobreLasNubesRoute, 7) },
        { name: "San Antonio de los Cobres", coords: getRoutePoint(sobreLasNubesRoute, 8) },
        { name: "Tilcara", coords: getRoutePoint(sobreLasNubesRoute, 11) },
        { name: "Hornocal", coords: getRoutePoint(sobreLasNubesRoute, 12) },
        { name: "Caspala", coords: getRoutePoint(sobreLasNubesRoute, 13) },
        { name: "Calilegua", coords: getRoutePoint(sobreLasNubesRoute, 15) },
        { name: "Libertador San Martín", coords: getRoutePoint(sobreLasNubesRoute, 16) },
        { name: "Embalse Las Maderas", coords: getRoutePoint(sobreLasNubesRoute, 17) },
      ],
      osrmCoordinates:
        "-65.4231976,-24.7821269;-65.342841,-25.283414;-65.844315,-25.169111;-66.165016,-25.120428;-65.976052,-26.073081;-65.490839,-25.074095;-66.200123,-24.722746;-66.239163,-24.386158;-66.318771,-24.218449;-66.412715,-24.203519;-65.471286,-23.711463;-65.39564,-23.578171;-65.052756,-23.199063;-65.09485,-23.339497;-64.888505,-23.908734;-64.849693,-23.745661;-64.788564,-23.806071;-65.205747,-24.377009;-65.4231976,-24.7821269",
    }),
    text: localizeStatic({
      heading: "Sobre las Nubes en el mapa",
      body: "Salta, Cachi, Cafayate, Abra del Acay, Tilcara, Hornocal, Caspala, Calilegua, Libertador San Martín y regreso por Las Maderas. Mové el mapa, acercate a la altura y mirá dónde se gana cada kilómetro.",
      frameTitle: "Mapa interactivo del recorrido Sobre las Nubes",
      workshopBody:
        "El recorrido quedó después de probar altura, quebrada y yunga hasta encontrar una línea que cruza Salta y Jujuy sin perder ritmo.",
      workshopCta: "Descubrí cómo armamos Sobre las Nubes",
    }),
  },
  "cruces-del-sur": {
    googleMapsUrl: "https://maps.app.goo.gl/3JruHQgzeRTNLJpy7",
    workshopSlug: "armar-cruces-del-sur",
    srcDoc: buildRouteMapSrcDoc({
      label: "Mapa del recorrido Cruces del Sur",
      route: crucesRoute,
      stops: [
        { name: "Bariloche", coords: getRoutePoint(crucesRoute, 0) },
        { name: "Trevelin", coords: getRoutePoint(crucesRoute, 1) },
        { name: "Chile Chico", coords: getRoutePoint(crucesRoute, 2) },
        { name: "Cochrane", coords: getRoutePoint(crucesRoute, 3) },
        { name: "Paso Roballos", coords: getRoutePoint(crucesRoute, 4) },
        { name: "Perito Moreno", coords: getRoutePoint(crucesRoute, 5) },
        { name: "RP44", coords: getRoutePoint(crucesRoute, 6) },
      ],
      osrmCoordinates:
        "-71.3102778,-41.1334722;-71.4625883,-43.0888123;-71.7229183,-46.5401253;-72.5752373,-47.2520865;-71.8338256,-47.1603752;-70.925584,-46.5916181;-71.4113039,-43.68483;-71.3102778,-41.1334722",
    }),
    text: localizeStatic({
      heading: "Cruces del Sur en el mapa",
      body: "Bariloche, Trevelin, Chile Chico, Cochrane, Paso Roballos, Perito Moreno y regreso por Patagonia. Mové el mapa, acercate al ripio y mirá el giro completo antes de escribirnos.",
      frameTitle: "Mapa interactivo del recorrido Cruces del Sur",
      workshopBody:
        "La línea final no salió de una mesa. La probamos con viento, frontera, ferry y ripio hasta que el recorrido quedó listo para rodarse.",
      workshopCta: "Mirá cómo armamos Cruces del Sur",
    }),
  },
  "gigantes-del-oeste": {
    googleMapsUrl: "https://maps.app.goo.gl/BWWYQYYWhBNAmj6U9",
    workshopSlug: "armar-gigantes-del-oeste",
    srcDoc: buildRouteMapSrcDoc({
      label: "Mapa del recorrido Gigantes del Oeste",
      route: gigantesRoute,
      stops: [
        { name: "Mendoza", coords: getRoutePoint(gigantesRoute, 0) },
        { name: "Villavicencio", coords: getRoutePoint(gigantesRoute, 2) },
        { name: "Uspallata", coords: getRoutePoint(gigantesRoute, 3) },
        { name: "Paso Los Libertadores", coords: getRoutePoint(gigantesRoute, 4) },
        { name: "Los Andes", coords: getRoutePoint(gigantesRoute, 5) },
        { name: "Barreal", coords: getRoutePoint(gigantesRoute, 8) },
        { name: "Villa Unión", coords: getRoutePoint(gigantesRoute, 12) },
        { name: "Laguna Brava", coords: getRoutePoint(gigantesRoute, 14) },
        { name: "Talampaya", coords: getRoutePoint(gigantesRoute, 16) },
        { name: "Chilecito", coords: getRoutePoint(gigantesRoute, 18) },
        { name: "Mina La Mejicana", coords: getRoutePoint(gigantesRoute, 19) },
        { name: "La Rioja", coords: getRoutePoint(gigantesRoute, 22) },
      ],
      osrmCoordinates:
        "-68.8458386,-32.8894587;-69.201432,-32.951352;-69.014142,-32.531955;-69.347289,-32.593133;-69.912308,-32.82542;-70.598271,-32.833799;-69.347289,-32.593133;-69.321341,-31.798144;-69.466667,-31.633333;-69.141327,-30.215611;-68.746166,-30.240711;-68.492236,-30.154472;-68.226972,-29.315889;-68.207739,-28.760391;-68.843853,-28.311883;-68.226972,-29.315889;-67.836155,-29.786114;-67.842102,-30.159067;-67.496824,-29.164868;-67.675668,-29.158303;-67.496824,-29.164868;-67.071513,-29.678716;-66.856458,-29.413454",
    }),
    text: localizeStatic({
      heading: "Gigantes del Oeste en el mapa",
      body: "Mendoza, Villavicencio, Uspallata, Paso Los Libertadores, Laguna Brava, Talampaya, Chilecito, Mina La Mejicana y La Rioja. Mové el mapa, acercate a la cordillera y mirá dónde se gana cada día.",
      frameTitle: "Mapa interactivo del recorrido Gigantes del Oeste",
      workshopBody:
        "Unimos Mendoza, San Juan y La Rioja después de probar variantes, pasos y alturas hasta dejar una ruta que sube de ritmo día tras día.",
      workshopCta: "Descubrí cómo armamos Gigantes del Oeste",
    }),
  },
  "volcanes-del-norte": {
    googleMapsUrl: "https://maps.app.goo.gl/NLtJ8B4giCKQFE8o8",
    workshopSlug: "armar-volcanes-del-norte",
    srcDoc: buildRouteMapSrcDoc({
      label: "Mapa del recorrido Volcanes del Norte",
      route: volcanesRoute,
      stops: [
        { name: "San Fernando", coords: getRoutePoint(volcanesRoute, 0) },
        { name: "Fiambalá", coords: getRoutePoint(volcanesRoute, 1) },
        { name: "Ruta de los Seismiles", coords: getRoutePoint(volcanesRoute, 2) },
        { name: "Dunas de Tatón", coords: getRoutePoint(volcanesRoute, 3) },
        { name: "Antofagasta de la Sierra", coords: getRoutePoint(volcanesRoute, 4) },
        { name: "El Peñón", coords: getRoutePoint(volcanesRoute, 5) },
        { name: "Minas Capillitas", coords: getRoutePoint(volcanesRoute, 6) },
        { name: "Andalgalá", coords: getRoutePoint(volcanesRoute, 7) },
        { name: "Aconquija", coords: getRoutePoint(volcanesRoute, 8) },
      ],
      osrmCoordinates:
        "-65.7795441,-28.469581;-67.6193274,-27.68933;-68.1469281,-27.5609208;-67.5817336,-27.354017;-67.4064692,-26.0595658;-67.2657213,-26.4798033;-66.3768598,-27.3445746;-66.3148915,-27.5827186;-66.0125499,-27.470099;-65.7795441,-28.469581",
    }),
    text: localizeStatic({
      heading: "Volcanes del Norte en el mapa",
      body: "San Fernando, Fiambalá, Ruta de los Seismiles, Dunas de Tatón, Antofagasta de la Sierra, El Peñón, Minas Capillitas, Andalgalá, Aconquija y regreso a Catamarca. Mové el mapa, acercate a la puna y mirá dónde se gana cada tramo.",
      frameTitle: "Mapa interactivo del recorrido Volcanes del Norte",
      workshopBody:
        "La ruta cruza Catamarca por altura, salares, piedra pómez y cuestas probadas hasta dejar un recorrido exigente sin perder margen para el grupo.",
      workshopCta: "Descubrí cómo armamos Volcanes del Norte",
    }),
  },
};

const testimonialsByTour: Record<string, Partial<Record<Locale, TourTestimonial[]>>> = {
  "sobre-las-nubes": {
    es: [
      {
        quote:
          "El Abra del Acay fue espectacular, no me esperaba algo así, muy buen camino, de principio a fin.",
        attribution: "Facundo Cresseri",
      },
      {
        quote:
          "Muy buena organización por parte de la empresa, grupo muy divertido, los guías unos fenómenos.",
        attribution: "Franco Lucente",
      },
      {
        quote:
          "Un viaje muy variado, pasamos de selvas a montañas y la nada misma, muy bueno. El grupo que se armó fue excelente.",
        attribution: "Ignacio Caprile",
      },
    ],
  },
  "cruces-del-sur": {
    es: [
      {
        quote:
          "El Paso Roballos fue el viaje más impactante de mi vida. No solo en moto, sino en general.",
        attribution: "Carlos Rossatti",
      },
      {
        quote:
          "El grupo que se formó en esos 7 días es increíble. Seguimos en contacto y ya estamos planeando el próximo tour.",
        attribution: "Martin Pujol",
      },
      {
        quote:
          "Excelente organización y aún mejor los lugares que recorrimos en el viaje en moto. El grupo que se formó fue espectacular, lo recomiendo a todos.",
        attribution: "Roberto Paoloni",
      },
    ],
  },
  "gigantes-del-oeste": {
    es: [
      {
        quote:
          "El Paso Los Libertadores fue increíble. Cruzar los Andes desde la moto fue un momento único.",
        attribution: "Agustin Sahovaler",
      },
      {
        quote: "El día de Laguna Brava fue surrealista.",
        attribution: "Agustin Lago",
      },
      {
        quote:
          "La Mina La Mejicana fue el desafío más grande que hice en moto. El grupo siempre con buena onda. Muy bueno todo.",
        attribution: "Diego Bianco",
      },
    ],
  },
  "volcanes-del-norte": {
    es: [
      {
        quote:
          "La ruta en moto hasta El Balcón de Pissis fue lo más impactante que vi en mi vida. La vista del volcán a 4.500 metros es impresionante.",
        attribution: "Martín Gonzalez",
      },
      {
        quote:
          "El grupo que se formó en esos 7 fue espectacular, ya hicimos 2 asados desde que volvimos.",
        attribution: "Juan Carrera",
      },
      {
        quote:
          "El Campo de Piedra Pómez fue como estar en otro planeta. Cada día fue una sorpresa. Nunca pensé que existían lugares así.",
        attribution: "Lucas Taccone",
      },
    ],
  },
};

type IconProps = {
  className?: string;
};

function MapPinIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
      <path
        d="M10 2.5c-3 0-5.3 2.2-5.3 5.1 0 3.7 4.1 8.2 5.3 9.5 1.2-1.3 5.3-5.8 5.3-9.5 0-2.9-2.3-5.1-5.3-5.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="7.7" r="1.7" fill="currentColor" />
    </svg>
  );
}

function CheckIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
      <path
        d="m3.4 10.1 4.1 4.1 9.1-9.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function InfoIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden focusable="false">
      <path d="M9 8.5h3v7H8v-2h1.5v-3H8v-2h1Zm.7-4.2h2.5v2.4H9.7V4.3Z" fill="currentColor" />
      <path
        d="M10 2.2 17.8 10 10 17.8 2.2 10 10 2.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function buildStatRows({
  tour,
  formatter,
  labels,
}: {
  tour: Tour;
  formatter: Intl.NumberFormat;
  labels: {
    duration: string;
    days: string;
    distance: string;
    ripio: string;
    altitude: string;
  };
}): StatRow[] {
  return [
    { label: labels.duration, value: `${tour.duration_days} ${labels.days}` },
    { label: labels.distance, value: `${formatter.format(tour.distance_km)} km` },
    tour.ripio_percent !== null ? { label: labels.ripio, value: `${tour.ripio_percent}%` } : null,
    tour.max_altitude_m !== null
      ? { label: labels.altitude, value: `${formatter.format(tour.max_altitude_m)} msnm` }
      : null,
  ].filter(Boolean) as StatRow[];
}

function buildGalleryFrames(tour: Tour, gallery: GalleryImage[], locale: Locale): GalleryFrame[] {
  const frames: GalleryFrame[] = gallery.map((image) => ({
    key: `${image.tour_slug}-${image.sort_order}`,
    imageSrc: image.image_url,
    alt: image.alt[locale],
    caption: image.caption[locale],
  }));

  if (frames.length === 0 && (tour.hero_image || tour.hero_image_color)) {
    frames.push({
      key: `${tour.slug}-hero`,
      imageSrc: tour.hero_image,
      colorSrc: tour.hero_image_color,
      alt: tour.hero_image_alt[locale] || tour.title[locale],
      caption: tour.summary[locale],
    });
  }

  while (frames.length < 3) {
    frames.push({
      key: `${tour.slug}-placeholder-${frames.length}`,
      label: tour.region[locale],
    });
  }

  return frames;
}

function StatGrid({ rows }: { rows: StatRow[] }) {
  return (
    <dl className="border-ink/30 bg-paper-light grid border-2 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="border-ink/20 border-b p-5 sm:border-r even:sm:border-r-0">
          <dt className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
            {row.label}
          </dt>
          <dd className="font-display text-display-md text-on-paper mt-2 uppercase">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StatStrip({ rows }: { rows: StatRow[] }) {
  return (
    <dl className="shadow-sticker-ink border-ink/30 bg-paper-light grid border-2 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className="border-ink/20 border-b p-5 lg:border-r lg:border-b-0 last:lg:border-r-0"
        >
          <dt className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
            {row.label}
          </dt>
          <dd className="font-display text-display-md text-on-paper mt-2 uppercase">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function RouteOverview({
  tour,
  locale,
  statRows,
  gallery,
}: {
  tour: Tour;
  locale: Locale;
  statRows: StatRow[];
  gallery: GalleryImage[];
}) {
  const featured = gallery.find((image) => image.featured) ?? gallery[0];

  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.74fr)] lg:items-center">
      <div className="space-y-6">
        <Eyebrow rule>{tour.region[locale]}</Eyebrow>
        <DisplayHeading size="xl" as="h2">
          {tour.title[locale]}
        </DisplayHeading>
        <p className="max-w-3xl font-sans text-xl leading-relaxed md:text-2xl">
          {tour.summary[locale]}
        </p>
        <StatGrid rows={statRows} />
      </div>

      <TourImagePoster
        tour={tour}
        locale={locale}
        imageSrc={featured?.image_url || tour.hero_image}
        colorSrc={featured ? undefined : tour.hero_image_color}
        alt={featured?.alt[locale] || tour.hero_image_alt[locale] || tour.title[locale]}
        caption={featured?.caption[locale]}
        label={tour.region[locale]}
        aspectClassName="aspect-[4/3]"
        sizes="(min-width: 1024px) 480px, 100vw"
        tilt={1}
      />
    </section>
  );
}

function GalleryCollage({
  tour,
  locale,
  gallery,
  eyebrow,
}: {
  tour: Tour;
  locale: Locale;
  gallery: GalleryImage[];
  eyebrow: string;
}) {
  const frames = buildGalleryFrames(tour, gallery, locale);

  return (
    <section className="space-y-6">
      <Eyebrow rule>{eyebrow}</Eyebrow>
      <div className="border-ink/25 -mx-5 overflow-x-auto border-y-2 py-5 sm:-mx-8 lg:mx-0">
        <div className="flex snap-x snap-mandatory gap-4 px-5 sm:px-8 lg:px-0">
          {frames.map((frame) => (
            <GalleryColorFrame
              key={frame.key}
              frame={frame}
              fallbackAlt={tour.title[locale]}
              sizes="(min-width: 1024px) 760px, (min-width: 640px) 78vw, 92vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryColorFrame({
  frame,
  fallbackAlt,
  sizes,
}: {
  frame: GalleryFrame;
  fallbackAlt: string;
  sizes: string;
}) {
  const imageSrc = frame.colorSrc || frame.imageSrc;
  const alt = frame.alt || fallbackAlt;
  const caption = frame.caption || frame.alt;

  return (
    <figure className="text-on-paper group/gallery-frame border-ink/60 bg-paper-aged shadow-sticker-ink hover:shadow-sticker-red relative aspect-[16/10] w-[86vw] shrink-0 snap-start overflow-hidden border-2 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-1 sm:w-[42rem] lg:w-[48rem]">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes}
          draggable={false}
          className="object-cover object-center saturate-110 transition-transform duration-300 ease-out group-hover/gallery-frame:scale-[1.03]"
        />
      ) : (
        <RoutePlaceholderPanel id={frame.key} label={frame.label} className="absolute inset-0" />
      )}
      {caption ? (
        <figcaption className="border-ink/35 bg-paper-light/95 absolute inset-x-0 bottom-0 z-[2] border-t-2 px-4 py-3 font-sans text-sm leading-snug font-semibold backdrop-blur-[1px] md:text-base">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function RouteMapSection({
  map,
  locale,
  eyebrow,
  openGoogleMapsLabel,
  workshopTitle,
}: {
  map: TourRouteMap;
  locale: Locale;
  eyebrow: string;
  openGoogleMapsLabel: string;
  workshopTitle: string;
}) {
  const text = map.text[locale];

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(18rem,0.32fr)] lg:items-stretch">
      <div className="space-y-6">
        <div className="max-w-3xl space-y-3">
          <Eyebrow rule>{eyebrow}</Eyebrow>
          <DisplayHeading size="xl" as="h2">
            {text.heading}
          </DisplayHeading>
          <p className="text-muted-on-paper font-sans text-lg leading-relaxed">{text.body}</p>
        </div>

        <div className="shadow-sticker-ink border-ink/40 bg-paper-aged relative min-h-[28rem] overflow-hidden border-2 md:min-h-[34rem]">
          <iframe
            title={text.frameTitle}
            srcDoc={map.srcDoc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts"
            className="h-full min-h-[28rem] w-full border-0 md:min-h-[34rem]"
          />
        </div>
      </div>

      <aside className="border-ink/30 bg-paper-light shadow-sticker-red flex flex-col justify-between gap-8 border-2 p-6 lg:self-end">
        <div className="space-y-4">
          <Eyebrow>{workshopTitle}</Eyebrow>
          <p className="font-sans text-base leading-relaxed">{text.workshopBody}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button href={`/${locale}/taller-de-rutas/${map.workshopSlug}`} edge={2} tilt="left">
            {text.workshopCta}
          </Button>
          <Button href={map.googleMapsUrl} external edge={3} tilt="right" variant="ghost">
            {openGoogleMapsLabel}
          </Button>
        </div>
      </aside>
    </section>
  );
}

function FeaturedTestimonial({ testimonial }: { testimonial: TourTestimonial }) {
  return (
    <figure className="border-paper/35 relative isolate border-y-2 py-8 md:py-10">
      <span
        aria-hidden
        className="font-display text-paper/15 pointer-events-none absolute -top-12 -left-4 text-[12rem] leading-none select-none md:-top-16 md:text-[16rem]"
      >
        “
      </span>
      <blockquote
        className="font-display text-paper relative text-[clamp(2.4rem,5vw,5.6rem)] leading-[1.05] text-pretty uppercase"
        style={{ filter: "url(#woodblock-distress)" }}
      >
        {testimonial.quote}
      </blockquote>
      <figcaption className="text-eyebrow tracking-eyebrow text-paper mt-6 font-semibold uppercase">
        — {testimonial.attribution}
      </figcaption>
    </figure>
  );
}

function SupportingTestimonial({
  testimonial,
  tilt,
}: {
  testimonial: TourTestimonial;
  tilt: "left" | "right";
}) {
  return (
    <figure
      className={`border-paper/35 bg-brand-red-deep/25 shadow-sticker-ink relative border-2 p-5 md:p-6 ${
        tilt === "left" ? "-rotate-1" : "rotate-1"
      }`}
    >
      <blockquote className="text-paper font-sans text-lg leading-relaxed font-semibold text-pretty">
        {testimonial.quote}
      </blockquote>
      <figcaption className="text-eyebrow tracking-eyebrow text-paper/80 border-paper/25 mt-5 border-t pt-4 font-semibold uppercase">
        — {testimonial.attribution}
      </figcaption>
    </figure>
  );
}

function TourTestimonials({
  testimonials,
  heading,
  eyebrow,
}: {
  testimonials: TourTestimonial[];
  heading: string;
  eyebrow: string;
}) {
  if (testimonials.length === 0) return null;
  const [featured, ...supporting] = testimonials;

  return (
    <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(20rem,0.38fr)] lg:items-end">
      <section className="space-y-8">
        <div className="max-w-4xl space-y-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          <DisplayHeading size="xl" as="h2">
            {heading}
          </DisplayHeading>
        </div>
        {featured ? <FeaturedTestimonial testimonial={featured} /> : null}
      </section>
      <div className="space-y-5">
        {supporting.map((testimonial, index) => (
          <SupportingTestimonial
            key={testimonial.attribution}
            testimonial={testimonial}
            tilt={index % 2 === 0 ? "right" : "left"}
          />
        ))}
      </div>
    </Container>
  );
}

type DayMetadataLabels = {
  surfacePending: string;
  distancePending: string;
};

function buildDayMetadata({
  day,
  locale,
  formatter,
  labels,
}: {
  day: ItineraryDay;
  locale: Locale;
  formatter: Intl.NumberFormat;
  labels: DayMetadataLabels;
}) {
  const metadata = [
    day.surface[locale] || labels.surfacePending,
    day.distance_km !== null ? `${formatter.format(day.distance_km)} km` : labels.distancePending,
  ];

  if (day.max_altitude_m !== null) {
    metadata.push(`${formatter.format(day.max_altitude_m)} msnm`);
  }

  return metadata;
}

function RoadbookStrip({
  itinerary,
  locale,
  formatter,
  dayLabel,
  labels,
}: {
  itinerary: ItineraryDay[];
  locale: Locale;
  formatter: Intl.NumberFormat;
  dayLabel: string;
  labels: DayMetadataLabels;
}) {
  const gridClassName =
    itinerary.length === 8
      ? "grid-cols-2 md:grid-cols-4 xl:grid-cols-8"
      : itinerary.length === 6
        ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
        : "grid-cols-2 md:grid-cols-4 xl:grid-cols-7";

  return (
    <nav
      aria-label={dayLabel}
      className="border-paper/30 bg-brand-red/95 z-20 -mx-5 border-y-2 px-5 py-3 backdrop-blur-sm sm:-mx-8 sm:px-8 md:sticky md:top-16 md:mx-0 md:border-2 xl:top-20"
    >
      <div className={`grid gap-2 ${gridClassName}`}>
        {itinerary.map((day) => (
          <a
            key={`${day.tour_slug}-strip-${day.day_number}`}
            href={`#day-${day.day_number}`}
            className="border-paper/30 bg-brand-red-deep/20 hover:bg-brand-red-deep/45 focus-visible:outline-paper min-h-16 border-2 p-3 transition-[transform,background-color] duration-200 ease-out hover:-translate-y-0.5 sm:min-h-20"
          >
            <span className="font-display text-paper block text-sm tracking-[var(--tracking-cta)] uppercase">
              {dayLabel} {day.day_number}
            </span>
            <span className="text-paper/75 mt-2 block font-sans text-xs leading-snug">
              {buildDayMetadata({ day, locale, formatter, labels }).slice(1).join(" · ")}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function DayRouteImage({
  day,
  tour,
  locale,
  dayLabel,
  image,
}: {
  day: ItineraryDay;
  tour: Tour;
  locale: Locale;
  dayLabel: string;
  image?: GalleryImage;
}) {
  const label = `${dayLabel} ${day.day_number}`;

  if (!image) {
    return (
      <RoutePlaceholderPanel
        id={`${tour.slug}-day-${day.day_number}`}
        label={label}
        className="border-ink/20 min-h-56 border-b-2 md:min-h-full md:border-r-2 md:border-b-0"
      />
    );
  }

  return (
    <div className="group/day-image bg-paper-aged border-ink/20 relative isolate min-h-56 overflow-hidden border-b-2 md:min-h-full md:border-r-2 md:border-b-0">
      <Image
        src={image.image_url}
        alt={image.alt[locale] || tour.title[locale]}
        fill
        sizes="(min-width: 1024px) 440px, (min-width: 768px) 42vw, 100vw"
        className="object-cover transition-transform duration-300 ease-out group-hover/day-card:scale-[1.03]"
      />
      <div className="absolute top-4 left-4 z-[2]">
        <span className="bg-paper-light font-display text-accent-on-paper inline-block border-2 border-current px-3 py-1.5 text-xs tracking-[var(--tracking-cta)] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

function DayRoadbookCard({
  day,
  tour,
  locale,
  formatter,
  dayLabel,
  highlightsLabel,
  metadataLabels,
  image,
  featured = false,
  spanFull = false,
}: {
  day: ItineraryDay;
  tour: Tour;
  locale: Locale;
  formatter: Intl.NumberFormat;
  dayLabel: string;
  highlightsLabel: string;
  metadataLabels: DayMetadataLabels;
  image?: GalleryImage;
  featured?: boolean;
  spanFull?: boolean;
}) {
  const metadata = buildDayMetadata({ day, locale, formatter, labels: metadataLabels });
  const highlights = day.highlights[locale];
  const isWide = featured || spanFull;

  return (
    <li
      id={`day-${day.day_number}`}
      data-zone="paper"
      className={`group/day-card bg-paper-grain text-on-paper shadow-sticker-ink hover:shadow-sticker-red border-paper/30 overflow-hidden border-2 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-1 ${
        isWide ? "scroll-mt-24 md:scroll-mt-40 lg:col-span-2" : "scroll-mt-24 md:scroll-mt-40"
      }`}
    >
      <article
        className={`grid h-full ${
          isWide
            ? "md:grid-cols-[minmax(16rem,0.45fr)_minmax(0,0.55fr)]"
            : "md:grid-cols-[minmax(12rem,0.38fr)_minmax(0,0.62fr)]"
        }`}
      >
        <DayRouteImage day={day} tour={tour} locale={locale} dayLabel={dayLabel} image={image} />

        <div className="flex h-full flex-col gap-4 p-5 md:p-6">
          <p className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
            {metadata.join(" · ")}
          </p>

          <h3 className="font-display text-display-md text-on-paper uppercase">
            {day.title[locale]}
          </h3>
          <p
            className={`text-muted-on-paper font-sans leading-relaxed ${
              isWide ? "text-base md:text-lg" : "text-sm"
            }`}
          >
            {day.body[locale]}
          </p>

          {highlights.length > 0 ? (
            <div className="mt-auto space-y-3 pt-2">
              <p className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
                {highlightsLabel}
              </p>
              <ul className="flex flex-wrap gap-2">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="border-ink/20 flex items-center gap-2 border px-2.5 py-1.5"
                  >
                    <MapPinIcon className="text-accent-on-paper h-3.5 w-3.5 shrink-0" />
                    <span className="font-sans text-xs leading-tight">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </article>
    </li>
  );
}

function isFeaturedRoadbookDay(tour: Tour, day: ItineraryDay) {
  return (
    day.day_number === 1 ||
    day.day_number % 5 === 0 ||
    (tour.slug === "cruces-del-sur" && day.day_number === 4)
  );
}

function buildRoadbookCardLayout(tour: Tour, itinerary: ItineraryDay[]) {
  const layout = new Map<number, { featured: boolean; spanFull: boolean }>();
  let openHalfRow = false;

  itinerary.forEach((day, index) => {
    const featured = isFeaturedRoadbookDay(tour, day);
    const nextDay = itinerary[index + 1];
    const nextIsFeatured = nextDay ? isFeaturedRoadbookDay(tour, nextDay) : false;
    const wouldBeOrphaned = !openHalfRow && nextIsFeatured;
    const isFinalOrphan = !openHalfRow && !nextDay;
    const spanFull = featured || wouldBeOrphaned || isFinalOrphan;

    layout.set(day.day_number, { featured, spanFull });

    if (spanFull) {
      openHalfRow = false;
      return;
    }

    openHalfRow = !openHalfRow;
  });

  return layout;
}

/**
 * TourCmsContent — renders the client-editable Google Sheets tour body as a
 * set of poster zones: route dossier, day-by-day route, and practical details.
 */
export async function TourCmsContent({ content, locale }: TourCmsContentProps) {
  const t = await getTranslations({ locale, namespace: "tour_detail" });
  const { tour, itinerary, sections, gallery } = content;
  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const formatter = new Intl.NumberFormat(numberLocale);
  const testimonials = testimonialsByTour[tour.slug]?.[locale] ?? [];
  const statRows = buildStatRows({
    tour,
    formatter,
    labels: {
      duration: t("duration_label"),
      days: t("days_unit"),
      distance: t("distance_label"),
      ripio: t("ripio_label"),
      altitude: t("max_altitude_label"),
    },
  });
  const metadataLabels: DayMetadataLabels = {
    surfacePending: t("surface_pending"),
    distancePending: t("distance_pending"),
  };
  const roadbookLayout = buildRoadbookCardLayout(tour, itinerary);
  const routeMap = routeMapsByTour[tour.slug];
  const routeMapSection = routeMap ? (
    <RouteMapSection
      map={routeMap}
      locale={locale}
      eyebrow={t("route_map_eyebrow")}
      openGoogleMapsLabel={t("route_map_open_google")}
      workshopTitle={t("route_map_workshop_title")}
    />
  ) : null;

  const sectionsByType = new Map<TourSection["type"], TourSection[]>();
  for (const section of sections) {
    const bucket = sectionsByType.get(section.type);
    if (bucket) {
      bucket.push(section);
    } else {
      sectionsByType.set(section.type, [section]);
    }
  }

  const practicalDetails =
    sections.length > 0 ? (
      <section className="space-y-8">
        <div className="space-y-3">
          <Eyebrow rule>{t("practical_eyebrow")}</Eyebrow>
          <DisplayHeading size="xl" as="h2">
            {t("practical_heading")}
          </DisplayHeading>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {sectionOrder.map((type) => {
            const items = sectionsByType.get(type) ?? [];
            if (items.length === 0) return null;

            const heading =
              type === "included"
                ? t("included_heading")
                : type === "not_included"
                  ? t("not_included_heading")
                  : t("good_to_know_heading");
            const ItemIcon =
              type === "included" ? CheckIcon : type === "not_included" ? XIcon : InfoIcon;

            return (
              <article key={type} className="border-ink/30 bg-paper-light border-2 p-6">
                <DisplayHeading size="md" as="h3" distress={false} className="mb-5">
                  {heading}
                </DisplayHeading>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={`${item.type}-${item.sort_order}`} className="flex items-start gap-3">
                      <ItemIcon className="text-accent-on-paper mt-1 h-4 w-4 shrink-0" />
                      <span className="font-sans text-sm leading-relaxed">{item.text[locale]}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    ) : null;

  return (
    <>
      <PaperZone density={itinerary.length > 0 ? "light" : "default"} tornBottom={3}>
        <Container className={itinerary.length > 0 ? "" : "space-y-16"}>
          {itinerary.length > 0 ? (
            <StatStrip rows={statRows} />
          ) : (
            <>
              <RouteOverview tour={tour} locale={locale} statRows={statRows} gallery={gallery} />
              <GalleryCollage
                tour={tour}
                locale={locale}
                gallery={gallery}
                eyebrow={t("gallery_eyebrow")}
              />
              {practicalDetails}
            </>
          )}
        </Container>
      </PaperZone>

      {itinerary.length > 0 ? (
        <RedZone density="default" tornBottom={2}>
          <Container className="space-y-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(18rem,0.34fr)] lg:items-end">
              <div className="space-y-5">
                <Eyebrow>{t("itinerary_eyebrow")}</Eyebrow>
                <DisplayHeading size="xl" as="h2">
                  {t("itinerary_heading")}
                </DisplayHeading>
              </div>
              <p className="text-muted-on-red max-w-md font-sans text-base leading-relaxed">
                {t("itinerary_hook")}
              </p>
            </div>

            <RoadbookStrip
              itinerary={itinerary}
              locale={locale}
              formatter={formatter}
              dayLabel={t("day_label")}
              labels={metadataLabels}
            />

            <ol className="grid gap-6 lg:grid-cols-2">
              {itinerary.map((day) => {
                const image = gallery.length
                  ? gallery[(day.day_number - 1) % gallery.length]
                  : undefined;
                const layout = roadbookLayout.get(day.day_number);
                return (
                  <DayRoadbookCard
                    key={`${day.tour_slug}-${day.day_number}`}
                    day={day}
                    tour={tour}
                    locale={locale}
                    formatter={formatter}
                    dayLabel={t("day_label")}
                    highlightsLabel={t("highlights_label")}
                    metadataLabels={metadataLabels}
                    image={image}
                    featured={layout?.featured}
                    spanFull={layout?.spanFull}
                  />
                );
              })}
            </ol>
          </Container>
        </RedZone>
      ) : null}

      {itinerary.length > 0 ? (
        <PaperZone density="default" tornBottom={testimonials.length > 0 ? 4 : 1}>
          <Container className="space-y-16">
            {routeMapSection}
            <GalleryCollage
              tour={tour}
              locale={locale}
              gallery={gallery}
              eyebrow={t("gallery_eyebrow")}
            />
          </Container>
        </PaperZone>
      ) : null}

      {itinerary.length > 0 && testimonials.length > 0 ? (
        <RedZone density="default" tornBottom={2}>
          <TourTestimonials
            testimonials={testimonials}
            eyebrow={t("testimonials_eyebrow")}
            heading={t("testimonials_heading")}
          />
        </RedZone>
      ) : null}

      {itinerary.length > 0 && practicalDetails ? (
        <PaperZone density="default" tornBottom={1}>
          <Container>{practicalDetails}</Container>
        </PaperZone>
      ) : null}
    </>
  );
}

/**
 * TourMdxContent — fallback for routes whose structured Sheets itinerary has
 * not been filled yet. It still gives the route a designed dossier layout
 * instead of dropping the MDX into one bare vertical article.
 */
export async function TourMdxContent({ tour, locale, gallery, MdxBody }: TourMdxContentProps) {
  const t = await getTranslations({ locale, namespace: "tour_detail" });
  const numberLocale = locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-AR";
  const formatter = new Intl.NumberFormat(numberLocale);
  const testimonials = testimonialsByTour[tour.slug]?.[locale] ?? [];
  const statRows = buildStatRows({
    tour,
    formatter,
    labels: {
      duration: t("duration_label"),
      days: t("days_unit"),
      distance: t("distance_label"),
      ripio: t("ripio_label"),
      altitude: t("max_altitude_label"),
    },
  });

  return (
    <>
      <PaperZone density="default" tornBottom={testimonials.length > 0 ? 4 : 1}>
        <Container className="space-y-12">
          <RouteOverview tour={tour} locale={locale} statRows={statRows} gallery={gallery} />
          <GalleryCollage
            tour={tour}
            locale={locale}
            gallery={gallery}
            eyebrow={t("gallery_eyebrow")}
          />

          <section className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
            <aside className="border-ink/30 bg-paper-light border-2 p-5 lg:sticky lg:top-28">
              <Eyebrow>{t("overview_eyebrow")}</Eyebrow>
              <dl className="mt-5 space-y-4">
                {statRows.map((row) => (
                  <div key={row.label} className="border-ink/20 border-t pt-4">
                    <dt className="text-eyebrow tracking-eyebrow text-accent-on-paper font-semibold uppercase">
                      {row.label}
                    </dt>
                    <dd className="font-display text-display-md mt-1 uppercase">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>

            <article className="prose-tour prose-tour-columns border-ink/30 bg-paper-light border-2 p-6 md:p-10">
              {MdxBody ? (
                <MdxBody />
              ) : (
                <p className="font-sans text-base opacity-70">{t("missing_content")}</p>
              )}
            </article>
          </section>
        </Container>
      </PaperZone>

      {testimonials.length > 0 ? (
        <RedZone density="default" tornBottom={1}>
          <TourTestimonials
            testimonials={testimonials}
            eyebrow={t("testimonials_eyebrow")}
            heading={t("testimonials_heading")}
          />
        </RedZone>
      ) : null}
    </>
  );
}
