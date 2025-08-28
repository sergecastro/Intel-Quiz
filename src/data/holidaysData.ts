// Holiday matching system - like Torah matches
export interface HolidayMatch {
  name: string;
  story: string;
  food: string;
  season: string;
  symbol: string;
}

export const holidayMatches: HolidayMatch[] = [
  {
    name: 'ראש השנה',
    story: 'ראש השנה היהודית',
    food: 'תפוחים ודבש',
    season: 'סתיו',
    symbol: 'שופר'
  },
  {
    name: 'יום כיפור',
    story: 'יום הכיפורים',
    food: 'צום',
    season: 'סתיו',
    symbol: 'בגדים לבנים'
  },
  {
    name: 'סוכות',
    story: 'חג הסוכות',
    food: 'ארוחות בסוכה',
    season: 'סתיו',
    symbol: 'לולב ואתרוג'
  },
  {
    name: 'שמחת תורה',
    story: 'חג שמחת תורה',
    food: 'ממתקים',
    season: 'סתיו',
    symbol: 'ספר תורה'
  },
  {
    name: 'חנוכה',
    story: 'נס פך השמן',
    food: 'לביבות וסופגניות',
    season: 'חורף',
    symbol: 'חנוכייה'
  },
  {
    name: 'פורים',
    story: 'מגילת אסתר',
    food: 'אוזני המן',
    season: 'חורף',
    symbol: 'מגילה ורעשן'
  },
  {
    name: 'פסח',
    story: 'יציאת מצרים',
    food: 'מצה וחרוסת',
    season: 'אביב',
    symbol: 'קערת הסדר'
  },
  {
    name: 'שבועות',
    story: 'מתן תורה',
    food: 'מאכלי חלב',
    season: 'קיץ',
    symbol: 'לוחות הברית'
  }
];

export const holidayCategories = {
  name: ['ראש השנה', 'יום כיפור', 'סוכות', 'שמחת תורה', 'חנוכה', 'פורים', 'פסח', 'שבועות'],
  story: ['ראש השנה היהודית', 'יום הכיפורים', 'חג הסוכות', 'חג שמחת תורה', 'נס פך השמן', 'מגילת אסתר', 'יציאת מצרים', 'מתן תורה'],
  food: ['תפוחים ודבש', 'צום', 'ארוחות בסוכה', 'ממתקים', 'לביבות וסופגניות', 'אוזני המן', 'מצה וחרוסת', 'מאכלי חלב'],
  season: ['סתיו', 'חורף', 'אביב', 'קיץ'],
  symbol: ['שופר', 'בגדים לבנים', 'לולב ואתרוג', 'ספר תורה', 'חנוכייה', 'מגילה ורעשן', 'קערת הסדר', 'לוחות הברית']
};

export const holidayCategoryNames = {
  name: 'שם החג',
  story: 'סיפור החג',
  food: 'מאכל מסורתי',
  season: 'עונה',
  symbol: 'סמל החג'
};

export type HolidayCategoryKey = keyof typeof holidayCategories;