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

type MockLocale = "en" | "pt";

const MOCK_TRANSLATIONS: Record<string, Record<MockLocale, string>> = {
  "Sobre las Nubes": { en: "Over the Clouds", pt: "Sobre as Nuvens" },
  "Salta y Jujuy": { en: "Salta and Jujuy", pt: "Salta e Jujuy" },
  "Ruta de montaña en Salta y Jujuy": {
    en: "Mountain road in Salta and Jujuy",
    pt: "Rota de montanha em Salta e Jujuy",
  },
  "Siete días en moto cruzando Salta y Jujuy. Asfalto, ripio, altura, selva y pueblos andinos. El Abra del Acay marca la vara: 4895 msnm, una ruta que se gana kilómetro a kilómetro.":
    {
      en: "Seven days by motorcycle across Salta and Jujuy. Pavement, gravel, altitude, jungle, and Andean villages. Abra del Acay sets the bar: 4895 masl, a route earned kilometer by kilometer.",
      pt: "Sete dias de moto cruzando Salta e Jujuy. Asfalto, ripio, altitude, selva e povoados andinos. O Abra del Acay marca a medida: 4895 msnm, uma rota conquistada quilômetro por quilômetro.",
    },
  "1712 km. 4895 msnm. Siete días sobre las nubes.": {
    en: "1712 km. 4895 masl. Seven days above the clouds.",
    pt: "1712 km. 4895 msnm. Sete dias sobre as nuvens.",
  },
  "Siete días por Salta y Jujuy. 1712 km, 50% ripio y Abra del Acay a 4895 msnm con Moto On/Off.": {
    en: "Seven days through Salta and Jujuy. 1712 km, 50% gravel, and Abra del Acay at 4895 masl with Moto On/Off.",
    pt: "Sete dias por Salta e Jujuy. 1712 km, 50% ripio e Abra del Acay a 4895 msnm com Moto On/Off.",
  },
  "Volcanes del Norte": { en: "Volcanoes of the North", pt: "Vulcões do Norte" },
  Catamarca: { en: "Catamarca", pt: "Catamarca" },
  "Paisaje volcánico de Catamarca": {
    en: "Volcanic landscape in Catamarca",
    pt: "Paisagem vulcânica de Catamarca",
  },
  "Tour en moto por Catamarca\nCuestas Minas Capillitas, Balcón de Pissis, Campo de Piedra Pómez, salares, puna y volcanes. Una ruta de altura que alterna ripio, asfalto y jornadas para riders que ya saben lo que buscan.":
    {
      en: "Motorcycle tour through Catamarca\nCuesta Minas Capillitas, Balcón del Pissis, Campo de Piedra Pómez, salt flats, puna, and volcanoes. A high-altitude route alternating gravel, pavement, and days for riders who already know what they are looking for.",
      pt: "Tour de moto por Catamarca\nCuesta Minas Capillitas, Balcón del Pissis, Campo de Piedra Pómez, salares, puna e vulcões. Uma rota de altitude que alterna ripio, asfalto e jornadas para riders que já sabem o que procuram.",
    },
  "Siete días entre volcanes, puna y caminos que ponen a prueba.": {
    en: "Seven days among volcanoes, puna, and roads that test you.",
    pt: "Sete dias entre vulcões, puna e caminhos que testam.",
  },
  "Tour de moto por Catamarca. Siete días, 50% ripio, volcanes, salares y altura con Moto On/Off.":
    {
      en: "Motorcycle tour through Catamarca. Seven days, 50% gravel, volcanoes, salt flats, and altitude with Moto On/Off.",
      pt: "Tour de moto por Catamarca. Sete dias, 50% ripio, vulcões, salares e altitude com Moto On/Off.",
    },
  "Cruces del Sur": { en: "Southern Crossings", pt: "Cruces do Sul" },
  "Carretera Austral y Patagonia": {
    en: "Carretera Austral and Patagonia",
    pt: "Carretera Austral e Patagônia",
  },
  "Riders avanzando por un camino de ripio en Patagonia": {
    en: "Riders moving along a gravel road in Patagonia",
    pt: "Riders avançando por um caminho de ripio na Patagônia",
  },
  "Carretera Austral en moto. Pasos fronterizos y ripio patagónico. 2321 km para cruzar bosques, lagos y rutas que se recuerdan por lo que exigieron.":
    {
      en: "Carretera Austral by motorcycle. Border passes and Patagonian gravel. 2321 km across forests, lakes, and roads remembered for what they demanded.",
      pt: "Carretera Austral de moto. Passos de fronteira e ripio patagônico. 2321 km para cruzar bosques, lagos e rotas lembradas pelo que exigiram.",
    },
  "2,321 km through Patagonia, lakes, and border crossings.": {
    en: "2321 km through Patagonia, lakes, and border crossings.",
    pt: "2321 km pela Patagônia, lagos e passos de fronteira.",
  },
  "Tour de moto por Carretera Austral y Patagonia. Siete días, 2321 km y 45% ripio con Moto On/Off.":
    {
      en: "Motorcycle tour through Carretera Austral and Patagonia. Seven days, 2321 km, and 45% gravel with Moto On/Off.",
      pt: "Tour de moto pela Carretera Austral e Patagônia. Sete dias, 2321 km e 45% ripio com Moto On/Off.",
    },
  "Gigantes del Oeste": { en: "Giants of the West", pt: "Gigantes do Oeste" },
  "Mendoza a La Rioja": { en: "Mendoza to La Rioja", pt: "Mendoza a La Rioja" },
  "Moto de aventura cruzando el oeste argentino": {
    en: "Adventure motorcycle crossing western Argentina",
    pt: "Moto de aventura cruzando o oeste argentino",
  },
  "Tour en moto por Mendoza, San Juan y La Rioja. Recorriendo la cordillera, Laguna Brava, Mina la Mejicana y caminos de montaña entre asfalto y ripio.":
    {
      en: "Motorcycle tour through Mendoza, San Juan, and La Rioja. Riding the cordillera, Laguna Brava, Mina La Mejicana, and mountain roads between pavement and gravel.",
      pt: "Tour de moto por Mendoza, San Juan e La Rioja. Percorrendo a cordilheira, Laguna Brava, Mina La Mejicana e caminhos de montanha entre asfalto e ripio.",
    },
  "2400 km. Ocho días. La cordillera se cruza arriba de la moto.": {
    en: "2400 km. Eight days. The cordillera is crossed from the saddle.",
    pt: "2400 km. Oito dias. A cordilheira se cruza em cima da moto.",
  },
  "Ocho días de moto por Mendoza, San Juan y La Rioja. 2400 km, ripio, cordillera y parques nacionales con Moto On/Off.":
    {
      en: "Eight days by motorcycle through Mendoza, San Juan, and La Rioja. 2400 km, gravel, cordillera, and national parks with Moto On/Off.",
      pt: "Oito dias de moto por Mendoza, San Juan e La Rioja. 2400 km, ripio, cordilheira e parques nacionais com Moto On/Off.",
    },
  "70% asfalto": { en: "70% pavement", pt: "70% asfalto" },
  "80% asfalto": { en: "80% pavement", pt: "80% asfalto" },
  "20% asfalto": { en: "20% pavement", pt: "20% asfalto" },
  "50% asfalto": { en: "50% pavement", pt: "50% asfalto" },
  "90% asfalto": { en: "90% pavement", pt: "90% asfalto" },
  "100% asfalto": { en: "100% pavement", pt: "100% asfalto" },
  "40% asfalto": { en: "40% pavement", pt: "40% asfalto" },
  "70% asfalto / 30% ripio": { en: "70% pavement / 30% gravel", pt: "70% asfalto / 30% ripio" },
  "90% asfalto / 10% ripio": { en: "90% pavement / 10% gravel", pt: "90% asfalto / 10% ripio" },
  "30% asfalto / 70% ripio": { en: "30% pavement / 70% gravel", pt: "30% asfalto / 70% ripio" },
  "50% asfalto / 50% ripio": { en: "50% pavement / 50% gravel", pt: "50% asfalto / 50% ripio" },
  "30% ripio": { en: "30% gravel", pt: "30% ripio" },
  "20% ripio": { en: "20% gravel", pt: "20% ripio" },
  "70% ripio": { en: "70% gravel", pt: "70% ripio" },
  "80% ripio": { en: "80% gravel", pt: "80% ripio" },
  "15% ripio": { en: "15% gravel", pt: "15% ripio" },
  "35% ripio": { en: "35% gravel", pt: "35% ripio" },
  "El primer día combina agua, selva, altura, montaña y pueblos andinos. Partimos desde Salta Capital rumbo al Embalse Cabra Corral, almorzamos con vistas al lago y seguimos hacia la Cuesta del Obispo. Curvas, cardones y nubes marcan la entrada a Cachi.":
    {
      en: "The first day combines water, jungle, altitude, mountain, and Andean villages. We leave Salta Capital for Embalse Cabra Corral, have lunch with lake views, and continue toward Cuesta del Obispo. Curves, cardones, and clouds mark the entrance to Cachi.",
      pt: "O primeiro dia combina água, selva, altitude, montanha e povoados andinos. Saímos de Salta Capital rumo ao Embalse Cabra Corral, almoçamos com vista para o lago e seguimos para a Cuesta del Obispo. Curvas, cardones e nuvens marcam a entrada em Cachi.",
    },
  "Un recorrido pensado para disfrutar arriba de la moto. Curvas entretenidas, cambios de ritmo y una paleta de colores en todo el trayecto. Atravesamos la Quebrada de las Flechas, almorzamos en Cafayate y rodamos la Quebrada de las Conchas hasta El Carril.":
    {
      en: "A route built to enjoy from the saddle. Playful curves, changes of rhythm, and color across the whole ride. We cross Quebrada de las Flechas, have lunch in Cafayate, and ride Quebrada de las Conchas to El Carril.",
      pt: "Um percurso pensado para aproveitar em cima da moto. Curvas divertidas, mudanças de ritmo e uma paleta de cores em todo o trajeto. Atravessamos a Quebrada de las Flechas, almoçamos em Cafayate e rodamos a Quebrada de las Conchas até El Carril.",
    },
  "El Abra del Acay es el tramo más emblemático de la Ruta 40: el punto más alto de esa ruta y de cualquier ruta nacional de América. La subida entrega color, acantilados y una montaña que exige atención. La bajada hacia San Antonio de los Cobres abre el paisaje y afloja el ritmo.":
    {
      en: "Abra del Acay is the most emblematic section of Ruta 40: its highest point and the highest point of any national road in the Americas. The climb gives color, cliffs, and a mountain that demands attention. The descent to San Antonio de los Cobres opens the landscape and relaxes the pace.",
      pt: "O Abra del Acay é o trecho mais emblemático da Ruta 40: o ponto mais alto dela e de qualquer rota nacional da América. A subida entrega cor, penhascos e uma montanha que exige atenção. A descida para San Antonio de los Cobres abre a paisagem e solta o ritmo.",
    },
  "Salimos rumbo al Viaducto La Polvorilla, pasando por La Juguetería y sus rocas inmensas. Seguimos hacia Salinas Grandes. En el descenso a Purmamarca aparecen curvas más marcadas, cerros de colores y la llegada al corazón de la quebrada.":
    {
      en: "We ride toward Viaducto La Polvorilla, passing La Juguetería and its huge rocks. Then we continue to Salinas Grandes. On the descent to Purmamarca, tighter curves, colored hills, and the heart of the quebrada appear.",
      pt: "Saímos rumo ao Viaducto La Polvorilla, passando por La Juguetería e suas rochas enormes. Seguimos para Salinas Grandes. Na descida a Purmamarca aparecem curvas mais marcadas, cerros coloridos e a chegada ao coração da quebrada.",
    },
  "Día de conducción y entorno más que velocidad. Curvas cerradas, rectas con acantilados y caminos de altura poco transitados. Más que conducir la moto, se rueda flotando sobre las nubes.":
    {
      en: "A day of riding and surroundings more than speed. Tight curves, straights beside cliffs, and little-traveled high roads. More than riding the bike, you roll above the clouds.",
      pt: "Dia de pilotagem e entorno mais do que velocidade. Curvas fechadas, retas com penhascos e caminhos de altitude pouco transitados. Mais do que conduzir a moto, você roda flutuando sobre as nuvens.",
    },
  "El paisaje cambia por completo: de caminos de altura y pueblos aislados empezás a descender hacia la selva de las Yungas. La ruta se vuelve verde, húmeda, cerrada. Una transición ganada entre montaña árida y selva viva.":
    {
      en: "The landscape changes completely: from high roads and isolated villages, you begin descending into the Yungas jungle. The route turns green, humid, and closed in. An earned transition between dry mountain and living jungle.",
      pt: "A paisagem muda completamente: dos caminhos de altitude e povoados isolados você começa a descer para a selva das Yungas. A rota fica verde, úmida e fechada. Uma transição conquistada entre montanha árida e selva viva.",
    },
  "Una jornada tranquila para cerrar el tour. Almuerzo junto al Dique La Ciénaga y unas dos horas finales de asfalto y curvas hasta volver a Salta Capital.":
    {
      en: "A calm day to close the tour. Lunch beside Dique La Ciénaga and about two final hours of pavement and curves back to Salta Capital.",
      pt: "Uma jornada tranquila para fechar o tour. Almoço junto ao Dique La Ciénaga e cerca de duas horas finais de asfalto e curvas até voltar a Salta Capital.",
    },
  "Partimos el tour en moto desde Mendoza Capital rumbo a Potrerillos entre túneles, curvas y embalses. Después entramos a la Reserva Natural Villavicencio: ripio, 365 curvas y llegada al histórico hotel antes de dormir en Uspallata.":
    {
      en: "We start the motorcycle tour from Mendoza Capital toward Potrerillos through tunnels, curves, and reservoirs. Then we enter Reserva Natural Villavicencio: gravel, 365 curves, and the historic hotel before sleeping in Uspallata.",
      pt: "Começamos o tour de moto em Mendoza Capital rumo a Potrerillos entre túneis, curvas e represas. Depois entramos na Reserva Natural Villavicencio: ripio, 365 curvas e chegada ao hotel histórico antes de dormir em Uspallata.",
    },
  "Cruzamos la cordillera por el Paso Internacional Los Libertadores. Aconcagua, túneles de alta montaña y la bajada por los Caracoles hacen una jornada de Andes completa, con regreso a Uspallata por el Cristo Redentor.":
    {
      en: "We cross the cordillera through Paso Internacional Los Libertadores. Aconcagua, high-mountain tunnels, and the descent through Los Caracoles make a full Andes day, returning to Uspallata by Cristo Redentor.",
      pt: "Cruzamos a cordilheira pelo Paso Internacional Los Libertadores. Aconcagua, túneis de alta montanha e a descida pelos Caracoles formam uma jornada completa de Andes, com volta a Uspallata pelo Cristo Redentor.",
    },
  "Dejamos el valle mendocino para entrar en planicies abiertas y caminos solitarios. El tour en moto sigue por Pampa del Leoncito, Barreal y Laguna Blanca: un día de horizontes largos y atardeceres ganados.":
    {
      en: "We leave the Mendoza valley and enter open plains and solitary roads. The motorcycle tour continues through Pampa del Leoncito, Barreal, and Laguna Blanca: a day of long horizons and earned sunsets.",
      pt: "Deixamos o vale mendocino para entrar em planícies abertas e caminhos solitários. O tour de moto segue por Pampa del Leoncito, Barreal e Laguna Blanca: um dia de horizontes longos e pores do sol conquistados.",
    },
  "Una etapa escénica que conecta valles, diques, quebradas y zonas áridas riojanas. Rodeo, Jáchal y Huaco cambian el ritmo con curvas cerradas y miradores abiertos.":
    {
      en: "A scenic stage linking valleys, dams, quebradas, and dry La Rioja terrain. Rodeo, Jáchal, and Huaco change the rhythm with tight curves and open lookouts.",
      pt: "Uma etapa cênica que conecta vales, diques, quebradas e zonas áridas riojanas. Rodeo, Jáchal e Huaco mudam o ritmo com curvas fechadas e mirantes abertos.",
    },
  "Subimos a Laguna Brava en moto, una laguna de alta montaña custodiada por silencio, flamencos y refugios de piedra. El ripio de Quebrada de la Troya y La Herradura pone color y exigencia al día.":
    {
      en: "We climb to Laguna Brava by motorcycle, a high-mountain lagoon guarded by silence, flamingos, and stone refuges. The gravel of Quebrada de la Troya and La Herradura adds color and demand to the day.",
      pt: "Subimos à Laguna Brava de moto, uma lagoa de alta montanha guardada por silêncio, flamingos e refúgios de pedra. O ripio da Quebrada de la Troya e La Herradura coloca cor e exigência no dia.",
    },
  "Talampaya abre paredones rojos y cañones de millones de años. Después el Valle de la Luna y la Cuesta de Miranda completan una jornada de colores duros antes de llegar a Chilecito.":
    {
      en: "Talampaya opens red walls and canyons millions of years old. Then Valle de la Luna and Cuesta de Miranda complete a day of hard color before reaching Chilecito.",
      pt: "Talampaya abre paredões vermelhos e cânions de milhões de anos. Depois o Valle de la Luna e a Cuesta de Miranda completam uma jornada de cores duras antes de chegar a Chilecito.",
    },
  "El ascenso a Mina La Mejicana en moto es corto en kilómetros e intenso en historia, altura y paisaje. Cañón del Ocre, ríos anaranjados, estructuras abandonadas y silencio absoluto cierran el tramo más alto del tour.":
    {
      en: "The climb to Mina La Mejicana by motorcycle is short in kilometers and intense in history, altitude, and landscape. Cañón del Ocre, orange rivers, abandoned structures, and absolute silence close the highest section of the tour.",
      pt: "A subida à Mina La Mejicana de moto é curta em quilômetros e intensa em história, altitude e paisagem. Cañón del Ocre, rios alaranjados, estruturas abandonadas e silêncio absoluto fecham o trecho mais alto do tour.",
    },
  "Cerramos por Ruta 40 hacia las Termas de Santa Teresita. Una jornada de regreso y descanso antes de completar la llegada a La Rioja.":
    {
      en: "We close on Ruta 40 toward Termas de Santa Teresita. A return and rest day before completing the arrival in La Rioja.",
      pt: "Fechamos pela Ruta 40 até as Termas de Santa Teresita. Uma jornada de retorno e descanso antes de completar a chegada a La Rioja.",
    },
  "Atravesamos la Ruta del Adobe entre Tinogasta y Fiambalá. Pueblos chicos, precordillera árida y cierre en las Termas de Fiambalá para preparar la altura que viene.":
    {
      en: "We cross Ruta del Adobe between Tinogasta and Fiambalá. Small towns, dry precordillera, and a close at Termas de Fiambalá to prepare for the altitude ahead.",
      pt: "Atravessamos a Ruta del Adobe entre Tinogasta e Fiambalá. Povoados pequenos, pré-cordilheira árida e fechamento nas Termas de Fiambalá para preparar a altitude que vem.",
    },
  "La Ruta de los Seismiles entra por Quebrada de las Angosturas y gana altura hasta el Balcón del Pissis. Volcanes, lagunas y una vista monumental ponen la vara del viaje.":
    {
      en: "Ruta de los Seismiles enters through Quebrada de las Angosturas and gains altitude to Balcón del Pissis. Volcanoes, lagoons, and a monumental view set the bar for the trip.",
      pt: "A Ruta de los Seismiles entra pela Quebrada de las Angosturas e ganha altitude até o Balcón del Pissis. Vulcões, lagoas e uma vista monumental marcam a medida da viagem.",
    },
  "Rumbo norte hacia las Dunas de Tatón, uno de los campos de arena más aislados de Catamarca. Tinogasta, bodega Veralma y el km 4040 de la Ruta 40 marcan el camino a Belén.":
    {
      en: "North toward Dunas de Tatón, one of the most isolated sand fields in Catamarca. Tinogasta, Veralma winery, and km 4040 of Ruta 40 mark the road to Belén.",
      pt: "Rumo norte para as Dunas de Tatón, um dos campos de areia mais isolados de Catamarca. Tinogasta, vinícola Veralma e o km 4040 da Ruta 40 marcam o caminho a Belén.",
    },
  "La ruta a Antofagasta combina montaña, quebradas y puna abierta. Al superar la cuesta aparecen volcanes, silencio y el campo de lava del Volcán Alumbrera.":
    {
      en: "The route to Antofagasta combines mountain, quebradas, and open puna. After the climb, volcanoes, silence, and the lava field of Volcán Alumbrera appear.",
      pt: "A rota a Antofagasta combina montanha, quebradas e puna aberta. Depois da cuesta aparecem vulcões, silêncio e o campo de lava do Volcán Alumbrera.",
    },
  "El terreno se vuelve claro, volcánico y ondulado hasta entrar al Campo de Piedra Pómez. Después la Laguna Carachi Pampa abre una puna inmensa, solitaria y difícil de olvidar.":
    {
      en: "The terrain turns pale, volcanic, and rolling until Campo de Piedra Pómez. Then Laguna Carachi Pampa opens an immense, solitary puna that is hard to forget.",
      pt: "O terreno fica claro, vulcânico e ondulado até entrar no Campo de Piedra Pómez. Depois a Laguna Carachi Pampa abre uma puna imensa, solitária e difícil de esquecer.",
    },
  "Saliendo de El Peñón, el paisaje volcánico da paso a caminos de montaña. Cuesta de Capillitas y Refugio del Minero hacen un día de ripio, altura y descenso hacia Andalgalá.":
    {
      en: "Leaving El Peñón, the volcanic landscape gives way to mountain roads. Cuesta de Capillitas and Refugio del Minero make a day of gravel, altitude, and descent toward Andalgalá.",
      pt: "Saindo de El Peñón, a paisagem vulcânica dá lugar a caminhos de montanha. Cuesta de Capillitas e Refugio del Minero fazem um dia de ripio, altitude e descida para Andalgalá.",
    },
  "El cierre cambia otra vez el clima: cursos de agua, vegetación densa y selva de montaña. Cuesta la Chilca y Loma Larga devuelven la ruta a San Fernando.":
    {
      en: "The close changes the climate again: watercourses, dense vegetation, and mountain jungle. Cuesta la Chilca and Loma Larga return the route to San Fernando.",
      pt: "O fechamento muda outra vez o clima: cursos de água, vegetação densa e selva de montanha. Cuesta la Chilca e Loma Larga devolvem a rota a San Fernando.",
    },
  "Salimos desde Bariloche por Ruta 40 y entramos en ritmo entre asfalto y ripio. El desvío por Cholila abre el Parque Nacional Los Alerces antes de llegar a Trevelin.":
    {
      en: "We leave Bariloche on Ruta 40 and find rhythm between pavement and gravel. The Cholila detour opens Parque Nacional Los Alerces before Trevelin.",
      pt: "Saímos de Bariloche pela Ruta 40 e entramos em ritmo entre asfalto e ripio. O desvio por Cholila abre o Parque Nacional Los Alerces antes de chegar a Trevelin.",
    },
  "Campo de tulipanes, Paso Futaleufú y entrada plena a la Carretera Austral. Bosque cerrado, ríos, curvas y montaña hasta cerrar el día en Puerto Cisnes.":
    {
      en: "Tulip fields, Paso Futaleufú, and full entry into Carretera Austral. Closed forest, rivers, curves, and mountain until the day closes in Puerto Cisnes.",
      pt: "Campo de tulipas, Paso Futaleufú e entrada plena na Carretera Austral. Bosque fechado, rios, curvas e montanha até fechar o dia em Puerto Cisnes.",
    },
  "Montaña, fiordos, asfalto y ripio hacia Puerto Ingeniero Ibáñez. La barcaza cruza el Lago General Carrera y deja la ruta lista para entrar a Chile Chico.":
    {
      en: "Mountain, fjords, pavement, and gravel toward Puerto Ingeniero Ibáñez. The ferry crosses Lago General Carrera and sets the route up for Chile Chico.",
      pt: "Montanha, fiordes, asfalto e ripio até Puerto Ingeniero Ibáñez. A barcaça cruza o Lago General Carrera e deixa a rota pronta para entrar em Chile Chico.",
    },
  "Día de ripio real bordeando el Lago General Carrera. Agua, montaña y camino abierto acompañan una de las etapas más auténticas de la Carretera Austral.":
    {
      en: "A real gravel day along Lago General Carrera. Water, mountain, and open road shape one of the most authentic stages of Carretera Austral.",
      pt: "Dia de ripio real margeando o Lago General Carrera. Água, montanha e caminho aberto acompanham uma das etapas mais autênticas da Carretera Austral.",
    },
  "Paso Roballos entrega estepa abierta, cordillera a los costados y aislamiento total. Del lado argentino, el camino bordea los Andes antes de llegar a Los Antiguos y Perito Moreno.":
    {
      en: "Paso Roballos gives open steppe, cordillera on both sides, and total isolation. On the Argentine side, the road follows the Andes before reaching Los Antiguos and Perito Moreno.",
      pt: "Paso Roballos entrega estepe aberta, cordilheira dos lados e isolamento total. Do lado argentino, o caminho margeia os Andes antes de chegar a Los Antiguos e Perito Moreno.",
    },
  "Jornada larga de regreso por Ruta 40, con rectas aisladas hasta Gobernador Costa. Después tomamos camino secundario hacia Río Pico y Lago Vintter, una Patagonia menos vista.":
    {
      en: "A long return day on Ruta 40, with isolated straights to Gobernador Costa. Then we take a secondary road toward Río Pico and Lago Vintter, a less-seen Patagonia.",
      pt: "Jornada longa de retorno pela Ruta 40, com retas isoladas até Gobernador Costa. Depois pegamos um caminho secundário para Río Pico e Lago Vintter, uma Patagônia menos vista.",
    },
  "Bosques bajos, montañas nevadas y ripio sin tránsito hasta Trevelin. Después volvemos a enlazar Ruta 40, El Bolsón y Bariloche para cerrar el cruce patagónico.":
    {
      en: "Low forests, snowy mountains, and traffic-free gravel to Trevelin. Then we link Ruta 40, El Bolsón, and Bariloche again to close the Patagonian crossing.",
      pt: "Bosques baixos, montanhas nevadas e ripio sem trânsito até Trevelin. Depois voltamos a ligar Ruta 40, El Bolsón e Bariloche para fechar a travessia patagônica.",
    },
  "Traslado de la moto ida y vuelta a destino": {
    en: "Round-trip motorcycle transport to the destination",
    pt: "Transporte de ida e volta da moto ao destino",
  },
  "Seguro de carga de la moto": {
    en: "Motorcycle cargo insurance",
    pt: "Seguro de carga da moto",
  },
  Refrigerios: { en: "Snacks and refreshments", pt: "Lanches e refrigerios" },
  "Moto de repuesto": { en: "Spare motorcycle", pt: "Moto reserva" },
  "Siete noches de alojamiento en hospedajes seleccionados": {
    en: "Seven nights in selected lodging",
    pt: "Sete noites em hospedagens selecionadas",
  },
  "Vehículo de apoyo durante toda la ruta": {
    en: "Support vehicle throughout the route",
    pt: "Veículo de apoio durante toda a rota",
  },
  "Combustible de emergencia para todo el trayecto": {
    en: "Emergency fuel for the full route",
    pt: "Combustível de emergência para todo o trajeto",
  },
  "Desayunos, almuerzos y cenas": {
    en: "Breakfasts, lunches, and dinners",
    pt: "Cafés da manhã, almoços e jantares",
  },
  "Guía con experiencia probada en el oeste argentino": {
    en: "Guide with proven experience in western Argentina",
    pt: "Guia com experiência comprovada no oeste argentino",
  },
  "Pasajes aéreos hasta Salta y desde Salta": {
    en: "Flights to and from Salta",
    pt: "Passagens aéreas até e desde Salta",
  },
  "Pasajes aéreos hasta Catamarca y desde Catamarca": {
    en: "Flights to and from Catamarca",
    pt: "Passagens aéreas até e desde Catamarca",
  },
  "Pasajes aéreos hasta Mendoza y desde La Rioja": {
    en: "Flights to Mendoza and from La Rioja",
    pt: "Passagens aéreas até Mendoza e desde La Rioja",
  },
  "Bebidas alcohólicas y comidas fuera del itinerario": {
    en: "Alcoholic drinks and meals outside the itinerary",
    pt: "Bebidas alcoólicas e refeições fora do itinerário",
  },
  "Seguro de viajero con cobertura de moto": {
    en: "Travel insurance with motorcycle coverage",
    pt: "Seguro viagem com cobertura para moto",
  },
  "Alquiler de moto si no traés la tuya": {
    en: "Motorcycle rental if you do not bring your own",
    pt: "Aluguel de moto se você não trouxer a sua",
  },
  "Cupo limitado por tour.": { en: "Limited capacity per tour.", pt: "Vagas limitadas por tour." },
  "Esta travesía atraviesa altura sostenida (2500–4550 msnm).": {
    en: "This crossing holds sustained altitude (2500–4550 masl).",
    pt: "Esta travessia passa por altitude sustentada (2500–4550 msnm).",
  },
  "Se requiere experiencia previa en ripio.": {
    en: "Previous gravel experience is required.",
    pt: "É necessária experiência prévia em ripio.",
  },
  "El tour cruza dos veces la frontera Argentina-Chile. DNI o pasaporte vigente y permiso para circular si la moto no está a tu nombre. Te asesoramos antes del viaje.":
    {
      en: "The tour crosses the Argentina-Chile border twice. You need a valid ID or passport and authorization to ride if the motorcycle is not in your name. We guide you before the trip.",
      pt: "O tour cruza duas vezes a fronteira Argentina-Chile. Você precisa de RG ou passaporte válido e autorização para circular se a moto não estiver no seu nome. Orientamos antes da viagem.",
    },
  "Abra del Acay, Quebrada de las Flechas y 1712 km ganados en el NOA.": {
    en: "Abra del Acay, Quebrada de las Flechas, and 1712 km earned in the Argentine northwest.",
    pt: "Abra del Acay, Quebrada de las Flechas e 1712 km conquistados no NOA.",
  },
  "Catamarca alta: volcanes, puna, salares y jornadas largas de ripio.": {
    en: "High Catamarca: volcanoes, puna, salt flats, and long gravel days.",
    pt: "Catamarca alta: vulcões, puna, salares e jornadas longas de ripio.",
  },
  "Patagonia y Carretera Austral con bosque, frontera y ripio.": {
    en: "Patagonia and Carretera Austral with forest, border, and gravel.",
    pt: "Patagônia e Carretera Austral com bosque, fronteira e ripio.",
  },
  "Camino de altura en la ruta Sobre las Nubes": {
    en: "High-altitude road on the Over the Clouds route",
    pt: "Caminho de altitude na rota Sobre as Nuvens",
  },
  "Moto avanzando por caminos de Salta y Jujuy": {
    en: "Motorcycle moving along roads in Salta and Jujuy",
    pt: "Moto avançando por caminhos de Salta e Jujuy",
  },
  "Ruta andina con cerros y ripio en Sobre las Nubes": {
    en: "Andean road with hills and gravel on Over the Clouds",
    pt: "Rota andina com cerros e ripio em Sobre as Nuvens",
  },
  "Trazado de montaña ganado sobre la puna": {
    en: "Mountain line earned across the puna",
    pt: "Traçado de montanha conquistado sobre a puna",
  },
  "Camino abierto entre valles del norte argentino": {
    en: "Open road between valleys of northern Argentina",
    pt: "Caminho aberto entre vales do norte argentino",
  },
  "Ruta de ripio entre Salta y Jujuy": {
    en: "Gravel road between Salta and Jujuy",
    pt: "Rota de ripio entre Salta e Jujuy",
  },
  "Paso de montaña en la ruta Sobre las Nubes": {
    en: "Mountain pass on the Over the Clouds route",
    pt: "Passo de montanha na rota Sobre as Nuvens",
  },
  "Rider enfrentando curvas de altura en el norte": {
    en: "Rider taking on high-altitude curves in the north",
    pt: "Rider enfrentando curvas de altitude no norte",
  },
  "Paisaje de altura recorrido sobre dos ruedas": {
    en: "High-altitude landscape crossed on two wheels",
    pt: "Paisagem de altitude percorrida sobre duas rodas",
  },
  "Moto cruzando caminos de montaña entre Mendoza y La Rioja": {
    en: "Motorcycle crossing mountain roads between Mendoza and La Rioja",
    pt: "Moto cruzando caminhos de montanha entre Mendoza e La Rioja",
  },
  "Ruta de cordillera en Gigantes del Oeste": {
    en: "Cordillera road on Giants of the West",
    pt: "Rota de cordilheira em Gigantes do Oeste",
  },
  "Motos avanzando por planicies abiertas en Gigantes del Oeste": {
    en: "Motorcycles moving across open plains on Giants of the West",
    pt: "Motos avançando por planícies abertas em Gigantes do Oeste",
  },
  "Rider avanzando por el ripio cuyano": {
    en: "Rider moving along Cuyo gravel",
    pt: "Rider avançando pelo ripio cuyano",
  },
  "Ruta abierta entre montañas del oeste": {
    en: "Open road between western mountains",
    pt: "Rota aberta entre montanhas do oeste",
  },
  "Camino de alta montaña recorrido en moto": {
    en: "High-mountain road ridden by motorcycle",
    pt: "Caminho de alta montanha percorrido de moto",
  },
  "Moto cargada para cruzar el oeste argentino": {
    en: "Loaded motorcycle ready to cross western Argentina",
    pt: "Moto carregada para cruzar o oeste argentino",
  },
  "Rider en una jornada larga de montaña": {
    en: "Rider on a long mountain day",
    pt: "Rider em uma jornada longa de montanha",
  },
  "Moto detenida en una ruta de ripio": {
    en: "Motorcycle stopped on a gravel road",
    pt: "Moto parada em uma rota de ripio",
  },
  "Camino conquistado en la ruta Gigantes del Oeste": {
    en: "Road conquered on the Giants of the West route",
    pt: "Caminho conquistado na rota Gigantes do Oeste",
  },
  "Trazado de ripio entre sierras y cordillera": {
    en: "Gravel line between sierras and cordillera",
    pt: "Traçado de ripio entre serras e cordilheira",
  },
  "Rider y moto en el oeste argentino": {
    en: "Rider and motorcycle in western Argentina",
    pt: "Rider e moto no oeste argentino",
  },
  "Camino de montaña puesto a prueba por la ruta": {
    en: "Mountain road tested by the route",
    pt: "Caminho de montanha testado pela rota",
  },
  "Paisaje de cordillera atravesado en moto": {
    en: "Cordillera landscape crossed by motorcycle",
    pt: "Paisagem de cordilheira atravessada de moto",
  },
  "Camino de alta montaña durante el día dos de Gigantes del Oeste": {
    en: "High-mountain road during day two of Giants of the West",
    pt: "Caminho de alta montanha durante o dia dois de Gigantes do Oeste",
  },
  "Riders avanzando por planicies de ripio en Gigantes del Oeste": {
    en: "Riders moving across gravel plains on Giants of the West",
    pt: "Riders avançando por planícies de ripio em Gigantes do Oeste",
  },
  "Moto sobre camino abierto rumbo a Laguna Brava": {
    en: "Motorcycle on open road toward Laguna Brava",
    pt: "Moto em caminho aberto rumo à Laguna Brava",
  },
  "Estructura minera en la ruta hacia Mina La Mejicana": {
    en: "Mining structure on the route to Mina La Mejicana",
    pt: "Estrutura mineira na rota até Mina La Mejicana",
  },
  "Grupo de motos detenido en un camino de montaña del oeste argentino": {
    en: "Group of motorcycles stopped on a mountain road in western Argentina",
    pt: "Grupo de motos parado em um caminho de montanha do oeste argentino",
  },
  "Ruta de Catamarca entre volcanes y puna": {
    en: "Catamarca route between volcanoes and puna",
    pt: "Rota de Catamarca entre vulcões e puna",
  },
  "Camino de altura en Volcanes del Norte": {
    en: "High-altitude road on Volcanoes of the North",
    pt: "Caminho de altitude em Vulcões do Norte",
  },
  "Paisaje volcánico cruzado en moto": {
    en: "Volcanic landscape crossed by motorcycle",
    pt: "Paisagem vulcânica cruzada de moto",
  },
  "Ruta de montaña en Catamarca": {
    en: "Mountain route in Catamarca",
    pt: "Rota de montanha em Catamarca",
  },
  "Camino de ripio entre volcanes del norte": {
    en: "Gravel road between northern volcanoes",
    pt: "Caminho de ripio entre vulcões do norte",
  },
  "Jornada de ruta larga sobre la puna catamarqueña": {
    en: "Long route day over the Catamarca puna",
    pt: "Jornada longa de rota sobre a puna catamarqueña",
  },
  "Horizonte de altura en Volcanes del Norte": {
    en: "High-altitude horizon on Volcanoes of the North",
    pt: "Horizonte de altitude em Vulcões do Norte",
  },
  "Ruta abierta entre salares y volcanes": {
    en: "Open road between salt flats and volcanoes",
    pt: "Rota aberta entre salares e vulcões",
  },
  "Moto sobre caminos probados de Catamarca": {
    en: "Motorcycle on tested roads in Catamarca",
    pt: "Moto sobre caminhos testados de Catamarca",
  },
  "Campo de Tulipanes, Trevelin.": {
    en: "Tulip fields, Trevelin.",
    pt: "Campo de tulipas, Trevelin.",
  },
  "Camino ripio, Carretera Austral": {
    en: "Gravel road, Carretera Austral",
    pt: "Caminho de ripio, Carretera Austral",
  },
  "Descanso entre la ruta 40 y la Carretera Austral": {
    en: "Rest between Ruta 40 and Carretera Austral",
    pt: "Descanso entre a Ruta 40 e a Carretera Austral",
  },
  "Camino a Puerto Cisnes, Chile": {
    en: "Road to Puerto Cisnes, Chile",
    pt: "Caminho a Puerto Cisnes, Chile",
  },
  "Paisaje de Patagonia ganado sobre ripio": {
    en: "Patagonian landscape earned on gravel",
    pt: "Paisagem da Patagônia conquistada no ripio",
  },
  "Camino abierto entre bosques y lagos patagónicos": {
    en: "Open road between Patagonian forests and lakes",
    pt: "Caminho aberto entre bosques e lagos patagônicos",
  },
  "Ruta 40, ripio hacia Chile": {
    en: "Ruta 40, gravel toward Chile",
    pt: "Ruta 40, ripio rumo ao Chile",
  },
  "Vista a volcán en la Carretera Austral": {
    en: "View of a volcano on Carretera Austral",
    pt: "Vista para vulcão na Carretera Austral",
  },
  "Cruce de frontera hacia Chile": {
    en: "Border crossing toward Chile",
    pt: "Travessia de fronteira rumo ao Chile",
  },
  "Paso Roballos en moto, Argentina": {
    en: "Paso Roballos by motorcycle, Argentina",
    pt: "Paso Roballos de moto, Argentina",
  },
  "Campo de Tulipanes": { en: "Tulip fields", pt: "Campo de tulipas" },
  "Campo de Piedra Pómez": { en: "Campo de Piedra Pómez", pt: "Campo de Piedra Pómez" },
  "Ruta de los Seismiles": { en: "Ruta de los Seismiles", pt: "Ruta de los Seismiles" },
  "365 curvas": { en: "365 curves", pt: "365 curvas" },
};

