export const historyCategories = {
  event: [
    // Leading items - ONLY real historical events
    "American Revolution", "The Renaissance", "World War II", "French Revolution", 
    "Industrial Revolution", "Roman Empire Fall", "Ancient Egypt Dynasty"
  ],
  
  startEndYear: [
    // Correct answers
    "1775-1783", "14th-17th centuries", "1939-1945", "1789-1799", 
    "1760-1840", "476 AD", "3100-30 BC",
    // Plausible but wrong options (3+ realistic)
    "1607-1776", "1861-1865", "18th-19th centuries", "1914-1918", 
    "1850-1950", "500-1000 AD", "1000-1500 BC",
    // Funny options (2 clearly wrong/silly)
    "When dinosaurs rebelled", "Last Black Friday sale", "The century of flying cars", 
    "When memes were invented", "Stone Age shopping spree"
  ],

  keyFigures: [
    // Correct answers
    "George Washington", "Leonardo da Vinci", "Winston Churchill", "Napoleon Bonaparte", 
    "James Watt", "Julius Caesar", "Cleopatra",
    // Plausible but wrong (3+ realistic)
    "Abraham Lincoln", "Albert Einstein", "William Shakespeare", "Adolf Hitler", 
    "Thomas Jefferson", "Alexander the Great", "King Tut",
    // Funny options (2 clearly wrong/silly) 
    "Super Mario", "A rebellious teapot", "The Ghost of Christmas Past", 
    "A ninja turtle", "The Mona Lisa (she got tired of posing)", "A time-traveling tourist"
  ],

  primaryRegion: [
    // Correct answers
    "North America", "Italy/Europe", "Europe/Pacific", "France", 
    "Britain", "Mediterranean", "Egypt/Africa",
    // Plausible but wrong (3+ realistic)
    "Asia", "South America", "Ancient Greece", "Germany", 
    "Spain", "Turkey", "Sudan",
    // Funny options (2 clearly wrong/silly)
    "Middle Earth", "Your kitchen during a tea party", "Pizza Land", 
    "The set of a Renaissance fair", "Atlantis (before it sank)", "The Moon (early space program)"
  ],

  majorCauses: [
    // Correct answers
    "Taxation without representation", "Revival of classical learning", "Aggression and territorial expansion", 
    "Economic crisis and social inequality", "Agricultural changes and new technology", 
    "Political instability and barbarian invasions", "Pharaoh succession and divine mandate",
    // Plausible but wrong (3+ realistic)
    "Religious persecution", "Territorial disputes", "Industrial machinery", "Colonial expansion", 
    "Trade route disruption", "Climate change", "Population growth",
    // Funny options (2 clearly wrong/silly)
    "A bad hair day for the king", "Revolt of the coffee machines", "Bored artists with too much paint", 
    "A shortage of good WiFi", "The great rubber duck rebellion", "Someone lost the instruction manual"
  ],

  majorOutcomes: [
    // Correct answers
    "U.S. Independence", "Cultural Renaissance in art and science", "Allied victory and UN formation", 
    "End of monarchy and rise of nationalism", "Mass production and urbanization", 
    "Rise of Byzantine Empire", "Unification of Upper and Lower Egypt",
    // Plausible but wrong (3+ realistic)
    "Abolition of slavery", "Invention of the printing press", "Creation of NATO", 
    "Women's suffrage", "Railroad expansion", "Spread of Christianity", "Construction of pyramids",
    // Funny options (2 clearly wrong/silly)
    "Everyone gets free fireworks", "Invention of the selfie stick", "Peace treaty signed by emojis", 
    "The first meme was created", "Flying cars for everyone", "Universal free pizza delivery"
  ]
};

export const historyCategoryNames = {
  event: 'Historical Event',
  startEndYear: 'Time Period', 
  keyFigures: 'Key Figures',
  primaryRegion: 'Primary Region',
  majorCauses: 'Major Causes',
  majorOutcomes: 'Major Outcomes'
};

export type HistoryCategoryKey = keyof typeof historyCategories;

// Matches define the correct combinations
export const historyMatches = [
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
    primaryRegion: "Italy/Europe",
    majorCauses: "Revival of classical learning",
    majorOutcomes: "Cultural Renaissance in art and science"
  },
  {
    event: "World War II",
    startEndYear: "1939-1945",
    keyFigures: "Winston Churchill",
    primaryRegion: "Europe/Pacific", 
    majorCauses: "Aggression and territorial expansion",
    majorOutcomes: "Allied victory and UN formation"
  },
  {
    event: "French Revolution",
    startEndYear: "1789-1799",
    keyFigures: "Napoleon Bonaparte",
    primaryRegion: "France",
    majorCauses: "Economic crisis and social inequality", 
    majorOutcomes: "End of monarchy and rise of nationalism"
  },
  {
    event: "Industrial Revolution",
    startEndYear: "1760-1840",
    keyFigures: "James Watt",
    primaryRegion: "Britain",
    majorCauses: "Agricultural changes and new technology",
    majorOutcomes: "Mass production and urbanization"
  },
  {
    event: "Roman Empire Fall",
    startEndYear: "476 AD",
    keyFigures: "Julius Caesar",
    primaryRegion: "Mediterranean", 
    majorCauses: "Political instability and barbarian invasions",
    majorOutcomes: "Rise of Byzantine Empire"
  },
  {
    event: "Ancient Egypt Dynasty",
    startEndYear: "3100-30 BC",
    keyFigures: "Cleopatra",
    primaryRegion: "Egypt/Africa",
    majorCauses: "Pharaoh succession and divine mandate",
    majorOutcomes: "Unification of Upper and Lower Egypt"
  }
];