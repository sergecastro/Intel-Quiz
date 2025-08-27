export interface TorahChoice {
  text: string;
  correct?: boolean;
  plausible?: boolean;
  funny?: boolean;
  source?: string;
  feedback?: string;
}

export interface TorahCategory {
  name: string;
  choices: TorahChoice[];
}

export interface TorahRound {
  lead: string;
  categories: TorahCategory[];
}

export const torahData: TorahRound[] = [
  {
    lead: "אברהם אבינו",
    categories: [
      {
        name: "אירועים/סיפורים",
        choices: [
          {
            text: "ברית בין הבתרים והבטחת הארץ והזרע",
            correct: true,
            source: "בראשית טו"
          },
          {
            text: "יציאת מצרים",
            correct: false,
            plausible: true,
            source: "שמות יב",
            feedback: "קרוב לנושא ברית וגאולה, אבל זה בימי משה."
          },
          {
            text: "המבול",
            correct: false,
            plausible: true,
            source: "בראשית ו–ט",
            feedback: "זה נח, לא אברהם."
          },
          {
            text: "מגדל בבל",
            correct: false,
            plausible: true,
            source: "בראשית יא",
            feedback: "אירוע קדם-אברהמי."
          },
          {
            text: "זכה בדרכון ביומטרי ראשון",
            correct: false,
            funny: true
          },
          {
            text: "מסע קניות ב'קניון הארץ המובטחת'",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "מיקומים קשורים",
        choices: [
          {
            text: "אוּר כשדים → חָרָן → כנען",
            correct: true,
            source: "בראשית יא:31–יב:5"
          },
          {
            text: "הר סיני",
            correct: false,
            plausible: true,
            source: "שמות יט–כ",
            feedback: "הר סיני קשור למשה, לא לאברהם."
          },
          {
            text: "גן עדן",
            correct: false,
            plausible: true,
            source: "בראשית ב–ג",
            feedback: "מוקדם הרבה לפני אברהם."
          },
          {
            text: "אררט",
            correct: false,
            plausible: true,
            source: "בראשית ח:ד",
            feedback: "זה נח והתיבה."
          },
          {
            text: "ה'פרומיסט לנד מול'",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "דמויות/קשרים",
        choices: [
          {
            text: "שרה (אשתו), יצחק (בנו), לוט (בן אחיו)",
            correct: true,
            source: "בראשית יא:27–כט; יב; יג; טו; כא; כב; יט"
          },
          {
            text: "נח (אביו)",
            correct: false,
            plausible: true,
            source: "בראשית ה–ט",
            feedback: "אין קשר משפחתי כזה בתורה."
          },
          {
            text: "משה (מצאצאיו הישירים)",
            correct: false,
            plausible: true,
            source: "שמות–דברים",
            feedback: "משה מעם ישראל, אך לא מצוין צאצאות ישירה מאברהם מעבר לשושלת הכללית."
          },
          {
            text: "יוסף (בנו)",
            correct: false,
            plausible: true,
            source: "בראשית ל–נ",
            feedback: "יוסף הוא נכדו של יצחק ובנו של יעקב, לא בנו של אברהם."
          },
          {
            text: "גמל בשם 'אייבי'",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "ציטוט/פסוק",
        choices: [
          {
            text: "לֶךְ־לְךָ... אֶל־הָאָרֶץ אֲשֶׁר אַרְאֶךָּ",
            correct: true,
            source: "בראשית יב:1"
          },
          {
            text: "בְּנֵה־לְךָ תֵּבָה",
            correct: false,
            plausible: true,
            source: "בראשית ו:14",
            feedback: "זה ציווי לנח."
          },
          {
            text: "אָנֹכִי ה' אֱלֹקֶיךָ",
            correct: false,
            plausible: true,
            source: "שמות כ:2",
            feedback: "דיבר ראשון בעשרת הדיברות – מתן תורה."
          },
          {
            text: "שְׁמַע יִשְׂרָאֵל",
            correct: false,
            plausible: true,
            source: "דברים ו:4",
            feedback: "דברי משה בדברים."
          },
          {
            text: "איפה הקפה בדרך לכנען?",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נושאים/סמליות",
        choices: [
          {
            text: "אמונה, ברית, הבטחת הזרע והארץ",
            correct: true,
            source: "בראשית יב; טו; יז; כב"
          },
          {
            text: "שיפוט וחידוש העולם",
            correct: false,
            plausible: true,
            source: "בראשית ו–ט",
            feedback: "נושא המבול."
          },
          {
            text: "שחרור מעבדות",
            correct: false,
            plausible: true,
            source: "שמות א–יב",
            feedback: "זה יציאת מצרים."
          },
          {
            text: "גאוות אדם ופירוד",
            correct: false,
            plausible: true,
            source: "בראשית יא",
            feedback: "מגדל בבל."
          },
          {
            text: "טיול כוכבים מודרך",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "תקופה",
        choices: [
          {
            text: "תקופת האבות",
            correct: true
          },
          {
            text: "לפני המבול",
            correct: false,
            plausible: true,
            source: "בראשית ה–ו"
          },
          {
            text: "תקופת יציאת מצרים",
            correct: false,
            plausible: true,
            source: "שמות"
          },
          {
            text: "השבוע שעבר",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נסים/הוראות קשורות",
        choices: [
          {
            text: "לידת יצחק לשרה בזקנותה",
            correct: true,
            source: "בראשית כא"
          },
          {
            text: "קשת בענן",
            correct: false,
            plausible: true,
            source: "בראשית ט:12–17",
            feedback: "סימן הברית לנח."
          },
          {
            text: "קריעת ים סוף",
            correct: false,
            plausible: true,
            source: "שמות יד",
            feedback: "בימי משה."
          },
          {
            text: "חלומות פרעה",
            correct: false,
            plausible: true,
            source: "בראשית מא",
            feedback: "יוסף."
          },
          {
            text: "אוהל שנפתח לבד בשבת",
            correct: false,
            funny: true
          }
        ]
      }
    ]
  },
  {
    lead: "משה רבנו",
    categories: [
      {
        name: "אירועים/סיפורים",
        choices: [
          {
            text: "מתן תורה בהר סיני",
            correct: true,
            source: "שמות יט–כ"
          },
          {
            text: "עקידת יצחק",
            correct: false,
            plausible: true,
            source: "בראשית כב",
            feedback: "זה אברהם ויצחק."
          },
          {
            text: "ברית בין הבתרים",
            correct: false,
            plausible: true,
            source: "בראשית טו",
            feedback: "אברהם."
          },
          {
            text: "חלום סולם יעקב",
            correct: false,
            plausible: true,
            source: "בראשית כח",
            feedback: "יעקב."
          },
          {
            text: "שדרוג ה-Wi-Fi במדבר",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "מיקומים קשורים",
        choices: [
          {
            text: "מצרים, מדיין, הר סיני/חורב, ערבות מואב",
            correct: true,
            source: "שמות–דברים"
          },
          {
            text: "בית לחם",
            correct: false,
            plausible: true,
            feedback: "קשור לדוד/רות, לא למשה."
          },
          {
            text: "ירושלים (בית המקדש)",
            correct: false,
            plausible: true,
            feedback: "בית המקדש מאוחר יותר."
          },
          {
            text: "אור כשדים",
            correct: false,
            plausible: true,
            feedback: "אברהם."
          },
          {
            text: "עמדת טעינה לרכבים",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "דמויות/קשרים",
        choices: [
          {
            text: "אהרן, מרים, יוכבד, עמרם, צפורה, גרשם ואליעזר",
            correct: true,
            source: "שמות ב–ד; ו"
          },
          {
            text: "שרה ורבקה",
            correct: false,
            plausible: true,
            feedback: "אמהות בתקופת האבות."
          },
          {
            text: "פרעה נבוכדנצר",
            correct: false,
            plausible: true,
            feedback: "שילוב תקופות/דמויות לא נכונות."
          },
          {
            text: "אסנת ומנשה",
            correct: false,
            plausible: true,
            feedback: "משפחת יוסף."
          },
          {
            text: "החמור המדבר",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "ציטוט/פסוק",
        choices: [
          {
            text: "שְׁמַע יִשְׂרָאֵל ה' אֱלֹקֵינוּ ה' אֶחָד",
            correct: true,
            source: "דברים ו:4"
          },
          {
            text: "שלח נא ביד תשלח",
            correct: false,
            plausible: true,
            source: "שמות ד:13",
            feedback: "אמנם דברי משה, אבל כאן מחפשים אמירה מכוננת לדורות."
          },
          {
            text: "לך־לך",
            correct: false,
            plausible: true,
            source: "בראשית יב:1",
            feedback: "אברהם."
          },
          {
            text: "אודך כי נורא נפליתי",
            correct: false,
            plausible: true,
            feedback: "תהילים – לא בתורה."
          },
          {
            text: "תפעילו בלוטות' במדבר",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נושאים/סמליות",
        choices: [
          {
            text: "גאולה, תורה, נבואה, ענווה",
            correct: true,
            source: "שמות–דברים; במדבר יב:3"
          },
          {
            text: "הבטחת הארץ לאבות",
            correct: false,
            plausible: true,
            source: "בראשית",
            feedback: "נושא מרכזי אצל האבות."
          },
          {
            text: "חטאי דור המבול",
            correct: false,
            plausible: true,
            source: "בראשית ו–ט"
          },
          {
            text: "מלכות בישראל",
            correct: false,
            plausible: true,
            feedback: "נושא מאוחר, בתקופת המלוכה."
          },
          {
            text: "תחרות 'נביא השנה'",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "תקופה",
        choices: [
          {
            text: "יציאת מצרים ושנות המדבר",
            correct: true
          },
          {
            text: "תקופת האבות",
            correct: false,
            plausible: true
          },
          {
            text: "בית שני",
            correct: false,
            plausible: true
          },
          {
            text: "מחר בבוקר",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נסים/הוראות קשורות",
        choices: [
          {
            text: "קריעת ים סוף",
            correct: true,
            source: "שמות יד"
          },
          {
            text: "קשת בענן",
            correct: false,
            plausible: true,
            source: "בראשית ט"
          },
          {
            text: "ברית מילה לאברהם",
            correct: false,
            plausible: true,
            source: "בראשית יז"
          },
          {
            text: "חלום סולם",
            correct: false,
            plausible: true,
            source: "בראשית כח"
          },
          {
            text: "מן בטעם פיצה",
            correct: false,
            funny: true
          }
        ]
      }
    ]
  },
  {
    lead: "יוסף הצדיק",
    categories: [
      {
        name: "אירועים/סיפורים",
        choices: [
          {
            text: "פענוח חלום פרעה והצלת מצרים מרעב",
            correct: true,
            source: "בראשית מא"
          },
          {
            text: "מתן תורה",
            correct: false,
            plausible: true,
            source: "שמות יט–כ"
          },
          {
            text: "עקידת יצחק",
            correct: false,
            plausible: true,
            source: "בראשית כב"
          },
          {
            text: "נחש הנחושת",
            correct: false,
            plausible: true,
            source: "במדבר כא"
          },
          {
            text: "תחרות 'האח הגדול במצרים'",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "מיקומים קשורים",
        choices: [
          {
            text: "חברון → דותן → מצרים (בית פוטיפר, בית הסוהר, ארמון; ולמשפחה: ארץ גושן)",
            correct: true,
            source: "בראשית לז–נ"
          },
          {
            text: "הרי אררט",
            correct: false,
            plausible: true,
            source: "בראשית ח"
          },
          {
            text: "הר סיני",
            correct: false,
            plausible: true,
            source: "שמות יט"
          },
          {
            text: "אור כשדים",
            correct: false,
            plausible: true
          },
          {
            text: "תחנת רכבת 'פרעה מרכז'",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "דמויות/קשרים",
        choices: [
          {
            text: "יעקב, רחל, בנימין, אסנת, מנשה ואפרים",
            correct: true,
            source: "בראשית ל; מא:45,50–52; מח"
          },
          {
            text: "שרה ויצחק",
            correct: false,
            plausible: true
          },
          {
            text: "אהרן ומרים",
            correct: false,
            plausible: true
          },
          {
            text: "דוד ושלמה",
            correct: false,
            plausible: true,
            feedback: "תקופת מלוכה – מחוץ לתורה."
          },
          {
            text: "הגביע המדבר מעצמו",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "ציטוט/פסוק",
        choices: [
          {
            text: "הֲתַחַת אֱלֹקִים אָנִי?",
            correct: true,
            source: "בראשית נ:19"
          },
          {
            text: "מי לה' אלי!",
            correct: false,
            plausible: true,
            source: "שמות לב:26",
            feedback: "דברי משה/לויים בפרשת העגל."
          },
          {
            text: "לך־לך",
            correct: false,
            plausible: true,
            source: "בראשית יב:1"
          },
          {
            text: "טובה הארץ מאוד מאוד",
            correct: false,
            plausible: true,
            source: "במדבר יד:7",
            feedback: "כלב ויהושע."
          },
          {
            text: "חלומות ב-4K",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נושאים/סמליות",
        choices: [
          {
            text: "השגחה, מחילה, הפיכת רוע לטובה",
            correct: true,
            source: "בראשית מה:5–8; נ:20"
          },
          {
            text: "עבודה זרה ותשובה",
            correct: false,
            plausible: true,
            source: "שמות לב"
          },
          {
            text: "גאולה ממלכתית",
            correct: false,
            plausible: true,
            feedback: "הוא מציל מרעב, אך לא 'גאולה' כיציאת מצרים."
          },
          {
            text: "מבול וטהרה",
            correct: false,
            plausible: true
          },
          {
            text: "מעיל משבב NFC",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "תקופה",
        choices: [
          {
            text: "תקופת האבות – ירידה למצרים",
            correct: true
          },
          {
            text: "שנות המדבר",
            correct: false,
            plausible: true
          },
          {
            text: "בית ראשון",
            correct: false,
            plausible: true
          },
          {
            text: "העתיד הרחוק",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נסים/הוראות קשורות",
        choices: [
          {
            text: "חלומות וניהול שבע שנות השבע",
            correct: true,
            source: "בראשית מא"
          },
          {
            text: "קריעת ים סוף",
            correct: false,
            plausible: true,
            source: "שמות יד"
          },
          {
            text: "מכת בכורות",
            correct: false,
            plausible: true,
            source: "שמות יא–יב"
          },
          {
            text: "נחש הנחושת",
            correct: false,
            plausible: true,
            source: "במדבר כא"
          },
          {
            text: "אספקת חיטה ברחפן",
            correct: false,
            funny: true
          }
        ]
      }
    ]
  },
  {
    lead: "חטא העגל",
    categories: [
      {
        name: "אירועים/סיפורים",
        choices: [
          {
            text: "עשיית העגל, שבירת הלוחות, ולאחר מכן לוחות שניות",
            correct: true,
            source: "שמות לב–לד"
          },
          {
            text: "מבול ותיבה",
            correct: false,
            plausible: true,
            source: "בראשית ו–ט"
          },
          {
            text: "מגדל בבל",
            correct: false,
            plausible: true,
            source: "בראשית יא"
          },
          {
            text: "עקידת יצחק",
            correct: false,
            plausible: true,
            source: "בראשית כב"
          },
          {
            text: "פסל זהב בצורת סמארטפון",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "מיקומים קשורים",
        choices: [
          {
            text: "הר סיני",
            correct: true,
            source: "שמות לב:1–6"
          },
          {
            text: "אור כשדים",
            correct: false,
            plausible: true
          },
          {
            text: "אררט",
            correct: false,
            plausible: true
          },
          {
            text: "חברון",
            correct: false,
            plausible: true
          },
          {
            text: "חניון הגמלים הצמוד",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "דמויות/קשרים",
        choices: [
          {
            text: "אהרן הכהן, משה, בני ישראל",
            correct: true,
            source: "שמות לב"
          },
          {
            text: "נח ובניו",
            correct: false,
            plausible: true
          },
          {
            text: "דוד ושלמה",
            correct: false,
            plausible: true
          },
          {
            text: "יעקב ולאה",
            correct: false,
            plausible: true
          },
          {
            text: "יוצר תכשיטים ממותג 'עגל-גולד'",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "ציטוט/פסוק",
        choices: [
          {
            text: "אֵלֶּה אֱלֹהֶיךָ יִשְׂרָאֵל",
            correct: true,
            source: "שמות לב:4"
          },
          {
            text: "מי לה' אלי!",
            correct: false,
            plausible: true,
            source: "שמות לב:26",
            feedback: "תגובה לאחר החטא – אך כאן מחפשים את קריאת העם."
          },
          {
            text: "שמע ישראל",
            correct: false,
            plausible: true,
            source: "דברים ו:4"
          },
          {
            text: "נעשה ונשמע",
            correct: false,
            plausible: true,
            source: "שמות כד:7",
            feedback: "לפני החטא."
          },
          {
            text: "יאללה ריקוד סביב ה-DJ",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נושאים/סמליות",
        choices: [
          {
            text: "עבודה זרה מול נאמנות לברית; תשובה וחידוש הקשר",
            correct: true,
            source: "שמות לב–לד"
          },
          {
            text: "אחדות לשם שמים",
            correct: false,
            plausible: true,
            feedback: "דווקא מחלוקת וחטא."
          },
          {
            text: "טוהר העולם אחרי המבול",
            correct: false,
            plausible: true
          },
          {
            text: "מלכות צדק",
            correct: false,
            plausible: true
          },
          {
            text: "לייקים סביב עגל זהב",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "תקופה",
        choices: [
          {
            text: "שנה ראשונה במדבר, לאחר מתן תורה",
            correct: true,
            source: "שמות לב בהמשך לשמות כד"
          },
          {
            text: "תקופת האבות",
            correct: false,
            plausible: true
          },
          {
            text: "ימי בית ראשון",
            correct: false,
            plausible: true
          },
          {
            text: "תשפ״א",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נסים/הוראות קשורות",
        choices: [
          {
            text: "לוחות שניות וקרינת פני משה",
            correct: true,
            source: "שמות לד:29–35"
          },
          {
            text: "קשת בענן",
            correct: false,
            plausible: true,
            source: "בראשית ט"
          },
          {
            text: "נחש הנחושת",
            correct: false,
            plausible: true,
            source: "במדבר כא"
          },
          {
            text: "קריעת ים סוף",
            correct: false,
            plausible: true,
            source: "שמות יד"
          },
          {
            text: "מצלמה עננית בסיני",
            correct: false,
            funny: true
          }
        ]
      }
    ]
  },
  {
    lead: "פרשת המרגלים",
    categories: [
      {
        name: "אירועים/סיפורים",
        choices: [
          {
            text: "שליחת המרגלים, דיבת הארץ, נגזרות 40 שנות נדודים",
            correct: true,
            source: "במדבר יג–יד"
          },
          {
            text: "עשרת הדיברות",
            correct: false,
            plausible: true,
            source: "שמות כ"
          },
          {
            text: "הכנסת האורחים של אברהם",
            correct: false,
            plausible: true,
            source: "בראשית יח"
          },
          {
            text: "יוסף ופוטיפר",
            correct: false,
            plausible: true,
            source: "בראשית לט"
          },
          {
            text: "סיור נדל\"ן עם רחפן",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "מיקומים קשורים",
        choices: [
          {
            text: "מדבר פארן ונחל אשכול",
            correct: true,
            source: "במדבר יג:3,24"
          },
          {
            text: "הר סיני",
            correct: false,
            plausible: true
          },
          {
            text: "אררט",
            correct: false,
            plausible: true
          },
          {
            text: "אור כשדים",
            correct: false,
            plausible: true
          },
          {
            text: "מרכז קניות ענק בענבים",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "דמויות/קשרים",
        choices: [
          {
            text: "יהושע בן נון וכלב בן יפונה",
            correct: true,
            source: "במדבר יג:16; יד:6–9"
          },
          {
            text: "אהרן הכהן",
            correct: false,
            plausible: true
          },
          {
            text: "דוד המלך",
            correct: false,
            plausible: true
          },
          {
            text: "יונה הנביא",
            correct: false,
            plausible: true
          },
          {
            text: "מדריך טיולים בשם 'אשכולי'",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "ציטוט/פסוק",
        choices: [
          {
            text: "טוֹבָה הָאָרֶץ מְאֹד מְאֹד",
            correct: true,
            source: "במדבר יד:7"
          },
          {
            text: "ארץ אוכלת יושביה",
            correct: false,
            plausible: true,
            source: "במדבר יג:32",
            feedback: "זה מתיאור המרגלים הרעים."
          },
          {
            text: "מי לה' אלי!",
            correct: false,
            plausible: true,
            source: "שמות לב:26"
          },
          {
            text: "נעשה ונשמע",
            correct: false,
            plausible: true,
            source: "שמות כד:7"
          },
          {
            text: "יאללה, קופצים לים",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נושאים/סמליות",
        choices: [
          {
            text: "אמונה מול פחד; לשון הרע על הארץ",
            correct: true,
            source: "במדבר יג–יד"
          },
          {
            text: "ברית מילה",
            correct: false,
            plausible: true,
            source: "בראשית יז"
          },
          {
            text: "עבודה זרה",
            correct: false,
            plausible: true,
            source: "שמות לב"
          },
          {
            text: "מנהיגות כהונה",
            correct: false,
            plausible: true,
            source: "במדבר טז–יז"
          },
          {
            text: "ביקורת מסעדות ענקיות",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "תקופה",
        choices: [
          {
            text: "תחילת שנות המדבר לאחר יציאת מצרים",
            correct: true,
            source: "במדבר יג:1–3"
          },
          {
            text: "תקופת האבות",
            correct: false,
            plausible: true
          },
          {
            text: "ימי בית שני",
            correct: false,
            plausible: true
          },
          {
            text: "ה-סטארטאפ ניישן",
            correct: false,
            funny: true
          }
        ]
      },
      {
        name: "נסים/הוראות קשורות",
        choices: [
          {
            text: "הגזרה: יום לשנה – 40 שנה במדבר",
            correct: true,
            source: "במדבר יד:33–34"
          },
          {
            text: "בקיעת הירדן",
            correct: false,
            plausible: true,
            source: "יהושע ג",
            feedback: "מחוץ לתורה."
          },
          {
            text: "מן",
            correct: false,
            plausible: true,
            source: "שמות טז",
            feedback: "אמת, אבל כאן מתמקדים בגזרת המרגלים."
          },
          {
            text: "לוחות הברית",
            correct: false,
            plausible: true,
            source: "שמות לא; לד"
          },
          {
            text: "רחפן ענק לענבים",
            correct: false,
            funny: true
          }
        ]
      }
    ]
  }
];

// Utility function to shuffle array
export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const categoryNames: Record<string, string> = {
  "אירועים/סיפורים": "אירועים/סיפורים",
  "מיקומים קשורים": "מיקומים קשורים", 
  "דמויות/קשרים": "דמויות/קשרים",
  "ציטוט/פסוק": "ציטוט/פסוק",
  "נושאים/סמליות": "נושאים/סמליות",
  "תקופה": "תקופה",
  "נסים/הוראות קשורות": "נסים/הוראות קשורות"
};