export function translateKnownSpanish(es: string, locale: MockLocale): string {
  return MOCK_TRANSLATIONS[es]?.[locale] ?? es;
}

const t = (es: string) => ({
  es,
  en: translateKnownSpanish(es, "en"),
  pt: translateKnownSpanish(es, "pt"),
});

const empty = { es: "", en: "", pt: "" };

function galleryImage({
  tour_slug,
  sort_order,
  image_url,
  alt,
  featured = false,
}: {
  tour_slug: string;
  sort_order: number;
  image_url: string;
  alt: string;
  featured?: boolean;
}): GalleryImage {
  return {
    tour_slug,
    sort_order,
    image_url,
    image_drive_id: "",
    alt: t(alt),
    caption: empty,
    featured,
  };
}

function highlights(items: string[]): ItineraryDay["highlights"] {
  return {
    es: items,
    en: items.map((item) => translateKnownSpanish(item, "en")),
    pt: items.map((item) => translateKnownSpanish(item, "pt")),
  };
}

function itineraryDay({
  tour_slug,
  day_number,
  title,
  route_from,
  route_to,
  distance_km,
  surface,
  max_altitude_m = null,
  body,
  highlights: dayHighlights,
}: {
  tour_slug: string;
  day_number: number;
  title: string;
  route_from: string;
  route_to: string;
  distance_km: number | null;
  surface: string;
  max_altitude_m?: number | null;
  body: string;
  highlights: string[];
}): ItineraryDay {
  return {
    tour_slug,
    day_number,
    title: t(title),
    route_from,
    route_to,
    distance_km,
    surface: t(surface),
    max_altitude_m,
    body: t(body),
    highlights: highlights(dayHighlights),
  };
}

