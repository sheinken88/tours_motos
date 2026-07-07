import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/sheinken/Desktop/tour_motos/output/moto-calendar-sheet-template";
const outputPath = path.join(outputDir, "moto-onoff-departures-template.xlsx");

const brandRed = "#A8342A";
const redDeep = "#6F211B";
const ink = "#1F140E";
const paper = "#E8DCC4";
const paperLight = "#F3E9D2";
const paperAged = "#D6C8A9";

const headers = [
  "tour_slug",
  "start_date",
  "end_date",
  "capacity",
  "spots_remaining",
  "status",
  "price",
  "currency",
  "notes_es",
  "notes_en",
  "notes_pt",
];

const examples = [
  [
    "sobre-las-nubes",
    "2026-08-01",
    "2026-08-07",
    8,
    8,
    "open",
    0,
    "USD",
    "Abra del Acay, Quebrada de las Flechas y 1712 km ganados en el NOA.",
    "Abra del Acay, Quebrada de las Flechas, and 1712 km earned in northwest Argentina.",
    "Abra del Acay, Quebrada de las Flechas e 1712 km conquistados no NOA.",
  ],
  [
    "gigantes-del-oeste",
    "2026-10-03",
    "2026-10-10",
    8,
    3,
    "low",
    0,
    "USD",
    "Mendoza, San Juan y La Rioja: 2400 km de cordillera, ripio y altura.",
    "Mendoza, San Juan, and La Rioja: 2400 km of cordillera, gravel, and altitude.",
    "Mendoza, San Juan e La Rioja: 2400 km de cordilheira, ripio e altitude.",
  ],
  [
    "volcanes-del-norte",
    "2026-09-12",
    "2026-09-18",
    8,
    8,
    "open",
    0,
    "USD",
    "Catamarca alta: volcanes, puna, salares y jornadas largas de ripio.",
    "High Catamarca: volcanoes, puna, salt flats, and long gravel days.",
    "Catamarca alta: vulcoes, puna, salares e longas jornadas de ripio.",
  ],
  [
    "cruces-del-sur",
    "2026-11-07",
    "2026-11-13",
    8,
    0,
    "sold_out",
    0,
    "USD",
    "Patagonia y Carretera Austral con bosque, frontera y ripio.",
    "Patagonia and Carretera Austral with forest, border crossings, and gravel.",
    "Patagonia e Carretera Austral com bosque, fronteira e ripio.",
  ],
];

const slugRows = [
  ["tour_slug", "Tour", "Region"],
  ["sobre-las-nubes", "Sobre las Nubes", "Salta y Jujuy"],
  ["gigantes-del-oeste", "Gigantes del Oeste", "Mendoza a La Rioja"],
  ["volcanes-del-norte", "Volcanes del Norte", "Catamarca"],
  ["cruces-del-sur", "Cruces del Sur", "Carretera Austral y Patagonia"],
];

const readmeRows = [
  ["Moto On/Off calendar sheet", ""],
  ["Purpose", "The Departures tab is the single source of truth for public calendar events."],
  ["How updates work", "The website reads this Sheet every 10 minutes, or immediately after /api/revalidate is called."],
  ["Live tab", "Only rows in Departures are public. Rows in Examples are ignored by the website."],
  ["Dates", "Use YYYY-MM-DD. Example: 2026-08-01."],
  ["Status values", "Use exactly one of: open, low, sold_out."],
  ["Currency values", "Use exactly one of: USD, ARS, EUR."],
  ["Translations", "Fill notes_es, notes_en, and notes_pt manually. Do not rely on automatic translation."],
  ["Tour slugs", "Use one of the values listed in the Slugs tab."],
  ["Before launch", "Share this Sheet with the Google service account email as Viewer."],
];

function styleTitle(range) {
  range.format = {
    fill: brandRed,
    font: { bold: true, color: paper },
    wrapText: true,
  };
}

function styleHeader(range) {
  range.format = {
    fill: redDeep,
    font: { bold: true, color: paper },
    wrapText: true,
    borders: { preset: "outside", style: "medium", color: ink },
  };
}

