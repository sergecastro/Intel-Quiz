export interface GameMatch {
  country: string;
  capital: string;
  language: string;
  currency: string;
  continent: string;
  flag: string;
  flagImage: string;
}

import franceFlagImg from '@/assets/flags/france.png';
import japanFlagImg from '@/assets/flags/japan.png';
import brazilFlagImg from '@/assets/flags/brazil.png';
import australiaFlagImg from '@/assets/flags/australia.png';
import egyptFlagImg from '@/assets/flags/egypt.png';
import canadaFlagImg from '@/assets/flags/canada.png';
import germanyFlagImg from '@/assets/flags/germany.png';
import indiaFlagImg from '@/assets/flags/india.png';
import mexicoFlagImg from '@/assets/flags/mexico.png';
import russiaFlagImg from '@/assets/flags/russia.png';
import southAfricaFlagImg from '@/assets/flags/south-africa.png';
import thailandFlagImg from '@/assets/flags/thailand.png';

export const gameMatches: GameMatch[] = [
  {
    country: "France",
    capital: "Paris",
    language: "French",
    currency: "Euro",
    continent: "Europe",
    flag: "France",
    flagImage: franceFlagImg
  },
  {
    country: "Japan",
    capital: "Tokyo", 
    language: "Japanese",
    currency: "Yen",
    continent: "Asia",
    flag: "Japan",
    flagImage: japanFlagImg
  },
  {
    country: "Brazil",
    capital: "Brasília",
    language: "Portuguese", 
    currency: "Real",
    continent: "South America",
    flag: "Brazil",
    flagImage: brazilFlagImg
  },
  {
    country: "Australia",
    capital: "Canberra",
    language: "English",
    currency: "Australian Dollar",
    continent: "Oceania",
    flag: "Australia",
    flagImage: australiaFlagImg
  },
  {
    country: "Egypt",
    capital: "Cairo",
    language: "Arabic",
    currency: "Egyptian Pound",
    continent: "Africa",
    flag: "Egypt",
    flagImage: egyptFlagImg
  },
  {
    country: "Canada",
    capital: "Ottawa",
    language: "English",
    currency: "Canadian Dollar",
    continent: "North America",
    flag: "Canada",
    flagImage: canadaFlagImg
  },
  {
    country: "Germany",
    capital: "Berlin",
    language: "German",
    currency: "Euro", 
    continent: "Europe",
    flag: "Germany",
    flagImage: germanyFlagImg
  },
  {
    country: "India",
    capital: "New Delhi",
    language: "Hindi",
    currency: "Rupee",
    continent: "Asia",
    flag: "India",
    flagImage: indiaFlagImg
  },
  {
    country: "Mexico",
    capital: "Mexico City",
    language: "Spanish",
    currency: "Peso",
    continent: "North America",
    flag: "Mexico",
    flagImage: mexicoFlagImg
  },
  {
    country: "Russia",
    capital: "Moscow",
    language: "Russian",
    currency: "Ruble",
    continent: "Europe",
    flag: "Russia",
    flagImage: russiaFlagImg
  },
  {
    country: "South Africa",
    capital: "Cape Town",
    language: "Afrikaans",
    currency: "Rand",
    continent: "Africa",
    flag: "South Africa",
    flagImage: southAfricaFlagImg
  },
  {
    country: "Thailand",
    capital: "Bangkok",
    language: "Thai",
    currency: "Baht",
    continent: "Asia",
    flag: "Thailand",
    flagImage: thailandFlagImg
  }
];

export const categories = {
  country: [...new Set(gameMatches.map(match => match.country))],
  capital: [...new Set(gameMatches.map(match => match.capital))],
  language: [...new Set(gameMatches.map(match => match.language))],
  currency: [...new Set(gameMatches.map(match => match.currency))],
  continent: [...new Set(gameMatches.map(match => match.continent))],
  flag: [...new Set(gameMatches.map(match => match.flag))]
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