export const MOCK_TOURS: Tour[] = [
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
      "Siete días en moto cruzando Salta y Jujuy. Asfalto, ripio, altura, selva y pueblos andinos. El Abra del Acay marca la vara: 4895 msnm, una ruta que se gana kilómetro a kilómetro.",
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
    sort_order: 1,
    title: t("Volcanes del Norte"),
    slugs: {
      es: "volcanes-del-norte",
      en: "volcanes-del-norte",
      pt: "volcanes-del-norte",
    },
    region: t("Catamarca"),
    difficulty: "intermediate_plus_plus",
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
      "Tour en moto por Catamarca\nCuestas Minas Capillitas, Balcón de Pissis, Campo de Piedra Pómez, salares, puna y volcanes. Una ruta de altura que alterna ripio, asfalto y jornadas para riders que ya saben lo que buscan.",
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
    sort_order: 3,
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
    hero_image: "/images/tours/cruces_del_sur/cruces_del_sur_1_halftone.png",
    hero_image_color: "/images/tours/cruces_del_sur/cruces_del_sur_1_color.jpeg",
    hero_image_drive_id: "",
    hero_image_color_drive_id: "",
    hero_image_alt: t("Riders avanzando por un camino de ripio en Patagonia"),
    summary: t(
      "Carretera Austral en moto. Pasos fronterizos y ripio patagónico. 2321 km para cruzar bosques, lagos y rutas que se recuerdan por lo que exigieron.",
    ),
    tagline: t("2,321 km through Patagonia, lakes, and border crossings."),
    seo_title: empty,
    seo_description: t(
      "Tour de moto por Carretera Austral y Patagonia. Siete días, 2321 km y 45% ripio con Moto On/Off.",
    ),
    published: true,
  },
  {
    slug: "gigantes-del-oeste",
    sort_order: 4,
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
      "Tour en moto por Mendoza, San Juan y La Rioja. Recorriendo la cordillera, Laguna Brava, Mina la Mejicana y caminos de montaña entre asfalto y ripio.",
    ),
    tagline: t("2400 km. Ocho días. La cordillera se cruza arriba de la moto."),
    seo_title: empty,
    seo_description: t(
      "Ocho días de moto por Mendoza, San Juan y La Rioja. 2400 km, ripio, cordillera y parques nacionales con Moto On/Off.",
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
        "Embalse Cabra Corral",
        "Parque Nacional Los Cardones",
        "Cuesta del Obispo",
        "Recta del Tintín",
      ],
      pt: [
        "Embalse Cabra Corral",
        "Parque Nacional Los Cardones",
        "Cuesta del Obispo",
        "Recta del Tintín",
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
        "Quebrada de las Flechas",
        "Anfiteatro",
        "Quebrada de las Conchas",
        "Garganta del Diablo",
      ],
      pt: [
        "Quebrada de las Flechas",
        "Anfiteatro",
        "Quebrada de las Conchas",
        "Garganta del Diablo",
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
      en: ["Abra del Acay"],
      pt: ["Abra del Acay"],
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
      en: ["Viaducto la Polvorilla", "La Juguetería", "Salinas Grandes", "Cerro de los 7 colores"],
      pt: ["Viaducto la Polvorilla", "La Juguetería", "Salinas Grandes", "Cerro de los 7 colores"],
    },
  },
  {
    tour_slug: "sobre-las-nubes",
    day_number: 5,
    title: t("Tilcara → Hornocal → Caspala"),
    route_from: "Tilcara",
    route_to: "Caspala",
    distance_km: 140,
    surface: t("20% asfalto"),
    max_altitude_m: 4550,
    body: t(
      "Día de conducción y entorno más que velocidad. Curvas cerradas, rectas con acantilados y caminos de altura poco transitados. Más que conducir la moto, se rueda flotando sobre las nubes.",
    ),
    highlights: {
      es: ["Hornocal", "Abra Azul", "Caspala"],
      en: ["Hornocal", "Abra Azul", "Caspala"],
      pt: ["Hornocal", "Abra Azul", "Caspala"],
    },
  },
  {
    tour_slug: "sobre-las-nubes",
    day_number: 6,
    title: t("Caspala → Parque Nacional Calilegua → Libertador San Martín"),
    route_from: "Caspala",
    route_to: "Libertador San Martín",
    distance_km: 205,
    surface: t("50% asfalto"),
    max_altitude_m: null,
    body: t(
      "El paisaje cambia por completo: de caminos de altura y pueblos aislados empezás a descender hacia la selva de las Yungas. La ruta se vuelve verde, húmeda, cerrada. Una transición ganada entre montaña árida y selva viva.",
    ),
    highlights: {
      es: ["Parque Nacional Calilegua"],
      en: ["Parque Nacional Calilegua"],
      pt: ["Parque Nacional Calilegua"],
    },
  },
  {
    tour_slug: "sobre-las-nubes",
    day_number: 7,
    title: t("Libertador San Martín → Embalse Las Maderas → Salta"),
    route_from: "Libertador San Martín",
    route_to: "Salta Capital",
    distance_km: 143,
    surface: t("80% asfalto"),
    max_altitude_m: null,
    body: t(
      "Una jornada tranquila para cerrar el tour. Almuerzo junto al Dique La Ciénaga y unas dos horas finales de asfalto y curvas hasta volver a Salta Capital.",
    ),
    highlights: {
      es: ["Embalse Las Maderas", "Dique La Ciénaga"],
      en: ["Embalse Las Maderas", "Dique La Ciénaga"],
      pt: ["Embalse Las Maderas", "Dique La Ciénaga"],
    },
  },
];

