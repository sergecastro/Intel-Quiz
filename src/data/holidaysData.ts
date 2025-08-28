export interface Holiday {
  key: string;
  name: {
    en: string;
    he: string;
  };
  story: {
    en: string;
    he: string;
  };
  food: {
    en: string;
    he: string;
  };
  season: {
    en: string;
    he: string;
  };
  symbol: {
    en: string;
    he: string;
  };
  image: string;
  video: string;
  audio?: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const holidays: Holiday[] = [
  {
    key: "roshhashanah",
    name: {
      en: "Rosh Hashanah",
      he: "ראש השנה"
    },
    story: {
      en: "Jewish New Year; introspection and renewal",
      he: "ראש השנה; חשבון נפש והתחדשות"
    },
    food: {
      en: "Apples & honey; pomegranate",
      he: "תפוח ודבש; רימון"
    },
    season: {
      en: "Autumn • Tishrei (early)",
      he: "סתיו • תשרי (תחילת תשרי)"
    },
    symbol: {
      en: "Shofar (ram's horn)",
      he: "שופר"
    },
    image: "/assets/holidays/rosh-hashanah.jpg",
    video: "/assets/holidays/rosh-hashanah.mp4",
    colors: {
      primary: "hsl(45, 85%, 55%)",
      secondary: "hsl(30, 75%, 65%)"
    }
  },
  {
    key: "yomkippur",
    name: {
      en: "Yom Kippur",
      he: "יום כיפור"
    },
    story: {
      en: "Day of Atonement; fasting & prayer",
      he: "יום הכיפורים; צום ותפילה"
    },
    food: {
      en: "(Fast day) – pre/post fast meals",
      he: "(יום צום) — ארוחות לפני/אחרי"
    },
    season: {
      en: "Autumn • Tishrei (mid)",
      he: "סתיו • תשרי (אמצע תשרי)"
    },
    symbol: {
      en: "White clothing; machzor",
      he: "בגדים לבנים; מחזור"
    },
    image: "/assets/holidays/yom-kippur.jpg",
    video: "/assets/holidays/yom-kippur.mp4",
    colors: {
      primary: "hsl(0, 0%, 95%)",
      secondary: "hsl(210, 40%, 85%)"
    }
  },
  {
    key: "sukkot",
    name: {
      en: "Sukkot",
      he: "סוכות"
    },
    story: {
      en: "Festival of Booths; dwelling in sukkah",
      he: "חג הסוכות; ישיבה בסוכה"
    },
    food: {
      en: "Harvest meals in the sukkah",
      he: "סעודות קציר בסוכה"
    },
    season: {
      en: "Autumn • Tishrei (mid‑late)",
      he: "סתיו • תשרי (אמצע־סוף)"
    },
    symbol: {
      en: "Lulav & etrog",
      he: "לולב ואתרוג"
    },
    image: "/assets/holidays/sukkot.jpg",
    video: "/assets/holidays/sukkot.mp4",
    colors: {
      primary: "hsl(120, 60%, 45%)",
      secondary: "hsl(60, 70%, 55%)"
    }
  },
  {
    key: "hanukkah",
    name: {
      en: "Hanukkah",
      he: "חנוכה"
    },
    story: {
      en: "Maccabees & the oil that lasted eight days",
      he: "החשמונאים ופך השמן לשמונה ימים"
    },
    food: {
      en: "Latkes; sufganiyot",
      he: "לביבות; סופגניות"
    },
    season: {
      en: "Early winter • Kislev",
      he: "תחילת חורף • כסלו"
    },
    symbol: {
      en: "Menorah/Chanukiah, dreidel",
      he: "חנוכייה/מנורה; סביבון"
    },
    image: "/assets/holidays/hanukkah.jpg",
    video: "/assets/holidays/hanukkah.mp4",
    colors: {
      primary: "hsl(220, 85%, 55%)",
      secondary: "hsl(45, 90%, 60%)"
    }
  },
  {
    key: "purim",
    name: {
      en: "Purim",
      he: "פורים"
    },
    story: {
      en: "Esther & Mordechai foil Haman's plot",
      he: "אסתר ומרדכי מסכלים את המן"
    },
    food: {
      en: "Hamantaschen",
      he: "אוזני המן"
    },
    season: {
      en: "Late winter • Adar",
      he: "סוף חורף • אדר"
    },
    symbol: {
      en: "Megillah & grogger",
      he: "מגילה ורעשן"
    },
    image: "/assets/holidays/purim.jpg",
    video: "/assets/holidays/purim.mp4",
    colors: {
      primary: "hsl(300, 75%, 55%)",
      secondary: "hsl(45, 85%, 65%)"
    }
  },
  {
    key: "pesach",
    name: {
      en: "Pesach (Passover)",
      he: "פסח"
    },
    story: {
      en: "Exodus from Egypt; freedom from slavery",
      he: "יציאת מצרים; חירות מעבדות"
    },
    food: {
      en: "Matzah, maror, charoset",
      he: "מצה, מרור, חרוסת"
    },
    season: {
      en: "Spring • Nisan",
      he: "אביב • ניסן"
    },
    symbol: {
      en: "Seder plate / three matzot",
      he: "קערת סדר / שלוש מצות"
    },
    image: "/assets/holidays/pesach.jpg",
    video: "/assets/holidays/pesach.mp4",
    colors: {
      primary: "hsl(200, 75%, 55%)",
      secondary: "hsl(25, 80%, 65%)"
    }
  },
  {
    key: "shavuot",
    name: {
      en: "Shavuot",
      he: "שבועות"
    },
    story: {
      en: "Giving of the Torah at Sinai",
      he: "מתן תורה בהר סיני"
    },
    food: {
      en: "Cheesecake & dairy dishes",
      he: "עוגת גבינה ומאכלי חלב"
    },
    season: {
      en: "Early summer • Sivan",
      he: "תחילת קיץ • סיון"
    },
    symbol: {
      en: "Tablets / Torah scroll",
      he: "לוחות / ספר תורה"
    },
    image: "/assets/holidays/shavuot.jpg",
    video: "/assets/holidays/shavuot.mp4",
    colors: {
      primary: "hsl(120, 70%, 45%)",
      secondary: "hsl(60, 80%, 70%)"
    }
  },
  {
    key: "simchattorah",
    name: {
      en: "Simchat Torah",
      he: "שמחת תורה"
    },
    story: {
      en: "Completion & restart of Torah reading",
      he: "סיום ופתיחה מחדש של קריאת התורה"
    },
    food: {
      en: "Dancing sweets; kiddush treats",
      he: "ממתקים בריקודים; קידוש"
    },
    season: {
      en: "Autumn • Tishrei (late)",
      he: "סתיו • תשרי (סוף תשרי)"
    },
    symbol: {
      en: "Dancing with Torah scrolls",
      he: "ריקוד עם ספרי תורה"
    },
    image: "/assets/holidays/simchat-torah.jpg",
    video: "/assets/holidays/simchat-torah.mp4",
    colors: {
      primary: "hsl(270, 70%, 55%)",
      secondary: "hsl(45, 85%, 65%)"
    }
  }
];

export const categories = {
  name: holidays.map(h => ({ en: h.name.en, he: h.name.he })),
  story: holidays.map(h => ({ en: h.story.en, he: h.story.he })),
  food: holidays.map(h => ({ en: h.food.en, he: h.food.he })),
  season: holidays.map(h => ({ en: h.season.en, he: h.season.he })),
  symbol: holidays.map(h => ({ en: h.symbol.en, he: h.symbol.he }))
};

export const categoryNames = {
  en: {
    name: "Name",
    story: "Story", 
    food: "Food",
    season: "Season",
    symbol: "Symbol"
  },
  he: {
    name: "שם החג",
    story: "סיפור",
    food: "מאכל", 
    season: "עונה",
    symbol: "סמל"
  }
};

export const categoryIcons = {
  name: "🕯️",
  story: "📖", 
  food: "🥙",
  season: "🍂",
  symbol: "✡️"
};