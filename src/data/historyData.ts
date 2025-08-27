export interface HistoryMatch {
  event: string;
  startEndYear: string;
  keyFigures: string;
  primaryRegion: string;
  majorCauses: string;
  majorOutcomes: string;
}

export const historyMatches: HistoryMatch[] = [
  {
    event: "American Revolution",
    startEndYear: "1775-1783",
    keyFigures: "George Washington",
    primaryRegion: "North America",
    majorCauses: "Taxation without representation",
    majorOutcomes: "U.S. Independence"
  },
  {
    event: "The Renaissance",
    startEndYear: "14th-17th centuries",
    keyFigures: "Leonardo da Vinci",
    primaryRegion: "Italy",
    majorCauses: "Revival of classical learning",
    majorOutcomes: "Cultural rebirth in Europe"
  },
  {
    event: "World War II",
    startEndYear: "1939-1945",
    keyFigures: "Winston Churchill",
    primaryRegion: "Global",
    majorCauses: "Rise of fascism",
    majorOutcomes: "Allied victory"
  },
  {
    event: "French Revolution",
    startEndYear: "1789-1799",
    keyFigures: "Robespierre",
    primaryRegion: "France",
    majorCauses: "Social inequality",
    majorOutcomes: "Abolition of monarchy"
  },
  {
    event: "Industrial Revolution",
    startEndYear: "1760-1840",
    keyFigures: "James Watt",
    primaryRegion: "Britain",
    majorCauses: "Technological innovation",
    majorOutcomes: "Mass production"
  },
  {
    event: "Roman Empire Fall",
    startEndYear: "476 AD",
    keyFigures: "Odoacer",
    primaryRegion: "Western Europe",
    majorCauses: "Barbarian invasions",
    majorOutcomes: "End of Western Roman Empire"
  },
  {
    event: "Black Death",
    startEndYear: "1347-1351",
    keyFigures: "No specific leader",
    primaryRegion: "Europe",
    majorCauses: "Bacterial pandemic",
    majorOutcomes: "Population decline"
  },
  {
    event: "Discovery of America",
    startEndYear: "1492",
    keyFigures: "Christopher Columbus",
    primaryRegion: "Atlantic Ocean",
    majorCauses: "Search for trade routes",
    majorOutcomes: "European colonization"
  },
  {
    event: "Russian Revolution",
    startEndYear: "1917",
    keyFigures: "Vladimir Lenin",
    primaryRegion: "Russia",
    majorCauses: "Economic hardship",
    majorOutcomes: "Soviet Union formation"
  },
  {
    event: "Cold War",
    startEndYear: "1947-1991",
    keyFigures: "John F. Kennedy",
    primaryRegion: "Global",
    majorCauses: "Ideological differences",
    majorOutcomes: "Soviet Union collapse"
  }
];

export const historyCategories = {
  event: [...new Set(historyMatches.map(match => match.event))],
  startEndYear: [...new Set(historyMatches.map(match => match.startEndYear))],
  keyFigures: [...new Set(historyMatches.map(match => match.keyFigures))],
  primaryRegion: [...new Set(historyMatches.map(match => match.primaryRegion))],
  majorCauses: [...new Set(historyMatches.map(match => match.majorCauses))],
  majorOutcomes: [...new Set(historyMatches.map(match => match.majorOutcomes))]
};

export const historyCategoryNames = {
  event: "Historical Event",
  startEndYear: "Start/End Year",
  keyFigures: "Key Figures",
  primaryRegion: "Primary Region",
  majorCauses: "Major Causes",
  majorOutcomes: "Major Outcomes"
} as const;

export type HistoryCategoryKey = keyof typeof historyCategories;