MOCK_ITINERARY.push(
  itineraryDay({
    tour_slug: "gigantes-del-oeste",
    day_number: 1,
    title: "Mendoza Capital → Potrerillos → Villavicencio → Uspallata",
    route_from: "Mendoza Capital",
    route_to: "Uspallata",
    distance_km: 218,
    surface: "80% asfalto",
    body: "Partimos el tour en moto desde Mendoza Capital rumbo a Potrerillos entre túneles, curvas y embalses. Después entramos a la Reserva Natural Villavicencio: ripio, 365 curvas y llegada al histórico hotel antes de dormir en Uspallata.",
    highlights: ["Embalse Potrerillos", "Reserva Natural Villavicencio", "365 curvas"],
  }),
  itineraryDay({
    tour_slug: "gigantes-del-oeste",
    day_number: 2,
    title: "Uspallata → Paso Los Libertadores → Uspallata",
    route_from: "Uspallata",
    route_to: "Uspallata",
    distance_km: 313,
    surface: "90% asfalto",
    max_altitude_m: 3854,
    body: "Cruzamos la cordillera por el Paso Internacional Los Libertadores. Aconcagua, túneles de alta montaña y la bajada por los Caracoles hacen una jornada de Andes completa, con regreso a Uspallata por el Cristo Redentor.",
    highlights: ["Puente del Inca", "Aconcagua", "Cristo Redentor", "Cuesta Caracoles"],
  }),
  itineraryDay({
    tour_slug: "gigantes-del-oeste",
    day_number: 3,
    title: "Pampa del Leoncito → Laguna Blanca → Calingasta",
    route_from: "Uspallata",
    route_to: "Calingasta",
    distance_km: 290,
    surface: "80% asfalto",
    body: "Dejamos el valle mendocino para entrar en planicies abiertas y caminos solitarios. El tour en moto sigue por Pampa del Leoncito, Barreal y Laguna Blanca: un día de horizontes largos y atardeceres ganados.",
    highlights: ["Pampa Leoncito", "Barreal", "Laguna Blanca"],
  }),
  itineraryDay({
    tour_slug: "gigantes-del-oeste",
    day_number: 4,
    title: "Barreal → Rodeo → Jáchal → Huaco → Villa Unión",
    route_from: "Barreal",
    route_to: "Villa Unión",
    distance_km: 437,
    surface: "100% asfalto",
    body: "Una etapa escénica que conecta valles, diques, quebradas y zonas áridas riojanas. Rodeo, Jáchal y Huaco cambian el ritmo con curvas cerradas y miradores abiertos.",
    highlights: ["Rodeo", "Quebrada de Jáchal", "Cuesta de Huaco"],
  }),
  itineraryDay({
    tour_slug: "gigantes-del-oeste",
    day_number: 5,
    title: "Villa Unión → Laguna Brava → Volcancito de Troya → Villa Unión",
    route_from: "Villa Unión",
    route_to: "Villa Unión",
    distance_km: 370,
    surface: "40% asfalto",
    max_altitude_m: 4300,
    body: "Subimos a Laguna Brava en moto, una laguna de alta montaña custodiada por silencio, flamencos y refugios de piedra. El ripio de Quebrada de la Troya y La Herradura pone color y exigencia al día.",
    highlights: ["Laguna Brava", "Volcancito de Troya", "Quebrada de la Troya", "La Herradura"],
  }),
  itineraryDay({
    tour_slug: "gigantes-del-oeste",
    day_number: 6,
    title: "Villa Unión → Talampaya → Valle de la Luna → Chilecito",
    route_from: "Villa Unión",
    route_to: "Chilecito",
    distance_km: 386,
    surface: "90% asfalto",
    body: "Talampaya abre paredones rojos y cañones de millones de años. Después el Valle de la Luna y la Cuesta de Miranda completan una jornada de colores duros antes de llegar a Chilecito.",
    highlights: ["Talampaya", "Valle de la Luna", "Cuesta de Miranda"],
  }),
  itineraryDay({
    tour_slug: "gigantes-del-oeste",
    day_number: 7,
    title: "Chilecito → Cañón del Ocre → Mina La Mejicana → Chilecito",
    route_from: "Chilecito",
    route_to: "Chilecito",
    distance_km: 240,
    surface: "20% asfalto",
    max_altitude_m: 4600,
    body: "El ascenso a Mina La Mejicana en moto es corto en kilómetros e intenso en historia, altura y paisaje. Cañón del Ocre, ríos anaranjados, estructuras abandonadas y silencio absoluto cierran el tramo más alto del tour.",
    highlights: ["Cañón del Ocre", "Mina La Mejicana", "Los Pesebres"],
  }),
  itineraryDay({
    tour_slug: "gigantes-del-oeste",
    day_number: 8,
    title: "Chilecito → Termas de Santa Teresita → La Rioja",
    route_from: "Chilecito",
    route_to: "La Rioja",
    distance_km: 311,
    surface: "100% asfalto",
    body: "Cerramos por Ruta 40 hacia las Termas de Santa Teresita. Una jornada de regreso y descanso antes de completar la llegada a La Rioja.",
    highlights: ["Ruta 40", "Termas de Santa Teresita", "La Rioja"],
  }),
  itineraryDay({
    tour_slug: "volcanes-del-norte",
    day_number: 1,
    title: "San Fernando → Fiambalá",
    route_from: "San Fernando",
    route_to: "Fiambalá",
    distance_km: 325,
    surface: "100% asfalto",
    body: "Atravesamos la Ruta del Adobe entre Tinogasta y Fiambalá. Pueblos chicos, precordillera árida y cierre en las Termas de Fiambalá para preparar la altura que viene.",
    highlights: ["Ruta del Adobe", "Tinogasta", "Termas de Fiambalá"],
  }),
  itineraryDay({
    tour_slug: "volcanes-del-norte",
    day_number: 2,
    title: "Fiambalá → Balcón del Pissis → Fiambalá",
    route_from: "Fiambalá",
    route_to: "Fiambalá",
    distance_km: 280,
    surface: "70% asfalto / 30% ripio",
    max_altitude_m: 4500,
    body: "La Ruta de los Seismiles entra por Quebrada de las Angosturas y gana altura hasta el Balcón del Pissis. Volcanes, lagunas y una vista monumental ponen la vara del viaje.",
    highlights: ["Balcón de Pissis", "Quebrada de las Angosturas", "Ruta de los Seismiles"],
  }),
  itineraryDay({
    tour_slug: "volcanes-del-norte",
    day_number: 3,
    title: "Fiambalá → Dunas de Tatón → Belén",
    route_from: "Fiambalá",
    route_to: "Belén",
    distance_km: 287,
    surface: "100% asfalto",
    body: "Rumbo norte hacia las Dunas de Tatón, uno de los campos de arena más aislados de Catamarca. Tinogasta, bodega Veralma y el km 4040 de la Ruta 40 marcan el camino a Belén.",
    highlights: ["Dunas de Tatón", "Tinogasta", "Km 4040", "Belén"],
  }),
  itineraryDay({
    tour_slug: "volcanes-del-norte",
    day_number: 4,
    title: "Belén → Antofagasta de la Sierra",
    route_from: "Belén",
    route_to: "Antofagasta de la Sierra",
    distance_km: 259,
    surface: "90% asfalto / 10% ripio",
    max_altitude_m: 3500,
    body: "La ruta a Antofagasta combina montaña, quebradas y puna abierta. Al superar la cuesta aparecen volcanes, silencio y el campo de lava del Volcán Alumbrera.",
    highlights: ["Cuesta de Randolfo", "Pucará La Alumbrera", "Campos de lava"],
  }),
  itineraryDay({
    tour_slug: "volcanes-del-norte",
    day_number: 5,
    title: "Antofagasta de la Sierra → Campo de Piedra Pómez",
    route_from: "Antofagasta de la Sierra",
    route_to: "Antofagasta de la Sierra",
    distance_km: 200,
    surface: "30% asfalto / 70% ripio",
    max_altitude_m: 3500,
    body: "El terreno se vuelve claro, volcánico y ondulado hasta entrar al Campo de Piedra Pómez. Después la Laguna Carachi Pampa abre una puna inmensa, solitaria y difícil de olvidar.",
    highlights: ["Campo de Piedra Pómez", "Laguna Carachi Pampa", "Volcán Carachi Pampa"],
  }),
  itineraryDay({
    tour_slug: "volcanes-del-norte",
    day_number: 6,
    title: "El Peñón → Andalgalá",
    route_from: "El Peñón",
    route_to: "Andalgalá",
    distance_km: 340,
    surface: "50% asfalto / 50% ripio",
    body: "Saliendo de El Peñón, el paisaje volcánico da paso a caminos de montaña. Cuesta de Capillitas y Refugio del Minero hacen un día de ripio, altura y descenso hacia Andalgalá.",
    highlights: ["Cuesta Minas Capillitas", "Refugio del Minero", "Andalgalá"],
  }),
  itineraryDay({
    tour_slug: "volcanes-del-norte",
    day_number: 7,
    title: "Andalgalá → San Fernando",
    route_from: "Andalgalá",
    route_to: "San Fernando",
    distance_km: 226,
    surface: "70% asfalto / 30% ripio",
    body: "El cierre cambia otra vez el clima: cursos de agua, vegetación densa y selva de montaña. Cuesta la Chilca y Loma Larga devuelven la ruta a San Fernando.",
    highlights: ["Cuesta la Chilca", "Loma Larga", "San Fernando"],
  }),
  itineraryDay({
    tour_slug: "cruces-del-sur",
    day_number: 1,
    title: "Bariloche → Trevelin",
    route_from: "Bariloche",
    route_to: "Trevelin",
    distance_km: 306,
    surface: "30% ripio",
    body: "Salimos desde Bariloche por Ruta 40 y entramos en ritmo entre asfalto y ripio. El desvío por Cholila abre el Parque Nacional Los Alerces antes de llegar a Trevelin.",
    highlights: ["El Bolsón", "Lago Puelo", "Parque Nacional Los Alerces"],
  }),
  itineraryDay({
    tour_slug: "cruces-del-sur",
    day_number: 2,
    title: "Trevelin → Paso Futaleufú → Puerto Cisnes",
    route_from: "Trevelin",
    route_to: "Puerto Cisnes",
    distance_km: 325,
    surface: "20% ripio",
    body: "Campo de tulipanes, Paso Futaleufú y entrada plena a la Carretera Austral. Bosque cerrado, ríos, curvas y montaña hasta cerrar el día en Puerto Cisnes.",
    highlights: ["Campo de Tulipanes", "Paso Futaleufú", "Termas Ventisquero", "Puerto Cisnes"],
  }),
  itineraryDay({
    tour_slug: "cruces-del-sur",
    day_number: 3,
    title: "Puerto Cisnes → Puerto Ingeniero Ibáñez → Chile Chico",
    route_from: "Puerto Cisnes",
    route_to: "Chile Chico",
    distance_km: 322,
    surface: "20% ripio",
    body: "Montaña, fiordos, asfalto y ripio hacia Puerto Ingeniero Ibáñez. La barcaza cruza el Lago General Carrera y deja la ruta lista para entrar a Chile Chico.",
    highlights: ["Reserva Nacional Mañihuales", "Cerro Castillo", "Ferry Lago General Carrera"],
  }),
  itineraryDay({
    tour_slug: "cruces-del-sur",
    day_number: 4,
    title: "Chile Chico → Cochrane",
    route_from: "Chile Chico",
    route_to: "Cochrane",
    distance_km: 178,
    surface: "70% ripio",
    body: "Día de ripio real bordeando el Lago General Carrera. Agua, montaña y camino abierto acompañan una de las etapas más auténticas de la Carretera Austral.",
    highlights: ["Lago General Carrera", "Reserva Nacional Lago General Carrera", "Lago Bertrand"],
  }),
  itineraryDay({
    tour_slug: "cruces-del-sur",
    day_number: 5,
    title: "Cochrane → Paso Roballos → Perito Moreno",
    route_from: "Cochrane",
    route_to: "Perito Moreno",
    distance_km: 250,
    surface: "80% ripio",
    body: "Paso Roballos entrega estepa abierta, cordillera a los costados y aislamiento total. Del lado argentino, el camino bordea los Andes antes de llegar a Los Antiguos y Perito Moreno.",
    highlights: ["Valle Chacabuco", "Paso Roballos", "Lago Cochrane", "Los Antiguos"],
  }),
  itineraryDay({
    tour_slug: "cruces-del-sur",
    day_number: 6,
    title: "Perito Moreno → Lago Vintter",
    route_from: "Perito Moreno",
    route_to: "Lago Vintter",
    distance_km: 473,
    surface: "15% ripio",
    body: "Jornada larga de regreso por Ruta 40, con rectas aisladas hasta Gobernador Costa. Después tomamos camino secundario hacia Río Pico y Lago Vintter, una Patagonia menos vista.",
    highlights: ["Ruta 40", "Río Pico", "Lago Vintter"],
  }),
  itineraryDay({
    tour_slug: "cruces-del-sur",
    day_number: 7,
    title: "Lago Vintter → Bariloche",
    route_from: "Lago Vintter",
    route_to: "Bariloche",
    distance_km: 467,
    surface: "35% ripio",
    body: "Bosques bajos, montañas nevadas y ripio sin tránsito hasta Trevelin. Después volvemos a enlazar Ruta 40, El Bolsón y Bariloche para cerrar el cruce patagónico.",
    highlights: ["Lago Vintter", "Lago Palena", "Ruta 40", "Bariloche"],
  }),
);

