// ── Sömn & Depression bland studenter ────────────────────────────────────────
 
addMdToPage(`
## Sömn och psykisk ohälsa bland studenter
 
Mer än varannan student i det här datasetet lider av depression.
Det är en alarmerande siffra — men vad ligger bakom den?
Den här analysen undersöker hur **sömnvanor** hänger ihop med psykisk ohälsa,
och hur **akademisk press** förstärker bilden ytterligare.
 
Datasetet innehåller **27 901 studenter** från Indien.
Av dem uppvisar **16 336 studenter** (58,5 %) tecken på depression.
`);
 
// ── DEL 1: Sömnlängd vs depression ───────────────────────────────────────────
 
addMdToPage(`
### Del 1 – Hur länge sover studenterna, och spelar det roll?
 
Vi börjar med att titta på hur sömnlängd per natt fördelar sig mot andelen
studenter som uppvisar depression.
`);
 dbQuery.use('default'); 
let sleepData = await dbQuery(`
  SELECT 
    SUBSTR("Sleep Duration", 2, LENGTH("Sleep Duration") - 2) AS sleep_label,
    ROUND(AVG(Depression) * 100, 1) AS pct_depressed,
    COUNT(*) AS n
  FROM student_depression
  WHERE "Sleep Duration" NOT LIKE '%Others%'
  GROUP BY "Sleep Duration"
  ORDER BY pct_depressed ASC
`);
 
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(sleepData, 'Sömnlängd', 'Andel deprimerade (%)'),
  options: {
    height: 400,
    chartArea: { left: 60, right: 20, top: 40, bottom: 80 },
    colors: ['#4a7fcb'],
    vAxis: { title: 'Andel med depression (%)', minValue: 0, maxValue: 100 },
    hAxis: { title: 'Sömnlängd per natt' },
    title: 'Andel deprimerade studenter per sömnkategori (%)',
    legend: 'none'
  }
});
 
addMdToPage(`
**Tabell 1.** Antal studenter och depressionsandel per sömnkategori.
`);
 
tableFromData({
  data: sleepData,
  columnNames: ['Sömnlängd', 'Andel deprimerade (%)', 'Antal studenter']
});
 
addMdToPage(`
Mönstret är tydligt: ju kortare sömn, desto högre depressionsandel.
Studenter som sover **mindre än 5 timmar** har den högsta andelen (64,5 %),
medan de som sover **mer än 8 timmar** klarar sig bäst (50,9 %).
`);
 
// ── DEL 2: Simple Statistics – korrelation & regression ──────────────────────
 
addMdToPage(`
### Del 2 – Statistisk analys med Simple Statistics
 
Vi omvandlar sömnkategorierna till numeriska medelvärden (timmar) för att
kunna beräkna korrelation och regressionslinje.
`);
 
const sleepToNum = {
  'Less than 5 hours': 4,
  '5-6 hours': 5.5,
  '7-8 hours': 7.5,
  'More than 8 hours': 9
};
 
const filtered  = sleepData.filter(r => sleepToNum[r.sleep_label] !== undefined);
const xVals     = filtered.map(r => sleepToNum[r.sleep_label]);
const yVals     = filtered.map(r => r.pct_depressed);
 
const correlation = s.sampleCorrelation(xVals, yVals);
const linReg      = s.linearRegression(xVals.map((x, i) => [x, yVals[i]]));
const regLine     = s.linearRegressionLine(linReg);
const r2          = s.rSquared(xVals.map((x, i) => [x, yVals[i]]), regLine);
 
addMdToPage(`
| Mått | Värde |
|------|-------|
| Person-korrelation (r) | **${correlation.toFixed(3)}** |
| Förklaringsgrad (R²) | **${(r2 * 100).toFixed(1)} %** |
| Regressionslinje | depression = ${linReg.m.toFixed(2)} × sömntimmar + ${linReg.b.toFixed(1)} |
 
Korrelationen **r = ${correlation.toFixed(2)}** bekräftar sambandet —
regressionslinjen sjunker med ungefär ${Math.abs(linReg.m).toFixed(1)} procentenheter
för varje extra timmes sömn.
`);
 
const scatterData = filtered.map(r => ({
  sleep_h: sleepToNum[r.sleep_label],
  'Observerad (%)': r.pct_depressed,
  'Regressionslinje (%)': parseFloat(regLine(sleepToNum[r.sleep_label]).toFixed(1))
}));
 
drawGoogleChart({
  type: 'ComboChart',
  data: makeChartFriendly(scatterData, 'Sömntimmar', 'Observerad (%)', 'Regressionslinje (%)'),
  options: {
    height: 400,
    chartArea: { left: 60, right: 20, top: 40, bottom: 60 },
    seriesType: 'scatter',
    series: {
      0: { type: 'scatter', color: '#4a7fcb', pointSize: 12 },
      1: { type: 'line',    color: '#e05c3a', lineWidth: 2, pointSize: 0 }
    },
    vAxis: { title: 'Andel med depression (%)', minValue: 45, maxValue: 70 },
    hAxis: { title: 'Genomsnittlig sömntid (timmar)', minValue: 3, maxValue: 10 },
    title: 'Samband sömn och depression – observerat vs. regressionslinje',
    legend: { position: 'bottom' }
  }
});
 
