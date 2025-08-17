export interface GameMatch {
  country: string;
  capital: string;
  language: string;
  currency: string;
  continent: string;
  flag: string;
}

export const gameMatches: GameMatch[] = [
  {
    country: "France",
    capital: "Paris",
    language: "French",
    currency: "Euro",
    continent: "Europe",
    flag: "🇫🇷"
  },
  {
    country: "Japan",
    capital: "Tokyo",
    language: "Japanese",
    currency: "Yen",
    continent: "Asia",
    flag: "🇯🇵"
  },
  {
    country: "Brazil",
    capital: "Brasília",
    language: "Portuguese",
    currency: "Real",
    continent: "South America",
    flag: "🇧🇷"
  },
  {
    country: "Australia",
    capital: "Canberra",
    language: "English",
    currency: "Australian Dollar",
    continent: "Oceania",
    flag: "🇦🇺"
  },
  {
    country: "Egypt",
    capital: "Cairo",
    language: "Arabic",
    currency: "Egyptian Pound",
    continent: "Africa",
    flag: "🇪🇬"
  },
  {
    country: "Canada",
    capital: "Ottawa",
    language: "English",
    currency: "Canadian Dollar",
    continent: "North America",
    flag: "🇨🇦"
  },
  {
    country: "Germany",
    capital: "Berlin",
    language: "German",
    currency: "Euro",
    continent: "Europe",
    flag: "🇩🇪"
  },
  {
    country: "India",
    capital: "New Delhi",
    language: "Hindi",
    currency: "Rupee",
    continent: "Asia",
    flag: "🇮🇳"
  },
  {
    country: "Mexico",
    capital: "Mexico City",
    language: "Spanish",
    currency: "Peso",
    continent: "North America",
    flag: "🇲🇽"
  },
  {
    country: "Russia",
    capital: "Moscow",
    language: "Russian",
    currency: "Ruble",
    continent: "Europe",
    flag: "🇷🇺"
  },
  {
    country: "South Africa",
    capital: "Cape Town",
    language: "Afrikaans",
    currency: "Rand",
    continent: "Africa",
    flag: "🇿🇦"
  },
  {
    country: "Thailand",
    capital: "Bangkok",
    language: "Thai",
    currency: "Baht",
    continent: "Asia",
    flag: "🇹🇭"
  }
];

export const categories = {
  country: gameMatches.map(match => match.country),
  capital: gameMatches.map(match => match.capital),
  language: gameMatches.map(match => match.language),
  currency: gameMatches.map(match => match.currency),
  continent: gameMatches.map(match => match.continent),
  flag: gameMatches.map(match => match.flag)
};

export const categoryNames = {
  country: "Country",
  capital: "Capital City",
  language: "Language",
  currency: "Currency",
  continent: "Continent",
  flag: "Flag"
} as const;

export type CategoryKey = keyof typeof categories;