export const MOCK_TOUR_SECTIONS: TourSection[] = [
  "Traslado de la moto ida y vuelta a destino",
  "Seguro de carga de la moto",
  "Refrigerios",
  "Moto de repuesto",
  "Starlink",
  "Siete noches de alojamiento en hospedajes seleccionados",
  "Vehículo de apoyo durante toda la ruta",
  "Combustible de emergencia para todo el trayecto",
  "Desayunos, almuerzos y cenas",
  "Guía con experiencia probada en el oeste argentino",
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
  ...[
    "Cupo limitado por tour.",
    "Esta travesía atraviesa altura sostenida (2500–4550 msnm).",
    "Se requiere experiencia previa en ripio.",
  ].map((text, index) => ({
    tour_slug: "sobre-las-nubes",
    type: "need_to_know" as const,
    sort_order: index + 1,
    text: t(text),
  })),
);

MOCK_TOUR_SECTIONS.push(
  ...[
    "Traslado de la moto ida y vuelta a destino",
    "Seguro de carga de la moto",
    "Refrigerios",
    "Moto de repuesto",
    "Starlink",
    "Siete noches de alojamiento en hospedajes seleccionados",
    "Vehículo de apoyo durante toda la ruta",
    "Combustible de emergencia para todo el trayecto",
    "Desayunos, almuerzos y cenas",
    "Guía con experiencia probada en el oeste argentino",
  ].map((text, index) => ({
    tour_slug: "volcanes-del-norte",
    type: "included" as const,
    sort_order: index + 1,
    text: t(text),
  })),
  ...[
    "Pasajes aéreos hasta Catamarca y desde Catamarca",
    "Bebidas alcohólicas y comidas fuera del itinerario",
    "Seguro de viajero con cobertura de moto",
    "Alquiler de moto si no traés la tuya",
  ].map((text, index) => ({
    tour_slug: "volcanes-del-norte",
    type: "not_included" as const,
    sort_order: index + 1,
    text: t(text),
  })),
  ...[
    "Cupo limitado por tour.",
    "Esta travesía atraviesa altura sostenida (2500–4550 msnm).",
    "Se requiere experiencia previa en ripio.",
  ].map((text, index) => ({
    tour_slug: "volcanes-del-norte",
    type: "need_to_know" as const,
    sort_order: index + 1,
    text: t(text),
  })),
);

