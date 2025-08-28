export interface TorahMatch {
  character: string;
  event: string;
  location: string;
  family: string;
  quote: string;
  theme: string;
  period: string;
  miracle: string;
}

export const torahMatches: TorahMatch[] = [
  {
    character: "אברהם אבינו",
    event: "ברית בין הבתרים והבטחת הארץ והזרע",
    location: "אוּר כשדים → חָרָן → כנען",
    family: "שרה (אשתו), יצחק (בנו), לוט (בן אחיו)",
    quote: "לֶךְ־לְךָ... אֶל־הָאָרֶץ אֲשֶׁר אַרְאֶךָּ",
    theme: "אמונה, ברית, הבטחת הזרע והארץ",
    period: "תקופת האבות",
    miracle: "לידת יצחק לשרה בזקנותה"
  },
  {
    character: "משה רבנו",
    event: "מתן תורה בהר סיני",
    location: "מצרים, מדיין, הר סיני/חורב, ערבות מואב",
    family: "אהרן, מרים, יוכבד, עמרם, צפורה",
    quote: "שְׁמַע יִשְׂרָאֵל ה' אֱלֹקֵינוּ ה' אֶחָד",
    theme: "גאולה, תורה, נבואה, ענווה",
    period: "יציאת מצרים ושנות המדבר",
    miracle: "קריעת ים סוף"
  },
  {
    character: "יוסף הצדיק",
    event: "פירוש חלומות פרעה והצלת מצרים מרעב",
    location: "כנען → מצרים → ארמון פרעה",
    family: "יעקב (אביו), בנימין (אחיו), אסנת (אשתו)",
    quote: "הֲלוֹא לֵאלֹהִים פִּתְרֹנִים",
    theme: "השגחה, סליחה, הישרדות עם ישראל",
    period: "סוף תקופת האבות",
    miracle: "חלומות נבואיים ופירושם"
  },
  {
    character: "עגל הזהב",
    event: "חטא עשיית עגל הזהב בהר סיני",
    location: "מחנה ישראל מתחת להר סיני",
    family: "עם ישראל, אהרן (מכין אותו)",
    quote: "אֵלֶּה אֱלֹהֶיךָ יִשְׂרָאֵל",
    theme: "עבודה זרה, תשובה, סליחה",
    period: "ימי מתן תורה",
    miracle: "שבירת לוחות הברית"
  },
  {
    character: "המרגלים",
    event: "ריגול הארץ ודו״ח רע על כניסה לארץ",
    location: "ממדבר פארן אל ארץ כנען",
    family: "נציגי שבטי ישראל, יהושע וכלב (מיעוט)",
    quote: "לֹא נוּכַל לַעֲלוֹת אֶל־הָעָם",
    theme: "בטחון בה׳, פחד, אמונה",
    period: "שנה השנייה במדבר",
    miracle: "ענבי אשכול הענקיים"
  },
  {
    character: "יצחק אבינו",
    event: "עקידת יצחק והקרבה על המזבח",
    location: "הר המוריה",
    family: "אברהם (אביו), שרה (אמו), רבקה (אשתו)",
    quote: "וַיֹּאמֶר הִנֵּנִי בְנִי",
    theme: "מסירות נפש, ציות, אמונה",
    period: "תקופת האבות",
    miracle: "איל נתפס בסבך"
  },
  {
    character: "יעקב אבינו",
    event: "חלום הסולם ומלאכי אלהים",
    location: "בית אל (בדרך לחרן)",
    family: "יצחק ורבקה (הורים), לאה ורחל (נשים)",
    quote: "מַה־נּוֹרָא הַמָּקוֹם הַזֶּה",
    theme: "נבואה, ברית, השגחה",
    period: "תקופת האבות",
    miracle: "סולם מוצב ארצה וראשו השמימה"
  },
  {
    character: "נח הצדיק",
    event: "בניית התיבה והצלה מהמבול",
    location: "תיבת נח על פני המים",
    family: "חם, שם, יפת (בניו) ונשיהם",
    quote: "זֶרַע אֶחָד מִכָּל־הַחַי",
    theme: "צדקות, שיפוט, התחדשות",
    period: "דורות ראשונים",
    miracle: "הצלת כל החי מהמבול"
  },
  {
    character: "אהרן הכהן",
    event: "משחת כהונה וקדושת הכהנים",
    location: "משכן במדבר",
    family: "משה (אחיו), מרים (אחותו), נדב ואביהוא (בניו)",
    quote: "וְהָיוּ לְךָ וּלְבָנֶיךָ אִתָּךְ",
    theme: "כהונה, קדושה, עבודת הקודש",
    period: "ימי המדבר",
    miracle: "מטה אהרן פרח ושקדים"
  }
];

export const torahCategories = {
  character: [...new Set(torahMatches.map(match => match.character))],
  event: [...new Set(torahMatches.map(match => match.event))],
  location: [...new Set(torahMatches.map(match => match.location))],
  family: [...new Set(torahMatches.map(match => match.family))],
  quote: [...new Set(torahMatches.map(match => match.quote))],
  theme: [...new Set(torahMatches.map(match => match.theme))],
  period: [...new Set(torahMatches.map(match => match.period))],
  miracle: [...new Set(torahMatches.map(match => match.miracle))]
};

export const torahCategoryNames = {
  character: "דמות",
  event: "אירוע מרכזי",
  location: "מיקום",
  family: "קשרי משפחה",
  quote: "פסוק מפורסם",
  theme: "נושא מרכזי",
  period: "תקופה",
  miracle: "נס/אות"
} as const;

export type TorahCategoryKey = keyof typeof torahCategories;