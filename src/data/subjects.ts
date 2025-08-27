import { gameMatches, categories, categoryNames, CategoryKey } from './gameData';
import { historyMatches, historyCategories, historyCategoryNames, HistoryCategoryKey } from './historyData';

export interface Subject {
  id: string;
  name: string;
  icon: string;
  matches: any[];
  categories: Record<string, string[]>;
  categoryNames: Record<string, string>;
  levels: {
    [key: number]: string[];
  };
}

export const subjects: Record<string, Subject> = {
  geography: {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    matches: gameMatches,
    categories: categories,
    categoryNames: categoryNames,
    levels: {
      1: ['country', 'capital', 'language'],
      2: ['country', 'capital', 'language', 'currency'],
      3: ['country', 'capital', 'language', 'currency', 'continent'],
      4: ['country', 'capital', 'language', 'currency', 'continent', 'flag']
    }
  },
  history: {
    id: 'history',
    name: 'History',
    icon: '📜',
    matches: historyMatches,
    categories: historyCategories,
    categoryNames: historyCategoryNames,
    levels: {
      1: ['event', 'startEndYear', 'keyFigures'],
      2: ['event', 'startEndYear', 'keyFigures', 'primaryRegion'],
      3: ['event', 'startEndYear', 'keyFigures', 'primaryRegion', 'majorCauses'],
      4: ['event', 'startEndYear', 'keyFigures', 'primaryRegion', 'majorCauses', 'majorOutcomes']
    }
  }
};

export const availableSubjects = Object.values(subjects);

export type SubjectKey = keyof typeof subjects;
export type AnyCategoryKey = CategoryKey | HistoryCategoryKey;