MOCK_TOUR_SECTIONS.push(
  ...[
    "Traslado de la moto ida y vuelta a destino",
    "Seguro de carga de la moto",
    "Refrigerios",
    "Moto de repuesto",
    "Starlink",
    "Siete noches de alojamiento en hospedajes seleccionados",
    "Vehículo de apoyo durante toda la ruta",
    "Combustible de emergencia para todo el trayecto",
    "Desayunos, almuerzos y cenas",
    "Guía con experiencia probada en el oeste argentino",
  ].map((text, index) => ({
    tour_slug: "gigantes-del-oeste",
    type: "included" as const,
    sort_order: index + 1,
    text: t(text),
  })),
  ...[
    "Pasajes aéreos hasta Mendoza y desde La Rioja",
    "Bebidas alcohólicas y comidas fuera del itinerario",
    "Seguro de viajero con cobertura de moto",
    "Alquiler de moto si no traés la tuya",
  ].map((text, index) => ({
    tour_slug: "gigantes-del-oeste",
    type: "not_included" as const,
    sort_order: index + 1,
    text: t(text),
  })),
  ...[
    "Cupo limitado por tour.",
    "El tour cruza dos veces la frontera Argentina-Chile. DNI o pasaporte vigente y permiso para circular si la moto no está a tu nombre. Te asesoramos antes del viaje.",
    "Se requiere experiencia previa en ripio.",
  ].map((text, index) => ({
    tour_slug: "gigantes-del-oeste",
    type: "need_to_know" as const,
    sort_order: index + 1,
    text: t(text),
  })),
);