function styleBody(range) {
  range.format = {
    fill: paperLight,
    font: { color: ink },
    wrapText: true,
    borders: { preset: "inside", style: "thin", color: paperAged },
  };
}

function setupDepartureSheet(sheet, includeExamples = false) {
  const rowCount = includeExamples ? examples.length + 1 : 201;
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  sheet.getRange("A1:K1").values = [headers];
  styleHeader(sheet.getRange("A1:K1"));

  if (includeExamples) {
    sheet.getRange(`A2:K${examples.length + 1}`).values = examples;
    styleBody(sheet.getRange(`A2:K${examples.length + 1}`));
  } else {
    styleBody(sheet.getRange("A2:K201"));
  }

  sheet.getRange("A:A").format.columnWidth = 24;
  sheet.getRange("B:C").format.columnWidth = 14;
  sheet.getRange("D:E").format.columnWidth = 16;
  sheet.getRange("F:H").format.columnWidth = 12;
  sheet.getRange("I:K").format.columnWidth = 48;
  sheet.getRange("B:C").format.numberFormat = "@";
  sheet.getRange("D:E").format.numberFormat = "0";
  sheet.getRange("G:G").format.numberFormat = "#,##0";

  sheet.getRange("A2:A201").dataValidation = {
    rule: { type: "list", values: ["sobre-las-nubes", "gigantes-del-oeste", "volcanes-del-norte", "cruces-del-sur"] },
  };
  sheet.getRange("F2:F201").dataValidation = {
    rule: { type: "list", values: ["open", "low", "sold_out"] },
  };
  sheet.getRange("H2:H201").dataValidation = {
    rule: { type: "list", values: ["USD", "ARS", "EUR"] },
  };

  sheet.getRange("F2:F201").conditionalFormats.addCustom('=$F2="open"', {
    fill: "#E6E1BF",
    font: { color: ink, bold: true },
  });
  sheet.getRange("F2:F201").conditionalFormats.addCustom('=$F2="low"', {
    fill: "#F0D196",
    font: { color: ink, bold: true },
  });
  sheet.getRange("F2:F201").conditionalFormats.addCustom('=$F2="sold_out"', {
    fill: "#C7BBA0",
    font: { color: ink, bold: true },
  });
}

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();

const departures = workbook.worksheets.add("Departures");
setupDepartureSheet(departures, false);

const examplesSheet = workbook.worksheets.add("Examples");
setupDepartureSheet(examplesSheet, true);

const slugs = workbook.worksheets.add("Slugs");
slugs.showGridLines = false;
slugs.freezePanes.freezeRows(1);
slugs.getRange("A1:C5").values = slugRows;
styleHeader(slugs.getRange("A1:C1"));
styleBody(slugs.getRange("A2:C5"));
slugs.getRange("A:A").format.columnWidth = 26;
slugs.getRange("B:C").format.columnWidth = 32;

const readme = workbook.worksheets.add("README");
readme.showGridLines = false;
readme.getRange("A1:B1").values = [["Moto On/Off - Google Sheets calendar setup", ""]];
readme.getRange("A1:B1").merge();
styleTitle(readme.getRange("A1:B1"));
readme.getRange("A3:B12").values = readmeRows;
styleBody(readme.getRange("A3:B12"));
readme.getRange("A3:A12").format = {
  fill: paperAged,
  font: { bold: true, color: ink },
  wrapText: true,
};
readme.getRange("A:A").format.columnWidth = 24;
readme.getRange("B:B").format.columnWidth = 86;

for (const sheetName of ["Departures", "Examples", "Slugs", "README"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(
    path.join(outputDir, `${sheetName.toLowerCase()}-preview.png`),
    new Uint8Array(await preview.arrayBuffer()),
  );
}

const inspect = await workbook.inspect({
  kind: "sheet,table",
  include: "id,name",
  maxChars: 4000,
  tableMaxRows: 5,
  tableMaxCols: 12,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