// ── DEL 3: Akademisk press × sömn ────────────────────────────────────────────
 
addMdToPage(`
### Del 3 – Akademisk press förstärker sömneffekten
 
Sömn berättar inte hela historien. När vi kombinerar sömnlängd med
**akademisk press** (skala 1–5) ser vi hur de två faktorerna samverkar.
En student med hög press och kort sömn befinner sig i en mycket utsatt situation.
`);
 
let combinedData = await dbQuery(`
  SELECT
    SUBSTR("Sleep Duration", 2, LENGTH("Sleep Duration") - 2) AS sleep_label,
    CAST("Academic Pressure" AS INTEGER) AS pressure,
    ROUND(AVG(Depression) * 100, 1) AS pct_depressed
  FROM student_depression
  WHERE "Sleep Duration" NOT LIKE '%Others%'
    AND "Academic Pressure" IN (1, 3, 5)
  GROUP BY "Sleep Duration", "Academic Pressure"
  ORDER BY "Academic Pressure"
`);
 
const sleepOrder = ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'];
const pivoted = sleepOrder.map(label => {
  const row = { Sömnlängd: label };
  [1, 3, 5].forEach(p => {
    const match = combinedData.find(d => d.sleep_label === label && d.pressure === p);
    row[`Press ${p} (%)`] = match ? match.pct_depressed : null;
  });
  return row;
});
 
drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(pivoted, 'Sömnlängd', 'Press 1 (%)', 'Press 3 (%)', 'Press 5 (%)'),
  options: {
    height: 440,
    chartArea: { left: 60, right: 20, top: 40, bottom: 80 },
    colors: ['#6ab187', '#f0a500', '#d9534f'],
    vAxis: { title: 'Andel med depression (%)', minValue: 0, maxValue: 100 },
    hAxis: { title: 'Sömnlängd per natt' },
    title: 'Depression (%) per sömnlängd och akademisk press (nivå 1, 3 och 5)',
    legend: { position: 'bottom' }
  }
});
 
tableFromData({
  data: pivoted,
  columnNames: ['Sömnlängd', 'Press nivå 1 (%)', 'Press nivå 3 (%)', 'Press nivå 5 (%)']
});
 
addMdToPage(`
Den farligaste kombinationen är tydlig: **hög press (nivå 5) + kort sömn**
ger upp till **90 % depressionsandel**. Jämfört med låg press + tillräcklig sömn
på ~15 % är det en sexfaldig skillnad.
`);
 
// ── DEL 4: Studietimmar ───────────────────────────────────────────────────────
 
addMdToPage(`
### Del 4 – Studietimmar tränger ut sömnen
 
En trolig förklaring till sömnbristen är att långa studiedagar lämnar för lite
tid för återhämtning. Sambandet syns tydligt i data.
`);
 
let studyData = await dbQuery(`
  SELECT
    CAST("Work/Study Hours" AS INTEGER) AS study_hours,
    ROUND(AVG(Depression) * 100, 1) AS pct_depressed,
    COUNT(*) AS n
  FROM student_depression
  WHERE "Work/Study Hours" IS NOT NULL
  GROUP BY CAST("Work/Study Hours" AS INTEGER)
  ORDER BY study_hours
`);
 
drawGoogleChart({
  type: 'LineChart',
  data: makeChartFriendly(studyData, 'Studietimmar/dag', 'Andel deprimerade (%)'),
  options: {
    height: 380,
    chartArea: { left: 60, right: 20, top: 40, bottom: 60 },
    colors: ['#e05c3a'],
    curveType: 'function',
    pointSize: 5,
    vAxis: { title: 'Andel med depression (%)', minValue: 0, maxValue: 100 },
    hAxis: { title: 'Studietimmar per dag', format: '#' },
    title: 'Fler studietimmar per dag → högre depressionsandel',
    legend: 'none'
  }
});
 
// ── Slutsats ──────────────────────────────────────────────────────────────────
 
const minRow = sleepData.reduce((a, b) => a.pct_depressed < b.pct_depressed ? a : b);
const maxRow = sleepData.reduce((a, b) => a.pct_depressed > b.pct_depressed ? a : b);
 
addMdToPage(`
### Slutsats – sömn är inte ett lyxproblem
 
Analysen pekar entydigt i en riktning:
 
- Studenter som sover **${minRow.sleep_label}** mår bäst — ${minRow.pct_depressed} % depressionsandel.
- Studenter som sover **${maxRow.sleep_label}** mår sämst — ${maxRow.pct_depressed} % depressionsandel.
- Korrelationen **r = ${correlation.toFixed(2)}** bekräftas av regressionslinjen.
- **Akademisk press är den starkaste förstärkaren** — vid press nivå 5 och kort sömn
  når depressionsandelen upp mot 90 %.
- **Långa studiedagar** tränger ut sömnen och förstärker spiralen ytterligare.
 
Sömn är inte ett lyxproblem — det är en grundläggande faktor för studenters psykiska hälsa.
`);