export const MOCK_GALLERY: GalleryImage[] = [
  galleryImage({
    tour_slug: "sobre-las-nubes",
    sort_order: 1,
    image_url: "/images/tours/sobre_las_nubes/20260311_100314.jpg",
    alt: "Camino de altura en la ruta Sobre las Nubes",
    featured: true,
  }),
  galleryImage({
    tour_slug: "sobre-las-nubes",
    sort_order: 2,
    image_url: "/images/tours/sobre_las_nubes/20260311_141800.jpg",
    alt: "Moto avanzando por caminos de Salta y Jujuy",
  }),
  galleryImage({
    tour_slug: "sobre-las-nubes",
    sort_order: 3,
    image_url: "/images/tours/sobre_las_nubes/20260402_180621.jpg",
    alt: "Ruta andina con cerros y ripio en Sobre las Nubes",
  }),
  galleryImage({
    tour_slug: "sobre-las-nubes",
    sort_order: 4,
    image_url: "/images/tours/sobre_las_nubes/20260226_200924.jpg",
    alt: "Trazado de montaña ganado sobre la puna",
  }),
  galleryImage({
    tour_slug: "sobre-las-nubes",
    sort_order: 5,
    image_url: "/images/tours/sobre_las_nubes/20251109_101738.jpg",
    alt: "Camino abierto entre valles del norte argentino",
  }),
  galleryImage({
    tour_slug: "sobre-las-nubes",
    sort_order: 6,
    image_url: "/images/tours/sobre_las_nubes/2.jpg",
    alt: "Ruta de ripio entre Salta y Jujuy",
  }),
  galleryImage({
    tour_slug: "sobre-las-nubes",
    sort_order: 7,
    image_url: "/images/tours/sobre_las_nubes/3.jpg",
    alt: "Paso de montaña en la ruta Sobre las Nubes",
  }),
  galleryImage({
    tour_slug: "sobre-las-nubes",
    sort_order: 8,
    image_url: "/images/tours/sobre_las_nubes/4.jpg",
    alt: "Rider enfrentando curvas de altura en el norte",
  }),
  galleryImage({
    tour_slug: "sobre-las-nubes",
    sort_order: 9,
    image_url: "/images/tours/sobre_las_nubes/5.jpg",
    alt: "Paisaje de altura recorrido sobre dos ruedas",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 1,
    image_url: "/images/tours/gigantes_del_oeste/20231105_141145.jpg",
    alt: "Moto cruzando caminos de montaña entre Mendoza y La Rioja",
    featured: true,
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 2,
    image_url: "/images/tours/gigantes_del_oeste/20231105_160041.jpg",
    alt: "Ruta de cordillera en Gigantes del Oeste",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 3,
    image_url: "/images/tours/gigantes_del_oeste/gigantes-fotos-caco/DIA%203.png",
    alt: "Motos avanzando por planicies abiertas en Gigantes del Oeste",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 4,
    image_url: "/images/tours/gigantes_del_oeste/20220909_151413.jpg",
    alt: "Rider avanzando por el ripio cuyano",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 5,
    image_url: "/images/tours/gigantes_del_oeste/20220909_153529.jpg",
    alt: "Ruta abierta entre montañas del oeste",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 6,
    image_url: "/images/tours/gigantes_del_oeste/20220430_170600.jpg",
    alt: "Camino de alta montaña recorrido en moto",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 7,
    image_url: "/images/tours/gigantes_del_oeste/IMG-20260405-WA0059.jpg",
    alt: "Moto cargada para cruzar el oeste argentino",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 8,
    image_url: "/images/tours/gigantes_del_oeste/IMG-20260405-WA0070.jpg",
    alt: "Rider en una jornada larga de montaña",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 9,
    image_url: "/images/tours/gigantes_del_oeste/IMG-20260421-WA0096.jpg",
    alt: "Moto detenida en una ruta de ripio",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 10,
    image_url: "/images/tours/gigantes_del_oeste/IMG-20260421-WA0100.jpg",
    alt: "Camino conquistado en la ruta Gigantes del Oeste",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 11,
    image_url: "/images/tours/gigantes_del_oeste/IMG-20260421-WA0103.jpg",
    alt: "Trazado de ripio entre sierras y cordillera",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 12,
    image_url: "/images/tours/gigantes_del_oeste/IMG-20260423-WA0022.jpg",
    alt: "Rider y moto en el oeste argentino",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 13,
    image_url: "/images/tours/gigantes_del_oeste/motion_photo_1364649692705347634.jpg",
    alt: "Camino de montaña puesto a prueba por la ruta",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 14,
    image_url: "/images/tours/gigantes_del_oeste/motion_photo_3144126936191235939.jpg",
    alt: "Paisaje de cordillera atravesado en moto",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 15,
    image_url: "/images/tours/gigantes_del_oeste/gigantes-fotos-caco/DIA%202.jpg",
    alt: "Camino de alta montaña durante el día dos de Gigantes del Oeste",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 16,
    image_url: "/images/tours/gigantes_del_oeste/gigantes-fotos-caco/DIA%204.png",
    alt: "Riders avanzando por planicies de ripio en Gigantes del Oeste",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 17,
    image_url: "/images/tours/gigantes_del_oeste/gigantes-fotos-caco/DIA%205.jpg",
    alt: "Moto sobre camino abierto rumbo a Laguna Brava",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 18,
    image_url: "/images/tours/gigantes_del_oeste/gigantes-fotos-caco/DIA%207.jpg",
    alt: "Estructura minera en la ruta hacia Mina La Mejicana",
  }),
  galleryImage({
    tour_slug: "gigantes-del-oeste",
    sort_order: 19,
    image_url: "/images/tours/gigantes_del_oeste/gigantes-fotos-caco/Galeria%20foto%206.jpg",
    alt: "Grupo de motos detenido en un camino de montaña del oeste argentino",
  }),
  galleryImage({
    tour_slug: "volcanes-del-norte",
    sort_order: 1,
    image_url: "/images/tours/volcanes_del_norte/1.jpg",
    alt: "Ruta de Catamarca entre volcanes y puna",
    featured: true,
  }),
  galleryImage({
    tour_slug: "volcanes-del-norte",
    sort_order: 2,
    image_url: "/images/tours/volcanes_del_norte/2.jpg",
    alt: "Camino de altura en Volcanes del Norte",
  }),
  galleryImage({
    tour_slug: "volcanes-del-norte",
    sort_order: 3,
    image_url: "/images/tours/volcanes_del_norte/3.jpg",
    alt: "Paisaje volcánico cruzado en moto",
  }),
  galleryImage({
    tour_slug: "volcanes-del-norte",
    sort_order: 4,
    image_url: "/images/tours/volcanes_del_norte/4.JPG",
    alt: "Ruta de montaña en Catamarca",
  }),
  galleryImage({
    tour_slug: "volcanes-del-norte",
    sort_order: 5,
    image_url: "/images/tours/volcanes_del_norte/5.png",
    alt: "Camino de ripio entre volcanes del norte",
  }),
  galleryImage({
    tour_slug: "volcanes-del-norte",
    sort_order: 6,
    image_url: "/images/tours/volcanes_del_norte/6.jpg",
    alt: "Jornada de ruta larga sobre la puna catamarqueña",
  }),
  galleryImage({
    tour_slug: "volcanes-del-norte",
    sort_order: 7,
    image_url: "/images/tours/volcanes_del_norte/8.jpg",
    alt: "Horizonte de altura en Volcanes del Norte",
  }),
  galleryImage({
    tour_slug: "volcanes-del-norte",
    sort_order: 8,
    image_url: "/images/tours/volcanes_del_norte/9.jpg",
    alt: "Ruta abierta entre salares y volcanes",
  }),
  galleryImage({
    tour_slug: "volcanes-del-norte",
    sort_order: 9,
    image_url: "/images/tours/volcanes_del_norte/11.jpeg",
    alt: "Moto sobre caminos probados de Catamarca",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 1,
    image_url: "/images/tours/cruces_del_sur/cruces-fotos-caco/Galeria%201.jpeg",
    alt: "Campo de Tulipanes, Trevelin.",
    featured: true,
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 2,
    image_url: "/images/tours/cruces_del_sur/2.jpg",
    alt: "Camino ripio, Carretera Austral",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 3,
    image_url: "/images/tours/cruces_del_sur/cruces-fotos-caco/Dia%203.png",
    alt: "Descanso entre la ruta 40 y la Carretera Austral",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 4,
    image_url: "/images/tours/cruces_del_sur/cruces-fotos-caco/Dia%204.jpg",
    alt: "Camino a Puerto Cisnes, Chile",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 5,
    image_url: "/images/tours/cruces_del_sur/5.png",
    alt: "Paisaje de Patagonia ganado sobre ripio",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 6,
    image_url: "/images/tours/cruces_del_sur/6.jpg",
    alt: "Camino abierto entre bosques y lagos patagónicos",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 7,
    image_url: "/images/tours/cruces_del_sur/cruces-fotos-caco/Dia%207.jpg",
    alt: "Ruta 40, ripio hacia Chile",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 8,
    image_url: "/images/tours/cruces_del_sur/8.png",
    alt: "Vista a volcán en la Carretera Austral",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 9,
    image_url: "/images/tours/cruces_del_sur/cruces-fotos-caco/Galeria%209.png",
    alt: "Cruce de frontera hacia Chile",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 10,
    image_url: "/images/tours/cruces_del_sur/cruces-fotos-caco/Galeria%2010.jpeg",
    alt: "Paso Roballos en moto, Argentina",
  }),
  galleryImage({
    tour_slug: "cruces-del-sur",
    sort_order: 11,
    image_url: "/images/tours/cruces_del_sur/cruces-fotos-caco/Galeria%2011.jpg",
    alt: "Paso Roballos en moto, Argentina",
  }),
];

