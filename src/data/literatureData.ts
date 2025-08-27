export interface LiteratureMatch {
  book: string;
  author: string;
  publicationDecade: string;
  mainCharacter: string;
  centralTheme: string;
  keyQuote: string;
  genreStyle: string;
  notableAdaptation: string;
}

export const literatureMatches: LiteratureMatch[] = [
  {
    book: "Pride and Prejudice",
    author: "Jane Austen",
    publicationDecade: "1810s",
    mainCharacter: "Elizabeth Bennet",
    centralTheme: "Social class and romance",
    keyQuote: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    genreStyle: "Romantic comedy of manners",
    notableAdaptation: "1995 BBC miniseries with Colin Firth"
  },
  {
    book: "The Hunger Games",
    author: "Suzanne Collins",
    publicationDecade: "2000s",
    mainCharacter: "Katniss Everdeen",
    centralTheme: "Survival and rebellion in a dystopia",
    keyQuote: "May the odds be ever in your favor.",
    genreStyle: "Young adult dystopian fiction",
    notableAdaptation: "2012 film with Jennifer Lawrence"
  },
  {
    book: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationDecade: "1920s",
    mainCharacter: "Jay Gatsby",
    centralTheme: "The American Dream and excess",
    keyQuote: "So we beat on, boats against the current, borne back ceaselessly into the past.",
    genreStyle: "Modernist novel",
    notableAdaptation: "2013 film with Leonardo DiCaprio"
  },
  {
    book: "Romeo and Juliet",
    author: "William Shakespeare",
    publicationDecade: "1590s",
    mainCharacter: "Romeo Montague",
    centralTheme: "Tragic love and family feud",
    keyQuote: "But soft, what light through yonder window breaks?",
    genreStyle: "Tragic play",
    notableAdaptation: "1968 film by Franco Zeffirelli"
  },
  {
    book: "To Kill a Mockingbird",
    author: "Harper Lee",
    publicationDecade: "1960s",
    mainCharacter: "Scout Finch",
    centralTheme: "Racial injustice and morality",
    keyQuote: "You never really understand a person until you consider things from his point of view.",
    genreStyle: "Southern Gothic fiction",
    notableAdaptation: "1962 film with Gregory Peck"
  },
  {
    book: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    publicationDecade: "1990s",
    mainCharacter: "Harry Potter",
    centralTheme: "Good vs evil and friendship",
    keyQuote: "It does not do to dwell on dreams and forget to live.",
    genreStyle: "Fantasy adventure",
    notableAdaptation: "2001 film with Daniel Radcliffe"
  },
  {
    book: "1984",
    author: "George Orwell",
    publicationDecade: "1940s",
    mainCharacter: "Winston Smith",
    centralTheme: "Totalitarian control and surveillance",
    keyQuote: "Big Brother is watching you.",
    genreStyle: "Dystopian science fiction",
    notableAdaptation: "1984 film with John Hurt"
  },
  {
    book: "The Catcher in the Rye",
    author: "J.D. Salinger",
    publicationDecade: "1950s",
    mainCharacter: "Holden Caulfield",
    centralTheme: "Alienation and loss of innocence",
    keyQuote: "If you really want to hear about it, the first thing you'll probably want to know is where I was born.",
    genreStyle: "Coming-of-age fiction",
    notableAdaptation: "Various stage adaptations"
  },
  {
    book: "Jane Eyre",
    author: "Charlotte Brontë",
    publicationDecade: "1840s",
    mainCharacter: "Jane Eyre",
    centralTheme: "Independence and social equality",
    keyQuote: "I am no bird; and no net ensnares me.",
    genreStyle: "Gothic romance",
    notableAdaptation: "2011 film with Mia Wasikowska"
  },
  {
    book: "Lord of the Flies",
    author: "William Golding",
    publicationDecade: "1950s",
    mainCharacter: "Ralph",
    centralTheme: "Civilization vs savagery",
    keyQuote: "Maybe there is a beast... maybe it's only us.",
    genreStyle: "Allegorical fiction",
    notableAdaptation: "1990 film adaptation"
  }
];

// Generate categories from the matches data
export const literatureCategories = {
  book: [...new Set(literatureMatches.map(match => match.book))],
  author: [
    ...new Set(literatureMatches.map(match => match.author)),
    // Additional plausible authors
    "Charles Dickens", "Mark Twain", "Virginia Woolf", "Ernest Hemingway", 
    "Toni Morrison", "Stephen King", "Agatha Christie", "Oscar Wilde",
    // Funny options
    "A caffeinated novelist", "The ghost of Christmas past", "A typing monkey",
    "Your English teacher", "A literary penguin", "Shakespeare's cousin"
  ],
  publicationDecade: [
    ...new Set(literatureMatches.map(match => match.publicationDecade)),
    // Additional plausible decades
    "1870s", "1880s", "1900s", "1930s", "1970s", "1980s", "2010s",
    // Funny options
    "When dinosaurs wrote novels", "The decade of smartphones", "Future dystopia",
    "When emojis were invented", "Stone Age", "The era of flying cars"
  ],
  mainCharacter: [
    ...new Set(literatureMatches.map(match => match.mainCharacter)),
    // Additional plausible characters
    "Hermione Granger", "Atticus Finch", "Huckleberry Finn", "Hamlet",
    "Emma Woodhouse", "Heathcliff", "Pip", "Catherine Earnshaw",
    // Funny options
    "A talking book", "The reader", "A literary critic", "Captain Obvious",
    "A confused librarian", "The protagonist's pet"
  ],
  centralTheme: [
    ...new Set(literatureMatches.map(match => match.centralTheme)),
    // Additional plausible themes
    "Love and loss", "War and peace", "Coming of age", "Revenge and justice",
    "Family dysfunction", "Identity crisis", "Power and corruption",
    // Funny options
    "The importance of breakfast", "How to avoid reading", "Cats vs dogs debate",
    "The mystery of missing socks", "Social media addiction", "Pizza preferences"
  ],
  keyQuote: [
    ...new Set(literatureMatches.map(match => match.keyQuote)),
    // Additional plausible quotes
    "To be or not to be, that is the question", "Call me Ishmael", 
    "It was the best of times, it was the worst of times",
    // Funny options
    "May the Force be with you", "I'll be back", "Houston, we have a problem",
    "That's what she said", "Winter is coming", "I am inevitable"
  ],
  genreStyle: [
    ...new Set(literatureMatches.map(match => match.genreStyle)),
    // Additional plausible genres
    "Historical fiction", "Mystery thriller", "Science fiction", "Romance",
    "Horror", "Biography", "Adventure", "Satirical comedy",
    // Funny options
    "Cooking manual", "Assembly instructions", "Shopping list epic",
    "Meme compilation", "Dance tutorial", "Pet training guide"
  ],
  notableAdaptation: [
    ...new Set(literatureMatches.map(match => match.notableAdaptation)),
    // Additional plausible adaptations
    "Broadway musical", "Netflix series", "Radio drama", "Opera adaptation",
    "Graphic novel", "Video game", "Animated series",
    // Funny options
    "Interpretive dance version", "Puppet show", "TikTok challenge",
    "Cooking show adaptation", "Reality TV spin-off", "Karaoke version"
  ]
};

export const literatureCategoryNames = {
  book: "Book Title",
  author: "Author",
  publicationDecade: "Publication Decade", 
  mainCharacter: "Main Character",
  centralTheme: "Central Theme",
  keyQuote: "Key Quote",
  genreStyle: "Genre/Style",
  notableAdaptation: "Notable Adaptation"
};

export type LiteratureCategoryKey = keyof typeof literatureCategories;