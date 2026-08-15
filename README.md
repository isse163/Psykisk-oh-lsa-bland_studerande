# Psykisk ohälsa bland studenter

En interaktiv dataanalys av sambandet mellan sömnvanor, akademisk press och depression bland studenter.

## Om projektet

Det här projektet undersöker ett dataset med **27 901 studenter** från Indien och analyserar hur sömnvanor och akademisk press påverkar studenters psykiska hälsa. Mer än varannan student i datasetet uppvisar tecken på depression (58,5 %).

Projektet är byggt med **Statistics Template JS (STJS)** — en mall för att arbeta med statistik och datavisualisering i JavaScript.

## Vad analysen visar

- **Sömnlängd och depression** — ju kortare sömn, desto högre depressionsandel
- **Akademisk press** — starkaste enskilda faktorn, upp till 90 % depressionsandel vid hög press och kort sömn
- **Studietimmar** — långa studiedagar tränger ut sömnen och förstärker depressionen
- **Statistisk analys** — Pearson-korrelation och regressionslinje beräknas med Simple Statistics

## Teknisk stack

| Teknologi | Användning |
|-----------|-----------|
| Node.js + Express | Webbserver och API |
| SQLite (better-sqlite3) | Databas med studentdata |
| Google Charts | Interaktiva diagram |
| Simple Statistics | Korrelation och regressionsanalys |
| Bootstrap 5 | Responsiv layout |
| Marked.js | Markdown-rendering |

## Installation

### Krav
- Node.js v18 eller senare
- npm

### Steg

1. Klona repot:
```bash
git clone https://github.com/isse163/Psykisk-oh-lsa-bland-studerande.git
cd Psykisk-oh-lsa-bland-studerande
```

2. Installera beroenden:
```bash
npm install
```

3. Starta servern:
```bash
npm start
```

4. Öppna webbläsaren på:
```
http://localhost:3005
```

## Filstruktur

```
├── backend/
│   ├── app.js                        # Express-server
│   ├── dbRouter.js                   # Databasrouter (SQLite, MySQL, MongoDB, Neo4j)
│   ├── example-databases-in-use.json # Exempelkonfiguration för databaser
│   └── sstatparts.js                 # Simple Statistics-delar
├── databases/
│   ├── databases-in-use.json         # Aktiv databaskonfiguration (git-ignorerad)
│   └── sqlite-dbs/
│       └── student_depression.db     # SQLite-databas med studentdata
├── js/
│   ├── libs/                         # Mallens bibliotek (bundlade)
│   ├── _menu.js                      # Menykonfiguration
│   ├── sleep-vs-depression.js        # Huvudanalys — sömn och depression
│   └── welcome.js                    # Välkomstsida
├── index.html                        # Huvudsida
├── in-style.css                      # Innehållsstilar
└── package.json
```

## Dataset

Datasetet innehåller information om 27 901 studenter med följande kolumner:

- **Sleep Duration** — sömnlängd per natt
- **Academic Pressure** — akademisk press (skala 1–5)
- **Work/Study Hours** — studietimmar per dag
- **Depression** — depression (0 = nej, 1 = ja)
- **CGPA** — betygssnitt
- **Financial Stress** — finansiell stress (skala 1–5)
- **Dietary Habits** — kostvanor (Healthy / Moderate / Unhealthy)

## Sidor

| Sida | Beskrivning |
|------|-------------|
| Välkommen | Introduktion till projektet och datasetet |
| Sömn & Depression | Komplett analys med 4 diagram, tabeller och statistik |

## Författare

Isse — Frontendutvecklare, examinerad från TUC Yrkeshögskola 2025