export const MOCK_DEPARTURES: Departure[] = [
  {
    tour_slug: "sobre-las-nubes",
    start_date: "2026-08-01",
    end_date: "2026-08-07",
    capacity: 8,
    spots_remaining: 8,
    status: "open",
    price: 0,
    currency: "USD",
    notes: t("Abra del Acay, Quebrada de las Flechas y 1712 km ganados en el NOA."),
  },
  {
    tour_slug: "volcanes-del-norte",
    start_date: "2026-09-12",
    end_date: "2026-09-18",
    capacity: 8,
    spots_remaining: 8,
    status: "open",
    price: 0,
    currency: "USD",
    notes: t("Catamarca alta: volcanes, puna, salares y jornadas largas de ripio."),
  },
  {
    tour_slug: "cruces-del-sur",
    start_date: "2026-11-07",
    end_date: "2026-11-13",
    capacity: 8,
    spots_remaining: 8,
    status: "open",
    price: 0,
    currency: "USD",
    notes: t("Patagonia y Carretera Austral con bosque, frontera y ripio."),
  },
];

function relocalizeMockContent() {
  for (const tour of MOCK_TOURS) {
    tour.title = t(tour.title.es);
    tour.region = t(tour.region.es);
    tour.hero_image_alt = t(tour.hero_image_alt.es);
    tour.summary = t(tour.summary.es);
    tour.tagline = t(tour.tagline.es);
    tour.seo_description = t(tour.seo_description.es);
  }

  for (const day of MOCK_ITINERARY) {
    day.title = t(day.title.es);
    day.surface = t(day.surface.es);
    day.body = t(day.body.es);
    day.highlights = highlights(day.highlights.es);
  }

  for (const section of MOCK_TOUR_SECTIONS) {
    section.text = t(section.text.es);
  }

  for (const image of MOCK_GALLERY) {
    image.alt = t(image.alt.es);
  }

  for (const departure of MOCK_DEPARTURES) {
    departure.notes = departure.notes.es ? t(departure.notes.es) : empty;
  }
}

relocalizeMockContent();
